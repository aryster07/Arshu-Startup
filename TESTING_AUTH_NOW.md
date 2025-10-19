# 🧪 Auth0 Testing Guide - Ready to Test!

## ✅ Authentication is Now ENABLED!

**Dev mode bypass is disabled.** Real Auth0 authentication is active!

---

## 🚀 How to Test Right Now

### Step 1: Restart Your Dev Server

**IMPORTANT:** You must restart the dev server for `.env` changes to take effect!

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

### Step 2: Open Your App

Go to: **http://localhost:5173**

You should see:
- ✅ No yellow "DEV MODE" banner (it's gone!)
- ✅ Landing page with "Get Started" button

---

### Step 3: Test OAuth Social Login

1. **Click "Get Started"** or **"Login"** button

2. **You'll see the Auth Page with two tabs:**
   - **Social Login** tab (OAuth)
   - **Email/Phone OTP** tab

3. **Click "Social Login" tab**

4. **You'll see three buttons:**
   - 🔵 Continue with Google
   - ⚫ Continue with GitHub
   - 🔵 Continue with Facebook

5. **Click any OAuth button** (e.g., "Continue with Google")

6. **What should happen:**
   - Auth0 login popup opens
   - You login with your Google/GitHub/Facebook account
   - Redirects back to your app
   - You're now on the Dashboard! ✅

---

### Step 4: Test Email/Phone OTP

1. **Click "Get Started"** or **"Login"**

2. **Click "Email/Phone OTP" tab**

3. **Choose "Email" or "Phone"**

4. **Enter your email or phone number**

5. **Click "Send OTP"**

6. **What should happen:**
   - Backend sends OTP to your email/phone
   - Enter the 6-digit code
   - Click "Verify OTP"
   - You're logged in! ✅

---

## 🎯 Current Configuration

```env
✅ Auth0 Domain: dev-kxy5z1utg6meqm1u.us.auth0.com
✅ Client ID: 1oNn2whuKHIjCGBPVTwwxILt2HP02HNO
✅ Redirect URI: http://localhost:5173/callback (for local testing)
✅ DEV_MODE: false (authentication enabled)
```

---

## 🔍 What to Look For

### Success Indicators:
✅ No yellow banner (dev mode disabled)
✅ Auth page appears when clicking "Get Started"
✅ OAuth buttons work and open Auth0 popup
✅ After login, redirects to Dashboard
✅ User info appears in dashboard (profile icon)

### Common Issues & Solutions:

#### Issue 1: "Callback URL mismatch"
**Solution:** Make sure you added `http://localhost:5173/callback` to Auth0 settings:
1. Go to https://manage.auth0.com/
2. Applications → Your App → Settings
3. Add to "Allowed Callback URLs"
4. Save changes

#### Issue 2: "Origin not allowed"
**Solution:** Add `http://localhost:5173` to:
- Allowed Web Origins
- Allowed Origins (CORS)

#### Issue 3: OAuth buttons don't work
**Solution:** Enable social connections:
1. Auth0 Dashboard → Authentication → Social
2. Enable Google, GitHub, Facebook
3. Save

#### Issue 4: OTP not sending
**Solution:** Backend needs to be running:
```bash
cd backend
npm install
npm run dev
```
Make sure you have Twilio/SendGrid credentials in `backend/.env`

---

## 📱 Testing Flow Diagram

```
Landing Page
     ↓
Click "Get Started"
     ↓
Auth Page (Two tabs: OAuth / OTP)
     ↓
┌──────────────────────────────────┐
│ Option 1: Social Login (OAuth)  │
│  - Click Google/GitHub/Facebook  │
│  - Auth0 popup opens             │
│  - Login with account            │
│  - Redirects back                │
│  - Dashboard! ✅                  │
└──────────────────────────────────┘
     OR
┌──────────────────────────────────┐
│ Option 2: Email/Phone OTP        │
│  - Enter email/phone             │
│  - Click "Send OTP"              │
│  - Receive 6-digit code          │
│  - Enter code                    │
│  - Click "Verify OTP"            │
│  - Dashboard! ✅                  │
└──────────────────────────────────┘
```

---

## 🎨 Visual Preview

### Auth Page (What you'll see):
```
┌─────────────────────────────────────────────────┐
│              Welcome to Law Bandhu              │
│         Sign in to access your legal dashboard  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  [Social Login] [Email/Phone OTP]       │   │
│  ├─────────────────────────────────────────┤   │
│  │                                          │   │
│  │  🔵 Continue with Google                │   │
│  │  ⚫ Continue with GitHub                │   │
│  │  🔵 Continue with Facebook              │   │
│  │                                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🧪 Test Checklist

Before testing, make sure:

- [x] Set `DEV_MODE = false` in `src/App.tsx` ✅
- [x] Updated `.env` with localhost callback URL ✅
- [ ] Restarted dev server (`npm run dev`)
- [ ] Auth0 callback URLs configured in dashboard
- [ ] Social connections enabled in Auth0
- [ ] Backend running (if testing OTP)

**Ready to test!** 🚀

---

## 📝 Quick Commands

```bash
# Restart dev server (required!)
npm run dev

# Open app
# http://localhost:5173

# If testing OTP, start backend:
cd backend
npm run dev
```

---

## 🎉 Expected Results

### OAuth Login (Google/GitHub/Facebook):
1. Click OAuth button
2. Auth0 popup opens
3. Login with your account
4. Popup closes
5. **Redirects to Dashboard** ✅
6. **Profile icon shows your info** ✅

### OTP Login (Email/Phone):
1. Enter email/phone
2. Click "Send OTP"
3. Receive code
4. Enter code
5. Click "Verify"
6. **Dashboard appears** ✅

---

## 🔧 Toggle Dev Mode Anytime

### Enable Authentication (Current):
```typescript
// src/App.tsx, line 17
const DEV_MODE = false; // ✅ Auth enabled
```

### Bypass Authentication (For quick testing):
```typescript
// src/App.tsx, line 17
const DEV_MODE = true; // Skip auth
```

---

## 📞 Need Help?

### Check These First:
1. ✅ Dev server restarted after `.env` changes?
2. ✅ Auth0 callback URLs added in dashboard?
3. ✅ Social connections enabled in Auth0?
4. ✅ Browser console for error messages?

### Auth0 Dashboard:
https://manage.auth0.com/

### Backend Setup (for OTP):
See `backend/README.md` for Twilio/SendGrid setup

---

## 🎯 Summary

**Authentication is now ENABLED!**

✅ DEV_MODE = false
✅ Real Auth0 integration active
✅ OAuth social login ready
✅ OTP login ready (needs backend)
✅ Localhost configured for testing

**Next:** Restart your dev server and test the login flow! 🚀

**Questions?** Just ask! The Auth0 setup is complete and ready to test.
