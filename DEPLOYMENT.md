# Law Bandhu - Legal Assistance Platform 🏛️⚖️

A modern, AI-powered legal assistance platform built with React, TypeScript, and Vite. Features include AI legal consultation, voice input with bilingual support (English/Hindi), lawyer directory, and case management.

![Law Bandhu Platform](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)

## 🌟 Features

### 🤖 AI Legal Assistant
- Powered by Perplexity AI (llama-3.1-sonar-small-128k-chat)
- Instant legal guidance and analysis
- Beautiful card-style UI with color-coded sections
- Citation-free, easy-to-read responses
- Automatic lawyer recommendation based on legal issues

### 🎤 Voice Input
- Bilingual support (English & Hindi)
- Auto-language detection using Devanagari character recognition
- Live transcription with Web Speech API
- Visual feedback with animated microphone button

### 🎨 Beautiful UI/UX
- Card-style design for all content sections
- Color-coded information hierarchy:
  - 🔵 Blue: Main sections (H2)
  - 🔷 Teal: Sub-sections (H3)
  - 🟡 Yellow: Key highlights
  - 🟢 Green: Lists and action items
  - 🟣 Purple: Quotes and code
- Fully responsive design
- Mobile-friendly navigation

### ⚖️ Lawyer Directory
- Advanced filtering system
- Lawyer profiles with ratings and specializations
- Direct consultation booking
- Location-based search

### 📋 Case Management
- Track case progress
- Document management
- Status updates
- Timeline view

### 💳 Payment Integration
- Secure payment processing
- Multiple payment options
- Transaction history

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Perplexity API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryster07/Arshu-Startup.git
   cd Arshu-Startup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 📦 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool & dev server
- **Tailwind CSS 4.1.3** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icon library

### AI & APIs
- **Perplexity API** - AI legal analysis
- **Web Speech API** - Voice input

### Utilities
- **marked** - Markdown parsing
- **class-variance-authority** - Component variants
- **clsx** - Conditional classnames

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aryster07/Arshu-Startup)

### Manual Deployment

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
   vercel
   ```

4. **Add Environment Variables**
   
   In your Vercel project settings, add:
   - `VITE_PERPLEXITY_API_KEY` = Your Perplexity API key

### Automatic Deployment

Push to the `main` branch, and Vercel will automatically deploy your changes if you've connected your GitHub repository.

## 📁 Project Structure

```
Arshu-Startup/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Reusable components
│   │   ├── dashboard/         # Dashboard & AI Assistant
│   │   ├── layout/            # Navigation & layout
│   │   ├── lawyer/            # Lawyer directory
│   │   ├── pages/             # Page components
│   │   └── ui/                # UI components (shadcn)
│   ├── services/
│   │   └── aiService.ts       # Perplexity API integration
│   ├── utils/
│   │   ├── legalIssueDetector.ts
│   │   └── legalQueryValidator.ts
│   ├── styles/
│   │   └── globals.css        # Global styles & card designs
│   ├── App.tsx                # Main app component
│   └── main.tsx               # Entry point
├── public/                    # Static assets
├── .env.example              # Environment template
├── vercel.json               # Vercel configuration
├── vite.config.ts            # Vite configuration
└── package.json              # Dependencies

```

## 🎯 Key Features Explained

### AI Legal Assistant
- Uses Perplexity's llama-3.1-sonar-small-128k-chat model
- Processes legal queries and provides detailed analysis
- Detects personal legal issues and recommends appropriate lawyer types
- Formats responses with beautiful card-style UI

### Voice Input System
- Continuous listening mode for natural conversation
- Auto-detects Hindi text using Devanagari Unicode range (U+0900 to U+097F)
- Switches language automatically during transcription
- Visual feedback with red pulsing microphone when active

### Response Formatting
- Removes citation numbers for cleaner reading
- Color-coded sections for visual hierarchy
- Enhanced spacing for better readability
- Gradient backgrounds and borders for each content type

## 🔒 Security

- API keys are stored in environment variables
- Never commit `.env` file to version control
- Use `.env.example` as a template

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Aryan** ([@aryster07](https://github.com/aryster07))

## 🙏 Acknowledgments

- Perplexity AI for the powerful API
- Radix UI for accessible components
- Tailwind CSS for amazing styling utilities
- shadcn/ui for beautiful component designs

## 📞 Support

For support, email aryster07@gmail.com or open an issue in the repository.

---

**Made with ❤️ for accessible legal assistance in India**
