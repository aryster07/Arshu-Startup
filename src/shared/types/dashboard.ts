// Dashboard-specific TypeScript interfaces
import { LegalService } from '../constants/dashboard/data';
import { DashboardTab, CaseStatus, CasePriority, ConsultationType, LegalDomain } from '../constants/dashboard';

export interface DashboardState {
  selectedLanguage: string;
  searchQuery: string;
  aiResponse: string;
  briefAnalysis: string;
  detailedAnalysis: string;
  showDetailedAnalysis: boolean;
  isAnalyzing: boolean;
  isLoadingDetailed: boolean;
  nonLegalMessage: string;
  activeTab: DashboardTab;
  lawyerRecommendation: {
    suggested: boolean;
    specialization: string;
  } | null;
}

export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  currentLanguage: string;
  confidence: number;
}

export interface AnalysisRequest {
  query: string;
  language: string;
  category?: string;
}

export interface AnalysisResponse {
  analysis: string;
  severity?: string;
  confidence: number;
  recommendedActions: string[];
  applicableLaws: string[];
}

export interface ConsultationBooking {
  fullName: string;
  phoneNumber: string;
  legalDomain: LegalDomain;
  consultationType: ConsultationType;
  preferredDateTime: string;
  caseDescription: string;
}

export interface DashboardCase {
  id: number;
  title: string;
  status: CaseStatus;
  lastUpdate: string;
  priority: CasePriority;
}

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  successRate: number;
  avgResolutionTime: string;
}