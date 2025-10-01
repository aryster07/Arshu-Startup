import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
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
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 ${className}`}>
      {LEGAL_SERVICES.map((service, index) => (
        <Link key={index} to={service.path}>
          <Card className="h-full p-6 lg:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] border border-slate-200 hover:border-blue-300 group bg-white">
            <div className="flex flex-col h-full">
              {/* Icon Header */}
              <div className="flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl mb-6 group-hover:from-blue-200 group-hover:to-blue-100 transition-all duration-300 mx-auto">
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                  {React.cloneElement(service.icon as React.ReactElement, { 
                    className: "h-8 w-8 lg:h-10 lg:w-10" 
                  })}
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed flex-1 group-hover:text-slate-700 transition-colors duration-300 mb-4">
                  {service.description}
                </p>
                
                {/* Access Button */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-10 group-hover:bg-blue-700 transition-all duration-300"
                >
                  Access Service
                </Button>
              </div>
              
              {/* Bottom Accent */}
              <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-slate-300 rounded-full group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300"></div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}