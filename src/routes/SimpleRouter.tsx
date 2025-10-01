import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Layouts
import DefaultLayout from '../layouts/DefaultLayout';
import AppLayout from '../layouts/AppLayout';

// Dashboard Pages - using original design
import ClientDashboardResponsive from '../pages/dashboard/ClientDashboardResponsive';
import LawyerDashboardResponsive from '../pages/dashboard/LawyerDashboardResponsive';

// Responsive Pages
import HomePageResponsive from '../pages/HomePageResponsive';

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

const DocumentReviewPage = () => (
  <DefaultLayout>
    <WithNavigation>
      {(navigate) => <DocumentReview onNavigate={navigate} />}
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
      <Route path={ROUTES.LAWYER_DASHBOARD} element={<LawyerDashboardResponsive />} />
      
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
      
      {/* Public pages with marketing layout */}
      <Route path="/about" element={
        <DefaultLayout>
          <AboutPage />
        </DefaultLayout>
      } />
      <Route path="/contact" element={
        <DefaultLayout>
          <ContactPage />
        </DefaultLayout>
      } />
      <Route path="/services" element={
        <DefaultLayout>
          <ServicesPage />
        </DefaultLayout>
      } />
      
      {/* Legal services pages */}
      <Route path="/services/legal-rights" element={<LegalRightsPage />} />
      <Route path="/services/consumer-rights" element={<ConsumerRightsPage />} />
      <Route path="/services/document-review" element={<DocumentReviewPage />} />
      <Route path="/services/emergency" element={<EmergencyServicesPage />} />
      <Route path="/services/legal-notice" element={<LegalNoticeServicePage />} />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="/legal-rights" element={<LegalRightsPage />} />
      <Route path="/consumer-rights" element={<ConsumerRightsPage />} />
      <Route path="/document-review" element={<DocumentReviewPage />} />
      <Route path="/emergency" element={<EmergencyServicesPage />} />
      <Route path="/legal-notice" element={<LegalNoticeServicePage />} />
      
      {/* Legacy redirects for convenience */}
      <Route path="/client/auth" element={<Navigate to={ROUTES.CLIENT_DASHBOARD} replace />} />
      <Route path="/lawyer/auth" element={<Navigate to={ROUTES.LAWYER_DASHBOARD} replace />} />
      <Route path="/auth/*" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to={ROUTES.CLIENT_DASHBOARD} replace />} />
      <Route path="/signup" element={<Navigate to={ROUTES.CLIENT_DASHBOARD} replace />} />
      <Route path="/client" element={<Navigate to={ROUTES.CLIENT_DASHBOARD} replace />} />
      <Route path="/lawyer" element={<Navigate to={ROUTES.LAWYER_DASHBOARD} replace />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
