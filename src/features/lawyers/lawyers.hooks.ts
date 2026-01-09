/**
 * Lawyer Feature - Custom Hooks
 * React hooks for lawyer state management
 */

import { useState, useEffect, useCallback } from 'react';
import type { Lawyer, LawyerFilterOptions } from '../../types';
import { DEFAULT_FILTERS } from '../../config/constants';
import { 
  filterLawyers, 
  sortLawyersByStarred, 
  countActiveFilters,
  getStarredCount,
  toggleLawyerStar 
} from './lawyers.logic';

interface UseLawyerFiltersReturn {
  filteredLawyers: Lawyer[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: LawyerFilterOptions;
  setFilters: (filters: LawyerFilterOptions) => void;
  activeFilterCount: number;
  resetFilters: () => void;
}

/**
 * Hook for managing lawyer filtering
 */
export function useLawyerFilters(lawyers: Lawyer[]): UseLawyerFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LawyerFilterOptions>(DEFAULT_FILTERS);

  const filteredLawyers = filterLawyers(lawyers, searchQuery, filters);
  const activeFilterCount = countActiveFilters(filters);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  }, []);

  return {
    filteredLawyers,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    activeFilterCount,
    resetFilters,
  };
}

interface UseMyLawyersReturn {
  lawyers: Lawyer[];
  starredCount: number;
  toggleStar: (lawyerId: number) => void;
  sortedLawyers: Lawyer[];
}

/**
 * Hook for managing "My Lawyers" with starring
 */
export function useMyLawyers(initialLawyers: Lawyer[]): UseMyLawyersReturn {
  const [lawyers, setLawyers] = useState(initialLawyers);

  const starredCount = getStarredCount(lawyers);

  const toggleStar = useCallback((lawyerId: number) => {
    setLawyers((prev) => toggleLawyerStar(prev, lawyerId));
  }, []);

  const sortedLawyers = sortLawyersByStarred(lawyers);

  return {
    lawyers,
    starredCount,
    toggleStar,
    sortedLawyers,
  };
}

interface UseLawyerModalReturn {
  selectedLawyer: Lawyer | null;
  openProfile: (lawyer: Lawyer) => void;
  closeProfile: () => void;
}

/**
 * Hook for managing lawyer profile modal with browser history
 */
export function useLawyerModal(): UseLawyerModalReturn {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      if (selectedLawyer) {
        setSelectedLawyer(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedLawyer]);

  const openProfile = useCallback((lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    window.history.pushState(
      { modal: 'lawyer-profile', lawyerId: lawyer.id },
      '',
      window.location.href
    );
  }, []);

  const closeProfile = useCallback(() => {
    setSelectedLawyer(null);
    if (window.history.state?.modal === 'lawyer-profile') {
      window.history.back();
    }
  }, []);

  return {
    selectedLawyer,
    openProfile,
    closeProfile,
  };
}
