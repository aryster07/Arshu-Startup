/**
 * Cases Feature - Custom Hooks
 */

import { useState, useCallback } from 'react';
import type { LegalCase } from '../../types';

interface UseCaseSelectionReturn {
  selectedCaseId: number | null;
  selectCase: (caseId: number) => void;
  clearSelection: () => void;
  isSelected: (caseId: number) => boolean;
}

/**
 * Hook for managing case selection
 */
export function useCaseSelection(): UseCaseSelectionReturn {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  const selectCase = useCallback((caseId: number) => {
    setSelectedCaseId(caseId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCaseId(null);
  }, []);

  const isSelected = useCallback(
    (caseId: number) => selectedCaseId === caseId,
    [selectedCaseId]
  );

  return {
    selectedCaseId,
    selectCase,
    clearSelection,
    isSelected,
  };
}
