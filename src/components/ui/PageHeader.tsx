import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

interface PageHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backUrl?: string;
  className?: string;
}

export default function PageHeader({ 
  title, 
  showBackButton = true, 
  backUrl = '/',
  className = '' 
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(backUrl);
  };

  return (
    <div className={`bg-white border-b border-slate-200 py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </Button>
          )}
          {title && (
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}