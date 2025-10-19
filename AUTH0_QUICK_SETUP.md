# 🔐 Auth0 Setup - Quick Reference

## ✅ Your Credentials (Already in .env)

```
Domain: dev-kxy5z1utg6meqm1u.us.auth0.com
Client ID: 1oNn2whuKHIjCGBPVTwwxILt2HP02HNO
Website: lawb.me
```

---

## 🚀 What You Need to Do in Auth0 Dashboard

### 1. Go to Auth0
https://manage.auth0.com/

### 2. Find Your Application
Applications → Applications → (Your App with Client ID: 1oNn2whuKHIjCGBPVTwwxILt2HP02HNO)

### 3. Add These URLs (Copy & Paste)

**Allowed Callback URLs:**
```
http://localhost:5173/callback, http://localhost:5173, https://lawb.me/callback, https://lawb.me, https://www.lawb.me/callback, https://www.lawb.me
```

**Allowed Logout URLs:**
```
http://localhost:5173, https://lawb.me, https://www.lawb.me
```

**Allowed Web Origins:**
```
http://localhost:5173, https://lawb.me, https://www.lawb.me
```

**Allowed Origins (CORS):**
```
http://localhost:5173, https://lawb.me, https://www.lawb.me
```

### 4. Enable Social Logins
- Go to: Authentication → Social
- Enable: Google ✅
- Enable: GitHub ✅
- Enable: Facebook ✅

### 5. Save Changes
Click "Save Changes" button at the bottom!

---

## 🧪 Testing

### Local Testing:
1. In `.env`, change to:
   ```
   VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback
   ```
2. Set `DEV_MODE = false` in `src/App.tsx`
3. Restart dev server: `npm run dev`
4. Test OAuth login

### Production Testing (lawb.me):
1. Deploy to Vercel
2. Add environment variables in Vercel
3. Test at https://lawb.me

---

## 📚 Full Guide
See **AUTH0_SETUP_LAWBME.md** for detailed instructions with screenshots and troubleshooting.

---

## ⚡ Quick Commands

```bash
# Restart dev server after .env changes
npm run dev

# Deploy to production
git add .
git commit -m "Configure Auth0"
git push origin main
```

---

**That's it!** 🎉 Copy the URLs above into Auth0 Dashboard and you're ready to test!
