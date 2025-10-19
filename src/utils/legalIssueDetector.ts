// Utility to detect if user is describing a personal legal issue vs asking a general question

interface IssueDetection {
  isPersonalIssue: boolean;
  legalField: string | null;
  confidence: 'high' | 'medium' | 'low';
}

// Patterns that indicate someone is describing a personal situation
const personalIssuePatterns = [
  // First person indicators
  /\b(I|my|me|mine|I'm|I've|I am|I have|I was|I did)\b/i,
  
  // Past tense actions
  /\b(happened|occurred|did|was|were|got|received|signed|agreed|bought|sold)\b/i,
  
  // Problem indicators
  /\b(problem|issue|trouble|help|advice|what should I|what can I|need to|have to)\b/i,
  
  // Hypothetical scenarios (e.g., "what happens if someone...")
  /\b(what happens if|what if someone|if somebody|if someone|can someone|what would happen)\b/i,
];

// Legal field keywords with their specializations
const legalFieldKeywords = {
  'Property Law': [
    'property', 'house', 'apartment', 'land', 'real estate', 'landlord', 'tenant',
    'rent', 'lease', 'eviction', 'mortgage', 'title', 'deed', 'ownership', 'boundary',
    'construction', 'builder', 'flat', 'plot', 'possession'
  ],
  'Family Law': [
    'divorce', 'marriage', 'custody', 'child', 'spouse', 'wife', 'husband',
    'separation', 'alimony', 'maintenance', 'adoption', 'domestic violence',
    'dowry', 'family', 'inheritance', 'will', 'guardian'
  ],
  'Criminal Law': [
    'arrested', 'police', 'FIR', 'charge', 'criminal', 'theft', 'fraud', 'assault',
    'murder', 'bail', 'accused', 'victim', 'crime', 'investigation', 'harassment',
    'threatening', 'violence', 'abuse', 'complaint', 'false case', 'hit and run',
    'accident', 'collision', 'crash', 'runs away', 'flee', 'escaped', 'vehicle'
  ],
  'Contract Law': [
    'contract', 'agreement', 'breach', 'signed', 'terms', 'conditions', 'deal',
    'violated', 'obligation', 'clause', 'payment', 'delivery', 'services',
    'MOU', 'memorandum', 'partnership', 'business deal'
  ],
  'Employment Law': [
    'job', 'employer', 'employee', 'fired', 'terminated', 'resignation', 'salary',
    'wage', 'workplace', 'boss', 'company', 'work', 'harassment at work',
    'unpaid', 'overtime', 'discrimination', 'wrongful termination', 'labor'
  ],
  'Consumer Law': [
    'bought', 'purchased', 'product', 'defective', 'refund', 'warranty', 'seller',
    'shop', 'merchant', 'consumer', 'complaint', 'goods', 'services', 'fraud',
    'cheated', 'online shopping', 'delivery', 'damaged'
  ],
  'Civil Law': [
    'dispute', 'neighbor', 'damages', 'compensation', 'injury', 'accident',
    'negligence', 'liability', 'sued', 'court', 'case', 'legal action'
  ],
  'Corporate Law': [
    'company', 'business', 'partnership', 'LLC', 'corporation', 'shareholder',
    'director', 'board', 'incorporation', 'registration', 'GST', 'tax',
    'compliance', 'audit', 'merger'
  ],
  'Cyber Law': [
    'online', 'internet', 'social media', 'hacking', 'cybercrime', 'data theft',
    'privacy', 'defamation online', 'fake profile', 'cyber harassment',
    'identity theft', 'phishing', 'website'
  ],
  'Intellectual Property': [
    'trademark', 'patent', 'copyright', 'brand', 'logo', 'invention', 'design',
    'plagiarism', 'infringement', 'intellectual property', 'IP'
  ]
};

export function detectPersonalLegalIssue(query: string): IssueDetection {
  const lowerQuery = query.toLowerCase();
  
  // Check if it's a personal issue based on patterns
  const personalIndicatorCount = personalIssuePatterns.filter(pattern => 
    pattern.test(query)
  ).length;
  
  // More aggressive detection - only need 1 match OR if a legal field is detected
  const isPersonalIssue = personalIndicatorCount >= 1;
  
  // Determine the legal field
  let bestMatch: { field: string; matches: number } = { field: '', matches: 0 };
  
  for (const [field, keywords] of Object.entries(legalFieldKeywords)) {
    const matches = keywords.filter(keyword => 
      lowerQuery.includes(keyword.toLowerCase())
    ).length;
    
    if (matches > bestMatch.matches) {
      bestMatch = { field, matches };
    }
  }
  
  const legalField = bestMatch.matches > 0 ? bestMatch.field : null;
  
  // If a legal field is detected, it's likely they need lawyer consultation
  // This ensures the "Consult a Lawyer" button shows for most relevant queries
  const finalIsPersonalIssue = isPersonalIssue || (legalField !== null);
  
  // Determine confidence
  let confidence: 'high' | 'medium' | 'low';
  if (personalIndicatorCount >= 3 && bestMatch.matches >= 2) {
    confidence = 'high';
  } else if (personalIndicatorCount >= 2 || bestMatch.matches >= 1) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }
  
  return {
    isPersonalIssue: finalIsPersonalIssue,
    legalField,
    confidence
  };
}

export function getLegalFieldDescription(field: string): string {
  const descriptions: Record<string, string> = {
    'Property Law': 'specializing in property disputes, real estate transactions, landlord-tenant issues, and property rights',
    'Family Law': 'specializing in divorce, child custody, maintenance, adoption, and domestic relations',
    'Criminal Law': 'specializing in criminal defense, bail applications, FIR matters, and criminal proceedings',
    'Contract Law': 'specializing in contract disputes, breach of agreements, and commercial contracts',
    'Employment Law': 'specializing in wrongful termination, workplace harassment, salary disputes, and labor rights',
    'Consumer Law': 'specializing in consumer complaints, product defects, refunds, and consumer protection',
    'Civil Law': 'specializing in civil disputes, compensation claims, and tort matters',
    'Corporate Law': 'specializing in business formation, corporate compliance, and commercial matters',
    'Cyber Law': 'specializing in cybercrime, online harassment, data protection, and digital rights',
    'Intellectual Property': 'specializing in trademarks, patents, copyrights, and IP protection'
  };
  
  return descriptions[field] || 'specializing in your legal matter';
}
