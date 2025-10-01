import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Layouts
import DefaultLayout from '../layouts/DefaultLayout';
import AppLayout from '../layouts/AppLayout';

// Responsive Pages
import HomePageResponsive from '../pages/HomePageResponsive';
import ClientDashboardResponsive from '../pages/dashboard/ClientDashboardResponsive';
import LawyerDashboardResponsive from '../pages/dashboard/LawyerDashboardResponsive';

// Static pages - using existing components
import AboutPage from '../components/AboutPage';
import ContactPage from '../components/ContactPage';
import ServicesPage from '../components/ServicesPage';
import LegalRightsChecker from '../components/LegalRightsChecker';
import ConsumerRightsChecker from '../components/ConsumerRightsChecker';
import DocumentReview from '../components/DocumentReview';
import EmergencyServices from '../components/EmergencyServices';
import LegalNoticeService from '../components/LegalNoticeService';

// Import navigation utility
import { useSimpleNavigation } from '../hooks/useSimpleNavigation';

// Wrapper component for legal services that provides navigation
const WithNavigation = ({ children }: { children: (navigate: (screen: string) => void) => React.ReactNode }) => {
  const { navigateTo } = useSimpleNavigation();
  return <>{children(navigateTo)}</>;
};

// Wrapper components for legal services (marketing site)
const LegalRightsPage = () => (
  <DefaultLayout>
    <WithNavigation>
      {(navigate) => <LegalRightsChecker onNavigate={navigate} />}
    </WithNavigation>
  </DefaultLayout>
);

const ConsumerRightsPage = () => (
  <DefaultLayout>
    <WithNavigation>
      {(navigate) => <ConsumerRightsChecker onNavigate={navigate} />}
    </WithNavigation>
  </DefaultLayout>
);

const EmergencyServicesPage = () => (
  <DefaultLayout>
    <WithNavigation>
      {(navigate) => <EmergencyServices onNavigate={navigate} />}
    </WithNavigation>
  </DefaultLayout>
);

const LegalNoticeServicePage = () => (
  <DefaultLayout>
    <WithNavigation>
      {(navigate) => <LegalNoticeService onNavigate={navigate} />}
    </WithNavigation>
  </DefaultLayout>
);

// Portal-specific service pages (full-screen with AppLayout)
const PortalLegalRightsPage = ({ userType }: { userType: 'client' | 'lawyer' }) => (
  <AppLayout userType={userType}>
    <div className="h-full">
      <LegalRightsChecker onNavigate={() => {}} />
    </div>
  </AppLayout>
);

const PortalConsumerRightsPage = ({ userType }: { userType: 'client' | 'lawyer' }) => (
  <AppLayout userType={userType}>
    <div className="h-full">
      <ConsumerRightsChecker onNavigate={() => {}} />
    </div>
  </AppLayout>
);

const PortalDocumentReviewPage = ({ userType }: { userType: 'client' | 'lawyer' }) => (
  <AppLayout userType={userType}>
    <div className="h-full">
      <DocumentReview onNavigate={() => {}} />
    </div>
  </AppLayout>
);

const PortalEmergencyServicesPage = ({ userType }: { userType: 'client' | 'lawyer' }) => (
  <AppLayout userType={userType}>
    <div className="h-full">
      <EmergencyServices onNavigate={() => {}} />
    </div>
  </AppLayout>
);

const PortalLegalNoticeServicePage = ({ userType }: { userType: 'client' | 'lawyer' }) => (
  <AppLayout userType={userType}>
    <div className="h-full">
      <LegalNoticeService onNavigate={() => {}} />
    </div>
  </AppLayout>
);

const NotFoundPage = () => (
  <DefaultLayout>
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404 - Page Not Found</h1>
        <p className="text-slate-600 mb-8">The page you're looking for doesn't exist.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Go Home
        </button>
      </div>
    </div>
  </DefaultLayout>
);

export default function SimpleRouter() {
  return (
    <Routes>
      {/* Homepage */}
      <Route path={ROUTES.HOME} element={<HomePageResponsive />} />
      
      {/* Dashboard routes */}
      <Route path={ROUTES.CLIENT_DASHBOARD} element={<ClientDashboardResponsive />} />
      <Route path="/dashboard/lawyer" element={<LawyerDashboardResponsive />} />
      
      {/* Client Portal Services */}
      <Route path="/dashboard/client/legal-rights" element={<PortalLegalRightsPage userType="client" />} />
      <Route path="/dashboard/client/consumer-rights" element={<PortalConsumerRightsPage userType="client" />} />
      <Route path="/dashboard/client/document-review" element={<PortalDocumentReviewPage userType="client" />} />
      <Route path="/dashboard/client/emergency" element={<PortalEmergencyServicesPage userType="client" />} />
      <Route path="/dashboard/client/legal-notice" element={<PortalLegalNoticeServicePage userType="client" />} />
      
      {/* Lawyer Portal Services */}
      <Route path="/dashboard/lawyer/legal-rights" element={<PortalLegalRightsPage userType="lawyer" />} />
      <Route path="/dashboard/lawyer/consumer-rights" element={<PortalConsumerRightsPage userType="lawyer" />} />
      <Route path="/dashboard/lawyer/document-review" element={<PortalDocumentReviewPage userType="lawyer" />} />
      <Route path="/dashboard/lawyer/emergency" element={<PortalEmergencyServicesPage userType="lawyer" />} />
      <Route path="/dashboard/lawyer/legal-notice" element={<PortalLegalNoticeServicePage userType="lawyer" />} />
      
      {/* Marketing Legal services */}
      <Route path={ROUTES.LEGAL_RIGHTS} element={<LegalRightsPage />} />
      <Route path={ROUTES.CONSUMER_RIGHTS} element={<ConsumerRightsPage />} />
      <Route path={ROUTES.EMERGENCY_SERVICES} element={<EmergencyServicesPage />} />
      <Route path={ROUTES.LEGAL_NOTICE} element={<LegalNoticeServicePage />} />
      
      {/* Static pages */}
      <Route path={ROUTES.ABOUT} element={<DefaultLayout><WithNavigation>{(navigate) => <AboutPage onNavigate={navigate} />}</WithNavigation></DefaultLayout>} />
      <Route path={ROUTES.CONTACT} element={<DefaultLayout><WithNavigation>{(navigate) => <ContactPage onNavigate={navigate} />}</WithNavigation></DefaultLayout>} />
      <Route path={ROUTES.SERVICES} element={<DefaultLayout><WithNavigation>{(navigate) => <ServicesPage onNavigate={navigate} />}</WithNavigation></DefaultLayout>} />
      
      {/* Legacy redirects */}
      <Route path="/client" element={<Navigate to={ROUTES.CLIENT_DASHBOARD} replace />} />
      <Route path="/lawyer" element={<Navigate to="/dashboard/lawyer" replace />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}