import { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./components/pages/LandingPage";
import { AuthPage } from "./components/pages/AuthPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ConsultantPage } from "./components/pages/ConsultantPage";
import { LawyersPage } from "./components/pages/LawyersPage";
import { CasesPage } from "./components/pages/CasesPage";
import { PaymentPage } from "./components/pages/PaymentPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

type AppView = 'landing' | 'auth' | 'dashboard';
type DashboardView = 'dashboard' | 'consultant' | 'lawyers' | 'cases' | 'payment' | 'settings';

function AppContent() {
  // � AUTHENTICATION ENABLED - Auth0 OAuth & OTP active
  const DEV_MODE = false; // Set to true to bypass authentication for testing
  
  // Start at landing page (not logged in)
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [dashboardView, setDashboardView] = useState<DashboardView>('dashboard');
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setCurrentView(event.state.view || 'landing');
        setDashboardView(event.state.dashboardView || 'dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial state if not already set
    if (!window.history.state) {
      window.history.replaceState(
        { view: currentView, dashboardView },
        '',
        window.location.href
      );
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Auto-navigate to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && currentView !== 'dashboard') {
      setCurrentView('dashboard');
      window.history.pushState(
        { view: 'dashboard', dashboardView: 'dashboard' },
        '',
        window.location.href
      );
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    // 🚧 DEV MODE: Skip to dashboard directly
    if (DEV_MODE) {
      setCurrentView('dashboard');
      setDashboardView('dashboard');
      window.history.pushState(
        { view: 'dashboard', dashboardView: 'dashboard' },
        '',
        window.location.href
      );
      return;
    }
    
    setCurrentView('auth');
    window.history.pushState(
      { view: 'auth', dashboardView },
      '',
      window.location.href
    );
  };

  const handleAuthSuccess = () => {
    setCurrentView('dashboard');
    setDashboardView('dashboard');
    window.history.pushState(
      { view: 'dashboard', dashboardView: 'dashboard' },
      '',
      window.location.href
    );
  };

  const handleBackToLanding = () => {
    window.history.back();
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
    setDashboardView('dashboard');
    window.history.pushState(
      { view: 'landing', dashboardView: 'dashboard' },
      '',
      window.location.href
    );
  };

  const handleDashboardViewChange = (view: string) => {
    setDashboardView(view as DashboardView);
    window.history.pushState(
      { view: 'dashboard', dashboardView: view },
      '',
      window.location.href
    );
  };

  // Show loading state
  if (isLoading && !DEV_MODE) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Landing Page View
  if (currentView === 'landing') {
    return (
      <>
        {/* 🚧 DEV MODE INDICATOR */}
        {DEV_MODE && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 px-4 text-sm font-semibold z-50 shadow-lg">
            🚧 DEV MODE: Authentication Bypassed - Click "Get Started" to go directly to Dashboard
          </div>
        )}
        <Navbar onLoginClick={handleLogin} />
        <LandingPage onGetStarted={handleLogin} />
      </>
    );
  }

  // Auth Page View
  if (currentView === 'auth') {
    return (
      <AuthPage 
        onBack={handleBackToLanding} 
        onSuccess={handleAuthSuccess} 
      />
    );
  }

  // Dashboard View
  const renderDashboardContent = () => {
    switch (dashboardView) {
      case 'consultant':
        return <ConsultantPage />;
      case 'lawyers':
        return <LawyersPage />;
      case 'cases':
        return <CasesPage />;
      case 'payment':
        return <PaymentPage />;
      case 'settings':
        return (
          <div>
            <div className="bg-white border border-slate-200 p-8 text-center" style={{ borderRadius: '12px' }}>
              <p className="text-slate-600">Settings page coming soon...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 🚧 DEV MODE INDICATOR on Dashboard */}
      {DEV_MODE && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 px-4 text-sm font-semibold z-50 shadow-lg">
          🚧 DEV MODE: Authentication Bypassed - Set DEV_MODE to false in App.tsx to enable real auth
        </div>
      )}
      <DashboardPage 
        activeView={dashboardView} 
        onViewChange={handleDashboardViewChange}
        onLogout={handleLogout}
      >
        {renderDashboardContent()}
      </DashboardPage>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
