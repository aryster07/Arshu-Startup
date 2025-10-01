# 🔒 Arshu Legal Platform - Ultra-Secure Backend

## 🛡️ Security-First Architecture

This backend is built with enterprise-grade security using the GitHub Student Developer Pack resources to provide maximum protection for legal data and user privacy.

### 🏗️ Infrastructure Stack

**Core Services:**
- **DigitalOcean** ($200 credit) - Secure cloud hosting with VPC and firewalls
- **MongoDB Atlas** ($50 credit) - Enterprise database with encryption at rest
- **1Password** (Free for 1 year) - Secrets and credential management
- **Stripe** (Waived fees) - PCI-compliant payment processing

**Security & Monitoring:**
- **Sentry** - Real-time error tracking and security monitoring
- **New Relic** ($300/month value) - Application performance and security analytics
- **Datadog** (2 years free) - Infrastructure monitoring and alerting
- **AstraSecurity** (6 months) - Web application firewall and malware scanning
- **Honeybadger** - Exception monitoring and uptime tracking

### 🔐 Security Features

#### Authentication & Authorization
- JWT with refresh tokens and secure httpOnly cookies
- bcrypt password hashing with 12 rounds
- Two-factor authentication (TOTP) support
- Session management with automatic cleanup
- Role-based access control (RBAC)

#### Data Protection
- Input validation and sanitization (Joi, express-validator)
- NoSQL injection prevention (express-mongo-sanitize)
- XSS protection with input filtering
- HTTP Parameter Pollution (HPP) protection
- Rate limiting and request throttling
- CORS with strict origin validation

#### Infrastructure Security
- SSL/TLS encryption in transit
- MongoDB encryption at rest
- Environment variable protection via 1Password/Doppler
- Security headers (Helmet.js)
- Request logging and audit trails
- IP-based access controls

#### Monitoring & Compliance
- Real-time security event logging
- GDPR-compliant data handling
- Audit trails for all sensitive operations
- Performance monitoring and alerting
- Automated security scanning
- Backup and disaster recovery

### 🚀 Quick Start

#### Prerequisites
1. **Node.js** 18+ and npm 9+
2. **MongoDB Atlas** account (use student pack)
3. **DigitalOcean** account (use student pack)
4. **1Password** account for secrets management

#### Environment Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your environment variables:
   ```bash
   # Use 1Password CLI or manually set these
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-ultra-secure-secret
   STRIPE_SECRET_KEY=sk_...
   SENTRY_DSN=https://...
   NEWRELIC_LICENSE_KEY=...
   ```

#### Installation & Development
```bash
# Install dependencies
npm install

# Run security audit
npm run security:audit

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

#### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run security checks
npm run security:check
```

### 📊 API Endpoints

#### Health & Status
- `GET /health` - Server health check
- `GET /api/v1` - API information

#### Authentication (Secure)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/forgot-password` - Password reset
- `POST /api/v1/auth/2fa/setup` - Setup 2FA
- `POST /api/v1/auth/2fa/verify` - Verify 2FA

#### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `DELETE /api/v1/users/account` - Delete account

#### Legal Services
- `POST /api/v1/legal/analyze` - Legal document analysis
- `POST /api/v1/legal/consultation` - Book consultation
- `GET /api/v1/legal/lawyers` - Get lawyer recommendations
- `POST /api/v1/legal/document-review` - Document review request

#### Payments (Stripe)
- `POST /api/v1/payments/create-intent` - Create payment intent
- `POST /api/v1/payments/confirm` - Confirm payment
- `POST /api/v1/payments/stripe/webhook` - Stripe webhook
- `GET /api/v1/payments/history` - Payment history

#### Admin (Protected)
- `GET /api/v1/admin/users` - Manage users
- `GET /api/v1/admin/analytics` - System analytics
- `GET /api/v1/admin/security-logs` - Security audit logs

### 🛡️ Security Implementation Details

#### Rate Limiting Strategy
```typescript
// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: 'Too many requests'
});

// Auth-specific rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});
```

#### JWT Security Configuration
```typescript
const jwtConfig = {
  secret: process.env.JWT_SECRET, // 256-bit minimum
  expiresIn: '15m', // Short-lived access tokens
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: '7d', // Longer refresh tokens
  issuer: 'arshu-legal',
  audience: 'arshu-users'
};
```

#### Database Security
```typescript
const mongoOptions = {
  ssl: true,
  sslValidate: true,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority', // Write concern for data integrity
  readPreference: 'primary'
};
```

### 📈 Monitoring & Alerts

#### Security Monitoring
- Failed authentication attempts
- Suspicious request patterns
- API abuse detection
- Data access anomalies
- Performance degradation

#### Business Metrics
- User registration/activity
- Legal service usage
- Payment processing
- System performance
- Error rates and patterns

### 🔧 DevOps & Deployment

#### CI/CD Pipeline
```yaml
# GitHub Actions workflow
- Security scanning (Snyk)
- Code quality checks (ESLint, Prettier)
- Unit and integration tests
- Docker containerization
- Deployment to DigitalOcean
```

#### Production Deployment
```bash
# Build and deploy
npm run build
docker build -t arshu-legal-backend .
docker push your-registry/arshu-legal-backend
```

### 📞 Support & Security

#### Security Contact
- **Security Issues**: security@arshulegal.com
- **General Support**: support@arshulegal.com
- **Emergency**: Use GitHub Security Advisories

#### Compliance
- **GDPR** compliant data handling
- **PCI DSS** compliant payments (via Stripe)
- **SOC 2** hosting infrastructure (DigitalOcean)
- **ISO 27001** database security (MongoDB Atlas)

### 📚 Additional Resources

- [Security Best Practices](./docs/security.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

**Built with ❤️ and 🔒 by Aryan using GitHub Student Developer Pack**