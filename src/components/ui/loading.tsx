/**
 * Loading State Management Utilities
 * Provides consistent loading indicators and skeleton screens
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

// Loading state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingOptions {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
}

// Loading Spinner Component
export const LoadingSpinner: React.FC<LoadingOptions> = ({ 
  text = 'Loading...', 
  size = 'md',
  variant = 'spinner' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        <span className={`${textSizeClasses[size]} text-slate-600`}>{text}</span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className={`${textSizeClasses[size]} text-slate-600`}>{text}</span>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}></div>
        <span className={`${textSizeClasses[size]} text-slate-600`}>{text}</span>
      </div>
    );
  }

  return null;
};

// Skeleton Components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className="h-4 bg-slate-200 rounded animate-pulse"
        style={{ width: `${Math.random() * 40 + 60}%` }}
      ></div>
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`border border-slate-200 rounded-lg p-4 ${className}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        <div className="h-3 bg-slate-200 rounded w-4/6"></div>
      </div>
      <div className="flex space-x-2 mt-4">
        <div className="h-8 bg-slate-200 rounded w-20"></div>
        <div className="h-8 bg-slate-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="w-full">
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 bg-slate-200 rounded flex-1"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-3 bg-slate-100 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Loading Button Component
export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  loading, 
  children, 
  className = '', 
  disabled = false, 
  onClick,
  type = 'button'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center px-4 py-2 
      bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 
      text-white font-medium rounded-lg transition-colors
      ${className}
    `}
  >
    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
    {children}
  </button>
);

// Progress Bar Component
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  showPercentage?: boolean;
}> = ({ progress, className = '', showPercentage = false }) => (
  <div className={`w-full ${className}`}>
    <div className="flex justify-between text-sm text-slate-600 mb-1">
      <span>Progress</span>
      {showPercentage && <span>{Math.round(progress)}%</span>}
    </div>
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  </div>
);

// Loading Overlay Component
export const LoadingOverlay: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  text?: string;
}> = ({ loading, children, text = 'Loading...' }) => (
  <div className="relative">
    {children}
    {loading && (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <LoadingSpinner text={text} size="lg" />
      </div>
    )}
  </div>
);

// Hook for managing loading states
export function useLoadingState(initialState: LoadingState = 'idle') {
  const [loadingState, setLoadingState] = React.useState<LoadingState>(initialState);
  const [error, setError] = React.useState<string | null>(null);

  const setLoading = () => {
    setLoadingState('loading');
    setError(null);
  };

  const setSuccess = () => {
    setLoadingState('success');
    setError(null);
  };

  const setError_ = (errorMessage: string) => {
    setLoadingState('error');
    setError(errorMessage);
  };

  const setIdle = () => {
    setLoadingState('idle');
    setError(null);
  };

  const reset = () => {
    setLoadingState('idle');
    setError(null);
  };

  return {
    loadingState,
    error,
    isLoading: loadingState === 'loading',
    isSuccess: loadingState === 'success',
    isError: loadingState === 'error',
    isIdle: loadingState === 'idle',
    setLoading,
    setSuccess,
    setError: setError_,
    setIdle,
    reset
  };
}

// Async operation wrapper with loading states
export function useAsyncOperation<T = any>() {
  const [state, setState] = React.useState<{
    loading: boolean;
    data: T | null;
    error: string | null;
  }>({
    loading: false,
    data: null,
    error: null
  });

  const execute = async (asyncFn: () => Promise<T>) => {
    setState({ loading: true, data: null, error: null });
    
    try {
      const result = await asyncFn();
      setState({ loading: false, data: result, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ loading: false, data: null, error: errorMessage });
      throw error;
    }
  };

  const reset = () => {
    setState({ loading: false, data: null, error: null });
  };

  return {
    ...state,
    execute,
    reset
  };
}

export default {
  LoadingSpinner,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  LoadingButton,
  ProgressBar,
  LoadingOverlay,
  useLoadingState,
  useAsyncOperation
};