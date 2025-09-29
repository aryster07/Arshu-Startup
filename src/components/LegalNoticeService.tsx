import React, { useState, useEffect } from 'react';
import { FileText, Clock, Send, CheckCircle, AlertTriangle, Scale, Gavel, Users, Mail, Brain, Loader2, Mic, MicOff, Languages, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getGeminiService } from '../services/geminiService';
import { useSpeechRecognition, SUPPORTED_LANGUAGES, getGeminiLanguageCode } from '../hooks/useSpeechRecognition';

interface LegalNoticeServiceProps {
  onNavigate?: (screen: string) => void;
}

export default function LegalNoticeService({ onNavigate }: LegalNoticeServiceProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    recipientName: '',
    recipientAddress: '',
    noticeType: '',
    urgency: '',
    description: '',
    documents: ''
  });
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  // Update description with live transcript
  useEffect(() => {
    if (transcript && transcript.trim()) {
      setFormData(prev => ({ ...prev, description: transcript }));
    }
  }, [transcript]);

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

  const sarcasticLoadingMessages = [
    'Drafting the most intimidating legal notice... Lawyers are trembling! ⚖️',
    'Consulting the ancient art of legal intimidation... Very scary! 👻',
    'Loading legal jargon generator... Preparing big words! 📚',
    'Summoning the spirits of past legal victories... They\'re busy! 👨‍⚖️',
    'Teaching AI to sound more lawyerly... Objection sustained! 🔨',
    'Calculating maximum legal drama potential... Off the charts! 📈',
    'Accessing the vault of legal threats... Password protected! 🔐',
    'Channeling inner lawyer energy... Billing by the hour! 💰',
    'Loading professional sternness module... Very serious! 😤',
    'Consulting the legal notice hall of fame... Legendary! 🏆',
    'Brewing the perfect storm of legalese... Almost ready! ⛈️',
    'Activating maximum legal authority mode... Please comply! 📜'
  ];

  const getRandomLoadingMessage = () => {
    return sarcasticLoadingMessages[Math.floor(Math.random() * sarcasticLoadingMessages.length)];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIAnalysis = async () => {
    if (!formData.description.trim() || !formData.noticeType) return;
    
    // Stop listening if currently active
    if (isListening) {
      stopListening();
    }
    
    // Show sarcastic loading message with delay
    setLoadingMessage(getRandomLoadingMessage());
    setIsAnalyzing(true);
    
    // Add a 3-4 second delay with fun loading messages
    await new Promise(resolve => setTimeout(resolve, 3500));
    try {
      const geminiService = getGeminiService();
      
      // Validate if content is law-related for legal notices
      const isLegalContent = await geminiService.validateLegalContent(formData.description);
      
      if (!isLegalContent) {
        setAiSuggestions('Please talk related to law. This legal notice service is designed for legal matters only. Please describe a legal issue such as contract breaches, payment disputes, property matters, or other legal concerns that require formal legal notice.');
        setIsAnalyzing(false);
        return;
      }
      
      const result = await geminiService.getInputAssistance(
        formData.description,
        `Legal Notice - ${formData.noticeType}. Provide suggestions for notice content and legal considerations.`
      );
      setAiSuggestions(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAiSuggestions('Unable to provide AI suggestions at the moment. Please proceed with manual drafting.');
    } finally {
      setIsAnalyzing(false);
      setLoadingMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Legal Notice Request:', formData);
    alert('Your legal notice request has been submitted. Our team will review and contact you within 2 hours.');
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      recipientName: '',
      recipientAddress: '',
      noticeType: '',
      urgency: '',
      description: '',
      documents: ''
    });
  };

  const noticeTypes = [
    {
      type: "Payment Recovery",
      description: "For unpaid dues, loan recovery, or outstanding payments",
      timeline: "2-3 days",
      price: "₹2,500 - ₹5,000"
    },
    {
      type: "Contract Breach",
      description: "For violation of contractual terms and conditions",
      timeline: "3-5 days",
      price: "₹3,000 - ₹7,000"
    },
    {
      type: "Property Disputes",
      description: "For illegal possession, boundary disputes, or property issues",
      timeline: "3-7 days",
      price: "₹4,000 - ₹8,000"
    },
    {
      type: "Employment Issues",
      description: "For wrongful termination, salary disputes, or workplace harassment",
      timeline: "2-4 days",
      price: "₹2,500 - ₹6,000"
    },
    {
      type: "Cheque Bouncing",
      description: "For dishonored cheques under Section 138 of Negotiable Instruments Act",
      timeline: "1-2 days",
      price: "₹3,000 - ₹5,000"
    },
    {
      type: "Consumer Disputes",
      description: "For defective products, poor service, or consumer rights violation",
      timeline: "2-3 days",
      price: "₹2,000 - ₹4,000"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Consultation & Assessment",
      description: "Our legal experts review your case details and assess the legal merits",
      duration: "30 minutes"
    },
    {
      step: 2,
      title: "Notice Drafting",
      description: "Professional drafting of legally sound notice with appropriate legal provisions",
      duration: "1-2 days"
    },
    {
      step: 3,
      title: "Review & Approval",
      description: "Client review and approval of the drafted legal notice",
      duration: "2-4 hours"
    },
    {
      step: 4,
      title: "Dispatch & Service",
      description: "Proper legal service of notice through registered post and courier",
      duration: "1 day"
    },
    {
      step: 5,
      title: "Follow-up & Support",
      description: "Monitoring response and providing next-step legal advice",
      duration: "Ongoing"
    }
  ];

  return (
    <div className="h-full bg-white">
      {/* Notice Types Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Types of Legal Notices</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional legal notice services for various types of disputes with transparent pricing and quick turnaround.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticeTypes.map((notice, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                  <Gavel className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-4">{notice.type}</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">{notice.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Timeline:</span>
                    <span className="font-medium text-slate-900">{notice.timeline}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Price Range:</span>
                    <span className="font-medium text-green-600">{notice.price}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={() => document.getElementById('notice-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Request This Notice
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Process</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Streamlined process to ensure quick, professional, and legally sound legal notice services.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="font-bold text-white">{step.step}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-2">{step.description}</p>
                <p className="text-blue-600 font-medium text-xs">{step.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Notice Request Form */}
      <section id="notice-form" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Legal Notice</h2>
            <p className="text-xl text-slate-600">
              Fill out the form below to get your professional legal notice drafted and served.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 mb-2">Your Full Name *</label>
                  <Input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="bg-white border-slate-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-2">Your Phone Number *</label>
                  <Input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="bg-white border-slate-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Your Email Address *</label>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="bg-white border-slate-200 focus:border-blue-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 mb-2">Type of Legal Notice *</label>
                  <Select value={formData.noticeType} onValueChange={(value: string) => handleInputChange('noticeType', value)}>
                    <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500">
                      <SelectValue placeholder="Select notice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Payment Recovery</SelectItem>
                      <SelectItem value="contract">Contract Breach</SelectItem>
                      <SelectItem value="property">Property Disputes</SelectItem>
                      <SelectItem value="employment">Employment Issues</SelectItem>
                      <SelectItem value="cheque">Cheque Bouncing</SelectItem>
                      <SelectItem value="consumer">Consumer Disputes</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-2">Urgency Level *</label>
                  <Select value={formData.urgency} onValueChange={(value: string) => handleInputChange('urgency', value)}>
                    <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency (Within 24 hours)</SelectItem>
                      <SelectItem value="urgent">Urgent (Within 48 hours)</SelectItem>
                      <SelectItem value="normal">Normal (Within 3-5 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Recipient Name & Details *</label>
                <Input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="Name of person/company to receive notice"
                  required
                  className="bg-white border-slate-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Recipient Address *</label>
                <Textarea
                  value={formData.recipientAddress}
                  onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                  placeholder="Complete address of the recipient including city, state, and pin code"
                  required
                  rows={3}
                  className="bg-white border-slate-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">
                  {getLanguageText('Detailed Description of Issue *', 'मुद्दे का विस्तृत विवरण *')}
                </label>
                <div className="relative">
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && formData.description.trim() && formData.noticeType) {
                        e.preventDefault();
                        handleAIAnalysis();
                      }
                    }}
                    placeholder={getLanguageText(
                      "Please provide detailed information about your dispute, including dates, amounts, and any relevant background information... (Press Enter for AI suggestions)",
                      "कृपया अपने विवाद के बारे में विस्तृत जानकारी प्रदान करें, जिसमें तारीखें, राशि और कोई भी प्रासंगिक पृष्ठभूमि की जानकारी शामिल हो... (AI सुझावों के लिए Enter दबाएं)"
                    )}
                    required
                    rows={5}
                    className="bg-white border-slate-200 focus:border-blue-500 pr-24"
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
                      onClick={handleAIAnalysis}
                      disabled={!formData.noticeType || !formData.description.trim() || loadingMessage !== ''}
                      size="sm"
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Get AI suggestions"
                    >
                      {loadingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Speech Status */}
                {isListening && (
                  <div className="flex items-center justify-center space-x-2 text-red-600 mt-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-sm">
                      {getLanguageText('Recording... Speak clearly about your legal issue', 'रिकॉर्डिंग... अपने कानूनी मुद्दे के बारे में स्पष्ट रूप से बोलें')}
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
                
                {/* AI Suggestions Section */}
                {(aiSuggestions || isAnalyzing) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      {isAnalyzing ? (
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin mt-0.5" />
                      ) : (
                        <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-2">
                          {isAnalyzing ? 'Analyzing Notice Requirements...' : 'AI Legal Notice Suggestions'}
                        </h4>
                        {isAnalyzing ? (
                          <p className="text-blue-700">Getting suggestions for your legal notice...</p>
                        ) : (
                          <p className="text-blue-800 whitespace-pre-wrap">{aiSuggestions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Supporting Documents</label>
                <Textarea
                  value={formData.documents}
                  onChange={(e) => handleInputChange('documents', e.target.value)}
                  placeholder="List any supporting documents you have (contracts, invoices, correspondence, etc.). You can email these separately after form submission."
                  rows={3}
                  className="bg-white border-slate-200 focus:border-blue-500"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">Important Information</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Legal notice fees are separate from consultation charges</li>
                      <li>• Final pricing depends on complexity and urgency of the case</li>
                      <li>• Our team will contact you within 2 hours to discuss details</li>
                      <li>• All information provided is kept strictly confidential</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Legal Notice Request
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our Legal Notice Services?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional expertise, quick turnaround, and comprehensive support for all your legal notice requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">Expert Legal Team</h3>
              <p className="text-slate-600 leading-relaxed">
                Experienced advocates with expertise in drafting legally sound notices across all practice areas.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">Quick Turnaround</h3>
              <p className="text-slate-600 leading-relaxed">
                Fast processing with emergency services available for urgent legal notice requirements.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">End-to-End Service</h3>
              <p className="text-slate-600 leading-relaxed">
                Complete service from drafting to proper legal service with follow-up support and guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need Immediate Legal Notice Service?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our emergency legal notice service is available 24/7. Get your notice drafted and served within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={() => window.location.href = 'tel:+916230244977'}
            >
              Emergency Service: +91 62302-44977
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-slate-300 text-white hover:bg-slate-800 px-8"
              onClick={() => onNavigate?.('contact')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}