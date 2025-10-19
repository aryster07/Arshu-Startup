# 🔐 Auth0 Configuration Guide for lawb.me

## ✅ Your Auth0 Credentials (Configured)

```
Domain: dev-kxy5z1utg6meqm1u.us.auth0.com
Client ID: 1oNn2whuKHIjCGBPVTwwxILt2HP02HNO
Website: lawb.me
```

✅ **Already configured in `.env` file!**

---

## 🚀 How to Set Up Redirect URLs in Auth0

### Step 1: Go to Auth0 Dashboard

1. Open: https://manage.auth0.com/
2. Login to your account
3. Select your application (should be the one with Client ID: `1oNn2whuKHIjCGBPVTwwxILt2HP02HNO`)

---

### Step 2: Configure Application Settings

Navigate to: **Applications → Applications → [Your App Name] → Settings**

---

### Step 3: Add Allowed Callback URLs

Scroll down to **"Application URIs"** section and find **"Allowed Callback URLs"**

**Add these URLs (one per line or comma-separated):**

```
http://localhost:5173/callback,
http://localhost:5173,
https://lawb.me/callback,
https://lawb.me,
https://www.lawb.me/callback,
https://www.lawb.me
```

**What each URL is for:**
- `http://localhost:5173/callback` - Local development testing
- `http://localhost:5173` - Local development fallback
- `https://lawb.me/callback` - Production callback (main)
- `https://lawb.me` - Production fallback
- `https://www.lawb.me/callback` - Production with www
- `https://www.lawb.me` - Production with www fallback

---

### Step 4: Add Allowed Logout URLs

Find **"Allowed Logout URLs"** in the same section

**Add these URLs:**

```
http://localhost:5173,
https://lawb.me,
https://www.lawb.me
```

**What this does:**
- After logout, users are redirected to these URLs
- Prevents security errors when logging out

---

### Step 5: Add Allowed Web Origins

Find **"Allowed Web Origins"** in the same section

**Add these URLs:**

```
http://localhost:5173,
https://lawb.me,
https://www.lawb.me
```

**What this does:**
- Allows your website to make requests to Auth0
- Required for authentication to work properly

---

### Step 6: Add Allowed Origins (CORS)

Find **"Allowed Origins (CORS)"** in the same section

**Add these URLs:**

```
http://localhost:5173,
https://lawb.me,
https://www.lawb.me
```

**What this does:**
- Enables Cross-Origin Resource Sharing
- Prevents CORS errors during authentication

---

### Step 7: Save Changes

**IMPORTANT:** Scroll to the bottom and click **"Save Changes"** button!

---

## 🎨 Visual Guide

Your Auth0 settings page should look like this:

```
┌─────────────────────────────────────────────────────────────┐
│ Application Settings                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Name: Law Bandhu                                            │
│ Domain: dev-kxy5z1utg6meqm1u.us.auth0.com                  │
│ Client ID: 1oNn2whuKHIjCGBPVTwwxILt2HP02HNO                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Application URIs                                     │   │
│ ├─────────────────────────────────────────────────────┤   │
│ │                                                      │   │
│ │ Application Login URI                                │   │
│ │ [                                               ]    │   │
│ │                                                      │   │
│ │ Allowed Callback URLs ⭐                             │   │
│ │ ┌──────────────────────────────────────────────┐   │   │
│ │ │ http://localhost:5173/callback,              │   │   │
│ │ │ http://localhost:5173,                       │   │   │
│ │ │ https://lawb.me/callback,                    │   │   │
│ │ │ https://lawb.me,                             │   │   │
│ │ │ https://www.lawb.me/callback,                │   │   │
│ │ │ https://www.lawb.me                          │   │   │
│ │ └──────────────────────────────────────────────┘   │   │
│ │                                                      │   │
│ │ Allowed Logout URLs ⭐                               │   │
│ │ ┌──────────────────────────────────────────────┐   │   │
│ │ │ http://localhost:5173,                       │   │   │
│ │ │ https://lawb.me,                             │   │   │
│ │ │ https://www.lawb.me                          │   │   │
│ │ └──────────────────────────────────────────────┘   │   │
│ │                                                      │   │
│ │ Allowed Web Origins ⭐                               │   │
│ │ ┌──────────────────────────────────────────────┐   │   │
│ │ │ http://localhost:5173,                       │   │   │
│ │ │ https://lawb.me,                             │   │   │
│ │ │ https://www.lawb.me                          │   │   │
│ │ └──────────────────────────────────────────────┘   │   │
│ │                                                      │   │
│ │ Allowed Origins (CORS) ⭐                            │   │
│ │ ┌──────────────────────────────────────────────┐   │   │
│ │ │ http://localhost:5173,                       │   │   │
│ │ │ https://lawb.me,                             │   │   │
│ │ │ https://www.lawb.me                          │   │   │
│ │ └──────────────────────────────────────────────┘   │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│          [Save Changes] ⭐ ← CLICK THIS!                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Enable Social Connections

### Step 8: Enable Google, GitHub, Facebook Login

1. In Auth0 Dashboard, go to: **Authentication → Social**

2. **Enable Google:**
   - Click "Google" → Toggle it ON
   - Click "Try" to test
   - (Optional) Add your own Google OAuth credentials later

3. **Enable GitHub:**
   - Click "GitHub" → Toggle it ON
   - Click "Try" to test

4. **Enable Facebook:**
   - Click "Facebook" → Toggle it ON
   - Click "Try" to test

**Note:** Auth0 provides default development keys for testing. For production, you should add your own credentials.

---

## 🧪 Testing Your Configuration

### Test Locally (Development)

1. **Make sure dev server is running:**
   ```bash
   npm run dev
   ```

2. **Open:** http://localhost:5173

3. **Click "Get Started"** (if DEV_MODE is false) or disable dev mode:
   ```typescript
   // In src/App.tsx, line 17
   const DEV_MODE = false; // Enable Auth0
   ```

4. **Click any OAuth button** (Google, GitHub, Facebook)

5. **Should see Auth0 login popup** ✅

6. **After login, redirects to:** http://localhost:5173/callback → Dashboard

---

### Test on Production (lawb.me)

1. **Deploy to Vercel** (if not already):
   ```bash
   git add .
   git commit -m "Add Auth0 configuration"
   git push origin main
   ```

2. **Update Vercel environment variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     VITE_AUTH0_DOMAIN=dev-kxy5z1utg6meqm1u.us.auth0.com
     VITE_AUTH0_CLIENT_ID=1oNn2whuKHIjCGBPVTwwxILt2HP02HNO
     VITE_AUTH0_REDIRECT_URI=https://lawb.me/callback
     ```

