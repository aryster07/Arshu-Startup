/**
 * Legal Services API
 * Contains all API calls related to legal services, analysis, and consultations
 */

import { apiClient, ApiResponse } from './apiService';

// Types for legal services
export interface LegalAnalysisRequest {
  query: string;
  category?: string;
  language?: string;
  urgency?: 'low' | 'medium' | 'high';
  context?: string;
}

export interface LegalAnalysisResponse {
  analysis: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  applicableLaws: string[];
  recommendedActions: string[];
  nextSteps: string[];
  lawyerRecommendation?: {
    specialization: string;
    urgency: boolean;
  };
  estimatedCost?: string;
  timeframe?: string;
  successRate?: string;
}

export interface ConsultationBooking {
  fullName: string;
  phoneNumber: string;
  email: string;
  legalDomain: string;
  consultationType: string;
  preferredDateTime: string;
  caseDescription: string;
  urgency?: string;
}

export interface LawyerProfile {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  cases_won: number;
  languages: string[];
  location: string;
  consultationFee: number;
  expertise: string[];
  description: string;
  available: boolean;
}

export interface LegalNoticeRequest {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  recipientName: string;
  recipientAddress: string;
  noticeType: string;
  urgency: string;
  description: string;
  documents?: string;
}

export interface DocumentReviewRequest {
  documentType: string;
  content: string;
  urgency?: string;
  additionalNotes?: string;
}

export interface DocumentReviewResponse {
  riskLevel: 'Low' | 'Medium' | 'High';
  overallScore: number;
  keyFindings: string[];
  recommendations: string[];
  legalIssues: string[];
  summary: string;
  estimatedReadTime: string;
  approval: 'Approved' | 'Needs Revision' | 'Requires Legal Review';
}

// Legal Services API class
class LegalServicesAPI {
  // Legal rights analysis
  async analyzeLegalRights(request: LegalAnalysisRequest): Promise<ApiResponse<LegalAnalysisResponse>> {
    return apiClient.post('/legal/analyze-rights', request);
  }

  // Consumer rights analysis
  async analyzeConsumerRights(request: LegalAnalysisRequest): Promise<ApiResponse<LegalAnalysisResponse>> {
    return apiClient.post('/legal/analyze-consumer-rights', request);
  }

  // Document review
  async reviewDocument(request: DocumentReviewRequest): Promise<ApiResponse<DocumentReviewResponse>> {
    return apiClient.post('/legal/review-document', request);
  }

  // Get lawyer recommendations
  async getLawyerRecommendations(specialization?: string, location?: string): Promise<ApiResponse<LawyerProfile[]>> {
    const params = { specialization, location };
    return apiClient.get('/lawyers/recommendations', { params });
  }

  // Get lawyers by specialization
  async getLawyersBySpecialization(specialization: string): Promise<ApiResponse<LawyerProfile[]>> {
    return apiClient.get(`/lawyers/specialization/${encodeURIComponent(specialization)}`);
  }

  // Book consultation
  async bookConsultation(booking: ConsultationBooking): Promise<ApiResponse<{ bookingId: string; message: string }>> {
    return apiClient.post('/consultations/book', booking);
  }

  // Submit legal notice request
  async submitLegalNotice(notice: LegalNoticeRequest): Promise<ApiResponse<{ requestId: string; message: string }>> {
    return apiClient.post('/legal/notice-request', notice);
  }

  // Emergency legal assistance
  async requestEmergencyAssistance(request: {
    category: string;
    description: string;
    urgency: string;
    contact: string;
    language?: string;
  }): Promise<ApiResponse<{ emergencyId: string; guidance: string; contacts: any[] }>> {
    return apiClient.post('/legal/emergency-assistance', request);
  }

  // Validate legal content
  async validateLegalContent(content: string): Promise<ApiResponse<{ isLegal: boolean; confidence: number }>> {
    return apiClient.post('/legal/validate-content', { content });
  }

  // Get AI assistance
  async getAIAssistance(request: {
    question: string;
    context?: string;
    language?: string;
  }): Promise<ApiResponse<{ response: string; confidence: number }>> {
    return apiClient.post('/legal/ai-assistance', request);
  }

  // Get case status
  async getCaseStatus(caseId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/cases/${caseId}/status`);
  }

  // Upload case documents
  async uploadCaseDocument(caseId: string, file: File, documentType: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return apiClient.post(`/cases/${caseId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
}

// Create and export instance
export const legalServicesAPI = new LegalServicesAPI();

// Hooks for React components
export const useLegalServices = () => {
  return {
    analyzeLegalRights: legalServicesAPI.analyzeLegalRights.bind(legalServicesAPI),
    analyzeConsumerRights: legalServicesAPI.analyzeConsumerRights.bind(legalServicesAPI),
    reviewDocument: legalServicesAPI.reviewDocument.bind(legalServicesAPI),
    getLawyerRecommendations: legalServicesAPI.getLawyerRecommendations.bind(legalServicesAPI),
    getLawyersBySpecialization: legalServicesAPI.getLawyersBySpecialization.bind(legalServicesAPI),
    bookConsultation: legalServicesAPI.bookConsultation.bind(legalServicesAPI),
    submitLegalNotice: legalServicesAPI.submitLegalNotice.bind(legalServicesAPI),
    requestEmergencyAssistance: legalServicesAPI.requestEmergencyAssistance.bind(legalServicesAPI),
    validateLegalContent: legalServicesAPI.validateLegalContent.bind(legalServicesAPI),
    getAIAssistance: legalServicesAPI.getAIAssistance.bind(legalServicesAPI),
    getCaseStatus: legalServicesAPI.getCaseStatus.bind(legalServicesAPI),
    uploadCaseDocument: legalServicesAPI.uploadCaseDocument.bind(legalServicesAPI),
  };
};

export default legalServicesAPI;