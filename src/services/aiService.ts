// AI Service with Google Gemini
// Indian Legal Assistant powered by Google Gemini AI

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
    // Initialize Google Gemini provider
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    this.providers = [
      {
        name: 'Gemini',
        apiKey: geminiKey,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        enabled: true
      }
    ];
    
    // Debug: Log configuration status
    console.log('=== AI Service Debug Info ===');
    console.log('Gemini key:', geminiKey ? geminiKey.substring(0, 15) + '...' : 'NOT FOUND');
    console.log('Using Google Gemini API');
    console.log('============================');
  }

  private async callGemini(query: string, apiKey: string): Promise<AIResponse> {
    try {
      console.log('Calling Google Gemini API...');
      
      const systemPrompt = `You are "Law Bandhu Assistant", an Indian legal assistant. Keep responses CONCISE and ACTIONABLE.

**Response Format (MUST FOLLOW):**
1. **Summary** (2-3 lines max): Quick answer to the query
2. **Key Points** (3-5 bullet points): Most important things to know
3. **Action Steps** (2-3 items): What the user should do next
4. **Disclaimer** (1 line): Remind to consult a lawyer

**Rules:**
- Keep total response under 300 words
- Use simple language, avoid legal jargon
- Cite specific Indian law sections only when critical
- Be direct and helpful
- Format with bullet points for easy reading on mobile`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt + "\n\nUser Query: " + query }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_ONLY_HIGH"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_ONLY_HIGH"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_ONLY_HIGH"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_ONLY_HIGH"
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Gemini API Error:', response.status, errorData);
        
        // Handle quota exceeded error
        if (response.status === 429 || errorData?.error?.status === 'RESOURCE_EXHAUSTED') {
          throw new Error('API quota exceeded. Please wait a moment and try again, or create a new API key at https://aistudio.google.com/app/apikey');
        }
        
        throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gemini Response received');
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure from Gemini API');
      }
      
      const text = data.candidates[0].content.parts[0].text;
      
      return {
        text: text,
        provider: 'Law Bandhu Assistant',
        success: true
      };
      
    } catch (error) {
      console.error('Gemini Error Details:', error);
      return {
        text: '',
        provider: 'Gemini',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async analyzeLegalQuery(query: string): Promise<AIResponse> {
    // Detect if this is a personal legal issue requiring lawyer consultation
    const issueDetection = detectPersonalLegalIssue(query);
    console.log('Personal issue detection:', issueDetection);
    
    // Get Gemini provider
    const provider = this.providers[0];
    
    if (!provider.enabled || !provider.apiKey) {
      console.error('Gemini not configured');
      return {
        text: 'AI service is not configured. Please add your Google Gemini API key to the .env file as VITE_GEMINI_API_KEY.',
        provider: 'None',
        success: false,
        error: 'Gemini API key not configured'
      };
    }

    console.log('Calling Gemini...');
    const result = await this.callGemini(query, provider.apiKey);

    if (result.success) {
      console.log('Success with Gemini');
      
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
      console.error(`Failed with Gemini: ${result.error}`);
      
      // Return helpful error message
      return {
        text: `Unable to get AI response from Gemini.\n\nError: ${result.error}\n\n💡 Troubleshooting:\n- Verify your Google Gemini API key is correct\n- Check if you have available quota\n- Ensure your API key has proper permissions\n- Visit: https://aistudio.google.com/app/apikey`,
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
