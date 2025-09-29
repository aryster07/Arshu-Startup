import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import AppLayout from '../../layouts/AppLayout';
import { getGeminiService } from '../../services/geminiService';
import { useSpeechRecognition, SUPPORTED_LANGUAGES, getGeminiLanguageCode } from '../../hooks/useSpeechRecognition';
import {
  FileText,
  Shield,
  ShoppingCart,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Search,
  Mic,
  MicOff,
  Globe
} from 'lucide-react';

export default function ClientDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nonLegalMessage, setNonLegalMessage] = useState<string>('');

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



  const recentCases = [
    {
      id: 1,
      title: "Consumer Rights Violation",
      status: "In Progress",
      lastUpdate: "2 days ago",
      priority: "high"
    },
    {
      id: 2,
      title: "Property Dispute Consultation",
      status: "Completed",
      lastUpdate: "1 week ago",
      priority: "medium"
    },
    {
      id: 3,
      title: "Employment Law Query",
      status: "Pending Review",
      lastUpdate: "3 days ago",
      priority: "low"
    }
  ];

  const legalServices = [
    {
      title: "Legal Rights Checker",
      description: "AI-powered analysis of your legal rights and potential violations",
      icon: <Shield className="h-6 w-6" />,
      path: '/dashboard/client/legal-rights'
    },
    {
      title: "Consumer Rights Protection",
      description: "Comprehensive consumer protection and dispute resolution",
      icon: <ShoppingCart className="h-6 w-6" />,
      path: '/dashboard/client/consumer-rights'
    },
    {
      title: "Document Review",
      description: "Professional legal document preparation and review services",
      icon: <FileText className="h-6 w-6" />,
      path: '/dashboard/client/document-review'
    },
    {
      title: "Emergency Legal Help",
      description: "24/7 emergency legal assistance for urgent matters",
      icon: <Phone className="h-6 w-6" />,
      path: '/dashboard/client/emergency'
    }
  ];

  // Sync speech transcript with search query
  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setSearchQuery('');
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

  const handleAnalysis = async () => {
    if (!searchQuery.trim()) return;

    setIsAnalyzing(true);
    setAiResponse('');
    setNonLegalMessage('');

    // Stop listening if currently active
    if (isListening) {
      stopListening();
    }

    try {
      const geminiService = getGeminiService();
      const selectedLangCode = getGeminiLanguageCode(selectedLanguage);

      // Validate if content is law-related
      const isLegalContent = await geminiService.validateLegalContent(searchQuery);

      if (!isLegalContent) {
        const message = selectedLangCode === 'hi'
          ? 'कृपया कानून से संबंधित बात करें। मैं विशेष रूप से केवल कानूनी मामलों में सहायता के लिए डिज़ाइन किया गया हूँ। कृपया कानूनी अधिकार, विवाद, उल्लंघन, अनुबंध, या कोई भी कानूनी मुद्दा साझा करें।'
          : 'Please talk related to law. I\'m specifically designed to help with legal matters only. Please share a law-related concern such as legal rights, disputes, violations, contracts, or any legal issue you\'re facing.';
        setNonLegalMessage(message);
        setIsAnalyzing(false);
        return;
      }

      const result = await geminiService.getInputAssistance(
        searchQuery,
        'Dashboard quick legal consultation. Provide brief legal guidance and suggest next steps.',
        selectedLangCode
      );
      setAiResponse(result);
    } catch (error) {
      console.error('Dashboard AI analysis failed:', error);
      const errorMessage = getGeminiLanguageCode(selectedLanguage) === 'hi'
        ? 'इस समय एआई सहायता प्रदान करने में असमर्थ। कृपया फिर से कोशिश करें या नीचे दी गई हमारी विशेष कानूनी सेवाओं का उपयोग करें।'
        : 'Unable to provide AI assistance at the moment. Please try again or use our specialized legal services below.';
      setAiResponse(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isAnalyzing && searchQuery.trim()) {
      e.preventDefault();
      handleAnalysis();
    }
  };

  return (
    <AppLayout userType="client">
      <div className="h-full flex flex-col">

        {/* Welcome Section */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to Your Legal Portal
          </h1>
        </div>

        {/* Voice Search Section */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              AI-Powered Legal Assistant
            </h3>
            <p className="text-slate-600 mb-6">
              Describe your legal issue in your preferred language using voice or text
            </p>

            {/* Language Selection */}
            <div className="flex justify-center mb-4">
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
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
                <Input
                  placeholder={getGeminiLanguageCode(selectedLanguage) === 'hi'
                    ? "यहाँ अपना कानूनी मुद्दा बताएं... (विश्लेषण के लिए Enter दबाएं)"
                    : "Describe your legal issue here... (Press Enter to analyze)"
                  }
                  value={searchQuery + (interimTranscript ? ` ${interimTranscript}` : '')}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-16 h-14 text-lg"
                />
                <Button
                  onClick={handleVoiceToggle}
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
                onClick={handleAnalysis}
                disabled={!searchQuery.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
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
                  {getGeminiLanguageCode(selectedLanguage) === 'hi'
                    ? 'रिकॉर्ड हो रहा है... अपने कानूनी मुद्दे के बारे में स्पष्ट रूप से बोलें'
                    : 'Recording... Speak clearly about your legal issue'
                  }
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
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{speechError}</span>
              </div>
            )}

            {/* AI Response Section */}
            {nonLegalMessage && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-900 mb-2">Legal Assistance Only</h4>
                    <p className="text-amber-800">{nonLegalMessage}</p>
                    <Button
                      onClick={() => {
                        setNonLegalMessage('');
                        setSearchQuery('');
                      }}
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

            {aiResponse && !nonLegalMessage && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-2">AI Legal Guidance</h4>
                    <p className="text-blue-800 whitespace-pre-wrap">{aiResponse}</p>
                    <div className="mt-3 flex space-x-2">
                      <Button
                        onClick={() => {
                          setAiResponse('');
                          setSearchQuery('');
                        }}
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        New Question
                      </Button>
                      <Link to="/dashboard/client/legal-rights">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          Detailed Analysis
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Legal Services</TabsTrigger>
            <TabsTrigger value="cases">My Cases</TabsTrigger>
            <TabsTrigger value="consultation">Book Consultation</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {legalServices.map((service, index) => (
                <Link key={index} to={service.path}>
                  <Card className="h-full p-8 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:border-blue-200 group">
                    <div className="flex items-start space-x-4 h-full">
                      <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-100 transition-colors duration-300 flex-shrink-0">
                        {service.icon}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed flex-1">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">My Cases</h2>
              <Button className="bg-slate-900 hover:bg-slate-800">
                <FileText className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </div>

            <div className="space-y-4">
              {recentCases.map((case_) => (
                <Card key={case_.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{case_.title}</h3>
                        <Badge
                          variant={case_.status === 'Completed' ? 'default' : 'secondary'}
                          className={`${case_.priority === 'high' ? 'bg-red-100 text-red-800' :
                            case_.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}
                        >
                          {case_.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Last updated {case_.lastUpdate}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                Book Legal Consultation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Full Name
                    </label>
                    <Input placeholder="Enter your full name" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Phone Number
                    </label>
                    <Input placeholder="+91 XXXXX XXXXX" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Legal Domain
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                      <option>Criminal Law</option>
                      <option>Civil Law</option>
                      <option>Family Law</option>
                      <option>Corporate Law</option>
                      <option>Consumer Protection</option>
                      <option>Property Law</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Preferred Date & Time
                    </label>
                    <Input type="datetime-local" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Consultation Type
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                      <option>Video Call</option>
                      <option>Phone Call</option>
                      <option>In-Person Meeting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Case Description
                    </label>
                    <Textarea
                      placeholder="Briefly describe your legal issue..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Button variant="outline">Save Draft</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}