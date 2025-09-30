import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
    <div className={isInCard ? "" : "space-y-6"}>
      {isInCard ? (
        // Original Card Layout - Voice Search Section
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            AI-Powered Legal Assistant
          </h3>
          <p className="text-slate-600 mb-6">
            Describe your legal issue in your preferred language using voice or text
          </p>

          {/* Language Selection */}
          <div className="flex justify-center mb-4">
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-48">
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

          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex-1 max-w-2xl relative">
              <Textarea
                placeholder="Describe your legal issue here... (Press Enter to analyze)"
                value={transcript || state.searchQuery}
                onChange={(e) => updateSearchQuery(e.target.value)}
                className="pr-16 h-14 text-lg resize-none"
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
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </div>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 px-8"
              onClick={handleSubmit}
              disabled={!state.searchQuery.trim() || state.isAnalyzing}
            >
              {state.isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {/* Speech Status */}
          {isListening && (
            <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-sm">
                Recording... Speak clearly about your legal issue
              </span>
              {confidence > 0 && (
                <Badge variant="outline" className="text-xs">
                  {Math.round(confidence * 100)}% confident
                </Badge>
              )}
            </div>
          )}

          {speechError && (
            <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
              <span className="text-sm">{speechError}</span>
            </div>
          )}

          {/* Non-Legal Message */}
          {state.nonLegalMessage && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="flex-1">
                  <h4 className="font-medium text-amber-900 mb-2">Legal Assistance Only</h4>
                  <p className="text-amber-800">{state.nonLegalMessage}</p>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    size="sm"
                    className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Ask Legal Question
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* AI Response - Brief Analysis */}
          {state.briefAnalysis && !state.nonLegalMessage && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-2">Brief Legal Analysis</h4>
                  <p className="text-blue-800 whitespace-pre-wrap">{state.briefAnalysis}</p>
                  
                  {/* Detailed Analysis Section */}
                  {!state.showDetailedAnalysis ? (
                    <div className="mt-4 flex space-x-2">
                      <Button
                        onClick={handleDetailedAnalysis}
                        disabled={state.isLoadingDetailed}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        {state.isLoadingDetailed ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Loading Detailed Analysis...
                          </>
                        ) : (
                          'Get Detailed Analysis'
                        )}
                      </Button>
                      <Button
                        onClick={resetAnalysis}
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        New Question
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="border-t border-blue-200 pt-4 mt-4">
                        <h5 className="font-medium text-blue-900 mb-2">Detailed Legal Analysis</h5>
                        <div className="text-blue-800 whitespace-pre-wrap bg-blue-25 p-3 rounded border-l-4 border-blue-400">
                          {state.detailedAnalysis}
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button
                          onClick={resetAnalysis}
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          New Question
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Modern Layout - Keep existing structure
        <>
          {/* Language Selection */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">AI Legal Consultation</h3>
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4 text-slate-600" />
                <Select value={selectedLanguage} onValueChange={onLanguageChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={transcript || state.searchQuery}
                  onChange={(e) => updateSearchQuery(e.target.value)}
                  placeholder="Describe your legal situation or ask a legal question..."
                  className="min-h-[120px] pr-12"
                  disabled={state.isAnalyzing}
                />
                
                {/* Speech Controls */}
                {isSpeechSupported && (
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleListening}
                      className={`p-2 ${isListening ? 'text-red-600 bg-red-50' : 'text-blue-600 hover:bg-blue-50'}`}
                      disabled={state.isAnalyzing}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    {(transcript || state.searchQuery) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Handle voice playback */}}
                        className="p-2 text-slate-600 hover:bg-slate-50"
                        disabled={state.isAnalyzing}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Speech Status */}
              {isListening && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600">Listening in {getLanguageByCode(currentLanguage).name}...</span>
                  </div>
                  {confidence && (
                    <Badge variant="outline" className="text-xs">
                      Confidence: {Math.round(confidence * 100)}%
                    </Badge>
                  )}
                </div>
              )}

              {/* Error Display */}
              {speechError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  Speech Error: {speechError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={resetAnalysis}
                  disabled={state.isAnalyzing}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={state.isAnalyzing || (!transcript && !state.searchQuery)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {state.isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
            </div>
          </Card>

          {/* Loading Message */}
          {state.isAnalyzing && loadingMessage && (
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <p className="text-sm text-slate-600">{loadingMessage}</p>
              </div>
            </Card>
          )}

          {/* Analysis Results - Brief and Detailed */}
          {state.briefAnalysis && (
            <Card className="p-6">
              <h4 className="font-semibold text-slate-900 mb-4">Brief Legal Analysis</h4>
              <div className="prose prose-sm max-w-none mb-4">
                <div 
                  className="text-slate-700"
                  dangerouslySetInnerHTML={{ 
                    __html: state.briefAnalysis.replace(/\n/g, '<br />') 
                  }}
                />
              </div>
              
              {/* Detailed Analysis Section */}
              {!state.showDetailedAnalysis ? (
                <div className="flex space-x-3">
                  <Button
                    onClick={handleDetailedAnalysis}
                    disabled={state.isLoadingDetailed}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    {state.isLoadingDetailed ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading Detailed Analysis...
                      </>
                    ) : (
                      'Get Detailed Analysis'
                    )}
                  </Button>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="border-t border-slate-200 pt-4">
                    <h5 className="font-semibold text-slate-900 mb-3">Detailed Legal Analysis</h5>
                    <div className="prose prose-sm max-w-none bg-slate-50 p-4 rounded border-l-4 border-blue-500">
                      <div 
                        className="text-slate-700"
                        dangerouslySetInnerHTML={{ 
                          __html: state.detailedAnalysis.replace(/\n/g, '<br />') 
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={resetAnalysis}
                      variant="outline"
                      size="sm"
                    >
                      New Analysis
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Non-Legal Message */}
          {state.nonLegalMessage && (
            <Card className="p-6 border-yellow-200 bg-yellow-50">
              <h4 className="font-semibold text-yellow-800 mb-2">Notice</h4>
              <p className="text-yellow-700">{state.nonLegalMessage}</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}