/**
 * Environment Configuration Management
 * Provides centralized configuration for different deployment environments
 */

import React from 'react';

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Configuration interface
export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: Environment;
    debug: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  auth: {
    tokenStorageKey: string;
    refreshTokenKey: string;
    sessionTimeout: number; // in minutes
  };
  services: {
    gemini: {
      apiKey: string;
      model: string;
      maxTokens: number;
    };
    speech: {
      enabled: boolean;
      language: string;
      continuous: boolean;
    };
  };
  features: {
    enableErrorReporting: boolean;
    enableAnalytics: boolean;
    enableProfiling: boolean;
    enableMockData: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    toastDuration: number;
    maxToasts: number;
  };
  legal: {
    emergencyContactNumber: string;
    supportEmail: string;
    businessHours: {
      start: number; // 24-hour format
      end: number;
      days: number[]; // 0 = Sunday, 6 = Saturday
    };
  };
}

// Environment-specific overrides type
type ConfigOverrides = {
  [K in keyof AppConfig]?: Partial<AppConfig[K]>;
};

// Default configuration
const defaultConfig: AppConfig = {
  app: {
    name: 'Arshu Legal Platform',
    version: '1.0.0',
    environment: 'development',
    debug: true,
  },
  api: {
    baseUrl: 'http://localhost:3001/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  auth: {
    tokenStorageKey: 'arshu_auth_token',
    refreshTokenKey: 'arshu_refresh_token',
    sessionTimeout: 60, // 1 hour
  },
  services: {
    gemini: {
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      model: 'gemini-pro',
      maxTokens: 4096,
    },
    speech: {
      enabled: true,
      language: 'en-IN',
      continuous: false,
    },
  },
  features: {
    enableErrorReporting: false,
    enableAnalytics: false,
    enableProfiling: false,
    enableMockData: true,
  },
  ui: {
    theme: 'light',
    toastDuration: 5000,
    maxToasts: 5,
  },
  legal: {
    emergencyContactNumber: '+91 62302-44977',
    supportEmail: 'support@arshu.com',
    businessHours: {
      start: 9,
      end: 18,
      days: [1, 2, 3, 4, 5], // Monday to Friday
    },
  },
};

// Environment-specific configurations
const environments: Record<Environment, ConfigOverrides> = {
  development: {
    app: {
      debug: true,
      environment: 'development',
    },
    api: {
      baseUrl: 'http://localhost:3001/api',
    },
    features: {
      enableErrorReporting: false,
      enableAnalytics: false,
      enableProfiling: true,
      enableMockData: true,
    },
  },

  staging: {
    app: {
      debug: false,
      environment: 'staging',
    },
    api: {
      baseUrl: 'https://staging-api.arshu.com/api',
    },
    features: {
      enableErrorReporting: true,
      enableAnalytics: true,
      enableProfiling: true,
      enableMockData: false,
    },
  },

  production: {
    app: {
      debug: false,
      environment: 'production',
    },
    api: {
      baseUrl: 'https://api.arshu.com/api',
    },
    features: {
      enableErrorReporting: true,
      enableAnalytics: true,
      enableProfiling: false,
      enableMockData: false,
    },
  },
};

// Configuration class
class ConfigManager {
  private config: AppConfig;
  private environment: Environment;

  constructor() {
    this.environment = this.detectEnvironment();
    this.config = this.buildConfig();
  }

  private detectEnvironment(): Environment {
    // Check environment variables
    const viteEnv = import.meta.env.VITE_ENVIRONMENT as Environment;
    if (viteEnv && ['development', 'staging', 'production'].includes(viteEnv)) {
      return viteEnv;
    }

    // Check Node environment
    const nodeEnv = import.meta.env.NODE_ENV;
    if (nodeEnv === 'production') {
      return 'production';
    }

    // Check hostname for staging
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('staging')) {
        return 'staging';
      }
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        return 'development';
      }
      if (hostname.includes('arshu.com')) {
        return 'production';
      }
    }

    // Default to development
    return 'development';
  }

  private buildConfig(): AppConfig {
    const envConfig = environments[this.environment];
    return this.deepMerge(defaultConfig, envConfig);
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  // Public methods
  public getConfig(): AppConfig {
    return this.config;
  }

  public get(path: string): any {
    const keys = path.split('.');
    let value = this.config as any;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  public getEnvironment(): Environment {
    return this.environment;
  }

  public isDevelopment(): boolean {
    return this.environment === 'development';
  }

  public isStaging(): boolean {
    return this.environment === 'staging';
  }

  public isProduction(): boolean {
    return this.environment === 'production';
  }

  public isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  // Validation methods
  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required API key
    if (!this.config.services.gemini.apiKey) {
      errors.push('Gemini API key is required');
    }

    // Validate API URL
    if (!this.config.api.baseUrl) {
      errors.push('API base URL is required');
    }

    // Validate business hours
    const { start, end, days } = this.config.legal.businessHours;
    if (start >= end) {
      errors.push('Business hours start time must be before end time');
    }
    if (days.length === 0) {
      errors.push('At least one business day must be specified');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Dynamic configuration updates (for runtime changes)
  public updateConfig(path: string, value: any): void {
    const keys = path.split('.');
    let target = this.config as any;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in target) || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }
    
    target[keys[keys.length - 1]] = value;
  }
}

// Create singleton instance
const configManager = new ConfigManager();

// Export convenience functions
export const config = configManager.getConfig();
export const getConfig = (path?: string) => path ? configManager.get(path) : configManager.getConfig();
export const getEnvironment = () => configManager.getEnvironment();
export const isDevelopment = () => configManager.isDevelopment();
export const isStaging = () => configManager.isStaging();
export const isProduction = () => configManager.isProduction();
export const isFeatureEnabled = (feature: keyof AppConfig['features']) => configManager.isFeatureEnabled(feature);
export const updateConfig = (path: string, value: any) => configManager.updateConfig(path, value);
export const validateConfig = () => configManager.validateConfig();

// React hook for configuration
export function useConfig(path?: string) {
  return React.useMemo(() => {
    return path ? getConfig(path) : getConfig();
  }, [path]);
}

// Development helpers
export const devHelpers = {
  logConfig: () => {
    if (isDevelopment()) {
      console.group('🔧 Application Configuration');
      console.log('Environment:', getEnvironment());
      console.log('Config:', getConfig());
      console.log('Validation:', validateConfig());
      console.groupEnd();
    }
  },
  
  setMockMode: (enabled: boolean) => {
    if (isDevelopment()) {
      updateConfig('features.enableMockData', enabled);
      console.log(`Mock data ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
};

export default configManager;