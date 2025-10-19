import { useState } from "react";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./components/pages/LandingPage";
import { AuthPage } from "./components/pages/AuthPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ConsultantPage } from "./components/pages/ConsultantPage";
import { LawyersPage } from "./components/pages/LawyersPage";
import { CasesPage } from "./components/pages/CasesPage";
import { PaymentPage } from "./components/pages/PaymentPage";

type AppView = 'landing' | 'auth' | 'dashboard';
type DashboardView = 'dashboard' | 'consultant' | 'lawyers' | 'cases' | 'payment' | 'settings';

export default function App() {
  // Start at landing page (not logged in)
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [dashboardView, setDashboardView] = useState<DashboardView>('dashboard');

  const handleLogin = () => {
    setCurrentView('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentView('dashboard');
    setDashboardView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleLogout = () => {
    setCurrentView('landing');
    setDashboardView('dashboard');
  };

  const handleDashboardViewChange = (view: string) => {
    setDashboardView(view as DashboardView);
  };

  // Landing Page View
  if (currentView === 'landing') {
    return (
      <>
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
            <h1 className="text-slate-900 mb-6" style={{ fontSize: '28px', fontWeight: 700 }}>
              Settings
            </h1>
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
    <DashboardPage 
      activeView={dashboardView} 
      onViewChange={handleDashboardViewChange}
      onLogout={handleLogout}
    >
      {renderDashboardContent()}
    </DashboardPage>
  );
}
