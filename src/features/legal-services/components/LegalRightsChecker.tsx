import React, { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/button';
import { Card } from '../../../shared/components/ui/card';
import { Input } from '../../../shared/components/ui/input';
import { Textarea } from '../../../shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Badge } from '../../../shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { useSpeechRecognition, SUPPORTED_LANGUAGES, getGeminiLanguageCode } from '../../../shared/hooks/useSpeechRecognition';
import { getGeminiService } from '../../../shared/services/geminiService';
import {
    Mic,
    MicOff,
    Volume2,
    Languages,
    Scale,
    AlertTriangle,
    CheckCircle,
    FileText,
    Shield,
    Users,
    Clock,
    BookOpen,
    Brain,
    Zap,
    Target,
    Loader2,
    Send
} from 'lucide-react';

// Custom styles to ensure active tab styling works - same as dashboard components
const customTabStyles = `
  .custom-tab-trigger[data-state="active"] {
    background-color: white !important;
    color: rgb(37 99 235) !important;
    border-color: rgb(59 130 246) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
    font-weight: 600 !important;
    transform: scale(1.02) !important;
  }
`;

interface LegalRightsCheckerProps {
    onNavigate: (screen: string) => void;
}

interface LegalAnalysisResult {
    rights: Array<{
        title: string;
        description: string;
        importance: 'high' | 'medium' | 'low';
    }>;
    violations: Array<{
        law: string;
        description: string;
        severity: 'high' | 'medium' | 'low';
    }>;
    remedies: Array<{
        action: string;
        description: string;
        timeline: string;
    }>;
    nextSteps: string[];
    legalReferences: Array<{
        law: string;
        section: string;
        description: string;
    }>;
    riskAssessment: {
        overall: 'high' | 'medium' | 'low';
        factors: string[];
    };
    summary: string;
}

export default function LegalRightsChecker({ onNavigate }: LegalRightsCheckerProps) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [analysisText, setAnalysisText] = useState('');
    const [analysisResult, setAnalysisResult] = useState<LegalAnalysisResult | null>(null);
    const [nonLegalMessage, setNonLegalMessage] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [loadingMessage, setLoadingMessage] = useState('');

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

    const legalCategories = [
        { id: 'employment', name: 'Employment Law', icon: <Users className="h-5 w-5" />, description: 'Workplace issues, termination, harassment' },
        { id: 'property', name: 'Property Rights', icon: <Shield className="h-5 w-5" />, description: 'Real estate, landlord-tenant disputes' },
        { id: 'consumer', name: 'Consumer Protection', icon: <Target className="h-5 w-5" />, description: 'Product defects, service issues, refunds' },
        { id: 'family', name: 'Family Law', icon: <Users className="h-5 w-5" />, description: 'Marriage, divorce, custody, inheritance' },
        { id: 'criminal', name: 'Criminal Law', icon: <AlertTriangle className="h-5 w-5" />, description: 'Criminal charges, police matters' },
        { id: 'contract', name: 'Contract Disputes', icon: <FileText className="h-5 w-5" />, description: 'Breach of contract, agreements' },
        { id: 'civil', name: 'Civil Rights', icon: <Scale className="h-5 w-5" />, description: 'Discrimination, civil liberties' },
        { id: 'other', name: 'Other Legal Issues', icon: <BookOpen className="h-5 w-5" />, description: 'General legal matters' }
    ];

    const sarcasticLoadingMessages = [
        'Reading all the law books... This might take a while ⚖️',
        'Consulting with our imaginary legal team... 👨‍⚖️',
        'Checking if this is actually legal... Plot twist incoming! 🎭',
        'Summoning the ghost of justice... BOO! 👻',
        'Teaching AI what "objection" means... Overruled! 🔨',
        'Converting legalese to human language... Good luck! 🤖',
        'Calculating your chances... Loading disappointment... 📊',
        'Asking ChatGPT\'s lawyer cousin for advice... 🤝',
        'Analyzing the fine print... Spoiler: There\'s always fine print! 📄',
        'Checking precedents... Googling similar cases... 🔍'
    ];

    const handleAnalysis = async () => {
        if (!analysisText.trim()) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);
        setNonLegalMessage('');

        // Show sarcastic loading messages every 6-7 seconds
        const messageInterval = setInterval(() => {
            const randomMessage = sarcasticLoadingMessages[Math.floor(Math.random() * sarcasticLoadingMessages.length)];
            setLoadingMessage(randomMessage);
        }, 6000 + Math.random() * 1000); // Random delay between 6-7 seconds

        try {
            const geminiService = getGeminiService();
            const selectedLangCode = getGeminiLanguageCode(selectedLanguage);

            // First validate if this is legal content
            const isLegalContent = await geminiService.validateLegalContent(analysisText);
            if (!isLegalContent) {
                setNonLegalMessage('Please provide a legal issue or question. This service is designed for legal rights analysis. Please describe legal matters such as employment disputes, property issues, consumer complaints, family law matters, or other legal concerns.');
                return;
            }

            // Enhanced prompt for comprehensive AI analysis
            const enhancedPrompt = `
      You are an expert Indian legal analyst. Analyze this case and provide structured JSON response.
      
      Case: ${analysisText}
      Category: ${selectedCategory || 'general'}
      
      RESPOND ONLY IN THIS EXACT JSON FORMAT:
      {
        "analysis": "Detailed case summary (2-3 sentences)",
        "severity": "High|Medium|Low",
        "confidence": 90,
        "violations": [
          {
            "type": "Specific violation name",
            "severity": "High|Medium|Low", 
            "description": "Detailed description",
            "applicableLaws": ["IPC Section XXX", "Act Name"],
            "recommendedAction": "Immediate action needed"
          }
        ],
        "yourRights": [
          "Article 21 - Right to Life and Personal Liberty",
          "Article 22 - Protection against arrest",
          "Right to legal representation under Section 303 CrPC"
        ],
        "legalRemedies": [
          "File FIR under relevant IPC sections",
          "Apply for anticipatory bail under Section 438 CrPC",
          "Engage criminal defense lawyer"
        ],
        "recommendedActions": [
          "Contact police immediately",
          "Hire criminal defense lawyer",
          "Gather evidence and witnesses",
          "Apply for bail if arrested"
        ],
        "applicableLaws": [
          "Indian Penal Code Section 302 - Murder",
          "Code of Criminal Procedure Section 438 - Anticipatory Bail",
          "Indian Constitution Article 22 - Protection against arrest"
        ],
        "nextSteps": [
          "Immediate surrender to police",
          "Contact family and lawyer",
          "Prepare bail application",
          "Document all evidence"
        ]
      }
      
      For criminal cases: Include specific IPC sections, CrPC provisions, constitutional rights
      For civil cases: Include CPC provisions, specific acts, limitation periods
      For consumer cases: Include Consumer Protection Act sections, forum jurisdiction
      
      Provide REAL legal analysis with SPECIFIC sections and ACTUAL remedies.
      `;

            const result = await geminiService.analyzeLegalRights({
                type: 'legal-rights',
                content: enhancedPrompt,
                context: {
                    category: selectedCategory || 'general',
                    jurisdiction: 'India',
                    urgency: 'medium',
                    language: selectedLangCode
                }
            });

            // Parse the AI response and structure it properly
            let summary = '';
            let rightsArray: Array<{ title: string, description: string, importance: 'high' | 'medium' | 'low' }> = [];
            let violationsArray: Array<{ law: string, description: string, severity: 'high' | 'medium' | 'low' }> = [];
            let remediesArray: Array<{ action: string, description: string, timeline: string }> = [];
            let nextStepsArray: string[] = [];
            let legalRefsArray: Array<{ law: string, section: string, description: string }> = [];

            if (result) {
                // Use the structured AI response
                summary = result.analysis || 'Legal analysis completed successfully.';

                // Map violations from AI response
                if (result.violations && result.violations.length > 0) {
                    violationsArray = result.violations.map(v => ({
                        law: v.applicableLaws?.[0] || v.type || 'Legal Violation',
                        description: v.description || 'Legal violation identified',
                        severity: (v.severity?.toLowerCase() || 'medium') as 'high' | 'medium' | 'low'
                    }));
                }

                // Map remedies from AI response
                if (result.legalRemedies && result.legalRemedies.length > 0) {
                    remediesArray = result.legalRemedies.map((remedy, index) => ({
                        action: `Legal Action ${index + 1}`,
                        description: remedy,
                        timeline: result.timeframe || 'To be determined'
                    }));
                }

                // Map next steps
                if (result.nextSteps && result.nextSteps.length > 0) {
                    nextStepsArray = result.nextSteps;
                } else if (result.recommendedActions && result.recommendedActions.length > 0) {
                    nextStepsArray = result.recommendedActions;
                }

                // Map legal references from applicable laws
                if (result.applicableLaws && result.applicableLaws.length > 0) {
                    legalRefsArray = result.applicableLaws.map(law => ({
                        law: law,
                        section: 'Applicable provisions',
                        description: `Relevant legal framework for this case`
                    }));
                }

                // Map rights based on analysis
                if (result.yourRights && result.yourRights.length > 0) {
                    rightsArray = result.yourRights.map(right => ({
                        title: 'Legal Right',
                        description: right,
                        importance: 'high' as const
                    }));
                } else {
                    // Generate rights based on the case
                    rightsArray = [
                        {
                            title: 'Right to Legal Representation',
                            description: 'You have the right to legal counsel and representation in this matter.',
                            importance: 'high' as const
                        },
                        {
                            title: 'Right to Fair Legal Process',
                            description: 'You are entitled to due process and fair treatment under Indian law.',
                            importance: 'high' as const
                        }
                    ];
                }
            }

            // Structure the result properly - only use AI-generated data
            const structuredResult: LegalAnalysisResult = {
                summary: summary || 'AI analysis in progress. Please ensure the AI service is properly configured.',
                rights: rightsArray,
                violations: violationsArray,
                remedies: remediesArray,
                nextSteps: nextStepsArray,
                legalReferences: legalRefsArray,
                riskAssessment: {
                    overall: (result.severity?.toLowerCase() || 'medium') as 'low' | 'medium' | 'high',
                    factors: result.recommendedActions || ['AI analysis required']
                }
            };

            setAnalysisResult(structuredResult);
        } catch (error) {
            console.error('Error analyzing legal rights:', error);
            // Show error message instead of hardcoded fallback
            setNonLegalMessage('AI analysis service is currently unavailable. Please check your internet connection and AI service configuration, then try again.');
        } finally {
            clearInterval(messageInterval);
            setIsAnalyzing(false);
            setLoadingMessage('');
        }
    };

    useEffect(() => {
        if (transcript) setAnalysisText(transcript);
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
        if (isListening) stopListening();
    };

    const transformedLanguages = SUPPORTED_LANGUAGES.map(lang => ({
        code: lang.code,
        name: lang.name,
        nativeName: lang.name
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (analysisText.trim() && !isAnalyzing) {
            handleAnalysis();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (analysisText.trim() && !isAnalyzing) {
                handleAnalysis();
            }
        }
    };

    const LegalAnalysisDisplay = ({ result }: { result: LegalAnalysisResult }) => (
        <div className="mt-6">
            {/* Inject custom styles for tab styling */}
            <style dangerouslySetInnerHTML={{ __html: customTabStyles }} />

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex flex-wrap lg:flex-nowrap w-full h-auto gap-2 bg-slate-100 p-2 rounded-xl">
                    <TabsTrigger
                        value="overview"
                        className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 lg:flex-none rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="violations"
                        className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 lg:flex-none rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
                    >
                        Violations
                    </TabsTrigger>
                    <TabsTrigger
                        value="rights"
                        className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 lg:flex-none rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
                    >
                        Rights
                    </TabsTrigger>
                    <TabsTrigger
                        value="remedies"
                        className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 lg:flex-none rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
                    >
                        Remedies
                    </TabsTrigger>
                    <TabsTrigger
                        value="steps"
                        className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-3 lg:px-4 flex-1 lg:flex-none rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
                    >
                        Next Steps
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-4">
                    <Card className="p-4 md:p-6 bg-blue-50 border-blue-200">
                        <div className="flex items-center mb-4">
                            <h3 className="text-lg md:text-xl font-semibold flex items-center">
                                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                                Legal Analysis Overview
                            </h3>
                        </div>
                        <div className="bg-white rounded-lg p-3 md:p-4 max-h-64 overflow-y-auto border border-blue-200">
                            <p className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line break-words overflow-hidden">
                                {result.summary.length > 800 ? result.summary.substring(0, 800) + '...' : result.summary}
                            </p>
                        </div>
                    </Card>
                </TabsContent>

                {/* Violations Tab */}
                <TabsContent value="violations" className="mt-4">
                    <Card className="p-4 md:p-6 bg-red-50 border-red-200">
                        <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                            Laws Violated
                        </h3>
                        {result.violations.length > 0 ? (
                            <div className="space-y-3">
                                {result.violations.map((violation, index) => (
                                    <div key={index} className="bg-white border border-red-200 rounded-lg p-3 md:p-4 overflow-hidden">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                                            <h5 className="font-semibold text-red-900 text-sm md:text-base break-words overflow-hidden max-w-full">{violation.law.length > 80 ? violation.law.substring(0, 80) + '...' : violation.law}</h5>
                                            <Badge
                                                variant={violation.severity === 'high' ? 'destructive' : 'secondary'}
                                                className="text-xs w-fit shrink-0"
                                            >
                                                {violation.severity.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-red-800 text-sm md:text-base leading-relaxed break-words overflow-hidden max-w-full">
                                            {violation.description.length > 200 ? violation.description.substring(0, 200) + '...' : violation.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <AlertTriangle className="h-12 w-12 text-red-300 mx-auto mb-3" />
                                <p className="text-slate-600 text-base md:text-lg font-medium">No Legal Violations Identified</p>
                                <p className="text-slate-500 text-sm mt-2 break-words">The AI analysis did not identify any specific legal violations in your case. This could mean your situation may not involve legal violations, or you may need to provide more details.</p>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* Rights Tab */}
                <TabsContent value="rights" className="mt-4">
                    <Card className="p-4 md:p-6 bg-blue-50 border-blue-200">
                        <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-blue-600" />
                            Your Legal Rights
                        </h3>
                        {result.rights.length > 0 ? (
                            <div className="space-y-4">
                                {result.rights.map((right, index) => (
                                    <div key={index} className="bg-white border-l-4 border-blue-500 rounded p-3 md:p-4 overflow-hidden">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                                            <h4 className="font-semibold text-slate-900 text-sm md:text-base break-words overflow-hidden max-w-full">{right.title.length > 80 ? right.title.substring(0, 80) + '...' : right.title}</h4>
                                            <Badge
                                                variant={right.importance === 'high' ? 'destructive' :
                                                    right.importance === 'medium' ? 'default' : 'secondary'}
                                                className="text-xs w-fit shrink-0"
                                            >
                                                {right.importance.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-slate-700 text-sm md:text-base leading-relaxed break-words overflow-hidden max-w-full">
                                            {right.description.length > 200 ? right.description.substring(0, 200) + '...' : right.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Shield className="h-12 w-12 text-blue-300 mx-auto mb-3" />
                                <p className="text-slate-600 text-base md:text-lg font-medium">No Specific Rights Identified</p>
                                <p className="text-slate-500 text-sm mt-2 break-words">The AI analysis couldn't identify specific legal rights for your case. Try providing more details about your situation for better analysis.</p>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* Remedies Tab */}
                <TabsContent value="remedies" className="mt-4">
                    <Card className="p-4 md:p-6 bg-green-50 border-green-200">
                        <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                            <Scale className="h-5 w-5 mr-2 text-green-600" />
                            Available Remedies
                        </h3>
                        <div className="space-y-4">
                            {result.remedies.length > 0 ? (
                                result.remedies.map((remedy, index) => (
                                    <div key={index} className="bg-white border border-green-200 rounded-lg p-3 md:p-4 overflow-hidden">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                                            <h4 className="font-semibold text-green-900 text-sm md:text-base break-words overflow-hidden max-w-full">{remedy.action.length > 100 ? remedy.action.substring(0, 100) + '...' : remedy.action}</h4>
                                            <Badge variant="outline" className="text-xs border-green-300 text-green-700 w-fit shrink-0">
                                                {remedy.timeline}
                                            </Badge>
                                        </div>
                                        <p className="text-green-800 text-sm md:text-base leading-relaxed break-words overflow-hidden max-w-full">
                                            {remedy.description.length > 200 ? remedy.description.substring(0, 200) + '...' : remedy.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Scale className="h-12 w-12 text-green-300 mx-auto mb-3" />
                                    <p className="text-slate-600 text-lg font-medium">No Legal Remedies Available</p>
                                    <p className="text-slate-500 text-sm mt-2">The AI couldn't identify specific legal remedies for your case. Consider consulting with a legal professional for personalized advice.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                {/* Next Steps Tab */}
                <TabsContent value="steps" className="mt-4">
                    <Card className="p-4 md:p-6 bg-yellow-50 border-yellow-200">
                        <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                            Next Steps
                        </h3>
                        {result.nextSteps.length > 0 ? (
                            <ul className="space-y-3">
                                {result.nextSteps.map((step, index) => (
                                    <li key={index} className="flex items-start space-x-3 bg-white p-3 md:p-4 rounded border border-yellow-200 overflow-hidden">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="text-slate-700 flex-1 text-sm md:text-base leading-relaxed break-words overflow-hidden max-w-full">
                                            {step.length > 150 ? step.substring(0, 150) + '...' : step}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <Clock className="h-12 w-12 text-yellow-300 mx-auto mb-3" />
                                <p className="text-slate-600 text-lg font-medium">No Next Steps Provided</p>
                                <p className="text-slate-500 text-sm mt-2">The AI couldn't determine specific next steps for your case. Please provide more details or consult with a legal expert.</p>
                            </div>
                        )}

                        {/* Legal References in Next Steps tab */}
                        {result.legalReferences.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-yellow-300">
                                <h4 className="font-semibold mb-3 flex items-center text-purple-900">
                                    <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                                    Legal References
                                </h4>
                                <div className="space-y-3">
                                    {result.legalReferences.map((ref, index) => (
                                        <div key={index} className="bg-white border border-purple-200 rounded-lg p-3">
                                            <div className="flex items-start justify-between mb-1">
                                                <h5 className="font-semibold text-purple-900 text-sm">{ref.law}</h5>
                                                <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                                                    {ref.section}
                                                </Badge>
                                            </div>
                                            <p className="text-purple-800 text-sm">{ref.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Single Container for All Input */}
                <div className="max-w-4xl mx-auto">
                    <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Language Selector */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    <Languages className="h-4 w-4 inline mr-2" />
                                    Select Language
                                </label>
                                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose your language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {transformedLanguages.map((lang) => (
                                            <SelectItem key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Input Field with Microphone - Dashboard Style */}
                            <div>
                                <label htmlFor="legal-issue" className="block text-sm font-medium text-slate-700 mb-3">
                                    Describe your legal issue or question
                                    <span className="text-xs text-slate-500 ml-2">(Press Enter to analyze)</span>
                                </label>
                                <div className="flex gap-4">
                                    <div className="flex-1 relative">
                                        <Textarea
                                            id="legal-issue"
                                            value={transcript || analysisText}
                                            onChange={(e) => setAnalysisText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Describe your legal issue..."
                                            className="min-h-[80px] pr-12 text-sm resize-none border border-slate-300 rounded-md"
                                            disabled={isAnalyzing}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVoiceToggle}
                                            disabled={!isSpeechSupported}
                                            className={`absolute right-2 top-2 p-1.5 rounded-sm transition-colors ${isListening
                                                    ? 'text-red-600 hover:text-red-700'
                                                    : 'text-slate-600 hover:text-slate-800'
                                                } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            title={!isSpeechSupported ? 'Speech recognition not supported' :
                                                isListening ? 'Stop recording' : 'Start voice input'}
                                        >
                                            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                        </button>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 h-10"
                                        disabled={!analysisText.trim() || isAnalyzing}
                                    >
                                        {isAnalyzing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="h-3 w-3 mr-1" />
                                                Analyze
                                            </>
                                        )}
                                    </Button>
                                </div>

                            </div>

                            {/* Status Messages - Dashboard Style */}
                            {isListening && (
                                <div className="flex items-center justify-center gap-2 text-red-600 py-2">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                    <span className="text-xs">Recording... Speak clearly</span>
                                </div>
                            )}

                            {/* Interim Speech Transcript */}
                            {interimTranscript && (
                                <div className="text-xs text-slate-500 italic py-2">
                                    {interimTranscript}
                                </div>
                            )}

                            {speechError && (
                                <div className="text-xs text-red-600 py-2">
                                    {speechError}
                                </div>
                            )}

                            {/* Legal Categories (Optional) - Hidden on Mobile */}
                            <div className="hidden md:block">
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    <Scale className="h-4 w-4 inline mr-2" />
                                    Legal Category (Optional)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {legalCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            className={`h-auto p-4 flex flex-col items-center space-y-2 text-center border-3 rounded-lg cursor-pointer transition-colors font-semibold ${selectedCategory === category.id
                                                    ? "bg-yellow-400 text-black border-yellow-600 shadow-lg"
                                                    : "bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200 hover:border-gray-500"
                                                }`}
                                            onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                                        >
                                            {category.icon}
                                            <span className="text-sm font-bold">{category.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>

                        {/* Loading Message */}
                        {isAnalyzing && loadingMessage && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <p className="text-blue-700 font-medium">{loadingMessage}</p>
                            </div>
                        )}

                        {/* Non-Legal Content Message */}
                        {nonLegalMessage && (
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-yellow-800 mb-1">Legal Content Required</h3>
                                        <p className="text-yellow-700">{nonLegalMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Analysis Results */}
                        {analysisResult && <LegalAnalysisDisplay result={analysisResult} />}

                        {/* Help Section - Show when no analysis */}
                        {!analysisResult && !isAnalyzing && !nonLegalMessage && (
                            <div className="mt-6 space-y-4">
                                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                                    <div className="text-center mb-6">
                                        <Scale className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Legal Rights Analysis Tool</h3>
                                        <p className="text-slate-600">Get comprehensive legal guidance for your situation</p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                                            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                            <h4 className="font-semibold text-slate-900 mb-1">Legal Violations</h4>
                                            <p className="text-sm text-slate-600">Identify laws and regulations that may be violated in your case</p>
                                        </div>

                                        <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                                            <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                            <h4 className="font-semibold text-slate-900 mb-1">Your Rights</h4>
                                            <p className="text-sm text-slate-600">Constitutional and legal rights available to protect you</p>
                                        </div>

                                        <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                            <h4 className="font-semibold text-slate-900 mb-1">Legal Remedies</h4>
                                            <p className="text-sm text-slate-600">Available legal actions and procedures for your situation</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-yellow-50 border-yellow-200">
                                    <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                                        <Brain className="h-5 w-5 mr-2" />
                                        How It Works
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-yellow-900">📝 Describe Your Issue</h4>
                                            <p className="text-yellow-800">Explain your legal situation in detail. Be specific about what happened, when, and who was involved.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-yellow-900">🎯 Select Category</h4>
                                            <p className="text-yellow-800">Choose the most relevant legal category to get more targeted analysis.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-yellow-900">🔍 AI Analysis</h4>
                                            <p className="text-yellow-800">Our AI analyzes Indian law to identify violations, rights, and remedies specific to your case.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-yellow-900">⚖️ Legal Guidance</h4>
                                            <p className="text-yellow-800">Get comprehensive legal guidance including next steps and applicable laws.</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-slate-50 border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                                        <FileText className="h-5 w-5 mr-2" />
                                        Example Legal Issues
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-2">Criminal Law</h4>
                                            <ul className="space-y-1 text-slate-700">
                                                <li>• Theft, robbery, or fraud cases</li>
                                                <li>• Assault or harassment incidents</li>
                                                <li>• Cyber crimes and online fraud</li>
                                                <li>• Domestic violence cases</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-2">Civil Law</h4>
                                            <ul className="space-y-1 text-slate-700">
                                                <li>• Property disputes and land issues</li>
                                                <li>• Contract breaches and agreements</li>
                                                <li>• Family law and divorce matters</li>
                                                <li>• Employment and workplace issues</li>
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}