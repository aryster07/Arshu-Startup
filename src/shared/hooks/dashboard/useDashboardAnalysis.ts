import { useState, useEffect } from 'react';
import { getGeminiService } from '../../services/geminiService';
import { getGeminiLanguageCode } from '../useSpeechRecognition';
import { AnalysisRequest, AnalysisResponse, DashboardState } from '../../types/dashboard';
import { LOADING_MESSAGES } from '../../../core/constants/legal';
import { useDashboardSarcasticLoading } from '../useSarcasticLoadingMessages';

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
    lawyerRecommendation: null,
  });

  // Use the new sarcastic loading messages hook
  const { loadingMessage: sarcasticLoadingMessage, startAnalysisLoading, stopLoading } = useDashboardSarcasticLoading();
  
  // Debug logging
  console.log('🎭 Dashboard sarcastic message:', sarcasticLoadingMessage);
  
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

    console.log('🚀 Starting dashboard analysis for:', analysisQuery);

    updateState({ 
      isAnalyzing: true, 
      aiResponse: '', 
      briefAnalysis: '',
      detailedAnalysis: '',
      showDetailedAnalysis: false,
      nonLegalMessage: '' 
    });
    
    // Start sarcastic loading messages based on user input
    console.log('🚀 Starting analysis with sarcastic loading for:', analysisQuery);
    startAnalysisLoading(analysisQuery);

    try {
      const geminiService = getGeminiService();
      if (!geminiService) {
        throw new Error('Gemini service not available');
      }

      console.log('✅ Gemini service obtained, making API call...');

      // First get brief analysis (3-4 lines)
      const briefPrompt = `Provide a brief 3-4 line legal analysis for: "${analysisQuery}". Be concise but informative. Focus on the key legal aspects and immediate insights.`;
      
      const briefResponse = await geminiService.getInputAssistance(
        briefPrompt,
        'Brief legal consultation - 3-4 lines only',
        getGeminiLanguageCode(state.selectedLanguage)
      );

      console.log('✅ Brief analysis received:', briefResponse?.substring(0, 100) + '...');

      stopLoading();

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

      console.log('✅ Dashboard analysis completed successfully');

    } catch (error) {
      stopLoading();
      console.error('❌ Dashboard analysis error:', error);
      
      // Provide more specific fallback analysis based on error type
      let fallbackAnalysis = '';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          fallbackAnalysis = `⚠️ API Configuration Issue: Unable to connect to AI service.

However, I can provide some general guidance for: "${analysisQuery}"

• This appears to be a legal matter that requires professional attention
• Document all relevant details, dates, and evidence related to your case
• Consider consulting with a qualified legal professional for specific advice
• Review applicable laws and regulations that might apply to your situation

Click "Get Detailed Analysis" for more comprehensive guidance.`;
        } else if (error.message.includes('Model not found')) {
          fallbackAnalysis = `⚠️ Service Temporarily Unavailable: AI model is being updated.

For your query: "${analysisQuery}"

• Legal matters require careful consideration of facts and applicable laws
• Gather all relevant documentation and evidence
• Note important dates and deadlines that might affect your case
• Seek professional legal counsel for authoritative advice

Please try again in a few moments, or click "Get Detailed Analysis" for alternative guidance.`;
        } else {
          fallbackAnalysis = `⚠️ Connection Issue: Unable to process your request at this time.

Regarding: "${analysisQuery}"

• This appears to be a legal concern that deserves proper attention
• Document all facts, circumstances, and relevant parties involved
• Consider the urgency of your situation and any time-sensitive factors
• Professional legal consultation is recommended for complex matters

Please check your internet connection and try again, or click "Get Detailed Analysis" for more information.`;
        }
      } else {
        fallbackAnalysis = `Legal Issue Identified: "${analysisQuery}"

While I'm currently unable to provide AI-powered analysis, here's some general guidance:

• Document all relevant details and evidence related to your situation
• Consider the applicable laws and your legal rights in this matter
• Note any time limitations or deadlines that might apply
• Consult with a legal professional for expert guidance tailored to your case

Click "Get Detailed Analysis" for comprehensive breakdown and next steps.`;
      }
      
      console.log('Using enhanced fallback analysis due to error:', error instanceof Error ? error.message : String(error));
      updateState({
        briefAnalysis: fallbackAnalysis,
        aiResponse: fallbackAnalysis,
        isAnalyzing: false
      });
    }
  };

  const detectLawyerRecommendationWithAI = async (analysisText: string, originalQuery: string) => {
    try {
      const geminiService = getGeminiService();
      if (!geminiService) {
        return detectLawyerSpecializationFromQuery(originalQuery); // Fallback to keyword-based
      }

      console.log('🤖 Using AI to determine lawyer specialization...');

      const lawyerRecommendationPrompt = `You are a legal AI assistant. Based on the legal query and analysis provided, determine the MOST APPROPRIATE lawyer specialization.

AVAILABLE SPECIALIZATIONS (choose EXACTLY one from this list):
- Criminal Lawyer (ONLY for serious crimes: murder, rape, serious assault, major fraud, narcotics)
- General Legal Expert (for minor crimes, theft, small disputes, general legal issues)
- Civil Lawyer
- Consumer Lawyer
- Family Lawyer
- Corporate Lawyer
- Employment Lawyer
- Real Estate Lawyer
- Tax Lawyer
- Immigration Lawyer
- Constitutional Lawyer
- Intellectual Property Lawyer
- Banking & Finance Lawyer

ANALYSIS GUIDELINES:
1. For MINOR crimes (phone theft, petty theft, small fraud, cyber complaints) → Choose "General Legal Expert"
2. For SERIOUS crimes (murder, rape, major assault, serious fraud) → Choose "Criminal Lawyer"
3. For property, business, family, consumer issues → Choose the specific specialization
4. If uncertain or general legal matter → Choose "General Legal Expert"
5. Consider the SEVERITY and COMPLEXITY of the legal matter

IMPORTANT: "General Legal Expert" is appropriate for most common legal issues and minor crimes.

QUERY: "${originalQuery}"

ANALYSIS: "${analysisText}"

IMPORTANT: Respond with ONLY the exact lawyer type name from the list above. Do not include any explanation, punctuation, or additional text.

LAWYER TYPE:`;

      const aiResponse = await geminiService.getInputAssistance(
        lawyerRecommendationPrompt,
        'Lawyer specialization recommendation',
        'en'
      );

      // Clean the AI response more thoroughly
      let cleanResponse = aiResponse
        .trim()
        .replace(/^Lawyer Type:\s*/i, '') // Remove potential "Lawyer Type:" prefix
        .replace(/^\s*-\s*/, '') // Remove potential bullet point
        .replace(/\n.*$/, '') // Take only the first line
        .trim();

      console.log('🤖 AI raw response:', JSON.stringify(aiResponse));
      console.log('🤖 AI cleaned response:', JSON.stringify(cleanResponse));

      // Validate AI response against our known types
      const validTypes = [
        'Criminal Lawyer', 'General Legal Expert', 'Civil Lawyer', 'Consumer Lawyer', 'Family Lawyer',
        'Corporate Lawyer', 'Employment Lawyer', 'Real Estate Lawyer', 'Tax Lawyer',
        'Immigration Lawyer', 'Constitutional Lawyer', 'Intellectual Property Lawyer',
        'Banking & Finance Lawyer'
      ];

      // Try to find a valid type even if response has extra text
      const foundType = validTypes.find(type => 
        cleanResponse.toLowerCase().includes(type.toLowerCase())
      );

      if (foundType) {
        console.log('✅ Found valid lawyer type:', foundType);
        return foundType;
      } else {
        console.log('⚠️ AI response not in valid types, raw response:', JSON.stringify(aiResponse));
        console.log('⚠️ Valid types:', validTypes);
        console.log('⚠️ Falling back to keyword-based detection');
        return detectLawyerSpecializationFromQuery(originalQuery);
      }

    } catch (error) {
      console.error('❌ Error in AI lawyer recommendation:', error);
      console.log('🔄 Falling back to keyword-based detection for query:', originalQuery);
      const fallbackResult = detectLawyerSpecializationFromQuery(originalQuery);
      console.log('🎯 Keyword-based fallback result:', fallbackResult);
      return fallbackResult;
    }
  };

  const detectLawyerRecommendation = (analysisText: string) => {
    const text = analysisText.toLowerCase();
    
    // Common phrases that indicate lawyer recommendation
    const lawyerKeywords = [
      'contact a lawyer', 'consult a lawyer', 'hire a lawyer', 'seek legal help',
      'professional legal assistance', 'expert legal help', 'legal expert',
      'attorney', 'advocate', 'legal counsel', 'legal advice', 'legal consultation'
    ];
    
    const hasLawyerRecommendation = lawyerKeywords.some(keyword => text.includes(keyword));
    
    if (!hasLawyerRecommendation) return null;

    // This function now just checks if a lawyer is recommended, actual specialization is determined by AI
    return 'lawyer_recommended';
  };

  const detectLawyerSpecializationFromQuery = (query: string): string => {
    const text = query.toLowerCase();
    
    // Enhanced keyword detection with better coverage and specificity
    const specializations = {
      'Criminal Lawyer': [
        // Serious criminal terms only - avoid minor theft/disputes
        'murder case', 'assault case', 'robbery case', 'rape case', 'kidnapping',
        'criminal case', 'criminal defense', 'criminal charges', 'criminal court',
        'police case', 'fir filed', 'fir lodged', 'arrest warrant', 'police custody',
        'bail application', 'bail hearing', 'anticipatory bail',
        'section 420', 'section 498a', 'section 377', 'ipc section',
        'crpc', 'criminal procedure code', 'chargesheet filed',
        'narcotic case', 'criminal investigation', 'accused in case',
        'homicide', 'attempted murder', 'grievous hurt', 'criminal conspiracy'
      ],
      'General Legal Expert': [
        // Minor disputes and general issues
        'theft case', 'phone stolen', 'mobile stolen', 'wallet stolen', 'bike stolen',
        'petty theft', 'small dispute', 'minor issue', 'complaint filed',
        'cybercrime complaint', 'online fraud', 'cheating case', 'fraud case',
        'dowry harassment case', 'domestic violence case', 'neighbor dispute',
        'simple legal matter', 'legal advice needed', 'police complaint'
      ],
      'Family Lawyer': [
        // Family relationships
        'family', 'marriage', 'divorce', 'separation', 'spouse', 'husband', 'wife',
        'child custody', 'custody', 'alimony', 'maintenance', 'dowry', 'domestic',
        // Family issues
        'adoption', 'guardianship', 'inheritance', 'succession', 'will',
        'hindu marriage act', 'family court', 'matrimonial', 'conjugal rights'
      ],
      'Consumer Lawyer': [
        // Consumer specific terms
        'consumer complaint', 'consumer dispute', 'consumer rights violated',
        'product defect', 'service deficiency', 'product liability', 'warranty claim',
        'refund denied', 'replacement refused', 'defective product',
        'online shopping fraud', 'ecommerce dispute', 'delivery problem',
        'consumer protection act', 'consumer court', 'consumer forum',
        'unfair trade practice', 'misleading advertisement', 'consumer grievance'
      ],
      'Employment Lawyer': [
        // Employment specific terms
        'wrongful termination', 'workplace harassment', 'employment dispute',
        'salary not paid', 'wages dispute', 'termination notice',
        'sexual harassment at work', 'workplace discrimination',
        'labour law violation', 'employment contract breach',
        'provident fund dispute', 'gratuity not paid', 'bonus dispute',
        'industrial dispute', 'union matter', 'employment tribunal'
      ],
      'Real Estate Lawyer': [
        // Property types
        'property', 'real estate', 'land', 'house', 'flat', 'apartment', 'plot',
        'building', 'construction', 'home', 'residence',
        // Property transactions
        'builder', 'developer', 'sale deed', 'registry', 'possession',
        'rera', 'real estate regulatory authority', 'booking', 'agreement',
        // Property disputes
        'landlord', 'tenant', 'rent', 'lease', 'eviction', 'neighbor dispute'
      ],
      'Civil Lawyer': [
        // Civil matters
        'civil', 'contract', 'agreement', 'breach', 'dispute', 'damages',
        'compensation', 'injunction', 'restraint order', 'civil suit',
        // Civil procedures
        'cpc', 'civil procedure code', 'civil court', 'decree', 'judgment',
        'appeal', 'revision', 'execution', 'attachment', 'recovery'
      ],
      'Corporate Lawyer': [
        // Business entities
        'company', 'business', 'corporate', 'firm', 'partnership', 'proprietorship',
        'pvt ltd', 'limited', 'llp', 'startup', 'enterprise',
        // Corporate matters
        'compliance', 'license', 'permit', 'registration', 'incorporation',
        'merger', 'acquisition', 'securities', 'shares', 'directors',
        'gst', 'income tax', 'audit', 'mca', 'roc'
      ],
      'Tax Lawyer': [
        // Tax types
        'tax', 'income tax', 'gst', 'vat', 'service tax', 'customs', 'excise',
        'tds', 'advance tax', 'self assessment tax',
        // Tax procedures
        'return', 'assessment', 'notice', 'demand', 'refund', 'appeal',
        'penalty', 'prosecution', 'tax evasion', 'tax planning'
      ],
      'Immigration Lawyer': [
        // Immigration documents
        'visa', 'passport', 'immigration', 'emigration', 'travel', 'foreign',
        'citizenship', 'naturalization', 'oci', 'pio',
        // Immigration issues
        'deportation', 'overstay', 'visa rejection', 'embassy', 'consulate'
      ],
      'Constitutional Lawyer': [
        // Constitutional matters
        'constitutional', 'fundamental rights', 'supreme court', 'high court',
        'writ petition', 'habeas corpus', 'mandamus', 'certiorari',
        'public interest litigation', 'pil', 'judicial review'
      ],
      'Intellectual Property Lawyer': [
        // IP types
        'patent', 'trademark', 'copyright', 'design', 'intellectual property',
        'brand', 'logo', 'invention', 'software', 'technology',
        // IP issues
        'infringement', 'piracy', 'plagiarism', 'licensing', 'royalty'
      ]
    };

    // Calculate scores for each specialization based on keyword matches
    const scores: Record<string, number> = {};
    const matchDetails: Record<string, string[]> = {};
    
    for (const [specialty, keywords] of Object.entries(specializations)) {
      const matches = keywords.filter(keyword => text.includes(keyword));
      if (matches.length > 0) {
        scores[specialty] = matches.length;
        matchDetails[specialty] = matches;
      }
    }

    console.log('🔍 Keyword matching results:');
    console.log('Query text:', text);
    console.log('Scores:', scores);
    console.log('Match details:', matchDetails);

    // Return the specialization with the highest score
    if (Object.keys(scores).length > 0) {
      const bestMatch = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
      console.log('🎯 Keyword-based lawyer recommendation:', bestMatch, 'with score:', scores[bestMatch]);
      console.log('🎯 Matching keywords:', matchDetails[bestMatch]);
      return bestMatch;
    }

    console.log('🔄 No keyword matches found, defaulting to General Legal Expert');
    return 'General Legal Expert'; // Default fallback
  };

  const handleDetailedAnalysis = async () => {
    if (!state.searchQuery.trim()) return;

    console.log('🔍 Starting detailed analysis for:', state.searchQuery);

    updateState({ isLoadingDetailed: true });
    
    // Start sarcastic loading for detailed analysis
    startAnalysisLoading(`${state.searchQuery} - detailed analysis`);

    try {
      const geminiService = getGeminiService();
      if (!geminiService) {
        throw new Error('Gemini service not available');
      }

      console.log('✅ Gemini service ready for detailed analysis...');

      // Get comprehensive detailed analysis
      const detailedPrompt = `Provide a comprehensive detailed legal analysis for: "${state.searchQuery}". 

      Structure your response with the following sections:

      **1. LEGAL VIOLATIONS IDENTIFIED:**
      - List specific laws, sections, or regulations that may have been violated
      - Include relevant acts, codes, or statutes (e.g., IPC sections, Consumer Protection Act, etc.)
      - Mention both civil and criminal implications if applicable

      **2. CASE STRENGTH ASSESSMENT:**
      - Likelihood of success (High/Medium/Low with percentage if possible)
      - Key evidence required to strengthen the case
      - Potential challenges or weaknesses in the case

      **3. LEGAL REMEDIES AVAILABLE:**
      - Civil remedies (compensation, injunction, damages)
      - Criminal remedies (if applicable)
      - Alternative dispute resolution options (mediation, arbitration)
      - Administrative remedies (complaints to regulatory bodies)

      **4. STEP-BY-STEP ACTION PLAN:**
      - Immediate steps to take (evidence collection, documentation)
      - Legal notices or formal complaints to file
      - Timeline for legal action
      - Documentation required

      **5. EXPERT LEGAL ASSISTANCE REQUIRED:**
      - Specific type of lawyer needed (Criminal, Civil, Consumer, Family, Corporate, etc.)
      - Why professional legal help is essential for this case
      - Urgency level of legal consultation
      - Recommendation: "We strongly recommend consulting with a [specific lawyer type] for this matter"

      **6. IMPORTANT CONSIDERATIONS:**
      - Statute of limitations
      - Costs involved
      - Time duration for resolution
      - Potential risks or counter-claims

      **7. RELEVANT PRECEDENTS:**
      - Similar cases or judgments if applicable
      - How courts typically handle such matters

      IMPORTANT: Always include a recommendation to consult with a specific type of lawyer in section 5. Make it thorough, professional, and actionable. Use Indian legal framework and context.`;

      const detailedResponse = await geminiService.getInputAssistance(
        detailedPrompt,
        'Comprehensive legal analysis with violations, remedies, and expert guidance',
        getGeminiLanguageCode(state.selectedLanguage)
      );

      // Detect if lawyer consultation is recommended and get AI-powered specialization
      const lawyerRecommended = detectLawyerRecommendation(detailedResponse);
      
      let finalLawyerRecommendation = null;
      if (lawyerRecommended) {
        console.log('🎯 Lawyer recommended, getting AI specialization...');
        const aiSpecialization = await detectLawyerRecommendationWithAI(detailedResponse, state.searchQuery);
        finalLawyerRecommendation = aiSpecialization;
      } else {
        // Force lawyer recommendation for detailed analysis and get AI specialization
        console.log('🎯 No explicit lawyer recommendation, using AI to determine best specialization...');
        const aiSpecialization = await detectLawyerRecommendationWithAI(detailedResponse, state.searchQuery);
        finalLawyerRecommendation = aiSpecialization;
      }

      console.log('✅ Final lawyer recommendation:', finalLawyerRecommendation);

      updateState({
        detailedAnalysis: detailedResponse,
        showDetailedAnalysis: true,
        isLoadingDetailed: false,
        lawyerRecommendation: finalLawyerRecommendation ? {
          suggested: true,
          specialization: finalLawyerRecommendation
        } : null
      });
      
      stopLoading();

    } catch (error) {
      console.error('❌ Detailed analysis error:', error);
      
      // Provide comprehensive fallback detailed analysis
      const fallbackDetailedAnalysis = `**DETAILED LEGAL ANALYSIS**
(AI service temporarily unavailable - providing structured guidance)

**1. LEGAL ISSUE ASSESSMENT:**
Your query: "${state.searchQuery}"
- This appears to be a matter requiring legal attention
- Multiple factors may be involved that need careful examination
- Legal rights and obligations should be thoroughly reviewed

**2. RECOMMENDED IMMEDIATE ACTIONS:**
• Document all facts, dates, and circumstances thoroughly
• Collect and preserve any relevant evidence or documentation
• Note all parties involved and their roles in the situation
• Identify any time-sensitive deadlines or statute of limitations

**3. LEGAL CONSIDERATIONS:**
• Review applicable laws, acts, and regulations for your situation
• Consider both civil and criminal implications if relevant
• Assess potential violations of your rights or legal standards
• Evaluate strength of your position based on available evidence

**4. NEXT STEPS:**
• Consult with a qualified legal professional immediately
• Prepare a detailed timeline of events and relevant facts
• Gather supporting documentation and evidence
• Consider urgency level and any immediate protective measures needed

**5. PROFESSIONAL CONSULTATION REQUIRED:**
We strongly recommend consulting with a legal expert who specializes in matters similar to yours. Professional legal advice is essential for:
- Accurate assessment of your rights and options
- Proper legal strategy and action plan
- Navigation of complex legal procedures
- Ensuring best possible outcome for your case

**Important:** This analysis is for informational purposes only and should not be considered as legal advice. Please consult with a licensed attorney for authoritative guidance specific to your situation.`;

      updateState({
        detailedAnalysis: fallbackDetailedAnalysis,
        showDetailedAnalysis: true,
        isLoadingDetailed: false,
        // Always provide a lawyer recommendation even in fallback
        lawyerRecommendation: {
          suggested: true,
          specialization: 'General Legal Expert'
        }
      });
      stopLoading();
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
      isLoadingDetailed: false,
      lawyerRecommendation: null,
    });
    stopLoading();
  };

  return {
    state,
    loadingMessage: sarcasticLoadingMessage || loadingMessage, // Use sarcastic message if available, fallback to regular
    updateState,
    updateSearchQuery,
    handleLanguageChange,
    handleAnalysis,
    handleDetailedAnalysis,
    resetAnalysis,
  };
}