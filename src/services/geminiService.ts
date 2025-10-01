export interface GeminiConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LegalAnalysisRequest {
  type: 'legal-rights' | 'consumer-rights' | 'document-review' | 'general-consultation';
  content: string;
  context?: {
    category?: string;
    jurisdiction?: string;
    urgency?: 'low' | 'medium' | 'high';
    previousContext?: string;
    language?: string;
  };
}

export interface LegalAnalysisResponse {
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

export class GeminiLegalService {
  private config: GeminiConfig;
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();
  private readonly RATE_LIMIT = 60; // requests per minute

  constructor(config: GeminiConfig) {
    this.config = {
      maxTokens: 2000,
      temperature: 0.3,
      ...config
    };
    
    if (!config.apiKey) {
      throw new Error('Gemini API key is required');
    }
  }

  private checkRateLimit(): void {
    const now = Date.now();
    const timeSinceReset = now - this.lastResetTime;
    
    if (timeSinceReset >= 60000) { // Reset every minute
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    if (this.requestCount >= this.RATE_LIMIT) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }
    
    this.requestCount++;
  }

  private async makeGeminiRequest(prompt: string): Promise<string> {
    this.checkRateLimit();

    console.log('🤖 Making Gemini API request...');
    console.log('API Key (first 10 chars):', this.config.apiKey.substring(0, 10) + '...');
    console.log('Model:', this.config.model);

    try {
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;
      console.log('Request URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }
        
        throw new Error(`Gemini API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        console.warn('No text in response:', data);
        return 'I apologize, but I could not generate a response. Please try again.';
      }
      
      return responseText;
    } catch (error) {
      console.error('🚨 Gemini API Request Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          throw new Error('Invalid API key. Please check your Gemini API key in .env.local file.');
        } else if (error.message.includes('MODEL_NOT_FOUND')) {
          throw new Error('Model not found. Please check the model name configuration.');
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
          throw new Error('API quota exceeded. Please try again later.');
        }
      }
      
      throw new Error('Failed to get AI response. Please try again or check your API configuration.');
    }
  }

  /**
   * Analyze legal rights based on user input
   */
  async analyzeLegalRights(request: LegalAnalysisRequest): Promise<LegalAnalysisResponse> {
    const prompt = this.buildLegalRightsPrompt(request);
    
    try {
      const text = await this.makeGeminiRequest(prompt);
      return this.parseLegalResponse(text, 'legal-rights');
    } catch (error) {
      console.error('Legal Rights Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Analyze consumer rights and protection issues
   */
  async analyzeConsumerRights(request: LegalAnalysisRequest): Promise<LegalAnalysisResponse> {
    const prompt = this.buildConsumerRightsPrompt(request);
    
    try {
      const text = await this.makeGeminiRequest(prompt);
      return this.parseLegalResponse(text, 'consumer-rights');
    } catch (error) {
      console.error('Consumer Rights Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Review and analyze legal documents
   */
  async reviewDocument(request: LegalAnalysisRequest): Promise<LegalAnalysisResponse> {
    const prompt = this.buildDocumentReviewPrompt(request);
    
    try {
      const text = await this.makeGeminiRequest(prompt);
      return this.parseLegalResponse(text, 'document-review');
    } catch (error) {
      console.error('Document Review Error:', error);
      throw error;
    }
  }

  /**
   * General legal consultation
   */
  async provideLegalConsultation(request: LegalAnalysisRequest): Promise<LegalAnalysisResponse> {
    const prompt = this.buildGeneralConsultationPrompt(request);
    
    try {
      const text = await this.makeGeminiRequest(prompt);
      return this.parseLegalResponse(text, 'general-consultation');
    } catch (error) {
      console.error('Legal Consultation Error:', error);
      throw error;
    }
  }

  /**
   * Validate if content is law-related
   */
  async validateLegalContent(content: string): Promise<boolean> {
    const prompt = `Determine if this content is related to legal matters, law, legal rights, legal advice, legal services, court cases, legal documents, or any legal concerns.

Content: "${content}"

Legal topics include: criminal law, civil law, family law, property law, consumer rights, employment law, constitutional rights, legal procedures, court matters, legal disputes, contracts, legal violations, legal remedies, legal documents, legal consultation, etc.

Examples of LEGAL content:
- "My landlord is not returning my security deposit"
- "I was wrongfully terminated from my job"
- "Someone hit my car and won't pay for damages"
- "I need help with a contract dispute"
- "My rights as a consumer were violated"

Examples of NON-LEGAL content:
- "What's the weather today?"
- "How to cook pasta?"
- "Tell me a joke"
- "What is the capital of France?"
- "Help me with math homework"

Respond with only "LEGAL" if it's law-related, or "NON-LEGAL" if it's not related to legal matters.`;

    try {
      const response = await this.makeGeminiRequest(prompt);
      return response.toLowerCase().includes('legal') && !response.toLowerCase().includes('non-legal');
    } catch (error) {
      console.error('Legal validation failed:', error);
      return true; // Default to allowing content if validation fails
    }
  }

  /**
   * Get quick AI assistance for input fields with language support
   */
  async getInputAssistance(question: string, context?: string, language: string = 'en'): Promise<string> {
    const languageInstructions = this.getLanguageInstructions(language);
    
    const prompt = `Legal AI Assistant - Be brief and direct.

${languageInstructions}

Context: ${context || 'General legal inquiry'}
Question: ${question}

PROVIDE CONCISE RESPONSE:
- Direct answer to the question
- Key legal point
- 1-2 practical suggestions
- Next step if needed

KEEP IT SHORT: Maximum 3-4 sentences. Be precise and actionable.`;

    try {
      return await this.makeGeminiRequest(prompt);
    } catch (error) {
      console.error('Input Assistance Error:', error);
      const fallbackMessage = language === 'hi' ? 
        'मुझे खेद है, लेकिन मैं इस समय सहायता प्रदान करने में असमर्थ हूँ। कृपया फिर से कोशिश करें या तुरंत सहायता के लिए हमारी सहायता टीम से संपर्क करें।' :
        'I apologize, but I\'m unable to provide assistance at the moment. Please try again or contact our support team for immediate help.';
      return fallbackMessage;
    }
  }

  /**
   * Detect language of input text
   */
  async detectLanguage(text: string): Promise<string> {
    const prompt = `Detect the language of this text. Respond with only the language code (en for English, hi for Hindi, etc.):

Text: "${text}"

Language code:`;

    try {
      const response = await this.makeGeminiRequest(prompt);
      const detectedLang = response.toLowerCase().trim();
      return ['en', 'hi'].includes(detectedLang) ? detectedLang : 'en';
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'en'; // Default to English
    }
  }

  /**
   * Translate text between languages
   */
  async translateText(text: string, fromLang: string, toLang: string): Promise<string> {
    if (fromLang === toLang) return text;
    
    const langNames = {
      'en': 'English',
      'hi': 'Hindi'
    };

    const prompt = `Translate this text from ${langNames[fromLang as keyof typeof langNames] || 'English'} to ${langNames[toLang as keyof typeof langNames] || 'Hindi'}:

Text: "${text}"

Translation:`;

    try {
      return await this.makeGeminiRequest(prompt);
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text if translation fails
    }
  }

  /**
   * Get language-specific instructions for prompts
   */
  private getLanguageInstructions(language: string): string {
    switch (language) {
      case 'hi':
        return `Response Language: Respond in Hindi (हिंदी). Provide legal guidance in clear, simple Hindi language suitable for Indian legal context.`;
      case 'en':
      default:
        return `Response Language: Respond in English. Use clear, professional legal language.`;
    }
  }

  /**
   * Build prompt for legal rights analysis
   */
  private buildLegalRightsPrompt(request: LegalAnalysisRequest): string {
    return `You are a legal AI assistant for Indian law. Analyze this situation concisely.

SITUATION: ${request.content}
CATEGORY: ${request.context?.category || 'General'}

PROVIDE BRIEF, PRECISE ANALYSIS:
1. Main legal issue identified
2. Severity (Low/Medium/High)
3. 2-3 applicable laws
4. 3-4 immediate actions
5. Best legal remedy
6. Estimated cost & time
7. Success likelihood

RESPOND IN JSON FORMAT - BE CONCISE:
{
  "analysis": "Brief 2-3 sentence summary of the legal issue",
  "severity": "Low|Medium|High",
  "confidence": 85,
  "applicableLaws": ["Key relevant laws - max 3"],
  "recommendedActions": ["Top 3-4 immediate actions"],
  "legalRemedies": ["Best remedy options - max 3"],
  "violations": [
    {
      "type": "Main violation type",
      "severity": "Level",
      "description": "Brief description",
      "applicableLaws": ["Relevant law"],
      "recommendedAction": "Key action"
    }
  ],
  "estimatedCost": "₹X,XXX - ₹Y,YYY",
  "timeframe": "X-Y months",
  "successRate": "XX%",
  "emergencyRequired": false,
  "nextSteps": ["Clear next steps - max 4"]
}`;
  }

  /**
   * Build prompt for consumer rights analysis
   */
  private buildConsumerRightsPrompt(request: LegalAnalysisRequest): string {
    return `Consumer Rights AI - Indian Law. Analyze briefly and precisely.

ISSUE: ${request.content}
CATEGORY: ${request.context?.category || 'General'}

PROVIDE CONCISE ANALYSIS:
1. Rights violated
2. Severity level
3. Key applicable laws
4. Immediate actions (max 4)
5. Best legal forum
6. Expected outcome

RESPOND IN JSON - BRIEF & PRECISE:
{
  "analysis": "Brief summary of consumer rights violation",
  "severity": "Low|Medium|High", 
  "confidence": 85,
  "applicableLaws": ["Key consumer laws - max 3"],
  "yourRights": ["Main rights applicable - max 4"],
  "immediateActions": ["Top actions to take - max 4"],
  "legalRemedies": [
    {
      "type": "Best forum (District/State/National Consumer Commission)",
      "applicableFor": "Claim range",
      "timeframe": "Expected time",
      "cost": "Fee range"
    }
  ],
  "expectedOutcome": {
    "compensation": "Likely amount",
    "timeframe": "Resolution time",
    "successRate": "Success %"
  },
  "nextSteps": ["Clear action steps - max 4"]
}`;
  }  /**
   * Build prompt for document review
   */
  private buildDocumentReviewPrompt(request: LegalAnalysisRequest): string {
    return `Legal Document Reviewer - Indian Law. Review concisely.

DOCUMENT: ${request.content}

PROVIDE BRIEF REVIEW:
1. Main legal issues/risks
2. Compliance status
3. Key improvements needed
4. Missing important clauses
5. Overall assessment
6. Approval status

RESPOND IN JSON - CONCISE & CLEAR:
{
  "analysis": "Brief document assessment - main issues identified",
  "confidence": 90,
  "documentSuggestions": ["Key improvements - max 5"],
  "legalRemedies": ["Compliance needs - max 3"],
  "applicableLaws": ["Relevant laws - max 3"],
  "recommendedActions": ["Actions needed - max 4"],
  "approval": "Approved|Needs Revision|Requires Legal Review",
  "riskLevel": "Low|Medium|High",
  "nextSteps": ["Clear next steps - max 4"]
}`;
  }

  /**
   * Build prompt for general consultation
   */
  private buildGeneralConsultationPrompt(request: LegalAnalysisRequest): string {
    return `You are an expert legal consultant providing professional advice on Indian law matters.

CONSULTATION REQUEST:
${request.content}

CONTEXT:
- Previous Context: ${request.context?.previousContext || 'None'}
- Urgency: ${request.context?.urgency || 'medium'}

CONSULTATION REQUIREMENTS:
1. Provide clear, professional legal guidance
2. Address specific concerns raised
3. Suggest practical next steps
4. Mention relevant legal considerations
5. Recommend when to seek in-person legal help

FORMAT YOUR RESPONSE AS JSON:
{
  "analysis": "professional legal consultation response",
  "confidence": 85,
  "recommendedActions": ["practical next steps"],
  "applicableLaws": ["relevant legal frameworks if applicable"],
  "nextSteps": ["detailed guidance"],
  "emergencyRequired": false,
  "followUpRecommended": true
}`;
  }

  /**
   * Parse Gemini response into structured format
   */
  private parseLegalResponse(text: string, type: string): LegalAnalysisResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          analysis: parsed.analysis || text,
          confidence: parsed.confidence || 85,
          ...parsed
        };
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, using fallback parsing');
    }

    // Fallback parsing if JSON extraction fails
    return {
      analysis: text,
      confidence: 80,
      applicableLaws: this.extractLaws(text),
      recommendedActions: this.extractActions(text),
      severity: this.determineSeverity(text),
      nextSteps: ['Consult with a legal professional for detailed guidance'],
    };
  }

  private extractLaws(text: string): string[] {
    const lawPattern = /(Act|Code|Law|Constitution|Amendment|Rule|Regulation|Order)\s+\d{4}/gi;
    const matches = text.match(lawPattern) || [];
    return [...new Set(matches)].slice(0, 5);
  }

  private extractActions(text: string): string[] {
    const actionKeywords = ['should', 'must', 'recommend', 'suggest', 'file', 'contact', 'document'];
    const sentences = text.split(/[.!?]+/);
    const actions = sentences
      .filter(sentence => actionKeywords.some(keyword => sentence.toLowerCase().includes(keyword)))
      .map(sentence => sentence.trim())
      .slice(0, 5);
    
    return actions.length > 0 ? actions : ['Seek professional legal consultation'];
  }

  private determineSeverity(text: string): 'Low' | 'Medium' | 'High' {
    const highSeverityWords = ['urgent', 'critical', 'immediate', 'emergency', 'serious'];
    const lowSeverityWords = ['minor', 'simple', 'basic', 'routine'];
    
    const lowerText = text.toLowerCase();
    
    if (highSeverityWords.some(word => lowerText.includes(word))) return 'High';
    if (lowSeverityWords.some(word => lowerText.includes(word))) return 'Low';
    return 'Medium';
  }
}

// Configuration and initialization
const config = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  geminiModel: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash',
  enableAI: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  rateLimit: parseInt(import.meta.env.VITE_API_RATE_LIMIT || '60')
};

// Export singleton instance
let geminiService: GeminiLegalService | null = null;

export const initializeGeminiService = (apiKey?: string): GeminiLegalService => {
  if (!geminiService) {
    const key = apiKey || config.geminiApiKey;
    console.log('🔑 Initializing Gemini service...');
    console.log('API Key available:', !!key);
    console.log('Model:', config.geminiModel);
    console.log('AI Features enabled:', config.enableAI);
    
    if (!key) {
      console.error('❌ No API key found in environment variables');
      throw new Error('Gemini API key is required. Please add VITE_GEMINI_API_KEY to your .env.local file.');
    }
    
    if (key === 'your_gemini_api_key_here') {
      console.error('❌ Default placeholder API key detected');
      throw new Error('Please replace the placeholder API key in .env.local with your actual Gemini API key.');
    }
    
    try {
      geminiService = new GeminiLegalService({
        apiKey: key,
        model: config.geminiModel,
        maxTokens: 4000,
        temperature: 0.7
      });
      console.log('✅ Gemini service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini service:', error);
      throw error;
    }
  }
  return geminiService;
};

export const getGeminiService = (): GeminiLegalService => {
  if (!geminiService) {
    return initializeGeminiService();
  }
  return geminiService;
};

export { config as geminiConfig };
export default GeminiLegalService;