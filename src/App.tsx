import { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./components/pages/LandingPage";
import { AuthPage } from "./components/pages/AuthPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ConsultantPage } from "./components/pages/ConsultantPage";
import { LawyersPage } from "./components/pages/LawyersPage";
import { CasesPage } from "./components/pages/CasesPage";
import { PaymentPage } from "./components/pages/PaymentPage";
import { RoleSelectionPage } from "./components/pages/RoleSelectionPage";
import { UserProfileSetup } from "./components/pages/UserProfileSetup";
import { LawyerProfileSetup } from "./components/pages/LawyerProfileSetup";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

type AppView = 'landing' | 'auth' | 'role-selection' | 'user-profile-setup' | 'lawyer-profile-setup' | 'dashboard';
type DashboardView = 'dashboard' | 'consultant' | 'lawyers' | 'cases' | 'payment' | 'settings';

function AppContent() {
  // MVP Mode - Direct access without login
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [dashboardView, setDashboardView] = useState<DashboardView>('dashboard');
  const { 
    isAuthenticated, 
    isLoading, 
    logout, 
    userRole, 
    profileCompleted,
    setUserRole,
    completeUserProfile,
    completeLawyerProfile,
    user
  } = useAuth();

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

  // Auto-navigate based on auth state and profile completion
  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading
    
    if (isAuthenticated) {
      // User is logged in - determine where to navigate
      if (!userRole) {
        // Need to select role
        if (currentView !== 'role-selection') {
          setCurrentView('role-selection');
        }
      } else if (!profileCompleted) {
        // Need to complete profile
        const targetView = userRole === 'lawyer' ? 'lawyer-profile-setup' : 'user-profile-setup';
        if (currentView !== targetView) {
          setCurrentView(targetView);
        }
      } else {
        // Profile complete - go to dashboard
        if (currentView !== 'dashboard') {
          setCurrentView('dashboard');
        }
      }
    } else {
      // Not authenticated - ensure we're on landing or auth
      if (currentView !== 'landing' && currentView !== 'auth') {
        setCurrentView('landing');
      }
    }
  }, [isAuthenticated, isLoading, userRole, profileCompleted]);

  const handleLogin = () => {
    // Show auth page for login/signup
    setCurrentView('auth');
    window.history.pushState(
      { view: 'auth', dashboardView: 'dashboard' },
      '',
      window.location.href
    );
  };

  const handleAuthSuccess = () => {
    // Navigation will be handled by the useEffect based on auth state
    // Just trigger a re-check by doing nothing - the auth state change will handle it
    console.log('Auth success - navigation will be handled by useEffect');
  };

  const handleRoleSelect = async (role: 'user' | 'lawyer') => {
    try {
      await setUserRole(role);
      // Navigation will be handled by useEffect when role state updates
    } catch (err) {
      console.error('Failed to set role:', err);
    }
  };

  const handleUserProfileComplete = async (data: { name: string }) => {
    try {
      await completeUserProfile(data);
      // Navigation will be handled by useEffect when profile state updates
    } catch (err) {
      console.error('Failed to complete profile:', err);
    }
  };

  const handleLawyerProfileComplete = async (data: any) => {
    try {
      await completeLawyerProfile(data);
      // Navigation will be handled by useEffect when profile state updates
    } catch (err) {
      console.error('Failed to complete profile:', err);
    }
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
  if (isLoading) {
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

  // Role Selection View
  if (currentView === 'role-selection') {
    return (
      <RoleSelectionPage 
        onSelect={handleRoleSelect}
        onBack={() => {
          logout();
          setCurrentView('landing');
        }}
      />
    );
  }

  // User Profile Setup View
  if (currentView === 'user-profile-setup') {
    return (
      <UserProfileSetup 
        onComplete={handleUserProfileComplete}
        onBack={() => setCurrentView('role-selection')}
        initialName={user?.name}
      />
    );
  }

  // Lawyer Profile Setup View
  if (currentView === 'lawyer-profile-setup') {
    return (
      <LawyerProfileSetup 
        onComplete={handleLawyerProfileComplete}
        onBack={() => setCurrentView('role-selection')}
        initialData={{ name: user?.name }}
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
