import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import passport from '@/config/passport';

import { connectDatabase } from '@/config/database';
import { initializeNewRelic } from '@/config/newrelic';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';
import { securityMiddleware } from '@/middleware/security';
import { auditLogger } from '@/middleware/auditLogger';
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import legalRoutes from '@/routes/legal';
import paymentRoutes from '@/routes/payments';
import adminRoutes from '@/routes/admin';

// Initialize monitoring services
initializeNewRelic();

class SecureLegalServer {
  public app: express.Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '5000', 10);
    
    this.initializeSentry();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeSentry(): void {
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        beforeSend(event) {
          // Remove sensitive data
          if (event.request?.headers) {
            delete event.request.headers.authorization;
            delete event.request.headers.cookie;
          }
          return event;
        },
      });

      this.app.use(SentryExpress.requestHandler());
      this.app.use(SentryExpress.tracingHandler());
    }
  }

  private initializeMiddleware(): void {
    // Trust proxy for accurate IP detection
    this.app.set('trust proxy', process.env.TRUST_PROXY === 'true');

    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: (origin, callback) => {
        const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compression
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10) / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/api/health';
      },
    });

    // Slow down repeated requests
    const speedLimiter = slowDown({
      windowMs: 15 * 60 * 1000, // 15 minutes
      delayAfter: 50, // Allow 50 requests per windowMs without delay
      delayMs: 500, // Add 500ms delay per request after delayAfter
      maxDelayMs: 20000, // Maximum delay of 20 seconds
    });

    this.app.use(limiter);
    this.app.use(speedLimiter);

    // Body parsing with size limits
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        // Store raw body for Stripe webhook verification
        if (req.path === '/api/v1/payments/stripe/webhook') {
          (req as any).rawBody = buf;
        }
      }
    }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser(process.env.SESSION_SECRET));

    // Session configuration for OAuth
    this.app.use(session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI!,
        touchAfter: 24 * 3600, // Lazy session update
        ttl: 14 * 24 * 60 * 60, // 14 days
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
        sameSite: 'strict'
      },
      name: 'arshu.sid'
    }));

    // Initialize Passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Security middleware
    this.app.use(mongoSanitize()); // Prevent NoSQL injection
    this.app.use(hpp()); // Prevent HTTP Parameter Pollution
    this.app.use(securityMiddleware);

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
      }));
    }

    // Audit logging for sensitive operations
    this.app.use(auditLogger);

    // Health check endpoint (before auth)
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV,
      });
    });
  }

  private initializeRoutes(): void {
    const apiV1 = '/api/v1';

    // API routes
    this.app.use(`${apiV1}/auth`, authRoutes);
    this.app.use(`${apiV1}/users`, userRoutes);
    this.app.use(`${apiV1}/legal`, legalRoutes);
    this.app.use(`${apiV1}/payments`, paymentRoutes);
    this.app.use(`${apiV1}/admin`, adminRoutes);

    // API documentation route
    this.app.get(`${apiV1}`, (req, res) => {
      res.json({
        message: 'Arshu Legal Platform API',
        version: 'v1',
        documentation: '/api/v1/docs',
        endpoints: {
          auth: `${apiV1}/auth`,
          users: `${apiV1}/users`,
          legal: `${apiV1}/legal`,
          payments: `${apiV1}/payments`,
          admin: `${apiV1}/admin`,
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // Sentry error handler (must be before other error handlers)
    if (process.env.SENTRY_DSN) {
      this.app.use(SentryExpress.errorHandler());
    }

    // 404 handler
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      const server = this.app.listen(this.port, () => {
        logger.info(`🚀 Secure Legal Platform Server started on port ${this.port}`);
        logger.info(`🔒 Environment: ${process.env.NODE_ENV}`);
        logger.info(`📊 Health check: http://localhost:${this.port}/health`);
        logger.info(`🔑 API: http://localhost:${this.port}/api/v1`);
      });

      // Graceful shutdown
      process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        logger.info('SIGINT received, shutting down gracefully');
        server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });
      });

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default SecureLegalServer;