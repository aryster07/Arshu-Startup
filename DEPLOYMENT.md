# Legal Platform Website - Vercel Deployment

A modern legal platform built with React, TypeScript, and Vite, featuring AI-powered legal analysis and comprehensive legal services.

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Arshu-Startup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local API URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Set Environment Variables (Optional)**
   
   In Vercel Project Settings → Environment Variables, add:
   ```
   VITE_API_URL=https://your-backend-api-url.com
   VITE_ENVIRONMENT=production
   ```
   
   **Note**: These are optional since the app currently works without a backend.

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables Setup

In your Vercel project dashboard, add these environment variables:

| Variable | Value | Description |
|----------|--------|-------------|
| `VITE_API_URL` | `https://your-api-domain.vercel.app` | Your backend API URL |
| `VITE_ENVIRONMENT` | `production` | Environment identifier |

### Domain Configuration

1. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## 🛠️ Build Information

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Dashboard pages
├── layouts/            # Layout components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/          # Application constants
```

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `vite.config.ts` - Vite build configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

## 🚦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm start        # Start production server
```

## 📱 Features

- **Responsive Design**: Mobile-first approach
- **AI Legal Analysis**: Powered by Gemini AI
- **Legal Services**: Rights checker, consumer protection, document review
- **Dashboard**: Separate client and lawyer portals
- **Real-time Analysis**: Voice recognition and text analysis

## 🔐 Security

- Environment variables properly configured
- No sensitive data in client bundle
- Secure API communication

## 📞 Support

For deployment issues or questions:
1. Check Vercel deployment logs
2. Verify environment variables
3. Ensure API endpoints are accessible

## 🎯 Performance

- Optimized build with Vite
- Code splitting and lazy loading
- Compressed assets
- CDN delivery via Vercel Edge Network