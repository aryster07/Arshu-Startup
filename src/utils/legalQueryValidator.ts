// Utility to check if a query is likely legal-related

const legalKeywords = [
  // General legal terms
  'law', 'legal', 'lawyer', 'attorney', 'court', 'judge', 'case', 'lawsuit', 'litigation',
  'advocate', 'counsel', 'barrister', 'solicitor', 'jurisdiction', 'statute', 'legislation',
  
  // Property & Real Estate
  'property', 'real estate', 'land', 'house', 'apartment', 'tenant', 'landlord', 'rent',
  'lease', 'title', 'deed', 'mortgage', 'eviction', 'ownership', 'easement', 'zoning',
  
  // Contract & Business
  'contract', 'agreement', 'breach', 'terms', 'conditions', 'business', 'company', 'LLC',
  'partnership', 'corporation', 'incorporation', 'trademark', 'patent', 'copyright',
  'intellectual property', 'NDA', 'non-disclosure', 'clause', 'negotiation',
  
  // Family Law
  'divorce', 'custody', 'child support', 'alimony', 'marriage', 'separation', 'adoption',
  'guardianship', 'prenuptial', 'family', 'domestic', 'maintenance', 'visitation',
  
  // Criminal Law & Traffic
  'criminal', 'crime', 'arrest', 'charge', 'defense', 'prosecution', 'bail', 'trial',
  'sentence', 'conviction', 'appeal', 'police', 'investigation', 'warrant', 'rights',
  'Miranda', 'felony', 'misdemeanor', 'penalty', 'prison', 'jail', 'probation',
  'hit and run', 'accident', 'collision', 'crash', 'vehicle', 'car accident', 'insurance claim',
  'driver', 'license', 'traffic violation', 'reckless driving', 'DUI', 'DWI',
  
  // Civil & Rights
  'civil', 'rights', 'discrimination', 'harassment', 'defamation', 'libel', 'slander',
  'negligence', 'injury', 'accident', 'compensation', 'damages', 'liability', 'tort',
  'consumer', 'complaint', 'dispute', 'arbitration', 'mediation', 'settlement',
  
  // Employment
  'employment', 'employee', 'employer', 'workplace', 'labor', 'wage', 'salary',
  'termination', 'wrongful discharge', 'harassment', 'discrimination', 'overtime',
  
  // Legal Procedures
  'file', 'petition', 'motion', 'hearing', 'testimony', 'evidence', 'witness',
  'subpoena', 'affidavit', 'deposition', 'discovery', 'verdict', 'judgment',
  'injunction', 'restraining order', 'complaint', 'summons',
  
  // Legal Questions & Scenarios
  'what happens if', 'can i sue', 'is it legal', 'what are my rights', 'who is liable',
  'who is responsible', 'can someone', 'what if someone', 'legal action', 'legal consequences',
  
  // Indian specific
  'IPC', 'CrPC', 'CPC', 'section', 'act', 'constitution', 'supreme court', 'high court',
  'advocate general', 'public prosecutor', 'magistrate', 'sessions court', 'tribunal',
  'RTI', 'FIR', 'chargesheet', 'bail', 'anticipatory bail', 'quash'
];

const nonLegalIndicators = [
  // Entertainment
  'movie', 'film', 'music', 'song', 'game', 'video game', 'sports', 'football', 'cricket',
  'entertainment', 'actor', 'actress', 'celebrity', 'TV show', 'series', 'episode',
  
  // Technology (non-legal)
  'programming', 'code', 'software', 'app', 'website', 'computer', 'laptop', 'phone',
  'android', 'iOS', 'Windows', 'Mac', 'Linux', 'algorithm', 'database',
  
  // Science & Math
  'physics', 'chemistry', 'biology', 'mathematics', 'equation', 'formula', 'calculation',
  'experiment', 'theory', 'hypothesis',
  
  // Cooking & Food
  'recipe', 'cooking', 'food', 'restaurant', 'dish', 'ingredient', 'kitchen',
  
  // Travel & Geography
  'travel', 'vacation', 'tourism', 'destination', 'hotel', 'flight',
  
  // Health (non-legal)
  'diet', 'exercise', 'fitness', 'workout', 'nutrition', 'vitamin',
  
  // General knowledge
  'what is', 'who is', 'when did', 'where is', 'how to make', 'how to cook',
  'history of', 'capital of', 'population of'
];

export function isLegalQuery(query: string): { isLegal: boolean; confidence: 'high' | 'medium' | 'low' } {
  const lowerQuery = query.toLowerCase();
  
  // Check for non-legal indicators first
  const hasNonLegalIndicator = nonLegalIndicators.some(indicator => 
    lowerQuery.includes(indicator.toLowerCase())
  );
  
  if (hasNonLegalIndicator) {
    // But check if it also has legal context
    const hasLegalContext = legalKeywords.some(keyword => 
      lowerQuery.includes(keyword.toLowerCase())
    );
    
    if (!hasLegalContext) {
      return { isLegal: false, confidence: 'high' };
    }
  }
  
  // Check for legal keywords
  const legalKeywordMatches = legalKeywords.filter(keyword => 
    lowerQuery.includes(keyword.toLowerCase())
  ).length;
  
  if (legalKeywordMatches >= 2) {
    return { isLegal: true, confidence: 'high' };
  } else if (legalKeywordMatches === 1) {
    return { isLegal: true, confidence: 'medium' };
  }
  
  // Check for question words that might indicate a general knowledge question
  const generalQuestionPatterns = [
    /^what is [a-z\s]+ (movie|song|game|food|dish)/i,
    /^who is [a-z\s]+ (actor|singer|player|chef)/i,
    /^how to (cook|make|prepare|play)/i,
    /^(recipe|cooking) (for|of)/i
  ];
  
  if (generalQuestionPatterns.some(pattern => pattern.test(lowerQuery))) {
    return { isLegal: false, confidence: 'high' };
  }
  
  // If query is very short and has no legal keywords, probably not legal
  if (query.split(' ').length <= 3 && legalKeywordMatches === 0) {
    return { isLegal: false, confidence: 'medium' };
  }
  
  // Default: assume it might be legal but with low confidence
  return { isLegal: true, confidence: 'low' };
}

export function getNonLegalResponse(): string {
  return `🏛️ **Law Bandhu Legal Assistant**

I apologize, but I'm a specialized Legal Assistant designed exclusively for legal matters and law-related queries.

I can only provide guidance on:
✓ **Property Law** - Real estate, land disputes, rental agreements
✓ **Contract Law** - Agreements, business contracts, breach of contract
✓ **Family Law** - Divorce, custody, marriage, adoption
✓ **Criminal Law** - Legal rights, arrests, charges, defense
✓ **Employment Law** - Labor rights, workplace disputes, termination
✓ **Consumer Rights** - Product liability, warranties, complaints
✓ **Civil Law** - Disputes, damages, compensation
✓ **Business Law** - Company formation, partnerships, compliance

**Please ask me a legal question, and I'll be happy to help!**

Example questions:
- "What are my rights as a tenant?"
- "How do I file a consumer complaint?"
- "What is the process for property registration?"
- "What should I do if arrested?"`;
}
