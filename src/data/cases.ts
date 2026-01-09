// ============================================
// Law Bandhu - Mock Cases Data
// ============================================

import type { LegalCase, CaseUpdate } from '../types';

export const MOCK_CASES: LegalCase[] = [
  {
    id: 1,
    title: "Property Dispute Case",
    caseNumber: "PROP/2024/001",
    lawyer: "Vikram Singh",
    status: "In Progress",
    lastUpdate: "2 days ago",
    steps: [
      { id: '1', label: 'Case Filed', status: 'completed' },
      { id: '2', label: 'Evidence Submission', status: 'completed' },
      { id: '3', label: 'Hearing', status: 'active' },
      { id: '4', label: 'Judgment', status: 'pending' },
      { id: '5', label: 'Closure', status: 'pending' }
    ]
  },
  {
    id: 2,
    title: "Contract Review",
    caseNumber: "CORP/2024/042",
    lawyer: "Priya Sharma",
    status: "Completed",
    lastUpdate: "1 week ago",
    steps: [
      { id: '1', label: 'Initial Review', status: 'completed' },
      { id: '2', label: 'Amendments', status: 'completed' },
      { id: '3', label: 'Final Review', status: 'completed' },
      { id: '4', label: 'Approval', status: 'completed' },
      { id: '5', label: 'Closure', status: 'completed' }
    ]
  }
];

export const MOCK_CASE_UPDATES: CaseUpdate[] = [
  {
    id: 1,
    caseId: 1,
    title: "Hearing scheduled",
    description: "Next hearing scheduled for October 25, 2025",
    date: "2 days ago",
    type: "hearing"
  },
  {
    id: 2,
    caseId: 1,
    title: "Document submitted",
    description: "Evidence documents have been submitted to the court",
    date: "1 week ago",
    type: "document"
  },
  {
    id: 3,
    caseId: 2,
    title: "Case closed",
    description: "Contract review has been completed successfully",
    date: "1 week ago",
    type: "closure"
  }
];
