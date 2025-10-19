# Law Bandhu - Legal Platform

# Law Bandhu UI/UX Design

A modern legal assistance platform built with React, TypeScript, and Vite, featuring AI-powered legal analysis.

A modern legal assistance platform with AI-powered features to help users with legal queries, lawyer consultations, and case management.

## 🚀 Features

This is a code bundle for Law Bandhu UI/UX Design. The original project is available at https://www.figma.com/design/Jhhgjzktm2x3ybkWbixkdv/Law-Bandhu-UI-UX-Design.

- **AI Legal Assistant**: Get instant legal guidance powered by Perplexity AI

- **Lawyer Directory**: Browse and consult with qualified legal professionals## 🚀 Quick Start

- **Case Management**: Track and manage your legal cases

- **Consultant Services**: Access legal consultation services### 1. Install Dependencies

- **Responsive Design**: Fully responsive UI built with Tailwind CSS```bash

npm install

## 📋 Prerequisites```



- Node.js (v16 or higher)### 2. Setup AI Integration (NEW!)

- npm or yarnThe platform now includes AI-powered legal assistance with automatic provider fallback.

- Perplexity API Key

**Quick Setup:**

## 🛠️ Installation```bash

# Run setup script

1. Clone the repository:setup-ai.bat  # On Windows

```bash

git clone <repository-url># Or manually create .env from template

cd Testcopy .env.example .env

``````



2. Install dependencies:**Add at least ONE API key to `.env`:**

```bash- OpenAI: https://platform.openai.com/

npm install- Gemini (FREE): https://makersuite.google.com/app/apikey

```- Perplexity: https://www.perplexity.ai/



3. Set up environment variables:📖 See **[QUICKSTART.md](QUICKSTART.md)** for detailed setup instructions

   - Copy `.env.example` to `.env`

   - Add your Perplexity API key:### 3. Run Development Server

   ``````bash

   VITE_PERPLEXITY_API_KEY=your_api_key_herenpm run dev

   ``````



## 🏃 Running the ApplicationVisit http://localhost:5173 to see the application.



Development mode:## ✨ Features

```bash

npm run dev### Core Features

```- 🏠 **Landing Page** - Professional introduction to legal services

- 🔐 **Authentication** - Secure login with OTP verification

Build for production:- 📊 **Dashboard** - Comprehensive overview of legal services

```bash- 👨‍⚖️ **Lawyer Directory** - Browse and filter legal professionals

npm run build- 📋 **Case Management** - Track and manage legal cases

```- 💳 **Payment History** - View transaction history



Preview production build:### 🤖 AI Features (NEW!)

```bash- **Multi-Provider AI Support:**

npm run preview  - OpenAI GPT-3.5-turbo

```  - Google Gemini Pro

  - Perplexity AI

## 🏗️ Project Structure- **Automatic Fallback:** If one provider fails, automatically uses the next

- **Real-time Analysis:** Get instant legal guidance

```- **Provider Transparency:** See which AI powered your response

src/- **Error Handling:** Graceful degradation with helpful error messages

├── components/

│   ├── auth/          # Authentication components## 📁 Project Structure

│   ├── common/        # Shared components

│   ├── dashboard/     # Dashboard components```

│   ├── lawyer/        # Lawyer-related componentssrc/

│   ├── layout/        # Layout components├── components/

│   ├── pages/         # Page components│   ├── auth/           # Authentication components

│   └── ui/            # UI primitives (shadcn/ui)│   ├── dashboard/      # Dashboard widgets including AI Assistant

├── services/          # API services│   ├── lawyer/         # Lawyer-related components

├── utils/             # Utility functions│   ├── pages/          # Page components

└── styles/            # Global styles│   ├── layout/         # Layout components (Navbar, Sidebar)

