import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { getGeminiService } from '../../services/geminiService';
import type { LegalAnalysisResponse } from '../../services/geminiService';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
// import { useNotification } from '../../hooks/useNotification'; // Removed for now
import { 
  Shield, 
  ShoppingCart, 
  FileText, 
  Phone, 
  Scale, 
  Mic, 
  MicOff, 
  Send, 
  Languages,
  Brain,
  Zap,
  Target,
  MessageSquare,
  CheckCircle,
  Calendar,
  Clock,
  User,
  Menu,
  X,
  Home,
  Settings,
  LogOut
} from 'lucide-react';

// Mobile-First Layout Component
function MobileLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/client' },
    { icon: Shield, label: 'Legal Rights', path: '/dashboard/client/legal-rights' },
    { icon: ShoppingCart, label: 'Consumer Rights', path: '/dashboard/client/consumer-rights' },
    { icon: FileText, label: 'Document Review', path: '/dashboard/client/document-review' },
    { icon: Phone, label: 'Emergency Help', path: '/dashboard/client/emergency' },
    { icon: Settings, label: 'Settings', path: '/dashboard/client/settings' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Mobile Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Legal Portal</h1>
              <p className="text-xs text-slate-600">Welcome back!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[70]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-center p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Navigation</h2>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 text-slate-600" />
                    <span className="text-slate-700 font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full flex items-center justify-start space-x-3 p-3 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 pb-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Mobile AI Assistant Component
function MobileAIAssistant() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LegalAnalysisResponse | null>(null);
  const [error, setError] = useState<string>('');

  // Speech recognition hook
  const {
    isSupported: isSpeechSupported,
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    language: 'en-US',
    continuous: true,
    interimResults: true,
    autoDetectLanguage: true
  });

  // Update query with speech transcript
  useEffect(() => {
    if (transcript) {
      setQuery(prev => prev + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleAnalysis = async () => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setError('');
    
    try {
      const geminiService = getGeminiService();
      
      // Validate if this is legal content
      const isLegalContent = await geminiService.validateLegalContent(query);
      
      if (!isLegalContent) {
        setError('Please ask questions related to legal matters only.');
        return;
      }

      // Perform legal analysis
      const result = await geminiService.analyzeLegalRights({
        type: 'general-consultation',
        content: query,
        context: {
          category: 'general',
          jurisdiction: 'India',
          language: 'en-US'
        }
      });

      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Brain className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Legal Assistant</h3>
        <p className="text-sm text-slate-600">Get instant legal guidance</p>
      </div>

      {/* Mobile Input */}
      <div className="space-y-3">
        <div className="relative">
          <Textarea
            placeholder="Describe your legal issue..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[100px] pr-12 text-sm resize-none"
            disabled={isAnalyzing}
          />
          <Button
            onClick={handleVoiceToggle}
            disabled={!isSpeechSupported}
            className={`absolute right-2 top-2 p-2 z-10 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'} ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!isSpeechSupported ? 'Speech recognition not supported' : isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>

        <Button 
          onClick={handleAnalysis}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!query.trim() || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Get Analysis
            </>
          )}
        </Button>
      </div>

      {/* Quick Status */}
      {isListening && (
        <div className="flex items-center justify-center space-x-2 text-red-600 mt-3">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-xs">Recording... Speak clearly</span>
        </div>
      )}

      {/* Interim Speech Transcript */}
      {interimTranscript && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 mb-1">Listening:</p>
          <p className="text-sm text-blue-800 italic">{interimTranscript}</p>
        </div>
      )}

      {/* Speech Error Message */}
      {speechError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{speechError}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-900 text-sm mb-2">Quick Analysis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {analysisResult.analysis || 'Analysis completed. Please check the detailed reports in our services for more information.'}
            </p>
          </div>
          
          {analysisResult.violations && analysisResult.violations.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-900 text-sm mb-2">Key Issues Found</h4>
              <ul className="text-xs text-amber-800 space-y-1">
                {analysisResult.violations.slice(0, 2).map((violation, index) => (
                  <li key={index}>• {violation.description}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={() => {
              setAnalysisResult(null);
              setQuery('');
            }}
            variant="outline"
            className="w-full text-xs"
          >
            New Query
          </Button>
        </div>
      )}
    </Card>
  );
}

// Mobile Services Grid
function MobileServicesGrid() {
  const services = [
    {
      title: "Legal Rights",
      description: "Check your legal rights",
      icon: <Shield className="h-5 w-5" />,
      color: "blue",
      path: '/dashboard/client/legal-rights'
    },
    {
      title: "Consumer Rights",
      description: "Consumer protection",
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "green",
      path: '/dashboard/client/consumer-rights'
    },
    {
      title: "Document Review",
      description: "Review legal documents",
      icon: <FileText className="h-5 w-5" />,
      color: "purple",
      path: '/dashboard/client/document-review'
    },
    {
      title: "Emergency Help",
      description: "24/7 legal assistance",
      icon: <Phone className="h-5 w-5" />,
      color: "red",
      path: '/dashboard/client/emergency'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200',
      red: 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {services.map((service, index) => (
        <Link key={index} to={service.path}>
          <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-opacity-50">
            <div className="text-center space-y-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-colors ${getColorClasses(service.color)}`}>
                {service.icon}
              </div>
              <div>
                <h4 className="font-medium text-slate-900 text-sm leading-tight">{service.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{service.description}</p>
              </div>
              <Button 
                size="sm" 
                className="w-full text-xs py-2"
                variant="outline"
              >
                Access
              </Button>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

// Mobile Cases List
function MobileCasesList() {
  const cases = [
    {
      id: "C001",
      title: "Property Dispute",
      status: "Active",
      lastUpdate: "2 days ago",
      priority: "high"
    },
    {
      id: "C002", 
      title: "Employment Issue",
      status: "Review",
      lastUpdate: "1 week ago",
      priority: "medium"
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">My Cases</h3>
        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-xs">
          New Case
        </Button>
      </div>

      {cases.map((case_) => (
        <Card key={case_.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-slate-900 text-sm truncate">{case_.title}</h4>
                <Badge 
                  variant={case_.status === 'Active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {case_.status}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-slate-600">
                <Clock className="h-3 w-3 mr-1" />
                {case_.lastUpdate}
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              View
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Mobile Consultation Form
function MobileConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    issue: '',
    dateTime: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [issueAnalysis, setIssueAnalysis] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Simple notification function (replaced useNotification hook)
  const notify = {
    success: (message: string) => {
      console.log('Success:', message);
      alert(message); // Simple alert for now
    }
  };

  const analyzeIssue = async () => {
    if (!formData.issue.trim()) return;

    setIsAnalyzing(true);
    try {
      const geminiService = getGeminiService();
      
      // Validate if this is legal content
      const isLegalContent = await geminiService.validateLegalContent(formData.issue);
      
      if (!isLegalContent) {
        setIssueAnalysis({
          error: 'Please describe a legal issue for consultation preparation.'
        });
        return;
      }

      // Analyze the issue for consultation preparation
      const result = await geminiService.analyzeLegalRights({
        type: 'general-consultation',
        content: formData.issue,
        context: {
          category: 'consultation-prep',
          jurisdiction: 'India',
          language: 'en-US'
        }
      });

      setIssueAnalysis({
        category: 'General Legal Matter',
        urgency: result.emergencyRequired ? 'High' : 'Normal',
        preparation: result.recommendedActions?.slice(0, 3) || [
          'Gather all relevant documents',
          'Prepare timeline of events',
          'List specific questions you want answered'
        ]
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setIssueAnalysis({
        error: 'Analysis failed. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBooking = async () => {
    setIsBooking(true);
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      notify.success('Consultation booking request submitted successfully! We will contact you soon.');
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Book Consultation</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-900">Legal Issue</label>
            {formData.issue.trim() && (
              <Button
                onClick={analyzeIssue}
                disabled={isAnalyzing}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                {isAnalyzing ? 'Analyzing...' : 'AI Prep'}
              </Button>
            )}
          </div>
          <Textarea
            value={formData.issue}
            onChange={(e) => setFormData({...formData, issue: e.target.value})}
            className="min-h-[80px] text-sm resize-none"
            placeholder="Briefly describe your legal issue..."
          />
        </div>

        {/* AI Analysis Result */}
        {issueAnalysis && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            {issueAnalysis.error ? (
              <p className="text-sm text-red-600">{issueAnalysis.error}</p>
            ) : (
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900 text-sm">Consultation Preparation</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium text-blue-800">Category:</span>
                    <p className="text-blue-700">{issueAnalysis.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Priority:</span>
                    <Badge variant={issueAnalysis.urgency === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                      {issueAnalysis.urgency}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-blue-800 text-xs">Preparation Tips:</span>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    {issueAnalysis.preparation.map((tip: string, index: number) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">Preferred Date & Time</label>
          <input
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1 text-sm">
            Save Draft
          </Button>
          <Button 
            onClick={handleBooking}
            disabled={!formData.name || !formData.phone || !formData.issue || !formData.dateTime || isBooking}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            {isBooking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Booking...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Mobile Dashboard Component
export default function ClientDashboardMobile() {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <MobileLayout>
      {/* AI Assistant Card */}
      <MobileAIAssistant />

      {/* Mobile Tab Navigation - Matches Desktop Style */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 rounded-xl">
          <TabsTrigger 
            value="services" 
            className="text-sm py-4 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-slate-200 hover:shadow-sm active:scale-95 touch-manipulation cursor-pointer"
          >
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="cases" 
            className="text-sm py-4 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-slate-200 hover:shadow-sm active:scale-95 touch-manipulation cursor-pointer"
          >
            My Cases
          </TabsTrigger>
          <TabsTrigger 
            value="consultation" 
            className="text-sm py-4 px-4 rounded-lg font-medium transition-all duration-200 hover:bg-slate-200 hover:shadow-sm active:scale-95 touch-manipulation cursor-pointer"
          >
            Book Consult
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <MobileServicesGrid />
        </TabsContent>

        <TabsContent value="cases">
          <MobileCasesList />
        </TabsContent>

        <TabsContent value="consultation">
          <MobileConsultationForm />
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
}