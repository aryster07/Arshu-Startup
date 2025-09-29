import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Simple navigation utility that maps old screen names to routes
export const useSimpleNavigation = () => {
  const navigate = useNavigate();

  const handleNavigate = (screenOrPath: string) => {
    // If it's already a path (starts with /), use it directly
    if (screenOrPath.startsWith('/')) {
      navigate(screenOrPath);
      return;
    }

    // Map old screen names to routes
    const routeMap: Record<string, string> = {
      'home': ROUTES.HOME,
      'about': ROUTES.ABOUT,
      'contact': ROUTES.CONTACT,
      'services': ROUTES.SERVICES,
      'legal-rights': ROUTES.LEGAL_RIGHTS,
      'consumer-rights': ROUTES.CONSUMER_RIGHTS,
      'document-review': ROUTES.DOCUMENT_REVIEW,
      'emergency': ROUTES.EMERGENCY_SERVICES,
      'legal-notice': ROUTES.LEGAL_NOTICE,
      'client': ROUTES.CLIENT_DASHBOARD,
      'lawyer': ROUTES.LAWYER_DASHBOARD,
    };

    const route = routeMap[screenOrPath] || ROUTES.HOME;
    navigate(route);
  };

  return { navigateTo: handleNavigate };
};