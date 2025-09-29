import React from 'react';
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
  Bell
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
  userType: 'client' | 'lawyer';
}

export default function AppLayout({ children, userType }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the main dashboard (no back button needed)
  const isMainDashboard = location.pathname === `/dashboard/${userType}`;
  
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
    { icon: MessageSquare, label: 'My Cases', path: '/dashboard/client/cases', id: 'cases' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/client/appointments', id: 'appointments' },
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

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Static Sidebar - Fixed Height, No Scroll */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-hidden">
        {/* Sidebar Header - Fixed */}
        <div className="p-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">LawB</h1>
              <p className="text-xs text-slate-600 capitalize">{userType} Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation - Static, No Scroll */}
        <nav className="flex-1 p-4 overflow-hidden">
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
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer - Fixed */}
        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="space-y-2">
            <Link
              to="/dashboard/profile"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Right Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar - Fixed Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
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
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
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

        {/* Main Content Area - Only This Scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}