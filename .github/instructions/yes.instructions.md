---
applyTo: '**'
---

# Legal Platform Website - Design & Development Guidelines

## Project Vision
Create a professional legal services platform with exceptional UI/UX that embodies trust, clarity, and accessibility. The design should evoke a sophisticated court/lawyer aesthetic while maintaining modern usability standards.

## Core Design Principles

### 1. Typography Excellence
- **Primary Font**: Use professional, readable serif or sans-serif fonts that convey authority and trust
- **Hierarchy**: Establish clear typographic hierarchy with consistent font weights (300, 400, 600, 700)
- **Scale**: Implement a harmonious type scale (12px, 14px, 16px, 18px, 24px, 32px, 48px, 64px)
- **Line Height**: Maintain optimal readability with 1.4-1.6 line height for body text
- **Letter Spacing**: Use subtle letter spacing for headings to enhance readability
- **Legal Aesthetic**: Choose fonts that feel professional and authoritative (think courthouse documents)

### 2. Spacing & Layout System
- **Consistent Spacing**: Use a 8px base unit system (8px, 16px, 24px, 32px, 48px, 64px, 96px)
- **White Space**: Embrace generous white space to create breathing room and reduce cognitive load
- **Vertical Rhythm**: Maintain consistent vertical spacing between elements
- **Component Spacing**: Standardize padding and margins within components
- **Section Separation**: Use clear visual separation between different content areas

### 3. Grid System & Layout
- **Responsive Grid**: Implement a flexible 12-column grid system
- **Breakpoints**: Mobile-first approach with clear breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Container Widths**: Use max-width containers for optimal reading experience
- **Alignment**: Maintain consistent alignment and visual flow
- **Asymmetric Balance**: Use intentional asymmetry to create visual interest while maintaining balance

