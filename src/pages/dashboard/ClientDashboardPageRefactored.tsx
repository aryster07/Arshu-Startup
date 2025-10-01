/**
 * Professional Client Dashboard Page - Original UI with Modular Architecture
 * Maintains original design while using refactored modular components
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card } from '../../components/ui/card';
import AppLayout from '../../layouts/AppLayout';
import { AnalysisSection } from '../../components/dashboard/AnalysisSection';
import { ServicesGrid } from '../../components/dashboard/ServicesGrid';
import { CasesList } from '../../components/dashboard/CasesList';
import { ConsultationForm } from '../../components/dashboard/ConsultationForm';
import { ConsultationBooking } from '../../types/dashboard';
// import { useNotification } from '../../hooks/useNotification'; // Removed for now

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
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="services" className="text-xs lg:text-sm py-3 lg:py-2">
              Legal Services
            </TabsTrigger>
            <TabsTrigger value="cases" className="text-xs lg:text-sm py-3 lg:py-2">
              My Cases
            </TabsTrigger>
            <TabsTrigger value="consultation" className="text-xs lg:text-sm py-3 lg:py-2">
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