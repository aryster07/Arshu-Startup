/**
 * Custom hook for accessing toast notifications
 * Provides a convenient interface for showing toast messages
 */

import { useToast } from '../components/ui/toast';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export function useNotification() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const notify = {
    success: (message: string, options?: ToastOptions) => {
      showSuccess(
        options?.title || 'Success',
        message
      );
    },

    error: (message: string, options?: ToastOptions) => {
      showError(
        options?.title || 'Error',
        message
      );
    },

    warning: (message: string, options?: ToastOptions) => {
      showWarning(
        options?.title || 'Warning',
        message
      );
    },

    info: (message: string, options?: ToastOptions) => {
      showInfo(
        options?.title || 'Info',
        message
      );
    }
  };

  return notify;
}

export default useNotification;