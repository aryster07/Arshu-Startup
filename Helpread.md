# Legal Platform Codebase Guide

## Project Overview

This is a comprehensive legal services platform built with React, TypeScript, and Vite. The platform connects clients with legal professionals and provides AI-powered legal assistance using Google Gemini 2.5 Flash. It features role-based dashboards, multilingual support, voice recognition, and specialized legal service modules.

## Project Architecture

### Core Technologies

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.6
- **Routing**: React Router DOM 7.9.3
- **UI Framework**: Radix UI components with Tailwind CSS
- **AI Integration**: Google Gemini 2.5 Flash API
- **Speech Recognition**: Web Speech API with custom hooks

## Project Structure

### Root Files

#### `package.json`

Main project configuration file defining dependencies, scripts, and metadata. Key dependencies include:

- React ecosystem (React, React DOM, React Router)
- UI components (@radix-ui/* packages)
- AI and speech utilities
- TypeScript and Vite for development

#### `tsconfig.json` & `tsconfig.node.json`

TypeScript configuration files for both the main application and Node.js tooling.

#### `vite.config.ts`

Vite build tool configuration with React SWC plugin for fast compilation.

#### `index.html`

Main HTML entry point that loads the React application.

#### `AI_SETUP.md`, `ERRORS_FIXED.md`, `README.md`

Documentation files for AI setup, error tracking, and project overview.

### Source Directory (`src/`)

#### Application Entry Point

**`main.tsx`**

- Application bootstrap file
- Renders the main App component into the DOM root
- Sets up React's StrictMode for development

**`App.tsx`**

- Root application component
- Initializes Google Gemini AI service on startup
- Sets up React Router with BrowserRouter
- Imports and renders the main SimpleRouter component

**`index.css`**

- Global CSS styles and Tailwind CSS imports
- Base styling for the entire application

#### Routing System (`routes/`)

**`SimpleRouter.tsx`**
Central routing configuration that defines all application routes and layouts:

**Route Structure:**

- **Homepage**: `/` → `HomePage` (marketing landing page)
- **Client Dashboard**: `/dashboard/client` → `ClientDashboardPage` (client portal)
- **Lawyer Dashboard**: `/dashboard/lawyer` → `LawyerDashboardPage` (lawyer portal)
- **Client Portal Services**:
  - `/dashboard/client/legal-rights` → Legal Rights Checker (app layout)
  - `/dashboard/client/consumer-rights` → Consumer Rights Checker (app layout)
  - `/dashboard/client/document-review` → Document Review (app layout)
  - `/dashboard/client/emergency` → Emergency Services (app layout)
  - `/dashboard/client/legal-notice` → Legal Notice Service (app layout)
- **Lawyer Portal Services**: Similar structure under `/dashboard/lawyer/`
- **Marketing Legal Services**:
  - `/services/legal-rights` → Legal Rights (default layout)
  - `/services/consumer-rights` → Consumer Rights (default layout)
  - `/services/emergency` → Emergency Services (default layout)
  - `/services/legal-notice` → Legal Notice (default layout)
- **Static Pages**: `/about`, `/contact`, `/services` (default layout)

**Layout Patterns:**

- `DefaultLayout`: Marketing pages with navbar and footer
- `AppLayout`: Dashboard pages with sidebar navigation
- `WithNavigation`: HOC providing navigation utilities to components

#### Route Constants (`constants/routes.ts`)

Centralized route definitions and configuration:

- `ROUTES`: Object containing all route paths
- `PAGE_TITLES`: SEO-friendly page titles
- `MAIN_NAVIGATION`: Main menu structure
- `DASHBOARD_NAVIGATION`: Dashboard sidebar menus
- `API_ENDPOINTS`: Future backend API endpoints

#### Navigation Hooks (`hooks/`)

**`useNavigation.ts`**
Comprehensive navigation utilities:

- `useNavigation()`: Main navigation hook with programmatic navigation
- `useMobileNavigation()`: Mobile-specific navigation with gesture support
- `useBreadcrumbs()`: Breadcrumb generation based on current route

**`useSimpleNavigation.ts`**
Simplified navigation hook that maps legacy screen names to modern routes. Used by older components for backward compatibility.

**`useSpeechRecognition.ts`**
Advanced speech recognition hook providing:

- Multi-language speech recognition
- Real-time transcription with interim results
- Auto-language detection
- Confidence scoring
- Error handling and browser compatibility checks

#### Layout Components (`layouts/`)

**`DefaultLayout.tsx`**
Standard layout for marketing pages:

- Fixed navbar at top
- Main content area with top padding
- Footer at bottom
- Used for: Home, About, Contact, Services pages

**`AppLayout.tsx`**
Dashboard layout for authenticated users:

- Fixed sidebar navigation (72 units wide)
- Role-based navigation menus (client vs lawyer)
- Top header with breadcrumb navigation
- Main scrollable content area
- User profile and settings access

**`DashboardLayout.tsx`**
Additional dashboard layout variation (if needed)

#### Page Components (`pages/`)

**`HomePage.tsx`**
Marketing landing page featuring:

- Hero section with professional legal branding
- Role selection cards (Client vs Lawyer portals)
- Emergency services callout
- Professional credentials showcase
- Navigation to all major sections

**Dashboard Pages (`pages/dashboard/`)**

**`ClientDashboardPage.tsx`**
Comprehensive client portal dashboard:

- AI-powered legal assistant with voice input
- Multi-language support (English/Hindi)
- Real-time speech recognition
- Legal content validation
- Quick legal consultation
- Legal services grid navigation
- Case management interface
- Consultation booking system

**`LawyerDashboardPage.tsx`**
Professional lawyer portal (structure similar to client dashboard but tailored for legal professionals)

#### Core Components (`components/`)

**Navigation Components**

**`Navbar.tsx`**
Main application navigation:

- Responsive design with mobile menu
- Services dropdown with quick access
- Active route highlighting
- Scroll-based styling changes
- Professional legal branding

**`Footer.tsx`**
Site-wide footer with legal information and links

**Legal Service Components**

**`LegalRightsChecker.tsx`**
AI-powered legal rights analysis tool:

- Multi-language input support
- Voice recognition integration
- Google Gemini AI analysis
- Comprehensive legal advice generation
- Indian law specialization

**`ConsumerRightsChecker.tsx`**
Specialized consumer protection service:

- Consumer rights violation detection
- Complaint assistance
- Remedy recommendations
- Indian Consumer Protection Act compliance

**`DocumentReview.tsx`**
Professional document analysis service:

- Legal document upload and review
- AI-powered analysis
- Compliance checking
- Risk assessment

**`EmergencyServices.tsx`**
24/7 emergency legal assistance:

- Urgent legal matter handling
- Emergency contact integration
- Priority escalation system

**`LegalNoticeService.tsx`**
Legal notice preparation and dispatch:

- Notice template generation
- Legal formatting
- Delivery coordination

**Informational Components**

**`AboutPage.tsx`**
Company information and team details

**`ContactPage.tsx`**
Contact forms and office information

**`ServicesPage.tsx`**
Complete services overview and descriptions

**`RoleSelectionCard.tsx`**
Reusable card component for role selection on homepage

#### UI Component Library (`components/ui/`)

**Complete Radix UI Component Suite:**

- `button.tsx` - Button components with variants
- `card.tsx` - Card containers for content sections
- `input.tsx` - Form input fields
- `textarea.tsx` - Multi-line text inputs
- `select.tsx` - Dropdown selections
- `dialog.tsx` - Modal dialogs
- `tabs.tsx` - Tab navigation
- `badge.tsx` - Status and label badges
- `accordion.tsx` - Collapsible content sections
- `navigation-menu.tsx` - Complex navigation menus
- `breadcrumb.tsx` - Breadcrumb navigation
- `pagination.tsx` - Page navigation controls
- `form.tsx` - Form handling utilities
- `alert.tsx` - Alert and notification components
- `progress.tsx` - Progress indicators
- `skeleton.tsx` - Loading placeholders
- `tooltip.tsx` - Hover tooltips
- `dropdown-menu.tsx` - Context menus
- `sheet.tsx` - Slide-out panels
- `drawer.tsx` - Mobile-friendly drawers
- `popover.tsx` - Floating content panels
- `hover-card.tsx` - Hover-triggered cards
- `calendar.tsx` - Date picker component
- `carousel.tsx` - Image/content carousels
- `chart.tsx` - Data visualization
- `table.tsx` - Data tables
- `checkbox.tsx` - Checkbox inputs
- `radio-group.tsx` - Radio button groups
- `switch.tsx` - Toggle switches
- `slider.tsx` - Range sliders
- `scroll-area.tsx` - Custom scrollbars
- `separator.tsx` - Visual separators
- `avatar.tsx` - User profile images
- `menubar.tsx` - Menu bar navigation
- `command.tsx` - Command palette
- `context-menu.tsx` - Right-click menus
- `toggle.tsx` - Toggle buttons
- `toggle-group.tsx` - Toggle button groups
- `collapsible.tsx` - Collapsible sections
- `aspect-ratio.tsx` - Responsive aspect ratios
- `resizable.tsx` - Resizable panels
- `sidebar.tsx` - Sidebar components
- `input-otp.tsx` - OTP input fields
- `label.tsx` - Form labels
- `sonner.tsx` - Toast notifications

**Utility Files:**

- `utils.ts` - Utility functions for styling and class merging
- `use-mobile.ts` - Mobile device detection hook
- `PageHeader.tsx` - Reusable page header component

#### Services (`services/`)

**`geminiService.ts`**
Comprehensive Google Gemini AI integration:

**Core Features:**

- `GeminiLegalService` class with singleton pattern
- Rate limiting (60 requests/minute)
- Multi-language support (English/Hindi)
- Legal content validation
- Error handling with graceful fallbacks

**Analysis Methods:**

- `analyzeLegalRights()` - General legal rights analysis
- `analyzeConsumerRights()` - Consumer protection analysis
- `reviewDocument()` - Document review and approval
- `provideLegalConsultation()` - General legal consultation
- `getInputAssistance()` - Quick AI assistance for inputs
- `validateLegalContent()` - Checks if content is law-related
- `detectLanguage()` - Auto-detects input language
- `translateText()` - Text translation between languages

**Configuration:**

- Environment-based setup with API keys
- Configurable model parameters
- Fallback strategies for API failures

**`speechService.ts`**
Speech recognition and processing utilities (if present)

#### Hooks (`hooks/`)

**Custom Hook Library:**

- `useNavigation.ts` - Navigation utilities with breadcrumbs
- `useSimpleNavigation.ts` - Legacy navigation compatibility
- `useSpeechRecognition.ts` - Advanced speech recognition with multi-language support

#### Utilities (`utils/`)

**`helpers.ts`**
Common utility functions used across the application

#### Types (`types/`)

**`index.ts`**
TypeScript type definitions for:

- Route configurations
- API responses
- Component props
- Service interfaces

#### Styling (`styles/`)

**`globals.css`**
Global CSS styles and Tailwind CSS customizations

#### Constants (`constants/`)

Route definitions and application constants

#### Figma Assets (`components/figma/`)

**`ImageWithFallback.tsx`**
Component for handling images with fallback support

#### Guidelines (`guidelines/`)

**`Guidelines.md`**
Design and development guidelines for the project

## Data Flow and Component Relationships

### Application Initialization

1. `main.tsx` → `App.tsx` → Initializes Gemini AI service
2. `App.tsx` → `SimpleRouter.tsx` → Route resolution
3. Route components → Layout selection → Page rendering

### Navigation Flow

1. User action triggers navigation via `useNavigation` or `useSimpleNavigation`
2. Router matches path in `SimpleRouter.tsx`
3. Route renders with appropriate layout (`DefaultLayout` or `AppLayout`)
4. Layout provides navigation context and page structure

### AI Integration Flow

1. User input in dashboard or legal service components
2. `GeminiLegalService` validates content is legal-related
3. AI analysis performed with proper prompts and context
4. Results formatted and displayed with error handling

### Speech Recognition Flow

1. `useSpeechRecognition` hook manages Web Speech API
2. Real-time transcription updates component state
3. Language detection and confidence scoring
4. Integration with AI services for analysis

## Key Features

### Multi-Language Support

- English and Hindi language interfaces
- Voice recognition in multiple languages
- AI responses in user's preferred language
- Automatic language detection

### AI-Powered Legal Assistance

- Google Gemini 2.5 Flash integration
- Legal content validation
- Indian law specialization
- Rate limiting and error handling

### Role-Based Architecture

- Separate dashboards for clients and lawyers
- Role-specific navigation and features
- Unified service components with different contexts

### Voice Integration

- Real-time speech recognition
- Multi-language voice input
- Confidence scoring and error handling
- Mobile-friendly voice controls

### Professional Design

- Court-inspired professional aesthetic
- Comprehensive UI component library
- Responsive design for all devices
- Accessibility-focused implementation

## Environment Setup

Required environment variables:

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_MODEL=gemini-2.5-pro
VITE_ENABLE_AI_FEATURES=true
VITE_API_RATE_LIMIT=60
```

## Development Workflow

1. **Development**: `npm run dev` - Starts Vite development server
2. **Building**: `npm run build` - Creates production build
3. **Components**: Use existing UI library in `components/ui/`
4. **Routing**: Add new routes in `SimpleRouter.tsx` and `routes.ts`
5. **AI Features**: Extend `GeminiLegalService` for new AI capabilities
6. **Styling**: Follow design guidelines in `.github/instructions/yes.instructions.md`

This codebase represents a comprehensive legal services platform with modern React architecture, AI integration, and professional legal industry focus.
