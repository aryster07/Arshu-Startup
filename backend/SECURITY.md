# 🛡️ Security Implementation Guide

## 🔒 GitHub Student Pack Security Stack

### 1Password Integration for Secrets Management

#### Setup 1Password for Development Team
1. **Create 1Password Account** (Free for 1 year via Student Pack)
2. **Install 1Password CLI**:
   ```bash
   # Windows (PowerShell)
   winget install 1Password.CLI
   
   # Verify installation
   op --version
   ```

3. **Setup 1Password Vault for Arshu Legal**:
   ```bash
   # Sign in to 1Password
   op signin
   
   # Create vault for legal platform secrets
   op vault create "Arshu-Legal-Secrets"
   ```

4. **Store Secrets Securely**:
   ```bash
   # MongoDB Atlas connection string
   op item create --vault="Arshu-Legal-Secrets" \
     --title="MongoDB Atlas" \
     --category="Database" \
     username="arshu-legal" \
     password="your-connection-string"
   
   # JWT Secrets
   op item create --vault="Arshu-Legal-Secrets" \
     --title="JWT Secrets" \
     --category="API Credential" \
     "JWT_SECRET=your-256-bit-secret" \
     "JWT_REFRESH_SECRET=your-refresh-secret"
   
   # Stripe API Keys
   op item create --vault="Arshu-Legal-Secrets" \
     --title="Stripe Keys" \
     --category="API Credential" \
     "STRIPE_SECRET_KEY=sk_test_..." \
     "STRIPE_WEBHOOK_SECRET=whsec_..."
   ```

### MongoDB Atlas Security Configuration

#### 1. Database Access Controls
```javascript
// IP Whitelist Configuration
const allowedIPs = [
  "0.0.0.0/0", // Development - restrict in production
  "your-digitalocean-droplet-ip/32"
];

// Database User Roles
const roles = [
  {
    role: "readWrite",
    db: "arshu-legal"
  },
  {
    role: "dbAdmin", 
    db: "arshu-legal"
  }
];
```

#### 2. Connection Security
```typescript
const mongoConfig = {
  // Enable SSL/TLS
  ssl: true,
  sslValidate: true,
  
  // Authentication
  authSource: 'admin',
  authMechanism: 'SCRAM-SHA-256',
  
  // Connection pooling
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  
  // Write safety
  retryWrites: true,
  w: 'majority',
  readPreference: 'primary'
};
```

### Stripe Security Implementation

#### 1. PCI Compliance Setup
```typescript
// Stripe configuration for legal platform
const stripeConfig = {
  apiVersion: '2023-10-16',
  typescript: true,
  
  // Security settings
  maxNetworkRetries: 3,
  timeout: 8000,
  
  // Webhook security
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Payment methods for legal services
  paymentMethods: ['card', 'bank_transfer'],
  
  // Legal service product configuration
  products: {
    consultation: {
      name: 'Legal Consultation',
      pricing: 'per_hour',
      currency: 'usd'
    },
    documentReview: {
      name: 'Document Review Service',
      pricing: 'per_document',
      currency: 'usd'
    }
  }
};
```

#### 2. Webhook Security
```typescript
// Verify Stripe webhook signatures
export const verifyStripeWebhook = (req: Request): boolean => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      endpointSecret!
    );
    return true;
  } catch (err) {
    securityLogger.error('Stripe webhook verification failed', {
      error: err.message,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};
```

### Digital Ocean Security Setup

#### 1. Droplet Configuration
```bash
# Create secure Ubuntu droplet
doctl compute droplet create arshu-legal-backend \
  --size s-2vcpu-4gb \
  --image ubuntu-22-04-x64 \
  --region nyc1 \
  --vpc-uuid your-vpc-id \
  --ssh-keys your-ssh-key-id \
  --enable-monitoring \
  --enable-private-networking

# Configure firewall
doctl compute firewall create arshu-legal-firewall \
  --inbound-rules "protocol:tcp,ports:22,sources:your-ip/32 protocol:tcp,ports:80,sources:0.0.0.0/0 protocol:tcp,ports:443,sources:0.0.0.0/0" \
  --outbound-rules "protocol:tcp,ports:all,destinations:0.0.0.0/0"
```

