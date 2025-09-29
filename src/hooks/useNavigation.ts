import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { ROUTES, PAGE_TITLES } from '../constants/routes';

/**
 * Custom hook for programmatic navigation with mobile gesture support
 */
export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = useCallback((path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  const getCurrentPath = useCallback(() => {
    return location.pathname;
  }, [location.pathname]);

  const getCurrentTitle = useCallback(() => {
    return PAGE_TITLES[location.pathname as keyof typeof PAGE_TITLES] || 'Legal Platform';
  }, [location.pathname]);

  const isCurrentPath = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const isPathActive = useCallback((path: string) => {
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Update document title based on current route
  useEffect(() => {
    const title = getCurrentTitle();
    document.title = title;
  }, [getCurrentTitle]);

  return {
    navigateTo,
    goBack,
    goForward,
    goHome,
    getCurrentPath,
    getCurrentTitle,
    isCurrentPath,
    isPathActive,
    location,
  };
}

/**
 * Hook for mobile-friendly navigation with swipe gestures
 */
export function useMobileNavigation() {
  const { goBack, goForward } = useNavigation();

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX;
      endY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 100;
      const maxVerticalDistance = 100;

      // Only trigger navigation if horizontal swipe is significant and vertical movement is minimal
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalDistance) {
        if (deltaX > 0) {
          // Swipe right - go back
          goBack();
        } else {
          // Swipe left - go forward (if available)
          goForward();
        }
      }
    };

    // Only add listeners on touch devices
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if ('ontouchstart' in window) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [goBack, goForward]);

  return {
    goBack,
    goForward,
  };
}

/**
 * Hook for breadcrumb navigation
 */
export function useBreadcrumbs() {
  const { getCurrentPath } = useNavigation();
  
  const getBreadcrumbs = useCallback(() => {
    const path = getCurrentPath();
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs: Array<{ label: string; path: string }> = [
      { label: 'Home', path: ROUTES.HOME }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map segments to readable labels
      const segmentLabels: Record<string, string> = {
        'dashboard': 'Dashboard',
        'client': 'Client',
        'lawyer': 'Lawyer',
        'services': 'Services',
        'legal-rights': 'Legal Rights',
        'consumer-rights': 'Consumer Rights',
        'document-review': 'Document Review',
        'emergency': 'Emergency Services',
        'legal-notice': 'Legal Notice',
        'about': 'About',
        'contact': 'Contact',
        'team': 'Team',
        'works': 'Works',
      };

      const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        path: currentPath,
      });
    });

    return breadcrumbs;
  }, [getCurrentPath]);

  return {
    breadcrumbs: getBreadcrumbs(),
  };
}