import { useState, useEffect, useCallback } from 'react';

// Base sarcastic messages for different legal scenarios
const SARCASTIC_MESSAGE_TEMPLATES = {
  // General sarcastic messages
  general: [
    "Pretending to be a real lawyer while I analyze this...",
    "Consulting my imaginary law degree...",
    "Asking the legal gods for wisdom...",
    "Channeling my inner Harvey Specter...",
    "Loading legal brilliance... please hold...",
    "Turning coffee into legal advice...",
    "Summoning the spirit of justice...",
    "Googling 'how to law' really fast...",
    "Putting on my serious lawyer face...",
    "Activating legal ninja mode..."
  ],
  
  // For relationship/divorce related queries
  relationship: [
    "Oh great, another relationship drama to sort out...",
    "Let me guess... someone's ex is being difficult?",
    "Calculating the cost of your poor life choices...",
    "Preparing tissues and legal documents...",
    "Adding up the emotional damage... in legal terms...",
    "Converting heartbreak into billable hours...",
    "Checking if stupidity is legally binding...",
    "Analyzing the fine print of love gone wrong..."
  ],
  
  // For money/financial disputes
  money: [
    "Ah yes, money problems... my favorite kind of drama...",
    "Let me calculate how broke you're about to be...",
    "Counting coins while drafting legal strategy...",
    "Analyzing your financial mistakes with surgical precision...",
    "Converting your debt into legal jargon...",
    "Preparing a budget for your legal doom...",
    "Calculating interest on your poor decisions..."
  ],
  
  // For property/landlord issues
  property: [
    "Another landlord being a pain? Shocking...",
    "Analyzing property drama... because rent wasn't high enough...",
    "Checking if your landlord has a soul... spoiler: probably not...",
    "Reviewing lease agreements written by Satan himself...",
    "Calculating square footage of your misery...",
    "Preparing eviction anxiety into legal strategy..."
  ],
  
  // For employment issues
  employment: [
    "Ah, workplace drama... because Monday wasn't depressing enough...",
    "Analyzing your boss's latest power trip...",
    "Checking if incompetence is a fireable offense... sadly, no...",
    "Converting office politics into legal strategy...",
    "Calculating compensation for dealing with idiots...",
    "Reviewing HR policies written by robots..."
  ],
  
  // For family disputes
  family: [
    "Family drama... because holidays weren't stressful enough...",
    "Analyzing genetic predisposition to poor decisions...",
    "Checking family tree for common sense... still searching...",
    "Converting family dysfunction into legal framework...",
    "Preparing for epic family feuds... legally speaking...",
    "Calculating inheritance of problems..."
  ],
  
  // For simple/obvious questions
  obvious: [
    "Really? You needed a lawyer for this?",
    "Analyzing what common sense should have told you...",
    "Checking legal databases for the blindingly obvious...",
    "Converting basic logic into legal advice...",
    "Preparing to state the obvious... legally...",
    "Googling 'how to adult' for legal precedent...",
    "Analyzing your ability to make simple decisions..."
  ],
  
  // For complex legal jargon queries
  complex: [
    "Deciphering legal hieroglyphics...",
    "Translating lawyer-speak into human language...",
    "Converting legal mumbo-jumbo into actual advice...",
    "Untangling the web of legal complexity...",
    "Preparing to explain why lawyers love big words...",
    "Analyzing unnecessarily complicated legal nonsense..."
  ],
  
  // For urgent/emergency queries
  urgent: [
    "Oh no! Legal emergency! *puts on cape*",
    "Activating emergency legal protocol...",
    "Breaking: Someone needs legal help... immediately!",
    "Rushing to save the day... legally speaking...",
    "Emergency legal consultation loading... sirens wailing...",
    "Code Red: Legal crisis in progress!"
  ]
};