### 4. Color Palette & Psychology
- **Primary Colors**: Deep navy/slate for trust and professionalism (#1e293b, #334155)
- **Accent Colors**: Sophisticated blue for actions and highlights (#3b82f6, #2563eb)
- **Legal Colors**: Incorporate traditional legal colors (gold/brass accents for premium feel)
- **Neutral Palette**: Comprehensive grayscale from white to charcoal (#ffffff to #0f172a)
- **Semantic Colors**: Clear success (green), warning (amber), and error (red) colors
- **Background Variants**: Subtle background tones for section differentiation

### 5. Contrast & Accessibility
- **WCAG Compliance**: Ensure AA level contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **Color Blindness**: Test all color combinations for accessibility
- **Focus States**: Clear, visible focus indicators for keyboard navigation
- **Text Contrast**: Ensure readability across all color combinations
- **Interactive Elements**: High contrast for buttons, links, and interactive components

### 6. Visual Hierarchy & Information Architecture
- **F-Pattern Reading**: Design layouts that support natural reading patterns
- **Progressive Disclosure**: Present information in digestible chunks
- **Call-to-Action Prominence**: Make primary actions obvious and accessible
- **Content Prioritization**: Lead with most important information
- **Visual Weight**: Use size, color, and positioning to guide attention

## User Experience Guidelines

### 1. Simplicity & Clarity
- **Minimal Interface**: Remove unnecessary elements that don't serve user goals
- **Clear Navigation**: Intuitive navigation structure with obvious paths
- **Single Purpose**: Each screen should have one primary purpose
- **Reduced Cognitive Load**: Minimize the number of decisions users need to make
- **Progressive Enhancement**: Build core functionality first, enhance with advanced features

### 2. Legal Professional Aesthetic
- **Court-inspired Design**: Draw inspiration from courthouse architecture and legal documents
- **Professional Imagery**: Use sophisticated, professional photography and illustrations
- **Formal Tone**: Maintain professional communication tone throughout
- **Trust Indicators**: Include credentials, certifications, and professional affiliations
- **Document-style Elements**: Incorporate design elements reminiscent of legal documents

### 3. User-Centered Design
- **Task-Oriented**: Design around what users need to accomplish
- **Error Prevention**: Design to prevent mistakes before they happen
- **Helpful Feedback**: Provide clear, actionable feedback for all user actions
- **Accessibility First**: Design for users with varying abilities
- **Mobile Experience**: Ensure excellent mobile experience for on-the-go legal needs

## Technical Implementation Standards

### 1. Component Design
- **Design System**: Build a comprehensive component library with consistent styling
- **Reusability**: Create modular, reusable components
- **State Management**: Clear visual states (default, hover, active, disabled, loading)
- **Responsive Components**: All components should work across all screen sizes
- **Performance**: Optimize for fast loading and smooth interactions

### 2. Animation & Micro-interactions
- **Purposeful Motion**: Use animation to guide attention and provide feedback
- **Professional Feel**: Subtle, sophisticated animations (no flashy effects)
- **Loading States**: Elegant loading indicators and skeleton screens
- **Transition Smoothness**: Smooth page transitions and state changes
- **Reduced Motion**: Respect user preferences for reduced motion

### 3. Content Strategy
- **Plain Language**: Use clear, jargon-free language when possible
- **Legal Accuracy**: Ensure all legal information is accurate and up-to-date
- **Scannable Content**: Structure content for easy scanning and comprehension
- **Emergency Information**: Make emergency services easily accessible
- **Help & Support**: Provide clear paths to assistance

## Quality Assurance

### 1. Testing Requirements
- **Cross-browser Compatibility**: Test across all major browsers
- **Device Testing**: Test on various devices and screen sizes
- **Accessibility Testing**: Use screen readers and accessibility tools
- **Performance Testing**: Ensure fast load times and smooth interactions
- **User Testing**: Validate design decisions with real users

### 2. Iteration & Improvement
- **Analytics Integration**: Track user behavior and identify improvement opportunities
- **Feedback Loops**: Implement systems for collecting and acting on user feedback
- **Continuous Refinement**: Regularly review and improve the user experience
- **A/B Testing**: Test design variations to optimize conversion and usability

## Success Metrics
- Users can complete their primary tasks within 3 clicks
- Professional appearance that builds immediate trust
- Accessible to users with disabilities
- Fast loading times (< 3 seconds)
- High user satisfaction and task completion rates
- Clear conversion paths for legal services

Remember: Every design decision should serve the user's need to access legal services quickly, clearly, and confidently. The interface should feel as professional and trustworthy as walking into a top-tier law firm.

## AI Integration Guidelines

### Google Gemini 2.5 Flash Integration
The platform uses Google Gemini 2.5 Flash for AI-powered legal assistance across all input fields and consultation features.

#### Core AI Features
1. **Legal Rights Analysis**: Real-time AI analysis of legal situations with detailed recommendations
2. **Consumer Rights Protection**: Specialized AI assistance for consumer disputes and protection
3. **Document Review**: AI-powered legal document analysis and approval workflows
4. **Input Field Assistance**: Context-aware AI help for all major input areas
5. **Floating AI Assistant**: 24/7 chat-based legal consultation available on all pages

#### AI Implementation Standards

**Service Architecture**:
- Centralized `GeminiLegalService` class with singleton pattern
- Rate limiting (60 requests/minute) to prevent API abuse
- Comprehensive error handling with graceful fallbacks
- Environment-based configuration management

**User Experience Principles**:
- **Transparency**: Always indicate when AI is being used
- **Fallback Strategy**: Provide helpful alternatives when AI fails
- **Progressive Enhancement**: App works without AI, enhanced with AI
- **Context Awareness**: AI responses tailored to user's current screen/context
- **Professional Tone**: All AI responses maintain legal professional standards

**Security & Privacy**:
- API keys stored in environment variables only
- No sensitive user data stored in AI requests
- Clear user consent for AI assistance features
- Compliance with data protection standards

**Integration Patterns**:
```typescript
// AI Service Integration
import { getGeminiService } from '../services/geminiService';

// Request AI assistance
const result = await geminiService.analyzeLegalRights({
  type: 'legal-rights',
  content: userInput,
  context: { category, jurisdiction: 'India', urgency }
});

// Handle AI responses with fallbacks
try {
  // AI operation
} catch (error) {
  // Graceful fallback with helpful message
}
```

**Component Integration**:
- Use `AIInputAssistant` component for input field assistance
- Integrate floating AI assistant via `FloatingAIAssistant`
- Show loading states during AI processing
- Provide clear AI vs human-generated content distinction

**Content Standards**:
- AI responses must be accurate and legally sound
- Include disclaimers about professional legal consultation
- Maintain consistent legal terminology
- Provide actionable, specific guidance
- Reference applicable Indian laws and acts

**Performance Optimization**:
- Cache AI responses where appropriate
- Use loading indicators for better UX
- Implement request throttling
- Optimize prompts for faster responses

**Error Handling**:
- Never leave users stranded when AI fails
- Provide alternative contact methods
- Log errors for debugging without exposing details
- Maintain service availability even with AI outages

**Quality Assurance**:
- Regular testing of AI response quality
- Monitor API usage and costs
- User feedback collection on AI assistance
- Continuous improvement of prompts and responses

#### Environment Setup
```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_MODEL=gemini-2.0-flash-exp
VITE_ENABLE_AI_FEATURES=true
VITE_API_RATE_LIMIT=60
```

#### Component Examples
- Legal Rights Checker: AI-powered legal situation analysis
- Consumer Rights Checker: Specialized consumer protection guidance  
- Document Review: Professional document analysis and approval
- Emergency Services: AI-assisted emergency legal guidance
- Input Assistance: Context-aware help for all form inputs

The AI integration enhances the platform's core mission of providing accessible, professional legal services while maintaining the highest standards of user experience and legal accuracy.