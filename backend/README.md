# Backend API Setup for Email/SMS OTP

This is a simple Node.js/Express backend for handling OTP authentication with Twilio and SendGrid.

## Prerequisites

1. Node.js installed
2. Twilio account (free with GitHub Student Pack - $100 credit)
3. SendGrid API key (via Twilio)

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Twilio Configuration (SMS OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# SendGrid Configuration (Email OTP)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173

# JWT Secret (for session management)
JWT_SECRET=your_random_secret_key_here_change_this_in_production

# Database (optional - for production)
# MONGODB_URI=mongodb://localhost:27017/lawbandhu
```

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### 1. Send Email OTP
```http
POST /api/auth/send-email-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### 2. Verify Email OTP
```http
POST /api/auth/verify-email-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "userId": "user_id_here",
  "token": "jwt_token_here"
}
```

### 3. Send Phone OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "+911234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your phone"
}
```

### 4. Verify Phone OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+911234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "userId": "user_id_here",
  "token": "jwt_token_here"
}
```

## Getting Twilio Credentials

### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up with your student email
3. Verify your phone number
4. Get **$100 credit** through GitHub Student Pack

### Step 2: Get Account SID and Auth Token
1. Go to Twilio Console: https://console.twilio.com
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Copy them to your `.env` file

### Step 3: Get Phone Number
1. In Twilio Console, go to Phone Numbers → Manage → Buy a number
2. Choose a number (free with trial credits)
3. Copy the number to your `.env` file (format: +1234567890)

### Step 4: Set up Verify Service (Recommended for OTP)
1. Go to Verify → Services
2. Click "Create new Service"
3. Name it "Law Bandhu OTP"
4. Copy the **Service SID** to your `.env` file

### Step 5: Set up SendGrid (Email OTP)
1. In Twilio Console, go to SendGrid Email API
2. Click "Create API Key"
3. Name it "Law Bandhu Email"
4. Choose "Full Access" or "Restricted Access" with Send Mail permission
5. Copy the API key to your `.env` file
6. Verify your sender email in SendGrid

## Security Best Practices

1. ✅ **Never expose backend .env variables to frontend**
2. ✅ **Use rate limiting** (already implemented in backend)
3. ✅ **Implement OTP expiry** (10 minutes default)
4. ✅ **Limit OTP attempts** (3 attempts per session)
5. ✅ **Use HTTPS in production**
6. ✅ **Validate phone numbers** (E.164 format)
7. ✅ **Sanitize email addresses**

## Testing

### Test with curl:

```bash
# Send Email OTP
curl -X POST http://localhost:5000/api/auth/send-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify Email OTP
curl -X POST http://localhost:5000/api/auth/verify-email-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Send Phone OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+911234567890"}'

# Verify Phone OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+911234567890","otp":"123456"}'
```

## Deployment

### Deploy to Heroku (Free with Student Pack)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create new app
heroku create lawbandhu-api

# Set environment variables
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
# ... set all other env vars

# Deploy
git push heroku main
```

### Deploy to Railway (Alternative)
1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically

## Troubleshooting

### Issue: OTP not sending
- Check Twilio account balance
- Verify phone number format (+country_code + number)
- Check Twilio logs in console

### Issue: Email not receiving
- Verify sender email in SendGrid
- Check spam folder
- Verify SendGrid API key permissions

### Issue: CORS errors
- Update FRONTEND_URL in .env
- Check if frontend is running on correct port

## Next Steps

1. ✅ Set up Twilio account
2. ✅ Get credentials and add to .env
3. ✅ Run backend server
4. ✅ Test API endpoints
5. ✅ Update frontend VITE_API_URL
6. ✅ Test full authentication flow
