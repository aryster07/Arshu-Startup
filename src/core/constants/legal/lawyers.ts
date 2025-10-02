// Legal experts and lawyers database
export interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  cases_won: number;
  languages: string[];
  location: string;
  consultationFee: number;
  expertise: string[];
  description: string;
  available: boolean;
}

export const LAWYERS_DATABASE: Lawyer[] = [
  // Criminal Lawyers
  {
    id: 'criminal-001',
    name: 'Adv. Rajesh Kumar',
    specialization: 'Criminal Lawyer',
    experience: 15,
    rating: 4.8,
    cases_won: 420,
    languages: ['Hindi', 'English'],
    location: 'Delhi High Court',
    consultationFee: 2500,
    expertise: ['Criminal Defense', 'Bail Applications', 'FIR Quashing', 'White Collar Crimes'],
    description: 'Senior Criminal Lawyer with expertise in high-profile criminal cases and white-collar crimes.',
    available: true
  },
  {
    id: 'criminal-002',
    name: 'Adv. Priya Sharma',
    specialization: 'Criminal Lawyer',
    experience: 12,
    rating: 4.7,
    cases_won: 350,
    languages: ['English', 'Hindi', 'Punjabi'],
    location: 'Mumbai Sessions Court',
    consultationFee: 2000,
    expertise: ['Cyber Crime', 'Economic Offenses', 'Domestic Violence', 'Criminal Appeals'],
    description: 'Specialized in cyber crimes and economic offenses with strong track record.',
    available: true
  },

  // Civil Lawyers
  {
    id: 'civil-001',
    name: 'Adv. Suresh Gupta',
    specialization: 'Civil Lawyer',
    experience: 18,
    rating: 4.9,
    cases_won: 560,
    languages: ['Hindi', 'English'],
    location: 'Delhi District Court',
    consultationFee: 1800,
    expertise: ['Property Disputes', 'Contract Law', 'Tort Claims', 'Civil Appeals'],
    description: 'Expert in property disputes and contract law with 18+ years experience.',
    available: true
  },
  {
    id: 'civil-002',
    name: 'Adv. Meera Nair',
    specialization: 'Civil Lawyer',
    experience: 14,
    rating: 4.6,
    cases_won: 385,
    languages: ['English', 'Malayalam', 'Tamil'],
    location: 'Chennai High Court',
    consultationFee: 2200,
    expertise: ['Commercial Disputes', 'Breach of Contract', 'Money Recovery', 'Civil Litigation'],
    description: 'Specialized in commercial disputes and contract breaches.',
    available: true
  },

  // Consumer Lawyers
  {
    id: 'consumer-001',
    name: 'Adv. Amit Verma',
    specialization: 'Consumer Lawyer',
    experience: 10,
    rating: 4.5,
    cases_won: 280,
    languages: ['Hindi', 'English'],
    location: 'National Consumer Commission',
    consultationFee: 1500,
    expertise: ['Consumer Protection', 'Product Liability', 'Service Deficiency', 'E-commerce Disputes'],
    description: 'Expert in consumer protection laws and e-commerce disputes.',
    available: true
  },

  // Family Lawyers
  {
    id: 'family-001',
    name: 'Adv. Kavita Singh',
    specialization: 'Family Lawyer',
    experience: 16,
    rating: 4.8,
    cases_won: 450,
    languages: ['Hindi', 'English'],
    location: 'Family Court Delhi',
    consultationFee: 2000,
    expertise: ['Divorce Proceedings', 'Child Custody', 'Domestic Violence', 'Maintenance'],
    description: 'Compassionate family lawyer with expertise in divorce and custody matters.',
    available: true
  },

  // Corporate Lawyers
  {
    id: 'corporate-001',
    name: 'Adv. Vikram Malhotra',
    specialization: 'Corporate Lawyer',
    experience: 20,
    rating: 4.9,
    cases_won: 680,
    languages: ['English', 'Hindi'],
    location: 'Mumbai High Court',
    consultationFee: 5000,
    expertise: ['Corporate Law', 'Mergers & Acquisitions', 'Securities Law', 'Compliance'],
    description: 'Senior corporate lawyer with expertise in M&A and securities law.',
    available: true
  },

  // Employment Lawyers
  {
    id: 'employment-001',
    name: 'Adv. Ravi Patel',
    specialization: 'Employment Lawyer',
    experience: 13,
    rating: 4.7,
    cases_won: 320,
    languages: ['Hindi', 'English', 'Gujarati'],
    location: 'Labour Court Ahmedabad',
    consultationFee: 1800,
    expertise: ['Employment Law', 'Wrongful Termination', 'Workplace Harassment', 'Labour Disputes'],
    description: 'Specialized in employment law and workplace rights protection.',
    available: true
  },

  // Real Estate Lawyers
  {
    id: 'realestate-001',
    name: 'Adv. Deepak Joshi',
    specialization: 'Real Estate Lawyer',
    experience: 17,
    rating: 4.8,
    cases_won: 480,
    languages: ['Hindi', 'English'],
    location: 'Gurgaon District Court',
    consultationFee: 3000,
    expertise: ['Property Law', 'RERA Disputes', 'Builder Disputes', 'Property Registration'],
    description: 'Expert in real estate law and RERA related disputes.',
    available: true
  },

  // Tax Lawyers
  {
    id: 'tax-001',
    name: 'Adv. Sunita Agarwal',
    specialization: 'Tax Lawyer',
    experience: 19,
    rating: 4.9,
    cases_won: 520,
    languages: ['English', 'Hindi'],
    location: 'Income Tax Appellate Tribunal',
    consultationFee: 4000,
    expertise: ['Income Tax', 'GST', 'Tax Appeals', 'Tax Planning'],
    description: 'Senior tax lawyer with expertise in income tax and GST matters.',
    available: true
  },

  // General Legal Experts
  {
    id: 'general-001',
    name: 'Adv. Mohit Sharma',
    specialization: 'General Legal Expert',
    experience: 22,
    rating: 4.9,
    cases_won: 750,
    languages: ['Hindi', 'English'],
    location: 'Supreme Court of India',
    consultationFee: 6000,
    expertise: ['Constitutional Law', 'Public Interest Litigation', 'Appeals', 'Legal Consultation'],
    description: 'Senior Advocate with Supreme Court practice and diverse legal expertise.',
    available: true
  }
];

export const getLawyersBySpecialization = (specialization: string): Lawyer[] => {
  return LAWYERS_DATABASE.filter(lawyer => 
    lawyer.specialization === specialization && lawyer.available
  ).sort((a, b) => b.rating - a.rating);
};

export const getTopRatedLawyers = (limit: number = 5): Lawyer[] => {
  return LAWYERS_DATABASE
    .filter(lawyer => lawyer.available)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};