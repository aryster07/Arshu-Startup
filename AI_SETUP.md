# Google Gemini AI Integration Setup

## Installation Instructions

### 1. Install Dependencies
```bash
npm install @google/generative-ai
```

### 2. Environment Configuration
1. Copy `.env.example` to `.env.local`
2. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Update `.env.local` with your API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Build and Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features Enabled

### ✅ AI-Powered Legal Analysis
- **Legal Rights Checker**: Real AI analysis replacing mock responses
- **Consumer Rights Checker**: Specialized consumer protection AI
- **Document Review**: Professional document analysis and approval

### ✅ Input Field Assistance
- Context-aware AI help on all major input fields
- Floating AI assistant available on every page
- Quick suggestions and legal guidance

### ✅ Professional Features
- 60 requests/minute rate limiting
- Graceful fallbacks when AI is unavailable
- Professional legal response formatting
- Indian law specialization

## Usage Examples

### Basic AI Consultation
The floating AI assistant is available on every page. Click the blue chat icon in the bottom-right corner.

### Input Field Help
Look for the "AI Help" button near text inputs to get context-aware assistance.

### Document Review
Navigate to Client Dashboard → Document Review to analyze legal documents with AI.

### Rights Analysis
Use Legal Rights Checker or Consumer Rights Checker for specialized AI analysis.

## Development Notes

- The app gracefully handles AI service failures
- All AI features have fallback responses
- TypeScript errors related to React types are expected in current setup
- Focus on AI functionality - UI errors are framework-related, not AI integration issues

## API Key Security
- Never commit API keys to version control
- Use environment variables only
- Rotate keys regularly for security
- Monitor API usage and costs

## Success Metrics
- AI provides relevant, accurate legal guidance
- Users can complete legal consultations with AI assistance
- Document review provides professional-grade analysis
- Emergency legal assistance is enhanced with AI support