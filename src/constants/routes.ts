// Route paths
export const ROUTES = {
  HOME: '/',
  
  // Dashboard routes
  CLIENT_DASHBOARD: '/dashboard/client',
  LAWYER_DASHBOARD: '/dashboard/lawyer',
  
  // Legal services routes
  LEGAL_RIGHTS: '/services/legal-rights',
  CONSUMER_RIGHTS: '/services/consumer-rights',
  DOCUMENT_REVIEW: '/services/document-review',
  EMERGENCY_SERVICES: '/services/emergency',
  LEGAL_NOTICE: '/services/legal-notice',
  
  // Information pages
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',
  
  // Authentication (for future use)
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Error pages
  NOT_FOUND: '/404',
} as const;

// Page titles for better SEO and navigation
export const PAGE_TITLES = {
  [ROUTES.HOME]: 'Legal Platform - Professional Legal Services',
  [ROUTES.CLIENT_DASHBOARD]: 'Client Dashboard - Legal Services',
  [ROUTES.LAWYER_DASHBOARD]: 'Lawyer Dashboard - Legal Services',
  [ROUTES.LEGAL_RIGHTS]: 'Legal Rights Analysis - AI-Powered Legal Assistant',
  [ROUTES.CONSUMER_RIGHTS]: 'Consumer Rights Protection - Legal Analysis',
  [ROUTES.DOCUMENT_REVIEW]: 'Document Review - Professional Legal Analysis',
  [ROUTES.EMERGENCY_SERVICES]: 'Emergency Legal Services - 24/7 Support',
  [ROUTES.LEGAL_NOTICE]: 'Legal Notice Service - Professional Documents',
  [ROUTES.ABOUT]: 'About Us - Legal Platform',
  [ROUTES.CONTACT]: 'Contact Us - Legal Platform',
  [ROUTES.SERVICES]: 'Our Services - Legal Platform',
  [ROUTES.NOT_FOUND]: 'Page Not Found - Legal Platform',
} as const;

// Navigation menu items
export const MAIN_NAVIGATION = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.SERVICES, label: 'Services' },
  { path: ROUTES.ABOUT, label: 'About' },
  { path: ROUTES.CONTACT, label: 'Contact' },
] as const;

// Dashboard navigation
export const DASHBOARD_NAVIGATION = {
  CLIENT: [
    { path: ROUTES.CLIENT_DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.LEGAL_RIGHTS, label: 'Legal Rights' },
    { path: ROUTES.CONSUMER_RIGHTS, label: 'Consumer Rights' },
    { path: ROUTES.DOCUMENT_REVIEW, label: 'Document Review' },
    { path: ROUTES.EMERGENCY_SERVICES, label: 'Emergency' },
  ],
  LAWYER: [
    { path: ROUTES.LAWYER_DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.CLIENT_DASHBOARD, label: 'Client View' },
    { path: ROUTES.LEGAL_NOTICE, label: 'Legal Notice' },
  ],
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  LEGAL: {
    ANALYZE_RIGHTS: '/legal/analyze-rights',
    CONSUMER_RIGHTS: '/legal/consumer-rights',
    DOCUMENT_REVIEW: '/legal/document-review',
    EMERGENCY: '/legal/emergency',
  },
  USER: {
    PROFILE: '/user/profile',
    CASES: '/user/cases',
    DOCUMENTS: '/user/documents',
  },
} as const;