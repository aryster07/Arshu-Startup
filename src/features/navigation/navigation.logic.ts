/**
 * Navigation Feature - Business Logic
 * Pure functions for navigation state management
 */

import type { AppView, DashboardView } from '../../types';

export interface NavigationState {
  view: AppView;
  dashboardView: DashboardView;
}

/**
 * Get page header info based on dashboard view
 */
export function getPageHeader(view: DashboardView): { title: string; subtitle: string } {
  const headers: Record<DashboardView, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Law Bandhu Legal Portal',
      subtitle: 'Your trusted legal assistance platform',
    },
    consultant: {
      title: 'Find Legal Consultant',
      subtitle: 'Connect with expert lawyers for your legal needs',
    },
    lawyers: {
      title: 'My Lawyers',
      subtitle: 'Manage your legal professionals and connections',
    },
    cases: {
      title: 'Your Cases',
      subtitle: 'Track and manage your legal cases',
    },
    payment: {
      title: 'Payment History',
      subtitle: 'View your transaction records and invoices',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your account preferences',
    },
  };

  return headers[view] || headers.dashboard;
}

/**
 * Create history state object
 */
export function createHistoryState(view: AppView, dashboardView: DashboardView): NavigationState {
  return { view, dashboardView };
}

/**
 * Check if navigation state is valid
 */
export function isValidAppView(view: string): view is AppView {
  return ['landing', 'auth', 'dashboard'].includes(view);
}

export function isValidDashboardView(view: string): view is DashboardView {
  return ['dashboard', 'consultant', 'lawyers', 'cases', 'payment', 'settings'].includes(view);
}
