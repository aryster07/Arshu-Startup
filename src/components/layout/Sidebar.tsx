import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Briefcase, 
  CreditCard, 
  Settings,
  Scale 
} from "lucide-react";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'consultant', label: 'Find Legal Consultant', icon: Search },
  { id: 'lawyers', label: 'My Lawyers', icon: Users },
  { id: 'cases', label: 'Your Cases', icon: Briefcase },
  { id: 'payment', label: 'Payment History', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeItem = 'dashboard', onItemClick }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 fixed left-0 top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Scale className="w-7 h-7 text-primary" style={{ color: '#2563eb' }} />
          <div>
            <h1 className="text-slate-900 font-serif-legal" style={{ fontSize: '18px', fontWeight: 700 }}>
              Legal Portal
            </h1>
            <p className="text-slate-500" style={{ fontSize: '12px' }}>
              Law Bandhu Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
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
    </aside>
  );
}
