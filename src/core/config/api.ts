/**
 * API Configuration
 * Centralized configuration for API endpoints and environment variables
 */

// Safely get environment variables with fallbacks
const getApiBaseUrl = (): string => {
  // Try different environment variable sources
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Vite environment variables
  if (import.meta?.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development fallback
  return 'http://localhost:5000';
};

const getEnvironment = (): string => {
  if (typeof process !== 'undefined' && process.env?.REACT_APP_ENVIRONMENT) {
    return process.env.REACT_APP_ENVIRONMENT;
  }
  
  // Vite environment variables
  if (import.meta?.env?.VITE_ENVIRONMENT) {
    return import.meta.env.VITE_ENVIRONMENT;
  }
  
  return 'development';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENVIRONMENT: getEnvironment(),
  ENDPOINTS: {
    USERS: {
      PROFILE: '/api/v1/users/profile',
      UPDATE_PROFILE: '/api/v1/users/profile',
      DELETE_ACCOUNT: '/api/v1/users/account',
    },
    LEGAL: {
      RIGHTS_ANALYSIS: '/api/v1/legal/rights-analysis',
      CONSUMER_RIGHTS: '/api/v1/legal/consumer-rights',
      DOCUMENT_REVIEW: '/api/v1/legal/document-review',
      EMERGENCY_SERVICES: '/api/v1/legal/emergency',
      LEGAL_NOTICE: '/api/v1/legal/notice',
    }
  }
} as const;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if we're in development
export const isDevelopment = (): boolean => {
  return API_CONFIG.ENVIRONMENT === 'development';
};

// Helper function to check if we're in production
export const isProduction = (): boolean => {
  return API_CONFIG.ENVIRONMENT === 'production';
};

export default API_CONFIG;