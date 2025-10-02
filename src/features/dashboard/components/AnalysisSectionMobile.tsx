import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LawyerRecommendation } from './LawyerRecommendation';
import { useSpeechRecognition, SUPPORTED_LANGUAGES, getLanguageByCode } from '../../hooks/useSpeechRecognition';
import { useDashboardAnalysis } from '../../hooks/dashboard/useDashboardAnalysis';
import { Mic, MicOff, Send, Languages, Volume2, Loader2 } from 'lucide-react';

interface AnalysisSectionProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  isInCard?: boolean;
}

export function AnalysisSection({ selectedLanguage, onLanguageChange, isInCard = false }: AnalysisSectionProps) {
  const { state, loadingMessage, updateSearchQuery, handleAnalysis, handleDetailedAnalysis, resetAnalysis } = useDashboardAnalysis();
  
  // Speech recognition hook
  const {
    isSupported: isSpeechSupported,
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage: setSpeechLanguage,
    currentLanguage,
    confidence
  } = useSpeechRecognition({
    language: selectedLanguage,
    continuous: true,
    interimResults: true,
    autoDetectLanguage: true
  });

  // Update search query when transcript changes
  React.useEffect(() => {
    if (transcript) {
      updateSearchQuery(transcript);
    }
  }, [transcript, updateSearchQuery]);

  const handleSubmit = () => {
    const query = transcript || state.searchQuery;
    if (query.trim()) {
      handleAnalysis(query);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !state.isAnalyzing && state.searchQuery.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile-first layout */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          AI-Powered Legal Assistant
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Describe your legal issue using voice or text
        </p>

        {/* Language Selection - Mobile optimized */}
        <div className="flex justify-center mb-4">
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-40 text-sm">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input Section - Mobile optimized */}
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              placeholder="Describe your legal issue here..."
              value={transcript || state.searchQuery}
              onChange={(e) => updateSearchQuery(e.target.value)}
              className="pr-12 min-h-[80px] text-sm resize-none"
              disabled={state.isAnalyzing}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={toggleListening}
              disabled={!isSpeechSupported}
              className={`absolute right-2 top-2 p-2 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'
                } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={!isSpeechSupported ? 'Speech recognition not supported' :
                isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700 w-full"
            onClick={handleSubmit}
            disabled={!state.searchQuery.trim() || state.isAnalyzing}
          >
            {state.isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {/* Speech Status */}
        {isListening && (
          <div className="flex items-center justify-center space-x-2 text-red-600 mt-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-xs">
              Recording... Speak clearly
            </span>
            {confidence > 0 && (
              <Badge variant="outline" className="text-xs">
                {Math.round(confidence * 100)}%
              </Badge>
            )}
          </div>
        )}

        {speechError && (
          <div className="flex items-center justify-center space-x-2 text-red-600 mt-3">
            <span className="text-xs">{speechError}</span>
          </div>
        )}

        {/* Non-Legal Message */}
        {state.nonLegalMessage && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-left">
              <h4 className="font-medium text-amber-900 mb-2 text-sm">Legal Assistance Only</h4>
              <p className="text-amber-800 text-xs">{state.nonLegalMessage}</p>
              <Button
                onClick={resetAnalysis}
                variant="outline"
                size="sm"
                className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100 text-xs"
              >
                Ask Legal Question
              </Button>
            </div>
          </div>
        )}

        {/* AI Response - Brief Analysis */}
        {state.briefAnalysis && !state.nonLegalMessage && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-left">
              <h4 className="font-medium text-blue-900 mb-2 text-sm">Brief Legal Analysis</h4>
              <p className="text-blue-800 whitespace-pre-wrap text-xs">{state.briefAnalysis}</p>
              
              {/* Detailed Analysis Section */}
              {!state.showDetailedAnalysis ? (
                <div className="mt-3 flex flex-col space-y-2">
                  <Button
                    onClick={handleDetailedAnalysis}
                    disabled={state.isLoadingDetailed}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    size="sm"
                  >
                    {state.isLoadingDetailed ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      'Get Detailed Analysis'
                    )}
                  </Button>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 text-xs"
                  >
                    New Question
                  </Button>
                </div>
              ) : (
                <div className="mt-3">
                  <div className="border-t border-blue-200 pt-3 mt-3">
                    <h5 className="font-medium text-blue-900 mb-2 text-sm">Detailed Legal Analysis</h5>
                    <div className="text-blue-800 whitespace-pre-wrap bg-blue-25 p-2 rounded border-l-4 border-blue-400 text-xs">
                      {state.detailedAnalysis}
                    </div>
                  </div>
                  
                  {/* Lawyer Recommendation Section */}
                  <div className="mt-3">
                    {state.lawyerRecommendation?.suggested ? (
                      <LawyerRecommendation specialization={state.lawyerRecommendation.specialization} />
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <h5 className="font-medium text-green-900 text-sm">Professional Consultation Recommended</h5>
                        </div>
                        <p className="text-green-800 mb-2 text-xs">
                          Based on your analysis, we recommend consulting with a legal professional.
                        </p>
                        <LawyerRecommendation specialization="General Legal Expert" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <Button
                      onClick={resetAnalysis}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100 text-xs"
                    >
                      New Question
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}