import { Search, Users, Briefcase, CreditCard } from "lucide-react";

interface MobileNavProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navItems = [
  { id: 'consultant', label: 'Get Consultant', icon: Search },
  { id: 'lawyers', label: 'My Lawyers', icon: Users },
  { id: 'cases', label: 'Your Cases', icon: Briefcase },
  { id: 'payment', label: 'Payment', icon: CreditCard },
];

export function MobileNav({ activeItem = 'consultant', onItemClick }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-blue-600'
                  : 'text-slate-500'
              }`}
              style={isActive ? { color: '#2563eb' } : {}}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span style={{ fontSize: '11px' }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
