// ============================================
// AI Service - Legal Query Detection
// ============================================

import type { IssueDetection, LegalQueryResult } from '../../types';

// Patterns that indicate someone is describing a personal situation
const PERSONAL_ISSUE_PATTERNS = [
  /\b(I|my|me|mine|I'm|I've|I am|I have|I was|I did)\b/i,
  /\b(happened|occurred|did|was|were|got|received|signed|agreed|bought|sold)\b/i,
  /\b(problem|issue|trouble|help|advice|what should I|what can I|need to|have to)\b/i,
  /\b(what happens if|what if someone|if somebody|if someone|can someone|what would happen)\b/i,
];

// Legal field keywords mapping
const LEGAL_FIELD_KEYWORDS: Record<string, string[]> = {
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
    'accident', 'collision', 'crash'
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

// Legal keywords for query validation
const LEGAL_KEYWORDS = [
  'law', 'legal', 'lawyer', 'attorney', 'court', 'judge', 'case', 'lawsuit',
  'advocate', 'counsel', 'jurisdiction', 'statute', 'legislation',
  'property', 'real estate', 'land', 'tenant', 'landlord', 'rent', 'lease',
  'contract', 'agreement', 'breach', 'terms', 'business', 'company',
  'divorce', 'custody', 'child support', 'alimony', 'marriage', 'family',
  'criminal', 'crime', 'arrest', 'charge', 'defense', 'bail', 'trial',
  'civil', 'rights', 'discrimination', 'harassment', 'defamation',
  'employment', 'employee', 'employer', 'workplace', 'labor', 'wage',
  'file', 'petition', 'motion', 'hearing', 'evidence', 'witness',
  'what happens if', 'can i sue', 'is it legal', 'what are my rights',
  'IPC', 'CrPC', 'CPC', 'section', 'act', 'constitution', 'supreme court',
  'FIR', 'chargesheet', 'bail', 'anticipatory bail'
];

const NON_LEGAL_INDICATORS = [
  'movie', 'film', 'music', 'song', 'game', 'sports', 'football', 'cricket',
  'programming', 'code', 'software', 'app', 'website', 'computer',
  'physics', 'chemistry', 'biology', 'mathematics', 'equation',
  'recipe', 'cooking', 'food', 'restaurant', 'dish', 'ingredient',
  'travel', 'vacation', 'tourism', 'hotel', 'flight',
  'diet', 'exercise', 'fitness', 'workout', 'nutrition',
  'what is', 'who is', 'when did', 'where is', 'how to make', 'how to cook'
];

export function detectPersonalLegalIssue(query: string): IssueDetection {
  const lowerQuery = query.toLowerCase();
  
  const personalIndicatorCount = PERSONAL_ISSUE_PATTERNS.filter(pattern => 
    pattern.test(query)
  ).length;
  
  const isPersonalIssue = personalIndicatorCount >= 1;
  
  let bestMatch = { field: '', matches: 0 };
  
  for (const [field, keywords] of Object.entries(LEGAL_FIELD_KEYWORDS)) {
    const matches = keywords.filter(keyword => 
      lowerQuery.includes(keyword.toLowerCase())
    ).length;
    
    if (matches > bestMatch.matches) {
      bestMatch = { field, matches };
    }
  }
  
  const legalField = bestMatch.matches > 0 ? bestMatch.field : null;
  const finalIsPersonalIssue = isPersonalIssue || legalField !== null;
  
  let confidence: 'high' | 'medium' | 'low';
  if (personalIndicatorCount >= 3 && bestMatch.matches >= 2) {
    confidence = 'high';
  } else if (personalIndicatorCount >= 2 || bestMatch.matches >= 1) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }
  
  return { isPersonalIssue: finalIsPersonalIssue, legalField, confidence };
}

export function isLegalQuery(query: string): LegalQueryResult {
  const lowerQuery = query.toLowerCase();
  
  const hasNonLegalIndicator = NON_LEGAL_INDICATORS.some(indicator => 
    lowerQuery.includes(indicator.toLowerCase())
  );
  
  if (hasNonLegalIndicator) {
    const hasLegalContext = LEGAL_KEYWORDS.some(keyword => 
      lowerQuery.includes(keyword.toLowerCase())
    );
    
    if (!hasLegalContext) {
      return { isLegal: false, confidence: 'high' };
    }
  }
  
  const legalKeywordMatches = LEGAL_KEYWORDS.filter(keyword => 
    lowerQuery.includes(keyword.toLowerCase())
  ).length;
  
  if (legalKeywordMatches >= 2) {
    return { isLegal: true, confidence: 'high' };
  } else if (legalKeywordMatches === 1) {
    return { isLegal: true, confidence: 'medium' };
  }
  
  if (query.split(' ').length <= 3 && legalKeywordMatches === 0) {
    return { isLegal: false, confidence: 'medium' };
  }
  
  return { isLegal: true, confidence: 'low' };
}

export function getLegalFieldDescription(field: string): string {
  const descriptions: Record<string, string> = {
    'Property Law': 'a property law specialist',
    'Family Law': 'a family law attorney',
    'Criminal Law': 'a criminal defense lawyer',
    'Contract Law': 'a contract law specialist',
    'Employment Law': 'an employment lawyer',
    'Consumer Law': 'a consumer rights attorney',
    'Civil Law': 'a civil litigation lawyer',
    'Corporate Law': 'a corporate lawyer',
    'Cyber Law': 'a cyber law specialist',
    'Intellectual Property': 'an IP attorney'
  };
  
  return descriptions[field] || 'a legal professional';
}

export function getNonLegalResponse(): string {
  return `🏛️ **Law Bandhu Legal Assistant**

I apologize, but I'm a specialized Legal Assistant designed exclusively for legal matters.

I can help with:
✓ **Property Law** - Real estate, land disputes, rental agreements
✓ **Contract Law** - Agreements, business contracts, breach of contract
✓ **Family Law** - Divorce, custody, marriage, adoption
✓ **Criminal Law** - Legal rights, arrests, charges, defense
✓ **Employment Law** - Labor rights, workplace disputes
✓ **Consumer Rights** - Product liability, warranties, complaints

**Please ask a legal question, and I'll be happy to help!**`;
}
