/**
 * Global Error Handling System
 * Provides centralized error handling, logging, and user feedback
 */

import { ApiError } from './apiService';

// Error types
export interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
}

export interface ApplicationError extends Error {
  code?: string;
  context?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  recoverable?: boolean;
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  APPLICATION = 'application',
  EXTERNAL_SERVICE = 'external_service',
  UNKNOWN = 'unknown',
}

// Error reporting service
class ErrorReportingService {
  private static instance: ErrorReportingService;
  private errorQueue: ErrorDetails[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    this.setupOnlineStatusListener();
    this.setupUnhandledErrorCatching();
  }

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  private setupOnlineStatusListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private setupUnhandledErrorCatching() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError(
        new Error(event.message),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      );
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        { reason: event.reason }
      );
    });
  }

  categorizeError(error: Error): ErrorCategory {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        return ErrorCategory.AUTHENTICATION;
      }
      if (error.status >= 400 && error.status < 500) {
        return ErrorCategory.VALIDATION;
      }
      if (error.status >= 500) {
        return ErrorCategory.EXTERNAL_SERVICE;
      }
      return ErrorCategory.NETWORK;
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return ErrorCategory.NETWORK;
    }

    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return ErrorCategory.PERMISSION;
    }

    return ErrorCategory.APPLICATION;
  }

  getSeverity(error: Error, category: ErrorCategory): 'low' | 'medium' | 'high' | 'critical' {
    if (category === ErrorCategory.AUTHENTICATION) return 'high';
    if (category === ErrorCategory.NETWORK) return 'medium';
    if (category === ErrorCategory.VALIDATION) return 'low';
    if (error.message.includes('critical') || error.message.includes('fatal')) return 'critical';
    return 'medium';
  }

  getUserFriendlyMessage(error: Error, category: ErrorCategory): string {
    switch (category) {
      case ErrorCategory.NETWORK:
        return 'Network connection issue. Please check your internet connection and try again.';
      case ErrorCategory.AUTHENTICATION:
        return 'Your session has expired. Please log in again.';
      case ErrorCategory.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorCategory.PERMISSION:
        return 'You don\'t have permission to perform this action.';
      case ErrorCategory.EXTERNAL_SERVICE:
        return 'Our service is temporarily unavailable. Please try again later.';
      default:
        return 'Something went wrong. Please try again or contact support if the problem persists.';
    }
  }

  reportError(error: Error, context?: Record<string, any>) {
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      ...context,
    };

    // Add to queue for batch sending
    this.errorQueue.push(errorDetails);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error reported:', errorDetails);
    }

    // Send immediately if online, otherwise queue
    if (this.isOnline) {
      this.flushErrorQueue();
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
      return userData ? JSON.parse(userData).id : undefined;
    } catch {
      return undefined;
    }
  }

  private async flushErrorQueue() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // In a real implementation, send to your error reporting service
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors }),
      });
    } catch (error) {
      // If sending fails, add back to queue
      this.errorQueue.unshift(...errors);
      console.warn('Failed to send error reports:', error);
    }
  }

  // Clear old errors from queue (call periodically)
  clearOldErrors(maxAge: number = 24 * 60 * 60 * 1000) { // 24 hours
    const cutoff = new Date(Date.now() - maxAge);
    this.errorQueue = this.errorQueue.filter(error => error.timestamp > cutoff);
  }
}

// Error handling utilities
export const errorHandler = {
  // Handle API errors with user feedback
  handleApiError: (error: Error, showToast?: (message: string, type: string) => void) => {
    const errorReporter = ErrorReportingService.getInstance();
    const category = errorReporter.categorizeError(error);
    const userMessage = errorReporter.getUserFriendlyMessage(error, category);
    
    errorReporter.reportError(error);
    
    if (showToast) {
      showToast(userMessage, 'error');
    }
    
    return userMessage;
  },

  // Create error from unknown
  createError: (unknown: unknown, defaultMessage: string = 'An error occurred'): Error => {
    if (unknown instanceof Error) {
      return unknown;
    }
    
    if (typeof unknown === 'string') {
      return new Error(unknown);
    }
    
    if (typeof unknown === 'object' && unknown !== null) {
      const message = (unknown as any).message || defaultMessage;
      return new Error(message);
    }
    
    return new Error(defaultMessage);
  },

  // Check if error is recoverable
  isRecoverable: (error: Error): boolean => {
    if (error instanceof ApiError) {
      // Network errors and server errors are usually recoverable
      return error.status >= 500 || error.status === 408 || error.status === 429;
    }
    
    // Application errors might be recoverable
    return !error.message.includes('critical') && !error.message.includes('fatal');
  },
};

// Export singleton instance
export const errorReporter = ErrorReportingService.getInstance();

export default ErrorReportingService;