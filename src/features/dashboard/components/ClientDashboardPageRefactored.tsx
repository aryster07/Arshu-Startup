/**
 * Professional Client Dashboard Page - Original UI with Modular Architecture
 * Maintains original design while using refactored modular components
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { Card } from '../../../shared/components/ui/card';
import AppLayout from '../../../core/layouts/AppLayout';
import { AnalysisSection } from './AnalysisSection';
import { ServicesGrid } from './ServicesGrid';
import { CasesList } from './CasesList';
import { ConsultationForm } from './ConsultationForm';
import { ConsultationBooking } from '../../../shared/types/dashboard';
// import { useNotification } from '../../hooks/useNotification'; // Removed for now

// Custom styles to ensure active tab styling works
const customTabStyles = `
  .custom-tab-trigger[data-state="active"] {
    background-color: white !important;
    color: rgb(37 99 235) !important;
    border-color: rgb(59 130 246) !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
    font-weight: 600 !important;
    transform: scale(1.02) !important;
  }
`;

export default function ClientDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  // Simple notification function (replaced useNotification hook)
  const notify = {
    success: (message: string) => {
      console.log('Success:', message);
      // You can implement toast notifications here
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
  };

  const handleConsultationBooking = (booking: ConsultationBooking) => {
    // Handle consultation booking submission
    console.log('Consultation booking:', booking);
    // You can add your booking logic here
    notify.success('Consultation booking submitted successfully!');
  };

  return (
    <AppLayout userType="client">
      {/* Custom styles for active tab visibility */}
      <style dangerouslySetInnerHTML={{ __html: customTabStyles }} />

      <div className="h-full flex flex-col">
        {/* Welcome Section - Original Style */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to Your Legal Portal
          </h1>
        </div>

        {/* Voice Search Section - Mobile-inspired design */}
        <Card className="p-4 lg:p-8 mb-6 lg:mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <AnalysisSection
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            isInCard={true}
          />
        </Card>

        {/* Main Tabs - Mobile responsive */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-slate-100 p-2 rounded-xl gap-2">
            <TabsTrigger
              value="services"
              className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-4 lg:px-6 flex-1 rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
            >
              Legal Services
            </TabsTrigger>
            <TabsTrigger
              value="cases"
              className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-4 lg:px-6 flex-1 rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
            >
              My Cases
            </TabsTrigger>
            <TabsTrigger
              value="consultation"
              className="custom-tab-trigger text-xs lg:text-sm py-3 lg:py-2 px-4 lg:px-6 flex-1 rounded-lg border-2 border-transparent text-slate-600 bg-transparent hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 ease-in-out"
            >
              Book Consultation
            </TabsTrigger>
          </TabsList>

          {/* Legal Services Tab */}
          <TabsContent value="services" className="space-y-6 lg:space-y-8">
            <ServicesGrid isOriginalLayout={true} />
          </TabsContent>

          {/* My Cases Tab */}
          <TabsContent value="cases" className="space-y-4 lg:space-y-6">
            <CasesList isOriginalLayout={true} />
          </TabsContent>

          {/* Book Consultation Tab */}
          <TabsContent value="consultation" className="space-y-6 lg:space-y-8">
            <Card className="p-4 lg:p-8">
              <ConsultationForm
                onSubmit={handleConsultationBooking}
                isOriginalLayout={true}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}