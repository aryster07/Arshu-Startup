/**
 * Navigation Feature - Custom Hooks
 */

import { useState, useEffect, useCallback } from 'react';
import type { AppView, DashboardView } from '../../types';
import { createHistoryState } from './navigation.logic';

interface UseAppNavigationReturn {
  currentView: AppView;
  dashboardView: DashboardView;
  navigateTo: (view: AppView) => void;
  navigateToDashboard: (view: DashboardView) => void;
  goBack: () => void;
}

/**
 * Hook for managing app-level navigation with browser history
 */
export function useAppNavigation(
  isAuthenticated: boolean
): UseAppNavigationReturn {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [dashboardView, setDashboardView] = useState<DashboardView>('dashboard');

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setCurrentView(event.state.view || 'landing');
        setDashboardView(event.state.dashboardView || 'dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial state
    if (!window.history.state) {
      window.history.replaceState(
        createHistoryState(currentView, dashboardView),
        '',
        window.location.href
      );
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-navigate to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && currentView !== 'dashboard') {
      setCurrentView('dashboard');
      window.history.pushState(
        createHistoryState('dashboard', 'dashboard'),
        '',
        window.location.href
      );
    }
  }, [isAuthenticated, currentView]);

  const navigateTo = useCallback((view: AppView) => {
    setCurrentView(view);
    if (view === 'dashboard') {
      setDashboardView('dashboard');
    }
    window.history.pushState(
      createHistoryState(view, view === 'dashboard' ? 'dashboard' : dashboardView),
      '',
      window.location.href
    );
  }, [dashboardView]);

  const navigateToDashboard = useCallback((view: DashboardView) => {
    setDashboardView(view);
    window.history.pushState(
      createHistoryState('dashboard', view),
      '',
      window.location.href
    );
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  return {
    currentView,
    dashboardView,
    navigateTo,
    navigateToDashboard,
    goBack,
  };
}
