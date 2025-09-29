import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Phone,
  Shield,
  CreditCard,
  Truck,
  Star,
  Clock,
  DollarSign,
  ArrowRight,
  Mic,
  MicOff,
  Loader2,
  HelpCircle,
  Languages,
  Volume2,
  Send
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getGeminiService } from '../services/geminiService';
import type { LegalAnalysisResponse } from '../services/geminiService';
import { useSpeechRecognition, SUPPORTED_LANGUAGES, getGeminiLanguageCode } from '../hooks/useSpeechRecognition';

interface ConsumerRightsCheckerProps {
  onNavigate: (screen: string) => void;
}

export default function ConsumerRightsChecker({ onNavigate }: ConsumerRightsCheckerProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [nonLegalMessage, setNonLegalMessage] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [loadingMessage, setLoadingMessage] = useState('');

  // Speech recognition hook
  const {
    isListening,
    transcript,
    confidence,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  // Update issue description with live transcript
  useEffect(() => {
    if (transcript && transcript.trim()) {
      setIssueDescription(transcript);
    }
  }, [transcript]);

  const sarcasticLoadingMessages = [
    'Reviewing consumer protection laws... This might take forever ⚖️',
    'Calling the customer service complaint department... Please hold! 📞',
    'Calculating how much companies owe you... Cha-ching! 💰',
    'Summoning the Consumer Protection Gods... They\'re busy! 👑',
    'Teaching AI about "The customer is always right"... 🤖',
    'Checking warranty fine print with a magnifying glass... 🔍',
    'Consulting the ancient art of getting refunds... Abracadabra! ✨',
    'Loading consumer karma points... You deserve better! ⭐',
    'Asking Karen for advice on complaint strategies... 💁‍♀️',
    'Calculating corporate guilt levels... Off the charts! 📈',
    'Searching for your receipt in the digital void... Found it! 🎯',
    'Teaching robots about human disappointment... Error 404! 😤'
  ];

  const getRandomLoadingMessage = () => {
    return sarcasticLoadingMessages[Math.floor(Math.random() * sarcasticLoadingMessages.length)];
  };

  const consumerCategories = [
    {
      id: 'product-defect',
      name: 'Defective Product',
      icon: <ShoppingCart className="h-5 w-5" />,
      description: 'Product quality issues, manufacturing defects'
    },
    {
      id: 'service-deficiency',
      name: 'Service Deficiency',
      icon: <Shield className="h-5 w-5" />,
      description: 'Poor service quality, incomplete services'
    },
    {
      id: 'billing-fraud',
      name: 'Billing/Fraud Issues',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Incorrect billing, unauthorized charges'
    },
    {
      id: 'delivery-issues',
      name: 'Delivery Problems',
      icon: <Truck className="h-5 w-5" />,
      description: 'Late delivery, damaged items, non-delivery'
    },
    {
      id: 'warranty-repair',
      name: 'Warranty/Repair',
      icon: <FileText className="h-5 w-5" />,
      description: 'Warranty claims, repair service issues'
    },
    {
      id: 'refund-return',
      name: 'Refund/Return',
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Return policy violations, refund delays'
    }
  ];

  const handleAnalysis = async () => {
    if (!selectedCategory || !issueDescription.trim()) {
      alert('Please select a category and describe your issue.');
      return;
    }
    
    // Show sarcastic loading message with delay
    setLoadingMessage(getRandomLoadingMessage());
    setCurrentStep(3);
    setNonLegalMessage(''); // Clear any previous non-legal message
    setAnalysisResult(null); // Clear any previous results
    
    // Add a 3-4 second delay with fun loading messages
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    try {
      const geminiService = getGeminiService();
      
      // Validate if content is consumer/legal-related
      const isLegalContent = await geminiService.validateLegalContent(issueDescription);
      
      if (!isLegalContent) {
        setNonLegalMessage('Please talk related to law. I\'m designed to help with legal matters, particularly consumer rights issues. Please describe a consumer-related problem such as defective products, unfair business practices, billing disputes, warranty issues, or any consumer rights violation, and I\'ll provide legal analysis.');
        setAnalysisResult(null);
        return;
      }
      
      // Stop listening if currently active
      if (isListening) {
        stopListening();
      }

      const selectedLangCode = getGeminiLanguageCode(selectedLanguage);
      const result = await geminiService.analyzeConsumerRights({
        type: 'consumer-rights',
        content: `Category: ${selectedCategory}\n\nIssue Description: ${issueDescription}`,
        context: {
          category: selectedCategory,
          jurisdiction: 'India',
          urgency: 'medium',
          language: selectedLangCode
        }
      });
      
      // Transform Gemini response to match component's expected format
      const transformedResult = {
        violationType: selectedCategory,
        severity: result.severity || 'Medium',
        applicableLaws: result.applicableLaws || ['Consumer Protection Act 2019'],
        yourRights: result.yourRights || [
          'Right to seek replacement or refund',
          'Right to compensation for deficiency',
          'Right to approach Consumer Commission'
        ],
        immediateActions: result.immediateActions || [
          'Document the issue with photos/videos',
          'Contact customer service in writing',
          'Keep all purchase receipts and communications'
        ],
        legalRemedies: result.legalRemedies || [
          {
            type: 'District Consumer Commission',
            applicableFor: 'Claims up to ₹1 Crore',
            timeframe: '90-150 days',
            cost: '₹500 - ₹5,000'
          }
        ],
        expectedOutcome: result.expectedOutcome || {
          compensation: 'Varies by case',
          timeframe: '3-6 months',
          successRate: 'Contact for assessment'
        },
        analysis: result.analysis,
        confidence: result.confidence || 80
      };
      
      setAnalysisResult(transformedResult);
    } catch (error) {
      console.error('Consumer rights analysis failed:', error);
      
      // Fallback to basic analysis if AI fails
      const fallbackResult = {
        violationType: selectedCategory,
        severity: 'Medium',
        applicableLaws: ['Consumer Protection Act 2019', 'Sale of Goods Act 1930'],
        yourRights: [
          'Right to seek replacement or refund',
          'Right to compensation for deficiency',
          'Right to approach Consumer Commission',
          'Right to file complaint within 2 years'
        ],
        immediateActions: [
          'Document the issue with photos/videos',
          'Contact customer service in writing',
          'Keep all purchase receipts and communications',
          'Set reasonable deadline for resolution'
        ],
        legalRemedies: [
          {
            type: 'District Consumer Commission',
            applicableFor: 'Claims up to ₹1 Crore',
            timeframe: '90-150 days',
            cost: '₹500 - ₹5,000'
          }
        ],
        expectedOutcome: {
          compensation: 'Contact for estimate',
          timeframe: '3-6 months',
          successRate: 'Varies by case'
        },
        analysis: 'AI analysis temporarily unavailable. Our consumer rights experts are available to help you.',
        confidence: 75
      };
      
      setAnalysisResult(fallbackResult);
    } finally {
      setLoadingMessage('');
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getLanguageText = (enText: string, hiText: string) => {
    return selectedLanguage === 'hi-IN' ? hiText : enText;
  };

  if (nonLegalMessage) {
    return (
      <div className="h-full bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <Card className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Consumer Legal Rights Only</h2>
              <p className="text-lg text-slate-600 mb-6">
                {nonLegalMessage}
              </p>
              <div className="space-y-3">
                <p className="text-slate-500">
                  <strong>Examples of consumer issues I can help with:</strong>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                  <div>• "Defective product received"</div>
                  <div>• "Billing disputes"</div>
                  <div>• "Warranty issues"</div>
                  <div>• "Service deficiency"</div>
                  <div>• "False advertising"</div>
                  <div>• "Refund problems"</div>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setNonLegalMessage('');
                  setIssueDescription('');
                  setCurrentStep(1);
                }} 
                className="mt-6 bg-blue-600 hover:bg-blue-700"
              >
                Ask Consumer Rights Question
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="h-full bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Consumer Rights Analysis Report
            </h1>
            <p className="text-slate-600">
              Based on your issue, here's your comprehensive consumer rights analysis
            </p>
          </div>

          <Tabs defaultValue="rights" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rights">Your Rights</TabsTrigger>
              <TabsTrigger value="actions">Immediate Actions</TabsTrigger>
              <TabsTrigger value="legal">Legal Remedies</TabsTrigger>
              <TabsTrigger value="complaint">File Complaint</TabsTrigger>
            </TabsList>

            <TabsContent value="rights" className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Your Consumer Rights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {analysisResult.yourRights.map((right: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <span className="text-slate-700">{right}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-3">Applicable Laws</h3>
                    <div className="space-y-2">
                      {analysisResult.applicableLaws.map((law: string, index: number) => (
                        <Badge key={index} variant="outline" className="block w-fit">
                          {law}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Immediate Actions to Take</h2>
                <div className="space-y-4">
                  {analysisResult.immediateActions.map((action: string, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-2">Time Limit Important</h3>
                      <p className="text-yellow-700">
                        Consumer complaints must be filed within 2 years of the cause of action. 
                        Don't delay in taking action to protect your rights.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Legal Remedy Options</h2>
                <div className="space-y-6">
                  {analysisResult.legalRemedies.map((remedy: any, index: number) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">{remedy.type}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Applicable For:</span>
                          <p className="font-medium text-slate-900">{remedy.applicableFor}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Timeframe:</span>
                          <p className="font-medium text-slate-900">{remedy.timeframe}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Filing Cost:</span>
                          <p className="font-medium text-slate-900">{remedy.cost}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Expected Outcome</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-green-600 text-sm">Potential Compensation:</span>
                      <p className="font-bold text-green-800">{analysisResult.expectedOutcome.compensation}</p>
                    </div>
                    <div>
                      <span className="text-green-600 text-sm">Expected Timeframe:</span>
                      <p className="font-bold text-green-800">{analysisResult.expectedOutcome.timeframe}</p>
                    </div>
                    <div>
                      <span className="text-green-600 text-sm">Success Rate:</span>
                      <p className="font-bold text-green-800">{analysisResult.expectedOutcome.successRate}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="complaint" className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">File Consumer Complaint</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Consumer Name
                      </label>
                      <Input placeholder="Enter your full name" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Mobile Number
                      </label>
                      <Input placeholder="+91 XXXXX XXXXX" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Email Address
                      </label>
                      <Input type="email" placeholder="your.email@example.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Transaction Amount
                      </label>
                      <Input type="number" placeholder="Enter amount in ₹" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Company/Seller Name
                      </label>
                      <Input placeholder="Name of the company" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Transaction Date
                      </label>
                      <Input type="date" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Preferred Commission
                      </label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option>District Consumer Commission</option>
                        <option>State Consumer Commission</option>
                        <option>National Consumer Commission</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Complaint Details
                      </label>
                      <Textarea 
                        placeholder="Detailed description of your complaint... (Press Enter to analyze)"
                        className="min-h-[100px]"
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && selectedCategory && issueDescription.trim()) {
                            e.preventDefault();
                            handleAnalysis();
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-3">Required Documents</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-sm text-slate-700">• Purchase Receipt</div>
                    <div className="text-sm text-slate-700">• Product Photos</div>
                    <div className="text-sm text-slate-700">• Communication Records</div>
                    <div className="text-sm text-slate-700">• Identity Proof</div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-4">
                  <Button variant="outline">Save Draft</Button>
                  <Button className="bg-green-600 hover:bg-green-700 px-8">
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Complaint
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-center space-x-4">
            <Button variant="outline" onClick={() => {
              setAnalysisResult(null);
              setNonLegalMessage('');
              setIssueDescription('');
              setCurrentStep(1);
            }}>
              New Analysis
            </Button>
            <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => onNavigate('client')}>
              Return to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full mb-6">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Consumer Protection Service
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Consumer Rights Checker
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Protect your consumer rights with expert guidance. Get instant analysis of your situation 
            and step-by-step assistance for filing complaints.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <Card className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
              Select Your Issue Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {consumerCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategory === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-slate-100 rounded-xl">
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                      <p className="text-slate-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={!selectedCategory}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
              {getLanguageText('Describe Your Issue', 'अपनी समस्या का वर्णन करें')}
            </h2>

            {/* Language Selection */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Languages className="h-5 w-5 text-slate-600" />
                <Select value={selectedLanguage} onValueChange={(value: 'en-IN' | 'hi-IN') => setSelectedLanguage(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-IN">🇮🇳 English (India)</SelectItem>
                    <SelectItem value="hi-IN">🇮🇳 हिंदी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Speech Recognition Status */}
              <div className="flex items-center space-x-2">
                {isListening && (
                  <>
                    <Volume2 className="h-4 w-4 text-red-500 animate-pulse" />
                    <span className="text-sm text-red-600 font-medium">
                      {getLanguageText('Listening...', 'सुन रहा है...')}
                    </span>
                  </>
                )}
                {speechError && (
                  <span className="text-sm text-red-500">
                    {getLanguageText('Speech error: ', 'भाषण त्रुटि: ')}{speechError}
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-slate-900 mb-4">
                  {getLanguageText('Tell us what happened in detail', 'विस्तार से बताएं कि क्या हुआ')}
                </label>
                
                {/* Live Transcript Display */}
                {(transcript || isListening) && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mic className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">
                        {getLanguageText('Live Transcript', 'लाइव प्रतिलेख')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">
                      {transcript || getLanguageText('Start speaking...', 'बोलना शुरू करें...')}
                    </p>
                    {confidence > 0 && (
                      <div className="mt-2 text-xs text-slate-500">
                        {getLanguageText('Confidence: ', 'विश्वास: ')}{Math.round(confidence * 100)}%
                      </div>
                    )}
                  </div>
                )}
                <div className="relative">
                  <Textarea
                    placeholder={getLanguageText(
                      "Please provide as much detail as possible about your consumer issue. Include dates, amounts, company names, and what you've tried so far... (Press Enter to analyze)",
                      "कृपया अपनी उपभोक्ता समस्या के बारे में यथासंभव विस्तार से बताएं। तारीखें, राशि, कंपनी के नाम और आपने अब तक क्या कोशिश की है... (विश्लेषण के लिए Enter दबाएं)"
                    )}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && selectedCategory && issueDescription.trim()) {
                        e.preventDefault();
                        handleAnalysis();
                      }
                    }}
                    className="min-h-[200px] pr-24 text-base"
                  />
                  {/* Voice and Analyze Buttons */}
                  <div className="absolute right-2 top-2 flex space-x-2">
                    <Button
                      onClick={handleVoiceToggle}
                      size="sm"
                      className={`p-2 ${
                        isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-800'
                      }`}
                      title={isListening ? 'Stop recording' : 'Start voice input'}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      onClick={handleAnalysis}
                      disabled={!selectedCategory || !issueDescription.trim() || loadingMessage !== ''}
                      size="sm"
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Analyze consumer issue"
                    >
                      {loadingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mt-2">
                  <span className="text-blue-600">
                    {getLanguageText('Press Ctrl+Enter to analyze', 'विश्लेषण के लिए Ctrl+Enter दबाएं')}
                  </span> {getLanguageText('or click Continue to proceed', 'या जारी रखने के लिए Continue पर क्लिक करें')}
                </p>
                
                {isListening && (
                  <div className="flex items-center justify-center space-x-2 text-red-600 mt-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-sm">
                      {getLanguageText('Recording... Speak clearly about your consumer issue', 'रिकॉर्डिंग... अपनी उपभोक्ता समस्या के बारे में स्पष्ट रूप से बोलें')}
                    </span>
                  </div>
                )}

                {/* Sarcastic Loading Message */}
                {loadingMessage && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">{loadingMessage}</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">
                  {getLanguageText('Tips for Better Analysis', 'बेहतर विश्लेषण के लिए सुझाव')}
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• {getLanguageText('Include specific dates and transaction amounts', 'विशिष्ट तारीखें और लेनदेन राशि शामिल करें')}</li>
                  <li>• {getLanguageText('Mention the company or seller name', 'कंपनी या विक्रेता का नाम बताएं')}</li>
                  <li>• {getLanguageText('Describe what you\'ve already tried to resolve the issue', 'बताएं कि आपने समस्या हल करने के लिए क्या कोशिश की है')}</li>
                  <li>• {getLanguageText('Include any communication you\'ve had with the company', 'कंपनी के साथ आपकी किसी भी बातچیत को शामिल करें')}</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-8">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                {getLanguageText('Back', 'वापस')}
              </Button>
              <Button 
                onClick={handleAnalysis}
                disabled={!issueDescription.trim()}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                {getLanguageText('Analyze Issue', 'समस्या का विश्लेषण करें')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}