```│   └── ui/             # Reusable UI components (shadcn/ui)

├── services/

## 🔑 Key Technologies│   └── aiService.ts    # AI integration with multi-provider support

├── styles/

- **React 18** - UI library│   └── globals.css     # Global styles and design system

- **TypeScript** - Type safety└── main.tsx            # Application entry point

- **Vite** - Build tool

- **Tailwind CSS** - StylingConfiguration Files:

- **Radix UI** - Accessible components├── .env                # API keys (DO NOT COMMIT)

- **Perplexity AI** - Legal analysis├── .env.example        # Template for API keys

├── tsconfig.json       # TypeScript configuration

## 🤝 Contributing└── vite.config.ts      # Vite configuration

```

This project is currently in development. For questions or contributions, please contact the development team.

## 🤖 AI Integration Documentation

## 📄 License

- **[QUICKSTART.md](QUICKSTART.md)** - 3-minute setup guide

All rights reserved.- **[AI_SETUP.md](AI_SETUP.md)** - Detailed AI configuration

- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details

## 🔒 Environment Variables

## 🛠️ Technology Stack

- `VITE_PERPLEXITY_API_KEY` - Your Perplexity API key for AI features

- **Frontend:** React 18 + TypeScript

## 📞 Support- **Build Tool:** Vite 6.3.5

- **Styling:** Tailwind CSS + Custom Design System

For support and inquiries, please contact the Law Bandhu team.- **UI Components:** Radix UI + shadcn/ui

- **AI Integration:** OpenAI, Gemini, Perplexity APIs
- **Icons:** Lucide React
- **Forms:** React Hook Form

## 🎨 Design System

The project follows a professional legal design system:
- **Primary Color:** Blue (#2563eb) - Trust and professionalism
- **Secondary Color:** Gold (#f59e0b) - Premium feel
- **Typography:** System fonts + Times New Roman for legal finish
- **Spacing:** 8px grid system
- **Border Radius:** 8px base for modern look

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔒 Security Notes

### Development
- API keys stored in environment variables
- `.env` file is gitignored
- Never commit API keys to version control

### Production Recommendations
For production deployment:
1. ✅ Move API calls to backend server
2. ✅ Implement rate limiting
3. ✅ Add user authentication
4. ✅ Use separate API keys for production
5. ✅ Monitor usage and set billing alerts

See [AI_SETUP.md](AI_SETUP.md) for detailed security guidelines.

## 💰 Cost Considerations

### AI Provider Pricing (Approximate)
- **Gemini:** Free tier available, then ~$0.00025/1K tokens
- **OpenAI:** ~$0.002/1K tokens
- **Perplexity:** Varies by plan

### Cost Optimization
- Responses limited to 500 tokens max
- Only one provider called per request
- Failed requests don't incur costs
- Automatic fallback prevents wasted calls

## 🐛 Troubleshooting

### AI Not Working
**"AI service is not configured"**
- Add at least one API key to `.env`
- Restart the development server

**"All AI providers failed"**
- Verify API keys are correct
- Check internet connection
- Ensure you have API credits/quota
- Check browser console for detailed errors

### General Issues
**Build errors:**
```bash
npm install  # Reinstall dependencies
```

**Port already in use:**
```bash
# Vite will automatically try another port
# Or manually specify: vite --port 3000
```

## 📚 Additional Resources

### Component Libraries
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Lucide Icons](https://lucide.dev/) - Icon library

### AI Providers
- [OpenAI Platform](https://platform.openai.com/)
- [Google AI Studio](https://makersuite.google.com/)
- [Perplexity AI](https://www.perplexity.ai/)

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

**Important:** Never commit API keys or sensitive data!

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- Design inspiration from legal industry standards
- UI components from Radix UI and shadcn/ui
- Original Figma design: [Law Bandhu UI/UX Design](https://www.figma.com/design/Jhhgjzktm2x3ybkWbixkdv/Law-Bandhu-UI-UX-Design)

## 📞 Support

For issues or questions:
1. Check the documentation files (QUICKSTART.md, AI_SETUP.md)
2. Review browser console for errors
3. Verify environment configuration
4. Check API provider status pages

---

**Ready to get started?** Follow the [QUICKSTART.md](QUICKSTART.md) guide to set up AI integration in 3 minutes!
  