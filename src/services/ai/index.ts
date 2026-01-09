// ============================================
// AI Service - Main Entry Point
// ============================================

import type { AIResponse } from '../../types';
import { callPerplexityAPI } from './perplexity';
import { detectPersonalLegalIssue, getLegalFieldDescription } from './legalDetection';

class AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
  }

  async analyzeLegalQuery(query: string): Promise<AIResponse> {
    const issueDetection = detectPersonalLegalIssue(query);
    
    if (!this.apiKey) {
      return {
        text: 'AI service is not configured. Please add your Perplexity API key to the .env file.',
        provider: 'None',
        success: false,
        error: 'API key not configured'
      };
    }

    const result = await callPerplexityAPI(query, this.apiKey);

    if (result.success && issueDetection.isPersonalIssue) {
      const fieldDescription = issueDetection.legalField 
        ? getLegalFieldDescription(issueDetection.legalField)
        : 'a legal professional';
      
      return {
        ...result,
        text: `${result.text}\n\n⚖️ **Professional Legal Advice Recommended**\n\nBased on your situation, consulting with ${fieldDescription} would be beneficial.`,
        isPersonalIssue: true,
        legalField: issueDetection.legalField
      };
    }

    if (!result.success) {
      return {
        ...result,
        text: `Unable to get AI response.\n\nError: ${result.error}\n\n💡 Verify your Perplexity API key at: https://www.perplexity.ai/settings/api`
      };
    }

    return result;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  getConfiguredProviders(): string[] {
    return this.apiKey ? ['Perplexity'] : [];
  }
}

export const aiService = new AIService();

// Re-export utilities
export { isLegalQuery, getNonLegalResponse } from './legalDetection';
