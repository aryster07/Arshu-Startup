/**
 * Authentication utilities for the frontend
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'lawyer' | 'admin';
  isVerified: boolean;
  isApproved?: boolean;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  const token = getAccessToken();
  return !!(user && token);
};

/**
 * Check if user has required role
 */
export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  return user?.role === requiredRole;
};

/**
 * Clear authentication data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
};

/**
 * Store authentication data
 */
export const storeAuthData = (user: User, tokens: AuthTokens): void => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('accessToken', tokens.accessToken);
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Make authenticated API request
 */
export const authenticatedFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    // Handle token expiry
    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        mergedOptions.headers = {
          ...mergedOptions.headers,
          ...getAuthHeader(),
        };
        return fetch(url, mergedOptions);
      } else {
        // Refresh failed, redirect to login
        clearAuthData();
        window.location.href = '/client/auth';
        throw new Error('Authentication expired');
      }
    }
    
    return response;
  } catch (error) {
    console.error('Authenticated fetch failed:', error);
    throw error;
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const API_BASE_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 
                        (import.meta.env?.VITE_API_URL) || 
                        'http://localhost:5000';
    
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.tokens) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

/**
 * Get redirect URL based on user role
 */
export const getDashboardUrl = (role: string): string => {
  switch (role) {
    case 'lawyer':
      return '/dashboard/lawyer';
    case 'admin':
      return '/admin/dashboard';
    case 'client':
    default:
      return '/dashboard';
  }
};

/**
 * Get auth portal URL based on user role
 */
export const getAuthUrl = (role: 'client' | 'lawyer' = 'client'): string => {
  return role === 'lawyer' ? '/lawyer/auth' : '/client/auth';
};

/**
 * Handle logout
 */
export const logout = async (): Promise<void> => {
  try {
    const API_BASE_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 
                        (import.meta.env?.VITE_API_URL) || 
                        'http://localhost:5000';
    const token = getAccessToken();
    
    if (token) {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
    }
  } catch (error) {
    console.error('Logout request failed:', error);
  } finally {
    clearAuthData();
    window.location.href = '/';
  }
};

/**
 * Format user's full name
 */
export const getUserFullName = (user: User | null): string => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`.trim();
};

/**
 * Get user's display name (first name + last initial)
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '';
  const lastInitial = user.lastName ? ` ${user.lastName.charAt(0)}.` : '';
  return `${user.firstName}${lastInitial}`;
};

/**
 * Check if user account needs attention
 */
export const getUserAccountStatus = (user: User | null): {
  status: 'active' | 'pending_verification' | 'pending_approval' | 'incomplete';
  message: string;
} => {
  if (!user) {
    return { status: 'incomplete', message: 'Please log in to continue' };
  }

  if (!user.isVerified) {
    return { 
      status: 'pending_verification', 
      message: 'Please verify your email address' 
    };
  }

  if (user.role === 'lawyer' && user.isApproved === false) {
    return { 
      status: 'pending_approval', 
      message: 'Your lawyer account is under review' 
    };
  }

  return { status: 'active', message: 'Account is active' };
};