# OAuth Configuration Guide

## Environment Variables Required

Create a `.env` file in your project root with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Google OAuth2
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

# Facebook OAuth2
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id

# Apple Sign In
REACT_APP_APPLE_CLIENT_ID=your_apple_client_id
REACT_APP_APPLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Environment
REACT_APP_ENVIRONMENT=development
```

## OAuth Provider Setup Instructions

### 1. Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Application type: Web application
6. Authorized JavaScript origins: `http://localhost:3000`, `https://yourdomain.com`
7. Authorized redirect URIs: 
   - `http://localhost:5000/api/v1/auth/google/callback`
   - `https://yourapi.com/api/v1/auth/google/callback`

### 2. Facebook OAuth2 Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app → "Business" type
3. Add "Facebook Login" product
4. In Facebook Login settings:
   - Valid OAuth Redirect URIs: 
     - `http://localhost:5000/api/v1/auth/facebook/callback`
     - `https://yourapi.com/api/v1/auth/facebook/callback`
   - Valid domains: `localhost`, `yourdomain.com`

### 3. Apple Sign In Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Register a new identifier → "App IDs"
3. Enable "Sign In with Apple" capability
4. Create a new service identifier for web
5. Configure Sign In with Apple:
   - Primary App ID: Your app ID
   - Domains: `yourdomain.com`
   - Return URLs: 
     - `http://localhost:5000/api/v1/auth/apple/callback`
     - `https://yourapi.com/api/v1/auth/apple/callback`

## Backend Environment Variables

Make sure your backend has these environment variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legal-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Session
SESSION_SECRET=your-session-secret

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth2
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Apple Sign In
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nyour_apple_private_key\n-----END PRIVATE KEY-----

# Email Service (for verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
PORT=5000
```

## Testing OAuth Flow

1. Start your backend server: `npm start`
2. Start your frontend: `npm run dev`
3. Navigate to `/client/auth` or `/lawyer/auth`
4. Click on any OAuth provider button
5. Complete the OAuth flow
6. You should be redirected back to the appropriate dashboard

## Deployment Notes

### Frontend Deployment (Vercel/Netlify)
- Update environment variables in deployment settings
- Set `REACT_APP_API_URL` to your production API URL
- Update OAuth redirect URIs to include production domain

### Backend Deployment (DigitalOcean/Heroku)
- Set all environment variables in deployment platform
- Update OAuth provider settings with production callback URLs
- Ensure MongoDB Atlas is configured for production

## Security Best Practices

1. **Never commit secrets**: Keep `.env` files in `.gitignore`
2. **Use HTTPS in production**: OAuth providers require HTTPS for production
3. **Validate tokens**: Always verify JWT tokens on protected routes
4. **Rate limiting**: Implement rate limiting on auth endpoints
5. **CORS configuration**: Configure CORS properly for your domain
6. **Session security**: Use secure, httpOnly cookies for sessions

## Troubleshooting

### Common Issues:

1. **OAuth redirect mismatch**: 
   - Check if callback URLs match exactly in provider settings
   - Ensure no trailing slashes or extra parameters

2. **CORS errors**: 
   - Check if frontend URL is added to CORS allowlist
   - Verify `credentials: 'include'` is set in fetch requests

3. **Token verification fails**: 
   - Check if JWT secrets match between requests
   - Verify token expiration times

4. **State parameter mismatch**: 
   - This is usually a security feature, ensure state is preserved

5. **Invalid client errors**: 
   - Double-check client IDs and secrets
   - Ensure OAuth apps are properly configured