3. **Redeploy:**
   - Vercel will auto-redeploy
   - Or manually: Deploy → Redeploy

4. **Test on live site:**
   - Go to: https://lawb.me
   - Click "Get Started"
   - Try OAuth login
   - Should redirect back to: https://lawb.me/callback → Dashboard ✅

---

## 🔍 Troubleshooting

### Error: "Callback URL mismatch"
**Solution:** Make sure you added the exact callback URLs in Auth0 settings and clicked "Save Changes"

### Error: "Origin not allowed"
**Solution:** Add your domain to "Allowed Web Origins" and "Allowed Origins (CORS)"

### Error: "Invalid state"
**Solution:** Clear browser cache and cookies, try again

### Login works locally but not on production
**Solution:** 
1. Check Vercel environment variables are set correctly
2. Make sure `https://lawb.me/callback` is in Auth0 Allowed Callback URLs
3. Redeploy on Vercel

### Social login buttons don't work
**Solution:** Make sure you enabled the social connections in Auth0 Dashboard → Authentication → Social

---

## 📱 Callback Flow Diagram

```
User clicks "Login with Google"
         ↓
Redirects to Auth0 login page
         ↓
User logs in with Google
         ↓
Auth0 redirects back to your site:
https://lawb.me/callback?code=abc123...
         ↓
Your app exchanges code for token
         ↓
User is authenticated!
         ↓
Redirects to Dashboard
```

---

## 🎯 Quick Checklist

Before testing authentication, make sure:

- [ ] Added all callback URLs in Auth0
- [ ] Added all logout URLs in Auth0
- [ ] Added all web origins in Auth0
- [ ] Added all CORS origins in Auth0
- [ ] Clicked "Save Changes" in Auth0
- [ ] Enabled social connections (Google, GitHub, Facebook)
- [ ] `.env` file has correct Auth0 credentials
- [ ] Set `DEV_MODE = false` in `src/App.tsx` (to enable auth)
- [ ] Restarted dev server after changing `.env`

---

## 🚀 Next Steps

1. **Complete Auth0 setup** (follow steps above)
2. **Test locally** with `DEV_MODE = false`
3. **Deploy to Vercel** with environment variables
4. **Test on lawb.me**
5. **Set `DEV_MODE = false`** in production build

---

## 💡 Pro Tips

### Multiple Environments
You can use different callback URLs for different environments:
- Development: `http://localhost:5173/callback`
- Staging: `https://staging.lawb.me/callback`
- Production: `https://lawb.me/callback`

### Custom Domain
If you want a custom Auth0 domain (like `auth.lawb.me`):
1. Upgrade to Auth0 paid plan
2. Configure custom domain in Auth0 settings

### Branding
Customize Auth0 login page:
1. Go to: Branding → Universal Login
2. Customize colors, logo, and styling

---

## 📞 Need Help?

**Auth0 Dashboard:** https://manage.auth0.com/
**Auth0 Docs:** https://auth0.com/docs/
**Auth0 Community:** https://community.auth0.com/

---

## ✅ Summary

**Your Auth0 is configured with:**
- Domain: `dev-kxy5z1utg6meqm1u.us.auth0.com`
- Client ID: `1oNn2whuKHIjCGBPVTwwxILt2HP02HNO`
- Production URL: `https://lawb.me`
- Callback URL: `https://lawb.me/callback`

**Next:** Follow the steps above to add the callback URLs in Auth0 Dashboard, and you're ready to test!

**Questions?** Just ask! 🚀
