import React, { useState, useEffect } from 'react';
import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Textarea } from '../../../shared/components/ui/textarea';
import { Badge } from '../../../shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { getGeminiService } from '../../../shared/services/geminiService';
import { useSpeechRecognition, SUPPORTED_LANGUAGES, getGeminiLanguageCode } from '../../../shared/hooks/useSpeechRecognition';
import { useNotification } from '../../../shared/hooks/useNotification';
import {
  Home,
  Phone,
  AlertTriangle,
  Clock,
  Shield,
  Users,
  FileText,
  MessageSquare,
  Video,
  Zap,
  ShieldAlert,
  Heart,
  UserX,
  Building,
  Gavel,
  Brain,
  Loader2,
  Mic,
  MicOff,
  Languages,
  Volume2,
  Send
} from 'lucide-react';

interface EmergencyServicesProps {
  onNavigate: (screen: string) => void;
}

export default function EmergencyServices({ onNavigate }: EmergencyServicesProps) {
  const [selectedEmergency, setSelectedEmergency] = useState('');
  const [emergencyDetails, setEmergencyDetails] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [aiGuidance, setAiGuidance] = useState<string>('');
  const [nonLegalMessage, setNonLegalMessage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [loadingMessage, setLoadingMessage] = useState('');

  // Notification hook for user feedback
  const notify = useNotification();

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

  // Update emergency details with live transcript
  useEffect(() => {
    if (transcript && transcript.trim()) {
      setEmergencyDetails(transcript);
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
    'Dispatching emergency legal ninjas... They\'re on their way! 🥷',
    'Activating superhero lawyer mode... Cape not included! 🦸‍⚖️',
    'Calling the legal emergency hotline... They put us on hold! ☎️',
    'Summoning the legal cavalry... Horses are tired! 🐎',
    'Loading emergency justice protocols... System overloaded! ⚡',
    'Consulting the emergency legal handbook... Pages are stuck! 📖',
    'Deploying rapid response legal team... Stuck in traffic! 🚗',
    'Activating legal emergency beacon... Signal is weak! 📡',
    'Launching emergency legal missiles... Target acquired! 🚀',
    'Powering up the justice generator... Please stand by! ⚡',
    'Opening emergency legal vault... Key is missing! 🔐',
    'Alerting the legal emergency squad... They\'re having coffee! ☕'
  ];

  const getRandomLoadingMessage = () => {
    return sarcasticLoadingMessages[Math.floor(Math.random() * sarcasticLoadingMessages.length)];
  };

  const emergencyCategories = [
    {
      id: 'arrest',
      name: 'Arrest/Detention',
      icon: <ShieldAlert className="h-6 w-6" />,
      description: 'Wrongful arrest, police detention, custody issues',
      urgency: 'Critical',
      color: 'red'
    },
    {
      id: 'domestic-violence',
      name: 'Domestic Violence',
      icon: <Heart className="h-6 w-6" />,
      description: 'Immediate protection needed from domestic abuse',
      urgency: 'Critical',
      color: 'red'
    },
    {
      id: 'harassment',
      name: 'Harassment/Threats',
      icon: <UserX className="h-6 w-6" />,
      description: 'Physical threats, stalking, workplace harassment',
      urgency: 'High',
      color: 'orange'
    },
    {
      id: 'property-seizure',
      name: 'Property Seizure',
      icon: <Building className="h-6 w-6" />,
      description: 'Illegal property seizure, eviction issues',
      urgency: 'High',
      color: 'orange'
    },
    {
      id: 'court-proceedings',
      name: 'Urgent Court Matter',
      icon: <Gavel className="h-6 w-6" />,
      description: 'Court hearing, bail application, injunction',
      urgency: 'High',
      color: 'orange'
    },
    {
      id: 'other',
      name: 'Other Emergency',
      icon: <AlertTriangle className="h-6 w-6" />,
      description: 'Other urgent legal matters requiring immediate attention',
      urgency: 'Medium',
      color: 'yellow'
    }
  ];

  const emergencyContacts = [
    {
      type: 'Primary Emergency Hotline',
      number: '+91 62302-44977',
      available: '24/7',
      description: 'Immediate legal assistance and consultation'
    },
    {
      type: 'Police Emergency',
      number: '100',
      available: '24/7',
      description: 'For immediate police assistance'
    },
    {
      type: 'Women Helpline',
      number: '181',
      available: '24/7',
      description: 'Women in distress, domestic violence'
    },
    {
      type: 'National Legal Services',
      number: '15100',
      available: '24/7',
      description: 'Free legal aid and services'
    }
  ];

  const legalRights = [
    {
      title: 'Right to Legal Representation',
      description: 'You have the right to a lawyer at all stages of legal proceedings'
    },
    {
      title: 'Right to Remain Silent',
      description: 'You are not obligated to answer questions without legal counsel present'
    },
    {
      title: 'Right to Know Charges',
      description: 'You must be informed of the specific charges against you'
    },
    {
      title: 'Right to Bail',
      description: 'In most cases, you have the right to apply for bail'
    },
    {
      title: 'Right to Medical Attention',
      description: 'You have the right to medical care if injured or unwell'
    },
    {
      title: 'Right to Contact Family',
      description: 'You can contact family members and inform them of your situation'
    }
  ];

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleEmergencyAnalysis = async () => {
    if (!emergencyDetails.trim() || !selectedEmergency) return;

    // Stop listening if currently active
    if (isListening) {
      stopListening();
    }

    // Show sarcastic loading message with delay
    setLoadingMessage(getRandomLoadingMessage());
    setIsAnalyzing(true);
    setNonLegalMessage(''); // Clear any previous non-legal message
    setAiGuidance(''); // Clear any previous guidance

    // Add a 3-4 second delay with fun loading messages
    await new Promise(resolve => setTimeout(resolve, 3500));
    try {
      const geminiService = getGeminiService();

      // Validate if content is law-related for emergency services
      const isLegalContent = await geminiService.validateLegalContent(emergencyDetails);

      if (!isLegalContent) {
        setNonLegalMessage(getLanguageText(
          'Please talk related to law. This is an emergency legal assistance service. Please describe a legal emergency such as arrest, domestic violence, legal threats, property disputes, or any urgent legal situation requiring immediate legal guidance.',
          'कृपया कानून से संबंधित बात करें। यह एक आपातकालीन कानूनी सहायता सेवा है। कृपया कोई कानूनी आपातकाल जैसे गिरफ्तारी, घरेलू हिंसा, कानूनी धमकी, संपत्ति विवाद, या तत्काल कानूनी मार्गदर्शन की आवश्यकता वाली किसी भी स्थिति का वर्णन करें।'
        ));
        setAiGuidance('');
        setIsAnalyzing(false);
        return;
      }

      const selectedLangCode = getGeminiLanguageCode(selectedLanguage);
      const result = await geminiService.getInputAssistance(
        emergencyDetails,
        `Emergency Legal Situation: ${selectedEmergency}. Provide immediate guidance and next steps. Respond in ${selectedLangCode === 'hi' ? 'Hindi' : 'English'}.`
      );
      setAiGuidance(result);
    } catch (error) {
      console.error('Emergency analysis failed:', error);
      setAiGuidance(getLanguageText(
        'Unable to provide AI guidance at the moment. Please contact emergency services directly.',
        'इस समय AI मार्गदर्शन प्रदान करने में असमर्थ। कृपया सीधे आपातकालीन सेवाओं से संपर्क करें।'
      ));
    } finally {
      setIsAnalyzing(false);
      setLoadingMessage('');
    }
  };

  const handleSubmitEmergency = () => {
    // In a real app, this would trigger immediate legal assistance
    notify.success('Emergency request submitted! A legal expert will contact you within 5 minutes.');
  };

  return (
    <div className="h-full bg-slate-50">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Emergency Legal Services Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Emergency Alert Banner */}
        <Card className="p-6 mb-8 border-red-200 bg-red-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-600 rounded-full">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-800 mb-2">24/7 Emergency Legal Assistance</h2>
              <p className="text-red-700">
                If you're in immediate danger, call police (100) first. For urgent legal matters,
                our emergency legal team is available round the clock.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={() => handleEmergencyCall('+916230244977')}
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Emergency Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Emergency Category Selection */}
            <Card className="p-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                Select Emergency Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyCategories.map((category) => (
                  <Card
                    key={category.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedEmergency === category.id
                      ? `ring-2 ${category.color === 'red' ? 'ring-red-500 bg-red-50' :
                        category.color === 'orange' ? 'ring-orange-500 bg-orange-50' :
                          'ring-yellow-500 bg-yellow-50'
                      }`
                      : ''
                      }`}
                    onClick={() => setSelectedEmergency(category.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${category.color === 'red' ? 'bg-red-100 text-red-600' :
                        category.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-slate-900">{category.name}</h4>
                          <Badge
                            variant={category.urgency === 'Critical' ? 'destructive' : 'secondary'}
                            className={`text-xs ${category.color === 'red' ? 'bg-red-100 text-red-800' :
                              category.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {category.urgency}
                          </Badge>
                        </div>
                        <p className="text-slate-600 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Know Your Rights - GRID STYLE */}
            <Card className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Know Your Legal Rights
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {legalRights.map((right, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="text-base font-medium text-slate-800">
                      {right.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {right.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>


            {/* Emergency Details Form */}
            {selectedEmergency && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                  Emergency Details
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Your Name *
                      </label>
                      <Input
                        placeholder="Enter your full name"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        placeholder="+91 XXXXX XXXXX"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Current Location *
                    </label>
                    <Input
                      placeholder="City, State or specific address"
                      value={contactInfo.location}
                      onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      {getLanguageText('Describe Your Emergency *', 'अपनी आपातकालीन स्थिति का वर्णन करें *')}
                    </label>
                    <div className="relative">
                      <Textarea
                        placeholder={getLanguageText(
                          "Please provide detailed information about your legal emergency. Include what happened, when it occurred, who is involved, and what immediate help you need... (Press Enter for AI guidance)",
                          "कृपया अपनी कानूनी आपातकालीन स्थिति के बारे में विस्तृत जानकारी प्रदान करें। क्या हुआ, कब हुआ, कौन शामिल है, और आपको तुरंत किस मदद की जरूरत है... (AI मार्गदर्शन के लिए Enter दबाएं)"
                        )}
                        className="min-h-[120px] pr-24"
                        value={emergencyDetails}
                        onChange={(e) => setEmergencyDetails(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && selectedEmergency && emergencyDetails.trim()) {
                            e.preventDefault();
                            handleEmergencyAnalysis();
                          }
                        }}
                      />
                      {/* Voice and Analyze Buttons */}
                      <div className="absolute right-2 top-2 flex space-x-2">
                        <Button
                          onClick={handleVoiceToggle}
                          size="sm"
                          className={`p-2 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-800'
                            }`}
                          title={isListening ? 'Stop recording' : 'Start voice input'}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>

                        <Button
                          onClick={handleEmergencyAnalysis}
                          disabled={!selectedEmergency || !emergencyDetails.trim() || loadingMessage !== ''}
                          size="sm"
                          className="p-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Get emergency legal guidance"
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
                          {getLanguageText('Recording... Speak clearly about your emergency', 'रिकॉर्डिंग... अपनी आपातकालीन स्थिति के बारे में स्पष्ट रूप से बोलें')}
                        </span>
                      </div>
                    )}

                    {/* Sarcastic Loading Message */}
                    {loadingMessage && (
                      <div className="flex items-center justify-center space-x-2 text-red-600 mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">{loadingMessage}</span>
                      </div>
                    )}

                    {/* Non-Legal Message Section */}
                    {nonLegalMessage && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-amber-900 mb-2">
                              Emergency Legal Services Only
                            </h4>
                            <p className="text-amber-800">{nonLegalMessage}</p>
                            <Button
                              onClick={() => {
                                setNonLegalMessage('');
                                setEmergencyDetails('');
                              }}
                              variant="outline"
                              size="sm"
                              className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                            >
                              Ask Legal Emergency Question
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Guidance Section */}
                    {(aiGuidance || isAnalyzing) && !nonLegalMessage && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          {isAnalyzing ? (
                            <Loader2 className="h-5 w-5 text-blue-600 animate-spin mt-0.5" />
                          ) : (
                            <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-900 mb-2">
                              {isAnalyzing ? 'Analyzing Emergency...' : 'AI Emergency Guidance'}
                            </h4>
                            {isAnalyzing ? (
                              <p className="text-blue-700">Getting immediate legal guidance for your emergency...</p>
                            ) : (
                              <p className="text-blue-800 whitespace-pre-wrap">{aiGuidance}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleSubmitEmergency}
                      disabled={!contactInfo.name || !contactInfo.phone || !emergencyDetails}
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 flex-1"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Submit Emergency Request
                    </Button>
                    <Button
                      onClick={() => handleEmergencyCall('+916230244977')}
                      size="lg"
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call Directly
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Emergency Contacts
              </h3>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 text-sm">{contact.type}</h4>
                      <Badge variant="outline" className="text-xs">
                        {contact.available}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-xs mb-2">{contact.description}</p>
                    <Button
                      size="sm"
                      className="w-full bg-slate-900 hover:bg-slate-800"
                      onClick={() => handleEmergencyCall(contact.number)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.number}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}