/**
 * API Service Layer for Backend Integration
 * Provides centralized API handling with proper error management and loading states
 */

// Base API configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request options
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

// Base API client
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get authentication token
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  // Build headers with authentication
  private buildHeaders(options?: RequestOptions): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...options?.headers };
    
    if (!options?.skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Build URL with query parameters
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${endpoint}`;
    
    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  // Retry logic with exponential backoff
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = API_CONFIG.retryAttempts
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) except 408, 429
        if (error instanceof ApiError) {
          const shouldRetry = 
            error.status >= 500 || 
            error.status === 408 || 
            error.status === 429;
          
          if (!shouldRetry || attempt === maxRetries) {
            throw error;
          }
        }

        // Wait before retry with exponential backoff
        if (attempt < maxRetries) {
          const delay = API_CONFIG.retryDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  // Make HTTP request
  private async makeRequest<T>(
    method: string,
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, options?.params);
    const headers = this.buildHeaders(options);

    const requestConfig: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(options?.timeout || API_CONFIG.timeout),
    };

    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }

    console.log(`🌐 API Request: ${method} ${url}`);

    return this.withRetry(async () => {
      const response = await fetch(url, requestConfig);

      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status}`, responseData);
        
        throw new ApiError(
          responseData?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          responseData?.code,
          responseData
        );
      }

      console.log(`✅ API Success: ${method} ${url}`);
      return responseData;
    }, options?.retries);
  }

  // HTTP Methods
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, body, options);
  }

  async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, body, options);
  }

  async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PATCH', endpoint, body, options);
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, options);
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Utility functions for common API patterns
export const apiUtils = {
  // Handle API responses with proper error handling
  handleResponse: <T>(
    response: ApiResponse<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ) => {
    if (response.success && response.data) {
      onSuccess?.(response.data);
      return response.data;
    } else {
      const errorMessage = response.error || response.message || 'An error occurred';
      onError?.(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Create paginated API call
  createPaginatedCall: <T>(endpoint: string) => {
    return async (page: number = 1, limit: number = 10, filters?: Record<string, any>) => {
      const params = { page, limit, ...filters };
      return apiClient.get<T[]>(endpoint, { params });
    };
  },

  // Upload file helper
  uploadFile: async (endpoint: string, file: File, additionalData?: Record<string, any>) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new ApiError(`Upload failed: ${response.statusText}`, response.status);
    }

    return response.json();
  },
};

export default apiClient;