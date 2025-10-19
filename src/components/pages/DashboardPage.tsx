import { Search, Users, Briefcase, CreditCard, Menu, LayoutDashboard, Settings, User, LogOut } from "lucide-react";
import { Sidebar } from "../layout/Sidebar";
import { FeatureCard } from "../dashboard/FeatureCard";
import { AILegalAssistant } from "../dashboard/AILegalAssistant";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Scale } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";

interface DashboardPageProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export function DashboardPage({ activeView, onViewChange, onLogout, children }: DashboardPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'consultant', label: 'Find Legal Consultant', icon: Search },
    { id: 'lawyers', label: 'My Lawyers', icon: Users },
    { id: 'cases', label: 'Your Cases', icon: Briefcase },
    { id: 'payment', label: 'Payment History', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Get current page title and description based on activeView
  const getPageHeader = () => {
    switch (activeView) {
      case 'dashboard':
        return {
          title: 'Law Bandhu Legal Portal',
          subtitle: 'Your trusted legal assistance platform'
        };
      case 'consultant':
        return {
          title: 'Find Legal Consultant',
          subtitle: 'Connect with expert lawyers for your legal needs'
        };
      case 'lawyers':
        return {
          title: 'My Lawyers',
          subtitle: 'Manage your legal professionals and connections'
        };
      case 'cases':
        return {
          title: 'Your Cases',
          subtitle: 'Track and manage your legal cases'
        };
      case 'payment':
        return {
          title: 'Payment History',
          subtitle: 'View your transaction records and invoices'
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Manage your account preferences'
        };
      default:
        return {
          title: 'Law Bandhu Legal Portal',
          subtitle: 'Your trusted legal assistance platform'
        };
    }
  };

  const pageHeader = getPageHeader();

  const handleMobileNavClick = (item: string) => {
    onViewChange(item);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Logout clicked');
    }
  };

  const handleMyProfile = () => {
    // TODO: Navigate to profile page or open profile modal
    console.log('My Profile clicked');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar activeItem={activeView} onItemClick={onViewChange} />

      {/* Mobile Navigation Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Scale className="w-7 h-7 text-primary" style={{ color: '#2563eb' }} />
                  <div>
                    <SheetTitle className="text-slate-900 font-serif-legal" style={{ fontSize: '18px', fontWeight: 700 }}>
                      Legal Portal
                    </SheetTitle>
                    <p className="text-slate-500" style={{ fontSize: '12px' }}>
                      Law Bandhu Platform
                    </p>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Dynamic Header */}
        <header className="sticky top-0 z-40 bg-slate-100 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between max-w-md mx-auto lg:max-w-none">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-white rounded-lg -ml-2"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
              <div>
                <h1 className="text-slate-900 font-serif-legal text-xl lg:text-3xl font-bold">
                  {pageHeader.title}
                </h1>
                <p className="text-slate-500 text-sm lg:text-base">
                  {pageHeader.subtitle}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  <Avatar className="w-9 h-9 cursor-pointer">
                    <AvatarFallback className="bg-slate-800 text-white" style={{ fontSize: '13px' }}>
                      AR
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-slate-700">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleMyProfile} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 pb-8">
          {children || (
            <div className="max-w-md mx-auto lg:max-w-none">
              {/* AI Legal Assistant */}
              <div className="mb-6">
                <AILegalAssistant onNavigate={onViewChange} />
              </div>

              {/* Tab Navigation */}
              

              {/* Core Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard
                  title="Legal Consultation"
                  description="Find expert lawyers"
                  icon={Search}
                  onClick={() => onViewChange('consultant')}
                  iconBgColor="#dbeafe"
                  iconColor="#2563eb"
                />
                <FeatureCard
                  title="My Lawyers"
                  description="Manage legal professionals"
                  icon={Users}
                  onClick={() => onViewChange('lawyers')}
                  iconBgColor="#d1fae5"
                  iconColor="#10b981"
                />
                <FeatureCard
                  title="Your Cases"
                  description="Track case progress"
                  icon={Briefcase}
                  onClick={() => onViewChange('cases')}
                  iconBgColor="#e9d5ff"
                  iconColor="#a855f7"
                />
                <FeatureCard
                  title="Payment History"
                  description="Transaction records"
                  icon={CreditCard}
                  onClick={() => onViewChange('payment')}
                  iconBgColor="#fecdd3"
                  iconColor="#e11d48"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
