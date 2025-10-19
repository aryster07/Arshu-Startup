import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  iconBgColor?: string;
  iconColor?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  iconBgColor = '#dbeafe',
  iconColor = '#2563eb'
}: FeatureCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border border-slate-200 bg-white"
      style={{ borderRadius: '16px' }}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {/* Icon */}
        <div 
          className="p-4 rounded-xl mb-2" 
          style={{ 
            backgroundColor: iconBgColor,
            borderRadius: '12px'
          }}
        >
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
        </div>
        
        {/* Title */}
        <h3 className="text-slate-900 font-serif-legal" style={{ fontSize: '16px', fontWeight: 600 }}>
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-slate-500" style={{ fontSize: '13px', lineHeight: '1.5' }}>
          {description}
        </p>
        
        {/* Access Link */}
        <button 
          className="text-primary hover:underline mt-2"
          style={{ 
            color: '#2563eb',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Access
        </button>
      </div>
    </Card>
  );
}
