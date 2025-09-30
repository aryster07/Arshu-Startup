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
      updateState({
        nonLegalMessage: 'Sorry, I encountered an error while analyzing your query. Please try again.',
        isAnalyzing: false
      });
    }
  };

  const handleDetailedAnalysis = async () => {
    if (!state.searchQuery.trim()) return;

    updateState({ isLoadingDetailed: true });

    try {
      const geminiService = getGeminiService();
      if (!geminiService) {
        throw new Error('Gemini service not available');
      }

      // Get detailed analysis
      const detailedPrompt = `Provide a comprehensive detailed legal analysis for: "${state.searchQuery}". Include:
      1. Legal framework and applicable laws
      2. Rights and obligations of parties involved
      3. Potential legal remedies or actions
      4. Step-by-step guidance for next steps
      5. Important considerations and warnings
      6. Relevant case law or precedents if applicable
      
      Make it thorough and professional.`;

      const detailedResponse = await geminiService.getInputAssistance(
        detailedPrompt,
        'Detailed legal analysis - comprehensive consultation',
        getGeminiLanguageCode(state.selectedLanguage)
      );

      updateState({
        detailedAnalysis: detailedResponse,
        showDetailedAnalysis: true,
        isLoadingDetailed: false
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
      isLoadingDetailed: false
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