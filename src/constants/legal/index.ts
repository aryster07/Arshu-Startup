// Legal service constants
export const LEGAL_CATEGORIES = {
  CRIMINAL: 'criminal',
  CIVIL: 'civil', 
  FAMILY: 'family',
  PROPERTY: 'property',
  CONSUMER: 'consumer',
  EMPLOYMENT: 'employment',
  CORPORATE: 'corporate',
  CYBER: 'cyber',
  ENVIRONMENTAL: 'environmental',
} as const;

export const CONSUMER_CATEGORIES = {
  PRODUCT_DEFECT: 'product-defect',
  SERVICE_ISSUE: 'service-issue',
  BILLING_DISPUTE: 'billing-dispute',
  WARRANTY_CLAIM: 'warranty-claim',
  REFUND_ISSUE: 'refund-issue',
  DELIVERY_PROBLEM: 'delivery-problem',
  FRAUD_SCAM: 'fraud-scam',
  PRIVACY_VIOLATION: 'privacy-violation',
} as const;

export const ANALYSIS_SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  EMERGENCY: 'emergency',
} as const;

export const LOADING_MESSAGES = [
  'Analyzing your legal situation...',
  'Reviewing applicable laws...',
  'Identifying potential violations...',
  'Generating recommendations...',
  'Preparing detailed analysis...',
] as const;

export type LegalCategory = typeof LEGAL_CATEGORIES[keyof typeof LEGAL_CATEGORIES];
export type ConsumerCategory = typeof CONSUMER_CATEGORIES[keyof typeof CONSUMER_CATEGORIES];
export type AnalysisSeverity = typeof ANALYSIS_SEVERITY[keyof typeof ANALYSIS_SEVERITY];
export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS];