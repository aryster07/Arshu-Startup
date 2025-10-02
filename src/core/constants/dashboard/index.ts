// Dashboard configuration constants
export const DASHBOARD_TABS = {
  OVERVIEW: 'overview',
  CONSULTATION: 'consultation',
  BOOKING: 'booking',
} as const;

export const CASE_STATUSES = {
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed', 
  PENDING_REVIEW: 'Pending Review',
} as const;

export const CASE_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const CONSULTATION_TYPES = {
  VIDEO_CALL: 'Video Call',
  PHONE_CALL: 'Phone Call', 
  IN_PERSON: 'In-Person Meeting',
} as const;

export const LEGAL_DOMAINS = {
  CRIMINAL: 'Criminal Law',
  CIVIL: 'Civil Law',
  FAMILY: 'Family Law',
  CORPORATE: 'Corporate Law',
  CONSUMER: 'Consumer Protection',
  PROPERTY: 'Property Law',
} as const;

export type DashboardTab = typeof DASHBOARD_TABS[keyof typeof DASHBOARD_TABS];
export type CaseStatus = typeof CASE_STATUSES[keyof typeof CASE_STATUSES];
export type CasePriority = typeof CASE_PRIORITIES[keyof typeof CASE_PRIORITIES];
export type ConsultationType = typeof CONSULTATION_TYPES[keyof typeof CONSULTATION_TYPES];
export type LegalDomain = typeof LEGAL_DOMAINS[keyof typeof LEGAL_DOMAINS];