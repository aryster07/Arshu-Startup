import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/card';
import { Shield, ShoppingCart, FileText, Phone } from 'lucide-react';

export interface LegalService {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const LEGAL_SERVICES: LegalService[] = [
  {
    title: "Legal Rights Checker",
    description: "AI-powered analysis of your legal rights and potential violations",
    icon: <Shield className="h-6 w-6" />,
    path: '/dashboard/client/legal-rights'
  },
  {
    title: "Consumer Rights Protection",
    description: "Comprehensive consumer protection and dispute resolution",
    icon: <ShoppingCart className="h-6 w-6" />,
    path: '/dashboard/client/consumer-rights'
  },
  {
    title: "Document Review",
    description: "Professional legal document preparation and review services",
    icon: <FileText className="h-6 w-6" />,
    path: '/dashboard/client/document-review'
  },
  {
    title: "Emergency Legal Help",
    description: "24/7 emergency legal assistance for urgent matters",
    icon: <Phone className="h-6 w-6" />,
    path: '/dashboard/client/emergency'
  }
];

interface ServicesGridProps {
  className?: string;
  isOriginalLayout?: boolean;
}

export function ServicesGrid({ className = "", isOriginalLayout = false }: ServicesGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-${isOriginalLayout ? '8' : '6'} ${className}`}>
      {LEGAL_SERVICES.map((service, index) => (
        <Link key={index} to={service.path}>
          <Card className={`${isOriginalLayout 
            ? 'h-full p-8 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 hover:border-blue-200 group'
            : 'p-6 hover:shadow-lg transition-shadow cursor-pointer'
          }`}>
            {isOriginalLayout ? (
              // Original Layout - More spacious with animation
              <div className="flex items-start space-x-4 h-full">
                <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-100 transition-colors duration-300 flex-shrink-0">
                  {service.icon}
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed flex-1">
                    {service.description}
                  </p>
                </div>
              </div>
            ) : (
              // Modern Compact Layout
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900">{service.title}</h3>
                </div>
                <p className="text-sm text-slate-600">{service.description}</p>
              </div>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}