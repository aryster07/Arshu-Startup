import React from 'react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
}

export default function DashboardLayout({ 
  children, 
  title, 
  showBackButton = true,
  actions 
}: DashboardLayoutProps) {

  const handleBack = () => {
    window.history.back();
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navbar */}
      <Navbar />
      
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left section */}
            <div className="flex items-center space-x-4">
              {/* Brand Logo */}
              <button onClick={handleHome} className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700">
                <span>⚖️</span>
                <span>LawB Dashboard</span>
              </button>

              {/* Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {showBackButton && (
                  <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ← Back
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={handleHome}
                  className="text-gray-600 hover:text-gray-900"
                >
                  🏠 Home
                </Button>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {actions}
              
              {/* Simple user profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  👤
                </div>
                <span className="hidden md:block text-sm text-gray-700">User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {children}
        </div>
      </main>
    </div>
  );
}