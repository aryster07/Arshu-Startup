/**
 * Law Bandhu - Type Definitions
 * Organized by feature domain
 */

// ============================================
// User & Authentication
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photoURL?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// Lawyer
// ============================================

export interface Lawyer {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  experience: number;
  location: string;
  languages: string[];
  consultationFee: number;
  image: string;
  bio?: string;
  education?: string[];
  barCouncilId?: string;
  successRate?: number;
  casesHandled?: number;
  isStarred?: boolean;
}

export interface LawyerFilterOptions {
  specializations: string[];
  experience: [number, number];
  rating: number;
  languages: string[];
  location: string[];
  consultationFee: [number, number];
}

// ============================================
// Legal Case
// ============================================

export type CaseStepStatus = 'completed' | 'active' | 'pending';

export interface CaseStep {
  id: string;
  label: string;
  status: CaseStepStatus;
}

export interface LegalCase {
  id: number;
  title: string;
  caseNumber: string;
  lawyer: string;
  status: string;
  lastUpdate: string;
  steps: CaseStep[];
}

export interface CaseUpdate {
  id: number;
  caseId: number;
  title: string;
  description: string;
  date: string;
  type: 'hearing' | 'document' | 'closure' | 'update';
}

// ============================================
// Payment
// ============================================

export type PaymentStatus = 'completed' | 'pending' | 'failed';
export type PaymentMethod = 'UPI' | 'Credit Card' | 'Net Banking' | 'Pending';

export interface Payment {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  invoiceId: string;
  method: PaymentMethod;
}

// ============================================
// AI Service
// ============================================

export interface AIResponse {
  text: string;
  provider: string;
  success: boolean;
  error?: string;
  isPersonalIssue?: boolean;
  legalField?: string | null;
}

export interface IssueDetection {
  isPersonalIssue: boolean;
  legalField: string | null;
  confidence: 'high' | 'medium' | 'low';
}

export interface LegalQueryResult {
  isLegal: boolean;
  confidence: 'high' | 'medium' | 'low';
}

// ============================================
// Navigation
// ============================================

export type AppView = 'landing' | 'auth' | 'dashboard';
export type DashboardView = 'dashboard' | 'consultant' | 'lawyers' | 'cases' | 'payment' | 'settings';

// ============================================
// UI Components
// ============================================

export interface SidebarItem {
  id: DashboardView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
