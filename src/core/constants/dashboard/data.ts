import { CaseStatus, CasePriority, LegalDomain } from './index';

// Dashboard data constants
export interface DashboardCase {
  id: number;
  title: string;
  status: CaseStatus;
  lastUpdate: string;
  priority: CasePriority;
}

export interface LegalService {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

export const RECENT_CASES: DashboardCase[] = [
  {
    id: 1,
    title: "Consumer Rights Violation",
    status: "In Progress",
    lastUpdate: "2 days ago", 
    priority: "high"
  },
  {
    id: 2,
    title: "Property Dispute Consultation",
    status: "Completed",
    lastUpdate: "1 week ago",
    priority: "medium"
  },
  {
    id: 3,
    title: "Employment Law Query",
    status: "Pending Review",
    lastUpdate: "3 days ago",
    priority: "low"
  }
];

export const DASHBOARD_STATS = {
  totalCases: 12,
  activeCases: 3,
  successRate: 85,
  avgResolutionTime: '15 days'
} as const;