#### 2. SSL Certificate Setup
```bash
# Install Certbot for Let's Encrypt
sudo apt update
sudo apt install certbot nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.arshulegal.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Monitoring & Security Analytics

#### 1. Sentry Configuration
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Security-focused configuration
  beforeSend(event) {
    // Remove sensitive data
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
    }
    
    // Log security events
    if (event.level === 'error' && event.tags?.security) {
      securityLogger.error('Security event detected', event);
    }
    
    return event;
  },
  
  // Sample rate for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

#### 2. New Relic Security Monitoring
```javascript
// newrelic.js configuration
exports.config = {
  app_name: ['Arshu Legal Platform'],
  license_key: process.env.NEWRELIC_LICENSE_KEY,
  
  // Security monitoring
  security: {
    agent: {
      enabled: true
    },
    mode: 'IAST', // Interactive Application Security Testing
    validator: {
      enabled: true
    }
  },
  
  // Custom attributes for legal compliance
  attributes: {
    include: [
      'request.headers.userAgent',
      'request.method',
      'response.status'
    ],
    exclude: [
      'request.headers.authorization',
      'request.headers.cookie'
    ]
  }
};
```

### AstraSecurity Web Firewall

#### 1. Firewall Rules Configuration
```yaml
# Astra Security firewall rules
security_rules:
  - name: "Legal Document Upload Protection"
    pattern: "multipart/form-data"
    action: "scan_and_allow"
    max_file_size: "10MB"
    allowed_extensions: [".pdf", ".doc", ".docx"]
  
  - name: "API Rate Limiting"
    pattern: "/api/v1/*"
    rate_limit: "100/15min"
    action: "throttle"
  
  - name: "Authentication Brute Force Protection"
    pattern: "/api/v1/auth/login"
    rate_limit: "5/15min"
    action: "block_on_threshold"
  
  - name: "SQL Injection Prevention"
    pattern: "(SELECT|INSERT|UPDATE|DELETE|DROP)"
    action: "block"
    log_level: "high"
```

### Compliance & Legal Requirements

#### 1. GDPR Implementation
```typescript
// GDPR compliance utilities
export const gdprUtils = {
  // Right to be forgotten
  async deleteUserData(userId: string): Promise<void> {
    await Promise.all([
      User.findByIdAndDelete(userId),
      LegalCase.deleteMany({ userId }),
      Payment.updateMany(
        { userId }, 
        { $unset: { personalData: "" } }
      )
    ]);
    
    auditLogger.info('GDPR data deletion completed', {
      userId,
      timestamp: new Date().toISOString(),
      action: 'gdpr_deletion'
    });
  },
  
  // Data export
  async exportUserData(userId: string): Promise<object> {
    const userData = await User.findById(userId).lean();
    const cases = await LegalCase.find({ userId }).lean();
    const payments = await Payment.find({ userId }).lean();
    
    return {
      profile: userData,
      legalCases: cases,
      paymentHistory: payments,
      exportedAt: new Date().toISOString()
    };
  }
};
```

#### 2. Audit Trail Implementation
```typescript
// Comprehensive audit logging
export const auditTrail = {
  logAction(action: string, userId?: string, details?: object): void {
    auditLogger.info('User action performed', {
      action,
      userId,
      details,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  },
  
  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high', details: object): void {
    securityLogger.warn('Security event detected', {
      event,
      severity,
      details,
      timestamp: new Date().toISOString()
    });
  }
};
```

### Security Testing & Validation

#### 1. Automated Security Testing
```bash
# Run security audit
npm audit

# Snyk vulnerability scanning
npm run security:check

# OWASP ZAP security testing
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:5000/api/v1
```

#### 2. Manual Security Review Checklist
- [ ] All secrets stored in 1Password
- [ ] MongoDB Atlas firewall configured
- [ ] Stripe webhook signatures verified
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Audit logging for sensitive operations
- [ ] GDPR compliance measures
- [ ] Error handling doesn't leak information
- [ ] Security headers properly configured

### Emergency Response Plan

#### 1. Security Incident Response
```bash
# Immediate actions for security incident
1. Rotate all API keys and secrets
2. Check audit logs for breach scope
3. Notify affected users if required
4. Document incident in security log
5. Update security measures to prevent recurrence
```

#### 2. Business Continuity
```yaml
# Backup and recovery procedures
backups:
  database: "Daily automated backups to S3"
  application_logs: "30-day retention"
  security_logs: "1-year retention"
  
recovery:
  rto: "4 hours"  # Recovery Time Objective
  rpo: "1 hour"   # Recovery Point Objective
  
contacts:
  primary: "security@arshulegal.com"
  emergency: "+1-XXX-XXX-XXXX"
```

---

This security implementation provides enterprise-grade protection for your legal platform using the best tools available through the GitHub Student Developer Pack.