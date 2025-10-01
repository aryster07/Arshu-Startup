/**
 * Authentication Service
 * Handles user authentication, authorization, and session management
 */

import { apiClient, ApiResponse } from './apiService';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  userType: 'client' | 'lawyer' | 'admin';
  isVerified: boolean;
  profile?: {
    avatar?: string;
    location?: string;
    preferences?: {
      language: string;
      notifications: boolean;
    };
  };
  createdAt: string;
  lastLogin?: string;
}

export interface LawyerProfile extends User {
  userType: 'lawyer';
  profile: {
    avatar?: string;
    location?: string;
    preferences?: {
      language: string;
      notifications: boolean;
    };
    barRegistrationNumber: string;
    specializations: string[];
    experience: number;
    education: string[];
    certifications: string[];
    practiceAreas: string[];
    consultationFee: number;
    availability: {
      days: string[];
      hours: string;
    };
    rating?: number;
    casesHandled?: number;
  };
}

// Auth request types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: 'client' | 'lawyer';
  barRegistrationNumber?: string; // Required for lawyers
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
  profile?: any;
}

// Auth response types
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenRefreshResponse {
  token: string;
  expiresIn: number;
}

// Token storage utilities
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const tokenStorage = {
  setTokens: (token: string, refreshToken: string, rememberMe: boolean = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  setUser: (user: User, rememberMe: boolean = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
};

// Authentication API class
class AuthenticationAPI {
  private refreshTokenPromise: Promise<string> | null = null;

  // Register new user
  async register(request: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post('/auth/register', request, { skipAuth: true });
  }

  // Login user
  async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/auth/login', request, { skipAuth: true });
    
    if (response.success && response.data) {
      const { token, refreshToken, user } = response.data;
      tokenStorage.setTokens(token, refreshToken, request.rememberMe);
      tokenStorage.setUser(user, request.rememberMe);
    }
    
    return response;
  }

  // Logout user
  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/logout');
      return response;
    } finally {
      tokenStorage.clearTokens();
    }
  }

  // Refresh token
  async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = this._refreshToken();
    
    try {
      return await this.refreshTokenPromise;
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  private async _refreshToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<TokenRefreshResponse>(
      '/auth/refresh-token',
      { refreshToken },
      { skipAuth: true }
    );

    if (response.success && response.data) {
      const { token } = response.data;
      // Update token while keeping the same storage type
      const isRemembered = localStorage.getItem(TOKEN_KEY) !== null;
      tokenStorage.setTokens(token, refreshToken, isRemembered);
      return token;
    }

    throw new Error('Failed to refresh token');
  }

  // Forgot password
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/forgot-password', request, { skipAuth: true });
  }

  // Reset password
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/reset-password', request, { skipAuth: true });
  }

  // Change password
  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/change-password', request);
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/profile');
  }

  // Update user profile
  async updateProfile(request: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.patch<User>('/auth/profile', request);
    
    if (response.success && response.data) {
      const isRemembered = localStorage.getItem(USER_KEY) !== null;
      tokenStorage.setUser(response.data, isRemembered);
    }
    
    return response;
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/verify-email', { token }, { skipAuth: true });
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/resend-verification');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = tokenStorage.getToken();
    const user = tokenStorage.getUser();
    return !!(token && user);
  }

  // Get current user
  getCurrentUser(): User | null {
    return tokenStorage.getUser();
  }

  // Check user role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.userType === role;
  }

  // Get user permissions
  async getUserPermissions(): Promise<ApiResponse<string[]>> {
    return apiClient.get('/auth/permissions');
  }
}

// Create and export instance
export const authAPI = new AuthenticationAPI();

// Auth context hook
export const useAuth = () => {
  return {
    register: authAPI.register.bind(authAPI),
    login: authAPI.login.bind(authAPI),
    logout: authAPI.logout.bind(authAPI),
    refreshToken: authAPI.refreshToken.bind(authAPI),
    forgotPassword: authAPI.forgotPassword.bind(authAPI),
    resetPassword: authAPI.resetPassword.bind(authAPI),
    changePassword: authAPI.changePassword.bind(authAPI),
    getProfile: authAPI.getProfile.bind(authAPI),
    updateProfile: authAPI.updateProfile.bind(authAPI),
    verifyEmail: authAPI.verifyEmail.bind(authAPI),
    resendVerificationEmail: authAPI.resendVerificationEmail.bind(authAPI),
    isAuthenticated: authAPI.isAuthenticated.bind(authAPI),
    getCurrentUser: authAPI.getCurrentUser.bind(authAPI),
    hasRole: authAPI.hasRole.bind(authAPI),
    getUserPermissions: authAPI.getUserPermissions.bind(authAPI),
  };
};

export default authAPI;