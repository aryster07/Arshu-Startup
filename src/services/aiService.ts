// AI Service with multiple providers (OpenAI, Gemini, Perplexity)
// Automatically falls back to next provider if one fails

import { detectPersonalLegalIssue, getLegalFieldDescription } from '../utils/legalIssueDetector';

interface AIResponse {
  text: string;
  provider: string;
  success: boolean;
  error?: string;
  isPersonalIssue?: boolean;
  legalField?: string | null;
}

interface AIProviderConfig {
  name: string;
  apiKey: string;
  endpoint: string;
  enabled: boolean;
}

class AIService {
  private providers: AIProviderConfig[];

  constructor() {
    // Initialize Perplexity provider
    const perplexityKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    
    this.providers = [
      {
        name: 'Perplexity',
        apiKey: perplexityKey,
        endpoint: 'https://api.perplexity.ai/chat/completions',
        enabled: true
      }
    ];
    
    // Debug: Log configuration status
    console.log('=== AI Service Debug Info ===');
    console.log('Perplexity key:', perplexityKey ? `${perplexityKey.substring(0, 15)}...` : 'NOT FOUND');
    console.log('Using Perplexity API');
    console.log('============================');
  }

  private async callPerplexity(query: string, apiKey: string): Promise<AIResponse> {
    try {
      console.log('Calling Perplexity API...');
      console.log('API Key (first 15 chars):', apiKey.substring(0, 15));
      
      // Try multiple models in case one doesn't work
      const models = [
        'llama-3.1-sonar-small-128k-chat',
        'llama-3.1-sonar-large-128k-chat',
        'sonar-small-chat',
        'sonar'
      ];
      
      for (const model of models) {
        try {
          console.log(`Trying Perplexity model: ${model}`);
          
          const requestBody = {
            model: model,
            messages: [
              {
                role: 'system',
                content: `You are a specialized Legal Assistant for Law Bandhu platform in India. 

RULES:
1. ONLY answer legal questions (law, rights, procedures, court, legal advice)
2. If question is NOT legal, respond: "I apologize, but I can only help with legal matters. Please ask a legal question."
3. Keep responses clear, professional, and under 500 words
4. Use bullet points for better readability
5. Remind users to consult a qualified lawyer for their specific case

For legal queries, provide helpful guidance on:
- Property, Contract, Family, Criminal, Employment, Consumer, Civil, Corporate, Cyber, IP Law
- Legal procedures, documentation, rights, liabilities`
              },
              {
                role: 'user',
                content: query
              }
            ],
            temperature: 0.7,
            max_tokens: 800
          };
          
          const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
          });

          console.log(`${model} response status:`, response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Perplexity ${model} Error:`, response.status, errorText);
            
            // Try next model if this one failed
            if (model !== models[models.length - 1]) {
              continue;
            }
            throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          console.log(`Success with Perplexity model: ${model}`);
          
          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Invalid response structure:', data);
            throw new Error('Invalid response structure from Perplexity API');
          }
          
          return {
            text: data.choices[0].message.content,
            provider: `Perplexity AI (${model})`,
            success: true
          };
        } catch (modelError) {
          console.error(`Failed with ${model}:`, modelError);
          // Continue to next model
          continue;
        }
      }
      
      throw new Error('All Perplexity models failed');
      
    } catch (error) {
      console.error('Perplexity Error Details:', error);
      return {
        text: '',
        provider: 'Perplexity',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async analyzeLegalQuery(query: string): Promise<AIResponse> {
    // Detect if this is a personal legal issue requiring lawyer consultation
    const issueDetection = detectPersonalLegalIssue(query);
    console.log('Personal issue detection:', issueDetection);
    
    // Only try Perplexity
    const provider = this.providers[0];
    
    if (!provider.enabled || !provider.apiKey) {
      console.error('Perplexity not configured');
      return {
        text: 'AI service is not configured. Please add your Perplexity API key to the .env file.',
        provider: 'None',
        success: false,
        error: 'Perplexity API key not configured'
      };
    }

    console.log('Trying Perplexity...');
    const result = await this.callPerplexity(query, provider.apiKey);

    if (result.success) {
      console.log('Success with Perplexity');
      
      // Change provider name to Law Bandhu Assistant
      result.provider = 'Law Bandhu Assistant';
      
      // Add personal issue metadata to response
      if (issueDetection.isPersonalIssue) {
        const fieldDescription = issueDetection.legalField 
          ? getLegalFieldDescription(issueDetection.legalField)
          : '';
        
        // Enhance response with lawyer consultation recommendation
        const enhancedText = `${result.text}\n\n⚖️ **Professional Legal Advice Recommended**\n\nBased on your situation, consulting with ${fieldDescription} would be beneficial. Our platform can connect you with qualified lawyers who specialize in this area.`;
        
        return {
          ...result,
          text: enhancedText,
          isPersonalIssue: true,
          legalField: issueDetection.legalField,
          provider: 'Law Bandhu Assistant'
        };
      }
      
      return result;
    } else {
      console.error(`Failed with Perplexity: ${result.error}`);
      
      // Return helpful error message
      return {
        text: `Unable to get AI response from Perplexity.\n\nError: ${result.error}\n\n💡 Troubleshooting:\n- Verify your Perplexity API key is correct\n- Check if you have available credits\n- Ensure your API key has proper permissions\n- Visit: https://www.perplexity.ai/settings/api`,
        provider: 'None',
        success: false,
        error: result.error
      };
    }
  }

  public isConfigured(): boolean {
    return this.providers.some(p => p.enabled && p.apiKey);
  }

  public getConfiguredProviders(): string[] {
    return this.providers
      .filter(p => p.enabled && p.apiKey)
      .map(p => p.name);
  }
}

export const aiService = new AIService();
