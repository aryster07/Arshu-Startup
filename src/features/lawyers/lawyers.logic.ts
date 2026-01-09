/**
 * Lawyer Feature - Business Logic
 * Pure functions for lawyer-related operations
 * Separated from UI for testability and reusability
 */

import type { Lawyer, LawyerFilterOptions } from '../../types';

/**
 * Filter lawyers based on search query and filter options
 */
export function filterLawyers(
  lawyers: Lawyer[],
  searchQuery: string,
  filters: LawyerFilterOptions
): Lawyer[] {
  return lawyers.filter((lawyer) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        lawyer.name.toLowerCase().includes(query) ||
        lawyer.specialization.toLowerCase().includes(query) ||
        lawyer.location.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Specialization filter
    if (filters.specializations.length > 0) {
      if (!filters.specializations.includes(lawyer.specialization)) return false;
    }

    // Experience filter
    if (lawyer.experience < filters.experience[0] || lawyer.experience > filters.experience[1]) {
      return false;
    }

    // Rating filter
    if (lawyer.rating < filters.rating) return false;

    // Language filter
    if (filters.languages.length > 0) {
      const hasMatchingLanguage = filters.languages.some((lang) =>
        lawyer.languages.includes(lang)
      );
      if (!hasMatchingLanguage) return false;
    }

    // Location filter
    if (filters.location.length > 0) {
      if (!filters.location.includes(lawyer.location)) return false;
    }

    // Consultation fee filter
    if (
      lawyer.consultationFee < filters.consultationFee[0] ||
      lawyer.consultationFee > filters.consultationFee[1]
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Sort lawyers by starred status (starred first)
 */
export function sortLawyersByStarred(lawyers: Lawyer[]): Lawyer[] {
  return [...lawyers].sort((a, b) => {
    if (a.isStarred && !b.isStarred) return -1;
    if (!a.isStarred && b.isStarred) return 1;
    return 0;
  });
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: LawyerFilterOptions): number {
  return (
    filters.specializations.length +
    filters.languages.length +
    filters.location.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.experience[0] > 0 || filters.experience[1] < 50 ? 1 : 0) +
    (filters.consultationFee[0] > 0 || filters.consultationFee[1] < 10000 ? 1 : 0)
  );
}

/**
 * Get count of starred lawyers
 */
export function getStarredCount(lawyers: Lawyer[]): number {
  return lawyers.filter((l) => l.isStarred).length;
}

/**
 * Toggle lawyer starred status
 */
export function toggleLawyerStar(lawyers: Lawyer[], lawyerId: number): Lawyer[] {
  return lawyers.map((lawyer) =>
    lawyer.id === lawyerId ? { ...lawyer, isStarred: !lawyer.isStarred } : lawyer
  );
}

/**
 * Find lawyer by ID
 */
export function findLawyerById(lawyers: Lawyer[], id: number): Lawyer | undefined {
  return lawyers.find((lawyer) => lawyer.id === id);
}
