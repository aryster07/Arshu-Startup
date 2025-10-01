import { Request, Response, NextFunction } from 'express';
import { auditLogger } from '@/utils/logger';

// Security middleware for additional request validation
export const securityMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove server signature
  res.removeHeader('X-Powered-By');
  
  // Validate content type for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    if (contentType && !contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
      auditLogger.warn('Suspicious content type detected', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentType,
        path: req.path,
        method: req.method,
      });
    }
  }
  
  // Log suspicious patterns
  const suspiciousPatterns = [
    /(\<script\>|\<\/script\>)/gi,  // Script tags
    /(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)/gi,  // SQL keywords
    /(\$where|\$regex|\$text)/gi,  // NoSQL injection
    /(javascript:|data:|vbscript:)/gi,  // Dangerous protocols
  ];
  
  const queryString = JSON.stringify(req.query);
  const bodyString = JSON.stringify(req.body);
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(queryString) || pattern.test(bodyString)) {
      auditLogger.error('Potential security threat detected', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
        pattern: pattern.toString(),
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  next();
};