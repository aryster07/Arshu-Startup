/**
 * Form Validation Utilities
 * Provides validation schemas and utilities for form handling
 */

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class FormValidator {
  static validate(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
    const errors: Record<string, string> = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];
      const error = this.validateField(value, rule, field);
      
      if (error) {
        errors[field] = error;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private static validateField(value: any, rule: ValidationRule, fieldName: string): string | null {
    // Required check
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rule.message || `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Minimum length
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
      }

      // Maximum length
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${fieldName} must not exceed ${rule.maxLength} characters`;
      }

      // Pattern matching
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${fieldName} format is invalid`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  phoneIndian: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericSpaces: /^[a-zA-Z0-9\s]+$/,
  name: /^[a-zA-Z\s]+$/,
  url: /^https?:\/\/.+/,
};

// Pre-built validation schemas
export const CommonSchemas = {
  // Contact form validation
  contactForm: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: ValidationPatterns.name,
      message: 'Name must contain only letters and spaces (2-50 characters)'
    },
    email: {
      required: true,
      pattern: ValidationPatterns.email,
      message: 'Please enter a valid email address'
    },
    phone: {
      required: true,
      pattern: ValidationPatterns.phoneIndian,
      message: 'Please enter a valid Indian phone number'
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 100,
      message: 'Subject must be 5-100 characters long'
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: 'Message must be 10-1000 characters long'
    }
  },

  // Consultation booking validation
  consultationForm: {
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: ValidationPatterns.name,
      message: 'Full name must contain only letters and spaces (2-50 characters)'
    },
    phoneNumber: {
      required: true,
      pattern: ValidationPatterns.phoneIndian,
      message: 'Please enter a valid Indian phone number'
    },
    caseDescription: {
      required: true,
      minLength: 20,
      maxLength: 2000,
      message: 'Case description must be 20-2000 characters long'
    },
    preferredDateTime: {
      required: true,
      custom: (value: string) => {
        const date = new Date(value);
        const now = new Date();
        
        if (date <= now) {
          return 'Please select a future date and time';
        }
        
        // Check if it's during business hours (9 AM - 6 PM, Mon-Fri)
        const dayOfWeek = date.getDay();
        const hour = date.getHours();
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          return 'Please select a weekday for consultation';
        }
        
        if (hour < 9 || hour >= 18) {
          return 'Please select a time during business hours (9 AM - 6 PM)';
        }
        
        return null;
      }
    }
  },

  // Legal notice form validation
  legalNoticeForm: {
    clientName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: ValidationPatterns.name,
      message: 'Client name must contain only letters and spaces (2-50 characters)'
    },
    clientEmail: {
      required: true,
      pattern: ValidationPatterns.email,
      message: 'Please enter a valid email address'
    },
    clientPhone: {
      required: true,
      pattern: ValidationPatterns.phoneIndian,
      message: 'Please enter a valid Indian phone number'
    },
    recipientName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Recipient name must be 2-100 characters long'
    },
    recipientAddress: {
      required: true,
      minLength: 10,
      maxLength: 300,
      message: 'Recipient address must be 10-300 characters long'
    },
    noticeType: {
      required: true,
      message: 'Please select a notice type'
    },
    urgency: {
      required: true,
      message: 'Please select urgency level'
    },
    description: {
      required: true,
      minLength: 50,
      maxLength: 2000,
      message: 'Description must be 50-2000 characters long'
    }
  },

  // Emergency services form validation
  emergencyForm: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: ValidationPatterns.name,
      message: 'Name must contain only letters and spaces (2-50 characters)'
    },
    phone: {
      required: true,
      pattern: ValidationPatterns.phoneIndian,
      message: 'Please enter a valid Indian phone number'
    },
    location: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: 'Location must be 5-200 characters long'
    },
    emergencyDetails: {
      required: true,
      minLength: 20,
      maxLength: 1000,
      message: 'Emergency details must be 20-1000 characters long'
    }
  }
};

// Hook for form validation
export function useFormValidation(schema: ValidationSchema) {
  const validateForm = (data: Record<string, any>): ValidationResult => {
    return FormValidator.validate(data, schema);
  };

  const validateField = (fieldName: string, value: any): string | null => {
    const rule = schema[fieldName];
    if (!rule) return null;
    
    return FormValidator['validateField'](value, rule, fieldName);
  };

  return {
    validateForm,
    validateField
  };
}

export default FormValidator;