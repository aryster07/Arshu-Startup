import { useState, useEffect } from 'react';
import { getGeminiService } from '../../services/geminiService';
import { getGeminiLanguageCode } from '../useSpeechRecognition';
import { AnalysisRequest, AnalysisResponse, DashboardState } from '../../types/dashboard';
import { LOADING_MESSAGES } from '../../constants/legal';

export function useDashboardAnalysis() {
  const [state, setState] = useState<DashboardState>({
    selectedLanguage: 'en-US',
    searchQuery: '',
    aiResponse: '',
    briefAnalysis: '',
    detailedAnalysis: '',
    showDetailedAnalysis: false,
    isAnalyzing: false,
    isLoadingDetailed: false,
    nonLegalMessage: '',
    activeTab: 'overview',
    lawyerRecommendation: null,
  });

  const [loadingMessage, setLoadingMessage] = useState('');

  const updateState = (updates: Partial<DashboardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    updateState({ selectedLanguage: newLanguage });
  };

  const updateSearchQuery = (query: string) => {
    updateState({ searchQuery: query });
  };

  const handleAnalysis = async (query?: string) => {
    const analysisQuery = query || state.searchQuery;
    if (!analysisQuery.trim()) return;

    updateState({ 
      isAnalyzing: true, 
      aiResponse: '', 
      briefAnalysis: '',
      detailedAnalysis: '',
      showDetailedAnalysis: false,
      nonLegalMessage: '' 
    });
    
    // Rotate loading messages
    let messageIndex = 0;
    const loadingInterval = setInterval(() => {
      setLoadingMessage(LOADING_MESSAGES[messageIndex % LOADING_MESSAGES.length]);
      messageIndex++;
    }, 1500);

    try {
      const geminiService = getGeminiService();
      if (!geminiService) {
        throw new Error('Gemini service not available');
      }

      // First get brief analysis (3-4 lines)
      const briefPrompt = `Provide a brief 3-4 line legal analysis for: "${analysisQuery}". Be concise but informative. Focus on the key legal aspects and immediate insights.`;
      
      const briefResponse = await geminiService.getInputAssistance(
        briefPrompt,
        'Brief legal consultation - 3-4 lines only',
        getGeminiLanguageCode(state.selectedLanguage)
      );

      clearInterval(loadingInterval);
      setLoadingMessage('');

      // Check if content is legal-related
      const isLegalContent = await geminiService.validateLegalContent(analysisQuery);
      
      if (!isLegalContent) {
        const nonLegalMsg = getGeminiLanguageCode(state.selectedLanguage) === 'hi'
          ? 'कृपया कानून से संबंधित मुद्दे पर चर्चा करें। मैं विशेष रूप से कानूनी मामलों में सहायता के लिए डिज़ाइन किया गया हूँ।'
          : 'Please discuss legal matters only. I\'m specifically designed to help with legal issues.';
        
        updateState({
          nonLegalMessage: nonLegalMsg,
          isAnalyzing: false
        });
        return;
      }

      updateState({
        briefAnalysis: briefResponse,
        aiResponse: briefResponse, // For backward compatibility
        isAnalyzing: false
      });

    } catch (error) {
      clearInterval(loadingInterval);
      setLoadingMessage('');
      console.error('Analysis error:', error);
      
      // Provide fallback brief analysis even if API fails
      const fallbackAnalysis = `Legal Issue Analysis: "${analysisQuery}"

This appears to be a legal matter that requires attention. Key considerations:
• Document all relevant details and evidence
• Consider the applicable laws and your legal rights
• Consult with a legal professional for proper guidance

Click "Get Detailed Analysis" for comprehensive breakdown.`;
      
      console.log('Using fallback analysis due to API error');
      updateState({
        briefAnalysis: fallbackAnalysis,
        aiResponse: fallbackAnalysis,
        isAnalyzing: false
      });
    }
  };

  const detectLawyerRecommendation = (analysisText: string) => {
    const text = analysisText.toLowerCase();
    
    // Common phrases that indicate lawyer recommendation
    const lawyerKeywords = [
      'contact a lawyer', 'consult a lawyer', 'hire a lawyer', 'seek legal help',
      'professional legal assistance', 'expert legal help', 'legal expert',
      'attorney', 'advocate', 'legal counsel', 'legal advice', 'legal consultation'
    ];
    
    const hasLawyerRecommendation = lawyerKeywords.some(keyword => text.includes(keyword));
    
    if (!hasLawyerRecommendation) return null;

    // Detect lawyer specialization based on content
    const specializations = {
      'Criminal Lawyer': ['criminal', 'police', 'fir', 'arrest', 'bail', 'theft', 'fraud', 'assault', 'murder', 'ipc', 'crpc'],
      'Civil Lawyer': ['civil', 'property', 'contract', 'agreement', 'dispute', 'damages', 'breach', 'cpc'],
      'Consumer Lawyer': ['consumer', 'product', 'service', 'refund', 'defect', 'consumer protection act', 'consumer court'],
      'Family Lawyer': ['family', 'divorce', 'marriage', 'custody', 'alimony', 'domestic', 'maintenance'],
      'Corporate Lawyer': ['company', 'business', 'corporate', 'partnership', 'compliance', 'securities', 'merger'],
      'Employment Lawyer': ['employment', 'job', 'workplace', 'salary', 'termination', 'harassment', 'labour'],
      'Real Estate Lawyer': ['property', 'real estate', 'land', 'builder', 'construction', 'rera'],
      'Tax Lawyer': ['tax', 'income tax', 'gst', 'taxation', 'revenue'],
      'Immigration Lawyer': ['visa', 'immigration', 'citizenship', 'passport', 'foreign']
    };

    for (const [specialty, keywords] of Object.entries(specializations)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return specialty;
      }
    }

    return 'General Legal Expert'; // Default if no specific specialization detected
  };

  const detectLawyerSpecializationFromQuery = (query: string): string => {
    const text = query.toLowerCase();
    
    // Detect lawyer specialization based on original query content
    const specializations = {
      'Criminal Lawyer': ['criminal', 'police', 'fir', 'arrest', 'bail', 'theft', 'fraud', 'assault', 'murder', 'hit', 'violence', 'crime'],
      'Civil Lawyer': ['civil', 'property', 'contract', 'agreement', 'dispute', 'damages', 'breach', 'landlord', 'tenant', 'neighbor'],
      'Consumer Lawyer': ['consumer', 'product', 'service', 'refund', 'defect', 'warranty', 'shop', 'purchase', 'seller', 'buyer'],
      'Family Lawyer': ['family', 'divorce', 'marriage', 'custody', 'alimony', 'domestic', 'maintenance', 'spouse', 'child'],
      'Corporate Lawyer': ['company', 'business', 'corporate', 'partnership', 'compliance', 'securities', 'merger', 'employee'],
      'Employment Lawyer': ['employment', 'job', 'workplace', 'salary', 'termination', 'harassment', 'labour', 'boss', 'work'],
      'Real Estate Lawyer': ['property', 'real estate', 'land', 'builder', 'construction', 'rera', 'house', 'flat', 'apartment'],
      'Tax Lawyer': ['tax', 'income tax', 'gst', 'taxation', 'revenue', 'tds', 'return'],
      'Immigration Lawyer': ['visa', 'immigration', 'citizenship', 'passport', 'foreign', 'travel']
    };

    for (const [specialty, keywords] of Object.entries(specializations)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return specialty;
      }
    }

    return 'General Legal Expert'; // Default fallback
  };

  const handleDetailedAnalysis = async () => {
    if (!state.searchQuery.trim()) return;

    updateState({ isLoadingDetailed: true });

    try {
      const geminiService = getGeminiService();
      if (!geminiService) {
        throw new Error('Gemini service not available');
      }

      // Get comprehensive detailed analysis
      const detailedPrompt = `Provide a comprehensive detailed legal analysis for: "${state.searchQuery}". 

      Structure your response with the following sections:

      **1. LEGAL VIOLATIONS IDENTIFIED:**
      - List specific laws, sections, or regulations that may have been violated
      - Include relevant acts, codes, or statutes (e.g., IPC sections, Consumer Protection Act, etc.)
      - Mention both civil and criminal implications if applicable

      **2. CASE STRENGTH ASSESSMENT:**
      - Likelihood of success (High/Medium/Low with percentage if possible)
      - Key evidence required to strengthen the case
      - Potential challenges or weaknesses in the case

      **3. LEGAL REMEDIES AVAILABLE:**
      - Civil remedies (compensation, injunction, damages)
      - Criminal remedies (if applicable)
      - Alternative dispute resolution options (mediation, arbitration)
      - Administrative remedies (complaints to regulatory bodies)

      **4. STEP-BY-STEP ACTION PLAN:**
      - Immediate steps to take (evidence collection, documentation)
      - Legal notices or formal complaints to file
      - Timeline for legal action
      - Documentation required

      **5. EXPERT LEGAL ASSISTANCE REQUIRED:**
      - Specific type of lawyer needed (Criminal, Civil, Consumer, Family, Corporate, etc.)
      - Why professional legal help is essential for this case
      - Urgency level of legal consultation
      - Recommendation: "We strongly recommend consulting with a [specific lawyer type] for this matter"

      **6. IMPORTANT CONSIDERATIONS:**
      - Statute of limitations
      - Costs involved
      - Time duration for resolution
      - Potential risks or counter-claims

      **7. RELEVANT PRECEDENTS:**
      - Similar cases or judgments if applicable
      - How courts typically handle such matters

      IMPORTANT: Always include a recommendation to consult with a specific type of lawyer in section 5. Make it thorough, professional, and actionable. Use Indian legal framework and context.`;

      const detailedResponse = await geminiService.getInputAssistance(
        detailedPrompt,
        'Comprehensive legal analysis with violations, remedies, and expert guidance',
        getGeminiLanguageCode(state.selectedLanguage)
      );

      // Detect if lawyer consultation is recommended
      const lawyerSpecialization = detectLawyerRecommendation(detailedResponse);

      // Force lawyer recommendation for detailed analysis if none detected
      const finalLawyerRecommendation = lawyerSpecialization || detectLawyerSpecializationFromQuery(state.searchQuery);

      updateState({
        detailedAnalysis: detailedResponse,
        showDetailedAnalysis: true,
        isLoadingDetailed: false,
        lawyerRecommendation: finalLawyerRecommendation ? {
          suggested: true,
          specialization: finalLawyerRecommendation
        } : null
      });

    } catch (error) {
      console.error('Detailed analysis error:', error);
      updateState({
        detailedAnalysis: 'Sorry, I encountered an error while providing detailed analysis. Please try again.',
        showDetailedAnalysis: true,
        isLoadingDetailed: false
      });
    }
  };

  const resetAnalysis = () => {
    updateState({
      searchQuery: '',
      aiResponse: '',
      briefAnalysis: '',
      detailedAnalysis: '',
      showDetailedAnalysis: false,
      nonLegalMessage: '',
      isAnalyzing: false,
      isLoadingDetailed: false,
      lawyerRecommendation: null,
    });
    setLoadingMessage('');
  };

  return {
    state,
    loadingMessage,
    updateState,
    updateSearchQuery,
    handleLanguageChange,
    handleAnalysis,
    handleDetailedAnalysis,
    resetAnalysis,
  };
}