# 🚀 Vercel Deployment Setup Guide

## ⚠️ Important: Environment Variables Required

Your deployment is showing "AI service is not configured" because the **environment variable is missing** in Vercel.

## 📋 Step-by-Step Deployment Instructions

### Step 1: Get Your Perplexity API Key

1. Go to [Perplexity AI Settings](https://www.perplexity.ai/settings/api)
2. Sign in or create an account
3. Navigate to **API** section
4. Click **"Generate API Key"**
5. Copy the API key (starts with `pplx-...`)

### Step 2: Add Environment Variable in Vercel

#### Option A: Through Vercel Dashboard (Recommended)

1. **Go to your Vercel project**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `Arshu-Startup` project

2. **Navigate to Settings**
   - Click on **"Settings"** tab
   - Select **"Environment Variables"** from the left menu

3. **Add the API Key**
   - **Name:** `VITE_PERPLEXITY_API_KEY`
   - **Value:** Your Perplexity API key (paste the key you copied)
   - **Environment:** Select **All** (Production, Preview, Development)
   - Click **"Save"**

4. **Redeploy**
   - Go to **"Deployments"** tab
   - Click the **three dots** (⋯) on the latest deployment
   - Click **"Redeploy"**
   - Select **"Use existing Build Cache"** (optional)
   - Click **"Redeploy"**

#### Option B: Through Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add VITE_PERPLEXITY_API_KEY

# When prompted:
# 1. Paste your Perplexity API key
# 2. Select: Production, Preview, Development (all)

# Redeploy
vercel --prod
```

### Step 3: Verify Deployment

1. **Wait for deployment to complete** (usually 1-2 minutes)

2. **Open your deployed site**
   - Click on the deployment URL
   - Navigate to the **Dashboard** or **AI Legal Assistant** section

3. **Test the AI Assistant**
   - Enter a legal query like: "What are my rights as a tenant?"
   - You should see a response from the AI

4. **Check Browser Console** (F12)
   - Look for: `"=== AI Service Debug Info ==="`
   - Should show: `"Perplexity key: pplx-..."`
   - Should NOT show: `"Perplexity key: NOT FOUND"`

## 🔍 Troubleshooting

### Issue: Still showing "AI service is not configured"

**Solution:**
1. Verify the environment variable name is exactly: `VITE_PERPLEXITY_API_KEY` (case-sensitive)
2. Make sure you selected **all environments** (Production, Preview, Development)
3. Try a **hard redeploy**:
   ```bash
   vercel --prod --force
   ```

### Issue: "Invalid API Key" or "Authentication Error"

**Solution:**
1. Verify your API key is correct
2. Check if your Perplexity account has available credits
3. Regenerate a new API key from [Perplexity Settings](https://www.perplexity.ai/settings/api)

### Issue: Build succeeds but AI still doesn't work

**Solution:**
1. Clear build cache in Vercel:
   - Go to **Settings** → **General**
   - Scroll to **"Build & Development Settings"**
   - Enable **"Clear Build Cache"**
   - Redeploy

## 📝 Environment Variable Checklist

Before deploying, make sure you have:

- ✅ Created a Perplexity account
- ✅ Generated a Perplexity API key
- ✅ Added `VITE_PERPLEXITY_API_KEY` in Vercel
- ✅ Selected **all environments** for the variable
- ✅ Redeployed after adding the variable
- ✅ Verified the deployment is using the new build

## 🌟 Additional Configuration (Optional)

### Custom Domain
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Build Settings (Already Configured)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Automatic Deployments
- Every push to `main` branch automatically deploys to production
- Pull requests create preview deployments

## 💡 Tips

1. **Keep your API key secure** - Never commit `.env` file to Git
2. **Monitor usage** - Check your Perplexity dashboard for API usage
3. **Set up alerts** - Configure Vercel to notify you of deployment failures
4. **Use preview deployments** - Test changes in preview before merging to main

## 📞 Need Help?

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Perplexity API Docs: [docs.perplexity.ai](https://docs.perplexity.ai)
- Check browser console for detailed error messages

---

**✅ Once you've added the environment variable and redeployed, your AI Legal Assistant will work perfectly!**
