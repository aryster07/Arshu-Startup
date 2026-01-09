/**
 * Cases Feature - Business Logic
 * Pure functions for case-related operations
 */

import type { LegalCase, CaseUpdate } from '../../types';

/**
 * Find case by ID
 */
export function findCaseById(cases: LegalCase[], id: number): LegalCase | undefined {
  return cases.find((c) => c.id === id);
}

/**
 * Get updates for a specific case
 */
export function getCaseUpdates(updates: CaseUpdate[], caseId: number): CaseUpdate[] {
  return updates.filter((update) => update.caseId === caseId);
}

/**
 * Get case status color
 */
export function getCaseStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return '#10b981';
    case 'in progress':
      return '#2563eb';
    case 'pending':
      return '#f59e0b';
    default:
      return '#64748b';
  }
}

/**
 * Check if case is completed
 */
export function isCaseCompleted(caseItem: LegalCase): boolean {
  return caseItem.status.toLowerCase() === 'completed';
}

/**
 * Get completion percentage of a case
 */
export function getCaseCompletionPercentage(caseItem: LegalCase): number {
  const completedSteps = caseItem.steps.filter((step) => step.status === 'completed').length;
  return Math.round((completedSteps / caseItem.steps.length) * 100);
}
