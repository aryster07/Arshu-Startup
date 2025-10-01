import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getGeminiService } from '../services/geminiService';
import { useSpeechRecognition, SUPPORTED_LANGUAGES, getGeminiLanguageCode } from '../hooks/useSpeechRecognition';
import type { LegalAnalysisResponse } from '../services/geminiService';
import {
  Home,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Scale,
  Users,
  Clock,
  Mic,
  MicOff,
  Search,
  Download,
  Share,
  BookOpen,
  Lightbulb,
  Phone,
  ArrowRight,
  Loader2,
  Languages,
  Volume2,
  Send
} from 'lucide-react';

interface LegalRightsCheckerProps {
  onNavigate: (screen: string) => void;
}

export default function LegalRightsChecker({ onNavigate }: LegalRightsCheckerProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [nonLegalMessage, setNonLegalMessage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [loadingMessage, setLoadingMessage] = useState('');

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
    confidence
  } = useSpeechRecognition({
    language: selectedLanguage,
    continuous: true,
    interimResults: true,
    autoDetectLanguage: true
  });

  const sarcasticLoadingMessages = [
    'Reading all the law books... This might take a while ⚖️',
    'Consulting with our imaginary legal team... 👨‍⚖️',
    'Checking if this is actually legal... Plot twist incoming! 🎭',
    'Summoning the ghost of justice... BOO! 👻',
    'Teaching AI what "objection" means... Overruled! 🔨',
    'Converting legalese to human language... Good luck! 🤖',
    'Calculating your chances... Loading disappointment... 📊',
    'Asking ChatGPT\'s lawyer cousin for advice... 🤝',
    'Dusting off ancient law scrolls... Achoo! 📜',
    'Bribing the legal algorithm with virtual cookies... 🍪',
    'Pretending to understand complicated legal jargon... 🤯',
    'Consulting the magic 8-ball of justice... Reply hazy! 🎱'
  ];

  const getRandomLoadingMessage = () => {
    return sarcasticLoadingMessages[Math.floor(Math.random() * sarcasticLoadingMessages.length)];
  };

  const legalCategories = [
    { id: 'criminal', name: 'Criminal Law', icon: <Shield className="h-5 w-5" /> },
    { id: 'civil', name: 'Civil Rights', icon: <Users className="h-5 w-5" /> },
    { id: 'consumer', name: 'Consumer Protection', icon: <FileText className="h-5 w-5" /> },
    { id: 'employment', name: 'Employment Law', icon: <Scale className="h-5 w-5" /> },
    { id: 'property', name: 'Property Rights', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'family', name: 'Family Law', icon: <Users className="h-5 w-5" /> }
  ];

  const handleAnalysis = async () => {
    console.log('🔍 handleAnalysis called');
    console.log('📝 analysisText:', analysisText);
    console.log('📂 selectedCategory:', selectedCategory);

    if (!analysisText.trim()) {
      console.log('❌ No analysis text provided');
      return;
    }

    console.log('⏳ Starting analysis...');

    // Show sarcastic loading message with delay
    setLoadingMessage(getRandomLoadingMessage());
    setIsAnalyzing(true);
    setNonLegalMessage(''); // Clear any previous non-legal message
    setAnalysisResult(null); // Clear any previous results

    // Add a 3-4 second delay with fun loading messages
    await new Promise(resolve => setTimeout(resolve, 3500));

    try {
      console.log('🤖 Getting Gemini service...');
      const geminiService = getGeminiService();

      // Validate if content is law-related
      const isLegalContent = await geminiService.validateLegalContent(analysisText);

      if (!isLegalContent) {
        setNonLegalMessage('Please talk related to law. I\'m specifically designed to help with legal matters only. Please share a law-related concern such as legal rights, disputes, violations, contracts, or any legal issue you\'re facing, and I\'ll provide professional legal analysis and guidance.');
        setAnalysisResult(null);
        setIsAnalyzing(false);
        return;
      }

      // Stop listening if currently active
      if (isListening) {
        stopListening();
      }

      const selectedLangCode = getGeminiLanguageCode(selectedLanguage);
      const result = await geminiService.analyzeLegalRights({
        type: 'legal-rights',
        content: analysisText,
        context: {
          category: selectedCategory || 'general',
          jurisdiction: 'India',
          urgency: 'medium',
          language: selectedLangCode
        }
      });

      // Transform Gemini response to match component's expected format
      const transformedResult = {
        riskLevel: result.severity?.toLowerCase() || 'medium',
        confidence: result.confidence,
        violations: result.violations || [],
        legalRemedies: result.legalRemedies || result.recommendedActions || [],
        estimatedCost: result.estimatedCost || 'Contact for estimate',
        timeframe: result.timeframe || '3-6 months',
        successRate: result.successRate || 'Varies by case',
        analysis: result.analysis,
        applicableLaws: result.applicableLaws || [],
        recommendedActions: result.recommendedActions || [],
        nextSteps: result.nextSteps || [],
        emergencyRequired: result.emergencyRequired || false
      };

      setAnalysisResult(transformedResult);
    } catch (error) {
      console.error('Legal analysis failed:', error);

      // Fallback to sample data if AI fails
      const fallbackResult = {
        riskLevel: 'medium' as const,
        confidence: 75,
        violations: [
          {
            type: 'Legal Issue Detected',
            severity: 'Medium',
            description: 'Unable to complete AI analysis. Please consult with a legal professional.',
            applicableLaws: ['Consult legal expert for specific laws'],
            recommendedAction: 'Seek professional legal consultation'
          }
        ],
        legalRemedies: [
          'Contact our legal experts for detailed analysis',
          'Schedule a consultation for personalized advice'
        ],
        estimatedCost: 'Contact for estimate',
        timeframe: 'Varies',
        successRate: 'Depends on case specifics',
        summary: 'AI analysis temporarily unavailable. Our legal experts are available to help you with your legal matter.',
        analysis: 'AI analysis temporarily unavailable. Our legal experts are available to help you.',
        applicableLaws: ['Contact legal expert'],
        recommendedActions: ['Seek professional consultation'],
        nextSteps: ['Contact our support team'],
        emergencyRequired: false
      };

      setAnalysisResult(fallbackResult);
    } finally {
      setIsAnalyzing(false);
      setLoadingMessage('');
    }
  };

  // Sync speech transcript with analysis text
  useEffect(() => {
    if (transcript) {
      setAnalysisText(transcript);
    }
  }, [transcript]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setAnalysisText('');
      startListening();
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    setSpeechLanguage(newLanguage);
    if (isListening) {
      stopListening();
    }
  };



  // Add error boundary
  if (!analysisResult && analysisText.length > 5000) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Input Too Long</h2>
          <p className="text-slate-600">Please keep your input under 5000 characters for better analysis.</p>
          <Button onClick={() => setAnalysisText('')} className="mt-4">
            Clear Input
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">
        {nonLegalMessage ? (
          // Show simple message for non-legal content
          <Card className="p-3 lg:p-6 mb-4 lg:mb-6 text-center">
            <div className="max-w-2xl mx-auto">
              <AlertTriangle className="h-12 w-12 lg:h-16 lg:w-16 text-amber-500 mx-auto mb-4 lg:mb-6" />
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 lg:mb-4">Legal Assistance Only</h2>
              <p className="text-base lg:text-lg text-slate-600 mb-4 lg:mb-6">
                {nonLegalMessage}
              </p>
              <div className="space-y-3">
                <p className="text-slate-500">
                  <strong>Examples of legal questions I can help with:</strong>
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-slate-600">
                  <div>• "My landlord won't return my deposit"</div>
                  <div>• "I was wrongfully terminated"</div>
                  <div>• "Someone damaged my property"</div>
                  <div>• "Contract dispute with vendor"</div>
                  <div>• "Consumer rights violation"</div>
                  <div>• "Family law questions"</div>
                </div>
              </div>
              <Button
                onClick={() => {
                  setNonLegalMessage('');
                  setAnalysisText('');
                }}
                className="mt-4 lg:mt-6 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                Ask Legal Question
              </Button>
            </div>
          </Card>
        ) : !analysisResult ? (
          <Card className="p-3 lg:p-6 mb-4 lg:mb-6">
            <div className="space-y-4 lg:space-y-6">
              {/* Language Selection */}
              <div className="mb-3 lg:mb-4">
                <label className="block text-base lg:text-lg font-semibold text-slate-900 mb-2 lg:mb-3">
                  Select Language / भाषा चुनें
                </label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full sm:w-64">
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

              {/* Input Section */}
              <div>
                <label className="block text-base lg:text-lg font-semibold text-slate-900 mb-3 lg:mb-4">
                  {getGeminiLanguageCode(selectedLanguage) === 'hi'
                    ? 'अपना कानूनी मुद्दा बताएं'
                    : 'Describe Your Legal Issue'}
                </label>
                <div className="relative">
                  <Textarea
                    placeholder={getGeminiLanguageCode(selectedLanguage) === 'hi'
                      ? "अपनी स्थिति का विस्तार से वर्णन करें। संबंधित तारीखें, संबंधित पक्ष, और कोई भी दस्तावेज़ या सबूत शामिल करें... (विश्लेषण के लिए Enter दबाएं)"
                      : "Explain your situation in detail. "
                    }
                    value={analysisText + (interimTranscript ? ` ${interimTranscript}` : '')}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      console.log('📝 Text changed:', e.target.value);
                      setAnalysisText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      console.log('⌨️ Key pressed:', e.key, 'Shift:', e.shiftKey);
                      const currentValue = (e.target as HTMLTextAreaElement).value;
                      console.log('📊 Current state - currentValue:', currentValue.trim().length, 'analysisText:', analysisText.trim().length, 'isAnalyzing:', isAnalyzing);

                      if (e.key === 'Enter' && !e.shiftKey && !isAnalyzing && currentValue.trim()) {
                        console.log('✅ Enter key triggered - calling handleAnalysis');
                        e.preventDefault();
                        handleAnalysis();
                      } else {
                        console.log('❌ Enter key conditions not met - key:', e.key, 'shift:', e.shiftKey, 'analyzing:', isAnalyzing, 'hasText:', !!currentValue.trim());
                      }
                    }}
                    className="min-h-[120px] lg:min-h-[150px] pr-12 sm:pr-16 lg:pr-24 text-base touch-manipulation"
                  />
                  {/* Voice and Analyze Buttons - Mobile optimized */}
                  <div className="absolute right-2 top-2 flex flex-row space-x-1 sm:space-x-2">
                    <Button
                      onClick={handleVoiceToggle}
                      disabled={!isSpeechSupported}
                      size="sm"
                      className={`p-1.5 sm:p-2 h-8 w-8 sm:h-10 sm:w-10 ${isListening ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                        } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''} shadow-md`}
                      title={!isSpeechSupported ? 'Speech recognition not supported' :
                        isListening ? 'Stop recording' : 'Start voice input'}
                    >
                      {isListening ? <MicOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Mic className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </Button>

                    <Button
                      onClick={handleAnalysis}
                      disabled={!analysisText.trim() || isAnalyzing}
                      size="sm"
                      className="p-1.5 sm:p-2 h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      title="Analyze legal issue"
                    >
                      {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Speech Status */}
                {isListening && (
                  <div className="flex items-center justify-center space-x-2 text-red-600 mt-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-sm">
                      {getGeminiLanguageCode(selectedLanguage) === 'hi'
                        ? 'रिकॉर्ड हो रहा है... अपने कानूनी मुद्दे के बारे में स्पष्ट रूप से बोलें'
                        : 'Recording... Speak clearly about your legal issue'}
                    </span>
                    {confidence > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(confidence * 100)}% confident
                      </Badge>
                    )}
                  </div>
                )}

                {speechError && (
                  <div className="flex items-center justify-center space-x-2 text-red-600 mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{speechError}</span>
                  </div>
                )}

                {/* Sarcastic Loading Message */}
                {isAnalyzing && loadingMessage && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">{loadingMessage}</span>
                  </div>
                )}

                <p className="text-sm text-slate-500 mt-2">
                  <span className="text-blue-600">
                    {getGeminiLanguageCode(selectedLanguage) === 'hi'
                      ? 'विश्लेषण के लिए Enter दबाएं'
                      : 'Press Enter to analyze'}
                  </span>
                  {getGeminiLanguageCode(selectedLanguage) === 'hi'
                    ? ' या नीचे दिए गए विश्लेषण बटन का उपयोग करें'
                    : ' or use the Analyze button below'}
                </p>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-lg font-semibold text-slate-900 mb-4">
                  Select Relevant Legal Categories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {legalCategories.map((category) => (
                    <Card key={category.id} className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          {category.icon}
                        </div>
                        <span className="font-medium text-slate-900">{category.name}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Analysis Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    console.log('🖱️ Analysis button clicked');
                    handleAnalysis();
                  }}
                  disabled={!analysisText.trim() || isAnalyzing}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-12 mr-4"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Analyze Legal Rights
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-8">
            {/* Analysis Summary */}
            <Card className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Analysis Results</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Download Report</span>
                    <span className="sm:hidden">Download</span>
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Share</span>
                    <span className="sm:hidden">Share</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 ${(analysisResult?.riskLevel === 'high') ? 'bg-red-100' :
                    (analysisResult?.riskLevel === 'medium') ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                    <AlertTriangle className={`h-6 w-6 sm:h-8 sm:w-8 ${(analysisResult?.riskLevel === 'high') ? 'text-red-600' :
                      (analysisResult?.riskLevel === 'medium') ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Risk Level</h3>
                  <p className={`text-base sm:text-lg font-bold capitalize ${(analysisResult?.riskLevel === 'high') ? 'text-red-600' :
                    (analysisResult?.riskLevel === 'medium') ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                    {analysisResult?.riskLevel || 'Unknown'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Confidence</h3>
                  <p className="text-base sm:text-lg font-bold text-blue-600">{analysisResult?.confidence || 0}%</p>
                  <Progress value={analysisResult?.confidence || 0} className="mt-2" />
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">Success Rate</h3>
                  <p className="text-base sm:text-lg font-bold text-green-600">{analysisResult?.successRate || 'N/A'}</p>
                </div>
              </div>

              {/* Analysis Summary Text */}
              {(analysisResult?.summary || analysisResult?.analysis) && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-50 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 sm:mb-3">Analysis Summary</h3>
                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                    {analysisResult?.summary || analysisResult?.analysis}
                  </p>
                </div>
              )}
            </Card>

            <Tabs defaultValue="violations" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-2 h-auto p-1">
                <TabsTrigger value="violations" className="text-xs lg:text-sm px-2 lg:px-4 py-2 lg:py-3 min-h-[40px] lg:min-h-[44px]">
                  <span className="hidden lg:inline">Violations Found</span>
                  <span className="lg:hidden">Violations</span>
                </TabsTrigger>
                <TabsTrigger value="remedies" className="text-xs lg:text-sm px-2 lg:px-4 py-2 lg:py-3 min-h-[40px] lg:min-h-[44px]">
                  <span className="hidden lg:inline">Legal Remedies</span>
                  <span className="lg:hidden">Remedies</span>
                </TabsTrigger>
                <TabsTrigger value="cost" className="text-xs lg:text-sm px-2 lg:px-4 py-2 lg:py-3 min-h-[40px] lg:min-h-[44px]">
                  <span className="hidden lg:inline">Cost & Timeline</span>
                  <span className="lg:hidden">Cost</span>
                </TabsTrigger>
                <TabsTrigger value="next-steps" className="text-xs lg:text-sm px-2 lg:px-4 py-2 lg:py-3 min-h-[40px] lg:min-h-[44px]">
                  <span className="hidden lg:inline">Next Steps</span>
                  <span className="lg:hidden">Steps</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="violations" className="space-y-3 sm:space-y-4">
                {(analysisResult?.violations || []).map((violation: any, index: number) => (
                  <Card key={index} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900">{violation?.type || 'Legal Issue'}</h3>
                          <Badge
                            variant={(violation?.severity === 'High') ? 'destructive' : 'secondary'}
                            className="self-start sm:self-auto text-xs"
                          >
                            {violation?.severity || 'Medium'} Severity
                          </Badge>
                        </div>
                        <p className="text-slate-600 mb-3 sm:mb-4 text-sm sm:text-base">{violation?.description || 'Legal analysis completed.'}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 text-sm sm:text-base">Applicable Laws:</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {(violation?.applicableLaws || []).map((law: string, lawIndex: number) => (
                            <Badge key={lawIndex} variant="outline" className="text-xs">
                              {law}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 text-sm sm:text-base">Recommended Action:</h4>
                        <p className="text-slate-600 text-sm sm:text-base">{violation?.recommendedAction || 'Consult with legal expert'}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="remedies" className="space-y-4">
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Available Legal Remedies</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {(analysisResult?.legalRemedies || analysisResult?.recommendedActions || []).map((remedy: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-blue-600 text-xs sm:text-sm font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-700 text-sm sm:text-base">{remedy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="cost" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Estimated Costs</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-slate-600">Legal Fees:</span>
                        <span className="font-semibold">{analysisResult?.estimatedCost || 'Contact for estimate'}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-slate-600">Court Fees:</span>
                        <span className="font-semibold">₹2,000 - ₹5,000</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-slate-600">Documentation:</span>
                        <span className="font-semibold">₹1,000 - ₹3,000</span>
                      </div>
                      <hr className="my-2 sm:my-3" />
                      <div className="flex justify-between text-base sm:text-lg font-bold">
                        <span>Total Estimated:</span>
                        <span className="text-blue-600">₹18,000 - ₹58,000</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Timeline</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 flex-shrink-0" />
                        <span className="text-slate-700 text-sm sm:text-base">Expected Duration: {analysisResult?.timeframe || '3-6 months'}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm text-slate-600">
                          <strong>Phase 1:</strong> Initial filing (1-2 weeks)
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600">
                          <strong>Phase 2:</strong> Response period (2-4 weeks)
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600">
                          <strong>Phase 3:</strong> Resolution/Hearing (2-4 months)
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="next-steps" className="space-y-4">
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6">Recommended Next Steps</h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-base flex-shrink-0">1</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">Gather Documentation</h4>
                        <p className="text-slate-600 mb-3 text-xs sm:text-sm">Collect all relevant documents, receipts, communications, and evidence related to your case.</p>
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Document Checklist
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-base flex-shrink-0">2</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">Legal Consultation</h4>
                        <p className="text-slate-600 mb-3 text-xs sm:text-sm">Schedule a consultation with a qualified lawyer specializing in your case type.</p>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm" size="sm">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Find Lawyer
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-base flex-shrink-0">3</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">File Formal Complaint</h4>
                        <p className="text-slate-600 mb-3 text-xs sm:text-sm">Based on legal advice, proceed with filing the appropriate complaint or legal notice.</p>
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                          <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Complaint Guide
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 bg-blue-50 border-blue-200">
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Need Immediate Help?</h3>
                    <p className="text-slate-600 mb-4 text-sm sm:text-base">
                      Our legal experts are available 24/7 for emergency consultation
                    </p>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm" onClick={() => onNavigate('emergency')}>
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      Emergency Legal Help
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => {
                setAnalysisResult(null);
                setNonLegalMessage('');
                setAnalysisText('');
              }}>
                New Analysis
              </Button>
              <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => onNavigate('client')}>
                Return to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}