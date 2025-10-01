import mongoose from 'mongoose';
import { logger, securityLogger } from '@/utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_URI_TEST 
      : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    // MongoDB connection options for maximum security
    const options: mongoose.ConnectOptions = {
      // Connection pooling
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Buffering
      bufferMaxEntries: 0,
      bufferCommands: false,
      
      // Monitoring
      heartbeatFrequencyMS: 10000,
      
      // Security
      authSource: 'admin',
      ssl: true,
      sslValidate: true,
      
      // Connection string options
      retryWrites: true,
      w: 'majority',
      readPreference: 'primary',
      
      // App name for monitoring
      appName: 'arshu-legal-platform',
    };

    // Connect to MongoDB
    await mongoose.connect(mongoURI, options);

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      logger.info(`🗄️  MongoDB connected successfully`);
      securityLogger.info('Database connection established', {
        event: 'db_connect',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
      securityLogger.error('Database connection error', {
        event: 'db_error',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      securityLogger.warn('Database disconnected', {
        event: 'db_disconnect',
        timestamp: new Date().toISOString(),
      });
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    // Enable mongoose debugging in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug(`MongoDB ${collectionName}.${method}`, {
          query: JSON.stringify(query),
          doc: doc ? JSON.stringify(doc) : undefined,
        });
      });
    }

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    securityLogger.error('Database connection failed', {
      event: 'db_connect_fail',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Ping the database
      await mongoose.connection.db.admin().ping();
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Database cleanup utility
export const cleanupDatabase = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'test') {
      await mongoose.connection.db.dropDatabase();
      logger.info('Test database cleaned up');
    }
  } catch (error) {
    logger.error('Database cleanup failed:', error);
    throw error;
  }
};

export default mongoose;