import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Shield, 
  ShoppingCart, 
  Phone, 
  User, 
  Users,
  Settings, 
  LogOut,
  ArrowLeft,
  Scale,
  MessageSquare,
  Calendar,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import ErrorBoundary from '../components/ui/ErrorBoundary';

interface AppLayoutProps {
  children: React.ReactNode;
  userType: 'client' | 'lawyer';
}

export default function AppLayout({ children, userType }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if we're on the main dashboard (no back button needed)
  const isMainDashboard = location.pathname === `/dashboard/${userType}`;

  // Close mobile menu when navigation occurs
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobileMenuOpen]);
  
  // Get current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/cases')) return 'Case Management';
    if (path.includes('/schedule')) return 'Schedule';
    if (path.includes('/clients')) return 'Client Management';
    if (path.includes('/messages')) return 'Communications';
    if (path.includes('/resources')) return 'Legal Resources';
    if (path.includes('/appointments')) return 'Appointments';
    if (path.includes('/legal-rights')) return 'Legal Rights Checker';
    if (path.includes('/consumer-rights')) return 'Consumer Rights Checker';
    if (path.includes('/emergency')) return 'Emergency Services';
    if (path.includes('/legal-notice')) return 'Legal Notice Service';
    if (path.includes('/profile')) return 'Profile Settings';
    if (path.includes('/settings')) return 'Settings';
    return userType === 'client' ? 'Client Portal' : 'Lawyer Portal';
  };

  const clientNavItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/client', id: 'dashboard' },
    { icon: FileText, label: 'Legal Rights', path: '/dashboard/client/legal-rights', id: 'legal-rights' },
    { icon: ShoppingCart, label: 'Consumer Rights', path: '/dashboard/client/consumer-rights', id: 'consumer-rights' },
    { icon: FileText, label: 'Document Review', path: '/dashboard/client/document-review', id: 'document-review' },
    { icon: Phone, label: 'Emergency Services', path: '/dashboard/client/emergency', id: 'emergency' },
    { icon: Scale, label: 'Legal Notice', path: '/dashboard/client/legal-notice', id: 'legal-notice' },
  ];

  const lawyerNavItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/lawyer', id: 'dashboard' },
    { icon: FileText, label: 'Case Management', path: '/dashboard/lawyer/cases', id: 'cases' },
    { icon: Calendar, label: 'Schedule', path: '/dashboard/lawyer/schedule', id: 'schedule' },
    { icon: Users, label: 'Clients', path: '/dashboard/lawyer/clients', id: 'clients' },
    { icon: MessageSquare, label: 'Communications', path: '/dashboard/lawyer/messages', id: 'messages' },
    { icon: Shield, label: 'Legal Resources', path: '/dashboard/lawyer/resources', id: 'resources' },
    { icon: Scale, label: 'Legal Tools', path: '/dashboard/lawyer/legal-rights', id: 'legal-tools' },
  ];

  const navItems = userType === 'client' ? clientNavItems : lawyerNavItems;

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/');
  };

  // Mobile-first layout structure
  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and Menu button */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (!isMainDashboard) {
                    navigate(`/dashboard/${userType}`);
                  } else {
                    navigate('/');
                  }
                }}
                className="h-9 w-9"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Center - Page title */}
            <div className="flex-1 text-center px-2">
              <h1 className="text-base font-semibold text-slate-900 truncate">
                {getPageTitle()}
              </h1>
            </div>

            {/* Right side - Notifications and profile */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="mobile-menu fixed top-0 left-0 right-0 z-50 bg-white shadow-xl transform transition-transform duration-300 max-h-96 overflow-y-auto">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex-shrink-0">
                      <img src="/logo.svg" alt="Law Bandhu" className="w-full h-full" />
                    </div>
                    <div>
                      <h1 className="font-bold text-lg text-slate-900">Law Bandhu</h1>
                      <p className="text-xs text-slate-600 capitalize">{userType} Portal</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to="/dashboard/profile"
                    className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-xs font-medium">Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-xs font-medium">Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-xs font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Desktop layout (existing design preserved)
  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex-shrink-0">
              <img src="/logo.svg" alt="Law Bandhu" className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">Law Bandhu</h1>
              <p className="text-xs text-slate-600 capitalize">{userType} Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="space-y-2">
            <Link
              to="/dashboard/profile"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <User className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Profile</span>
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Desktop Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isMainDashboard && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/dashboard/${userType}`)}
                  className="h-9 w-9"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {getPageTitle()}
                </h2>
                <p className="text-sm text-slate-600">
                  {isMainDashboard 
                    ? 'Welcome back! Manage your legal matters efficiently.'
                    : 'Navigate back to dashboard anytime'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">John Doe</p>
                  <p className="text-slate-600 capitalize">{userType}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6">
            <ErrorBoundary level="section">
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}