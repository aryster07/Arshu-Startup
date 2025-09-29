import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Check } from 'lucide-react';

interface RoleSelectionCardProps {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  className?: string;
}

export default function RoleSelectionCard({
  title,
  subtitle,
  description,
  benefits,
  icon,
  buttonText,
  onClick,
  className = ""
}: RoleSelectionCardProps) {
  return (
    <Card className={`group p-10 hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 bg-white ${className}`}>
      <div className="space-y-8">
        {/* Icon and Title */}
        <div className="flex items-start space-x-4">
          <div className="p-4 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600">{subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>

        {/* Benefits List */}
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center mt-0.5">
                <Check className="h-3 w-3 text-slate-600" />
              </div>
              <span className="text-slate-700 text-sm leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button 
          onClick={onClick}
          size="lg"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}