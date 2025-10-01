import winston from 'winston';
import WintonMongoDB from 'winston-mongodb';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports array
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info',
  }),

  // File transport for errors
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: fileFormat,
    maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE || '5242880', 10), // 5MB
    maxFiles: parseInt(process.env.LOG_FILE_MAX_FILES || '5', 10),
  }),

  // File transport for all logs
  new winston.transports.File({
    filename: 'logs/combined.log',
    format: fileFormat,
    maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE || '5242880', 10), // 5MB
    maxFiles: parseInt(process.env.LOG_FILE_MAX_FILES || '5', 10),
  }),
];

// Add MongoDB transport for production
if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
  transports.push(
    new WintonMongoDB.MongoDB({
      db: process.env.MONGODB_URI,
      collection: 'application_logs',
      level: 'error',
      options: {
        useUnifiedTopology: true,
      },
      metaKey: 'metadata',
      expireAfterSeconds: 60 * 60 * 24 * 30, // 30 days
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: fileFormat,
  transports,
  exitOnError: false,
});

// Security-focused audit logger
export const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/audit.log',
      maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE || '5242880', 10),
      maxFiles: parseInt(process.env.LOG_FILE_MAX_FILES || '5', 10),
    }),
  ],
});

// Performance logger
export const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/performance.log',
      maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE || '5242880', 10),
      maxFiles: parseInt(process.env.LOG_FILE_MAX_FILES || '5', 10),
    }),
  ],
});

// Security logger for sensitive operations
export const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/security.log',
      maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE || '5242880', 10),
      maxFiles: parseInt(process.env.LOG_FILE_MAX_FILES || '5', 10),
    }),
  ],
});

// Create logs directory if it doesn't exist
import { existsSync, mkdirSync } from 'fs';
if (!existsSync('logs')) {
  mkdirSync('logs');
}