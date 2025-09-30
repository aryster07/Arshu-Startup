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

export default function ClientDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
  };

  const handleConsultationBooking = (booking: ConsultationBooking) => {
    // Handle consultation booking submission
    console.log('Consultation booking:', booking);
    // You can add your booking logic here
    alert('Consultation booking submitted successfully!');
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

        {/* Voice Search Section - Original Card Style */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200">
          <AnalysisSection
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            isInCard={true}
          />
        </Card>

        {/* Main Tabs - Original Layout */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Legal Services</TabsTrigger>
            <TabsTrigger value="cases">My Cases</TabsTrigger>
            <TabsTrigger value="consultation">Book Consultation</TabsTrigger>
          </TabsList>

          {/* Legal Services Tab */}
          <TabsContent value="services" className="space-y-8">
            <ServicesGrid isOriginalLayout={true} />
          </TabsContent>

          {/* My Cases Tab */}
          <TabsContent value="cases" className="space-y-6">
            <CasesList isOriginalLayout={true} />
          </TabsContent>

          {/* Book Consultation Tab */}
          <TabsContent value="consultation" className="space-y-8">
            <Card className="p-8">
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