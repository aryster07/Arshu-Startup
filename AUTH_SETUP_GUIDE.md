# Authentication Setup Guide - GitHub Student Pack Resources

## 🎓 GitHub Student Pack Resources for Authentication

### Recommended Services (All Free with Student Pack):

#### 1. **Twilio** (Email & SMS OTP)
- **What you get**: $100 credit
- **Perfect for**: SMS OTP, Email verification via SendGrid (Twilio-owned)
- **Setup**: https://www.twilio.com/try-twilio
- **Student Pack Link**: https://education.github.com/pack

#### 2. **Auth0** (OAuth & Authentication)
- **What you get**: Free plan + enhanced features
- **Perfect for**: Google, GitHub, Facebook OAuth, Social logins
- **Setup**: https://auth0.com/
- **Features**: Pre-built login UI, JWT tokens, user management

#### 3. **Firebase** (Alternative - Google)
- **What you get**: Generous free tier
- **Perfect for**: Authentication, Phone OTP, OAuth (Google, GitHub, etc.)
- **Setup**: https://firebase.google.com/

---

## 🚀 Recommended Setup: Twilio + Auth0

### Phase 1: Twilio Setup (SMS & Email OTP)

#### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up with your student email
3. Verify your account
4. Get **$100 credit** through GitHub Student Pack

#### Step 2: Get Twilio Credentials
```bash
# You'll need these:
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # For OTP
```

#### Step 3: Enable SendGrid (Email OTP)
1. Go to Twilio Console → SendGrid Email API
2. Create API key
3. Get credentials:
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### Phase 2: Auth0 Setup (OAuth - Google, GitHub, Facebook)

#### Step 1: Create Auth0 Account
1. Go to https://auth0.com/
2. Sign up with GitHub (to get Student Pack benefits)
3. Create a new Application → Single Page Application

#### Step 2: Configure Auth0
```bash
# Auth0 Credentials needed:
VITE_AUTH0_DOMAIN=your-app.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
VITE_AUTH0_REDIRECT_URI=http://localhost:3000/callback
# For production: https://your-domain.com/callback
```

#### Step 3: Enable Social Connections
In Auth0 Dashboard → Authentication → Social:
1. **Google**: Enable Google OAuth
2. **GitHub**: Enable GitHub OAuth  
3. **Facebook**: Enable Facebook Login

---

## 📦 Installation

### Install Required Packages
```bash
# Auth0 for OAuth
npm install @auth0/auth0-react

# Twilio for SMS OTP
npm install twilio

# For API requests
npm install axios

# For secure token storage
npm install js-cookie
```

---

## 🔧 Environment Variables Setup

Create/Update `.env` file:

```env
# === AI Service ===
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here

# === Auth0 (OAuth - Frontend) ===
VITE_AUTH0_DOMAIN=your-app.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
VITE_AUTH0_AUDIENCE=https://your-app.us.auth0.com/api/v2/
VITE_AUTH0_REDIRECT_URI=http://localhost:3000/callback

# === Backend API URL ===
VITE_API_URL=http://localhost:5000

# === Twilio (Backend Only - DO NOT expose to frontend) ===
# These should be in your backend .env file, not here
# TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# TWILIO_AUTH_TOKEN=your_auth_token_here
# TWILIO_PHONE_NUMBER=+1234567890
# TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === SendGrid (Email - Backend Only) ===
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Auth0Provider (OAuth - Google, GitHub, Facebook)   │  │
│  │  - Login with Google                                 │  │
│  │  - Login with GitHub                                 │  │
│  │  - Login with Facebook                               │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Email/Phone OTP (via Backend API)                   │  │
│  │  - Send OTP to Email/Phone                           │  │
│  │  - Verify OTP                                        │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Node.js/Express)                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Twilio Integration                                  │  │
│  │  - POST /api/auth/send-otp (SMS)                     │  │
│  │  - POST /api/auth/verify-otp                         │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  SendGrid Integration                                │  │
│  │  - POST /api/auth/send-email-otp                     │  │
│  │  - POST /api/auth/verify-email-otp                   │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Next Steps

I will now create:
1. ✅ Auth0 Provider wrapper
2. ✅ Updated AuthPage with OAuth buttons
3. ✅ OTP verification component
4. ✅ Authentication service
5. ✅ Backend API structure (Node.js)

Would you like me to:
- **Option A**: Set up BOTH Auth0 (OAuth) + Twilio (OTP) - Complete solution
- **Option B**: Start with Auth0 only (OAuth - easiest to set up)
- **Option C**: Start with Twilio only (OTP - requires backend)

**Recommended**: Option A for complete authentication system

---

## 💡 Cost Breakdown (with Student Pack)

| Service | Normal Cost | With Student Pack | What You Get |
|---------|-------------|-------------------|--------------|
| Twilio SMS | $0.0079/msg | **FREE** ($100 credit) | ~12,000 SMS |
| SendGrid Email | $0.001/email | **FREE** (via Twilio) | Unlimited |
| Auth0 | $240/year | **FREE** | Unlimited social logins |

**Total Savings**: $340+/year! 🎉

---

## 🔒 Security Best Practices

1. ✅ Never expose Twilio credentials in frontend code
2. ✅ Use Auth0 for OAuth (handles security automatically)
3. ✅ Store JWT tokens securely (httpOnly cookies)
4. ✅ Implement rate limiting for OTP requests
5. ✅ Add CORS protection
6. ✅ Use HTTPS in production

---

**Ready to proceed?** Let me know which option you prefer, and I'll set it up!
