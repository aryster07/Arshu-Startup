export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType<any>;
  description?: string;
}

export interface LegalCase {
  id: number;
  title: string;
  status: 'In Progress' | 'Completed' | 'Pending' | 'Closed';
  lastUpdate: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LegalService {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  category: 'analysis' | 'consultation' | 'document' | 'emergency';
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'client' | 'lawyer';
  email: string;
  phone?: string;
  profileImage?: string;
}

export interface AnalysisRequest {
  type: 'legal-rights' | 'consumer-rights' | 'document-review' | 'general-consultation';
  content: string;
  context?: {
    category?: string;
    jurisdiction?: string;
    urgency?: 'low' | 'medium' | 'high';
    previousContext?: string;
  };
}

export interface AnalysisResult {
  analysis: string;
  severity?: 'Low' | 'Medium' | 'High';
  confidence: number;
  applicableLaws: string[];
  recommendedActions: string[];
  legalRemedies?: string[];
  estimatedCost?: string;
  timeframe?: string;
  successRate?: string;
  violations?: Array<{
    type: string;
    severity: string;
    description: string;
    applicableLaws: string[];
    recommendedAction: string;
  }>;
  yourRights?: string[];
  immediateActions?: string[];
  nextSteps?: string[];
  documentSuggestions?: string[];
  emergencyRequired?: boolean;
  expectedOutcome?: {
    compensation: string;
    timeframe: string;
    successRate: string;
  };
  approval?: 'Approved' | 'Needs Revision' | 'Requires Legal Review';
  riskLevel?: 'Low' | 'Medium' | 'High';
  followUpRecommended?: boolean;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  requiresAuth?: boolean;
  layout?: 'default' | 'dashboard' | 'minimal';
}