import { Request, Response, NextFunction } from 'express';
import { auditLogger as auditLog, securityLogger } from '@/utils/logger';

// Audit logging middleware for sensitive operations
export const auditLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override end function to log response
  res.end = function(...args: any[]) {
    const duration = Date.now() - startTime;
    
    // Log all requests (filtered by importance)
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
      userId: (req as any).user?.id,
      sessionId: req.sessionID,
    };
    
    // Log sensitive operations
    const sensitiveEndpoints = [
      '/auth/',
      '/admin/',
      '/payments/',
      '/users/profile',
      '/legal/analysis',
    ];
    
    const isSensitive = sensitiveEndpoints.some(endpoint => 
      req.originalUrl.includes(endpoint)
    );
    
    if (isSensitive) {
      securityLogger.info('Sensitive operation performed', {
        ...logData,
        headers: {
          authorization: req.get('Authorization') ? '[REDACTED]' : undefined,
          'content-type': req.get('Content-Type'),
        },
        body: req.method !== 'GET' ? '[REDACTED]' : undefined,
      });
    }
    
    // Log errors and suspicious activity
    if (res.statusCode >= 400) {
      auditLog.error('Request failed', logData);
    } else if (duration > 5000) {
      auditLog.warn('Slow request detected', logData);
    }
    
    // Call original end function
    originalEnd.apply(this, args);
  };
  
  next();
};