// Legal Services Feature Module
export * from './components';

// Types
export interface LegalCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface LegalAnalysisRequest {
  type: 'legal-rights' | 'consumer-rights' | 'document-review';
  content: string;
  context: {
    category?: string;
    jurisdiction?: string;
    urgency?: 'low' | 'medium' | 'high';
    language?: string;
  };
}

export interface LegalRight {
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export interface LegalViolation {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface LegalRecommendation {
  action: string;
  timeline: string;
  priority: 'urgent' | 'important' | 'normal';
}

export interface LegalReference {
  act: string;
  section: string;
  description: string;
}

export interface LegalNextStep {
  step: string;
  description: string;
  timeframe: string;
}

export interface LegalAnalysisResult {
  summary: string;
  rights: LegalRight[];
  violations: LegalViolation[];
  recommendations: LegalRecommendation[];
  legalReferences: LegalReference[];
  nextSteps: LegalNextStep[];
  riskAssessment?: {
    overall: 'high' | 'medium' | 'low';
    factors: string[];
  };
  consultation?: {
    recommended: boolean;
    urgency: 'immediate' | 'within_week' | 'within_month';
    specialization: string;
  };
}