// Keywords to detect different categories
const CATEGORY_KEYWORDS = {
  relationship: ['divorce', 'marriage', 'spouse', 'partner', 'ex', 'relationship', 'dating', 'breakup', 'custody', 'alimony'],
  money: ['money', 'debt', 'loan', 'payment', 'financial', 'bank', 'credit', 'wage', 'salary', 'bill', 'cost', 'expensive'],
  property: ['rent', 'landlord', 'tenant', 'property', 'house', 'apartment', 'lease', 'eviction', 'deposit', 'utilities'],
  employment: ['job', 'work', 'boss', 'employee', 'fired', 'quit', 'salary', 'workplace', 'discrimination', 'harassment'],
  family: ['family', 'parent', 'child', 'inheritance', 'will', 'estate', 'sibling', 'relative', 'guardian'],
  urgent: ['emergency', 'urgent', 'asap', 'immediately', 'help', 'crisis', 'stuck', 'trouble', 'arrest']
};

// Function to detect if question is obviously simple
const isObviousQuestion = (query: string): boolean => {
  const obvious = ['is this legal', 'can I', 'should I', 'what if I', 'is it okay'];
  return obvious.some(phrase => query.toLowerCase().includes(phrase));
};

// Function to detect complex legal jargon
const isComplexLegal = (query: string): boolean => {
  const complex = ['pursuant to', 'heretofore', 'wherein', 'whereas', 'notwithstanding', 'jurisdiction', 'statute', 'precedent'];
  return complex.some(phrase => query.toLowerCase().includes(phrase));
};

// Function to categorize user input
const categorizeInput = (query: string): keyof typeof SARCASTIC_MESSAGE_TEMPLATES => {
  const lowerQuery = query.toLowerCase();
  
  // Check for urgency first
  if (CATEGORY_KEYWORDS.urgent.some(keyword => lowerQuery.includes(keyword))) {
    return 'urgent';
  }
  
  // Check if it's an obvious question
  if (isObviousQuestion(query)) {
    return 'obvious';
  }
  
  // Check if it's complex legal jargon
  if (isComplexLegal(query)) {
    return 'complex';
  }
  
  // Check other categories
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return category as keyof typeof SARCASTIC_MESSAGE_TEMPLATES;
    }
  }
  
  return 'general';
};

// Function to generate contextual sarcastic messages
const generateContextualMessages = (query: string): string[] => {
  const category = categorizeInput(query);
  const categoryMessages = SARCASTIC_MESSAGE_TEMPLATES[category];
  const generalMessages = SARCASTIC_MESSAGE_TEMPLATES.general;
  
  // Mix category-specific messages with general ones for variety
  return [...categoryMessages, ...generalMessages.slice(0, 3)];
};

export function useSarcasticLoadingMessages() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Generate messages based on user input
  const initializeMessages = useCallback((userInput: string) => {
    const contextualMessages = generateContextualMessages(userInput);
    console.log('🎭 Generated messages for input:', userInput, contextualMessages);
    setMessages(contextualMessages);
    setMessageIndex(0);
    setCurrentMessage(contextualMessages[0]);
  }, []);

  // Start the loading message rotation
  const startLoading = useCallback((userInput: string) => {
    initializeMessages(userInput);
    setIsActive(true);
  }, [initializeMessages]);

  // Stop the loading message rotation
  const stopLoading = useCallback(() => {
    setIsActive(false);
    setCurrentMessage('');
  }, []);

  // Effect to rotate messages every few seconds
  useEffect(() => {
    if (!isActive || messages.length === 0) return;

    const interval = setInterval(() => {
      setMessageIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % messages.length;
        setCurrentMessage(messages[nextIndex]);
        return nextIndex;
      });
    }, 3500); // Change message every 3.5 seconds

    return () => clearInterval(interval);
  }, [isActive, messages]);

  return {
    currentMessage,
    startLoading,
    stopLoading,
    isActive
  };
}

// Hook specifically for dashboard analysis with input context
export function useDashboardSarcasticLoading() {
  const { currentMessage, startLoading, stopLoading, isActive } = useSarcasticLoadingMessages();
  
  const startAnalysisLoading = useCallback((query: string) => {
    console.log('🎭 Starting sarcastic loading for:', query);
    if (!query.trim()) {
      startLoading("Let me analyze this profound question you forgot to ask...");
    } else {
      startLoading(query);
    }
  }, [startLoading]);

  return {
    loadingMessage: currentMessage,
    startAnalysisLoading,
    stopLoading,
    isLoading: isActive
  };
}