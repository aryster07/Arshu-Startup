import React from 'react';

// Import the current HomePage (we'll fix it)
import DefaultLayout from '../core/layouts/DefaultLayout';
import { useNavigation } from '../shared/hooks/useNavigation';
import { ROUTES } from '../core/constants/routes';
import { Users, Scale, Shield, Clock, CheckCircle, Award, Users2, FileText } from 'lucide-react';
import { Button } from '../shared/components/ui/button';

// Desktop HomePage Component
function HomePageDesktop() {
  const { navigateTo } = useNavigation();

  const handleRoleSelection = (role: string) => {
    // Navigate to the appropriate dashboard
    if (role === 'client') {
      navigateTo(ROUTES.CLIENT_DASHBOARD);
    } else if (role === 'lawyer') {
      navigateTo(ROUTES.LAWYER_DASHBOARD);
    } else {
      // Fallback to services page
      navigateTo('/services');
    }
  };

  const navigateToScreen = (screen: string) => {
    const routeMap: Record<string, string> = {
      'about': ROUTES.ABOUT,
      'contact': ROUTES.CONTACT,
      'services': ROUTES.SERVICES,
      'legal-rights': ROUTES.LEGAL_RIGHTS,
      'consumer-rights': ROUTES.CONSUMER_RIGHTS,
      'document-review': ROUTES.DOCUMENT_REVIEW,
      'emergency': ROUTES.EMERGENCY_SERVICES,
      'legal-notice': ROUTES.LEGAL_NOTICE,
    };
    
    const route = routeMap[screen];
    if (route) {
      navigateTo(route);
    }
  };

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-24">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-2 bg-slate-900 text-white text-sm rounded-full mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Available 24/7 • Professional Legal Services
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Professional Legal
              <span className="block text-blue-600">Solutions Platform</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with qualified legal professionals for comprehensive assistance. 
              Expert guidance for all your legal matters with certified advocates and updated legal knowledge.
            </p>

            <div className="flex flex-wrap justify-center gap-12 mb-16">
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Certified Professionals</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-medium">Updated Legal Knowledge</span>
              </div>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <div 
              onClick={() => handleRoleSelection('client')}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">I'm a Client</h3>
                  <p className="text-slate-600">Get legal assistance, consultation, and professional guidance for your legal matters</p>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </div>
            </div>

            <div 
              onClick={() => handleRoleSelection('lawyer')}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-green-200 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                  <Scale className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">I'm a Lawyer</h3>
                  <p className="text-slate-600">Access professional tools, manage cases, and connect with clients efficiently</p>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Join Our Network
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <p className="text-slate-600 mb-6">
              Need immediate assistance? Access our quick legal services
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
                <p className="text-blue-800 font-medium">Legal Rights Checker</p>
                <p className="text-blue-600 text-sm">AI-powered legal analysis</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-3">
                <p className="text-red-800 font-medium">Emergency Services</p>
                <p className="text-red-600 text-sm">24/7 legal assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Services Section */}
      <section className="py-16 bg-white lg:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Access comprehensive legal services designed to meet all your legal needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Legal Rights Checker */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Scale className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Legal Rights Checker</h3>
                  <p className="text-slate-600 text-sm">AI-powered analysis of your legal rights with expert guidance</p>
                </div>
              </div>
            </div>

            {/* Consumer Rights */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Consumer Rights</h3>
                  <p className="text-slate-600 text-sm">Protection for consumer disputes and marketplace issues</p>
                </div>
              </div>
            </div>

            {/* Document Review */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Document Review</h3>
                  <p className="text-slate-600 text-sm">Professional review and analysis of legal documents</p>
                </div>
              </div>
            </div>

            {/* Emergency Services */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Emergency Services</h3>
                  <p className="text-slate-600 text-sm">24/7 emergency legal assistance for urgent matters</p>
                </div>
              </div>
            </div>

            {/* Legal Notice Service */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Legal Notice Service</h3>
                  <p className="text-slate-600 text-sm">Professional legal notice drafting and delivery</p>
                </div>
              </div>
            </div>

            {/* View All Services */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Explore All Services</h3>
                <p className="text-slate-600 text-sm">Browse our complete range of legal services and solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Credentials Section */}
      <section className="py-24 bg-slate-50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Professional Excellence</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our commitment to legal excellence is demonstrated through certified professionals, 
              comprehensive services, and continuous updates on legal developments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-4">Certified Professionals</h4>
              <p className="text-slate-600 leading-relaxed">
                All our legal professionals are certified advocates with extensive experience in their respective domains and continuous professional development.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users2 className="h-7 w-7 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-4">Comprehensive Services</h4>
              <p className="text-slate-600 leading-relaxed">
                From legal consultations to document reviews, we provide end-to-end legal services covering all major areas of law and legal requirements.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-4">Current Legal Knowledge</h4>
              <p className="text-slate-600 leading-relaxed">
                Continuous updates on current laws, recent judgments, and latest legal developments ensure 
                our advice reflects the most current legal landscape and precedents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

// Responsive HomePage Component - Now just returns desktop version
export default function HomePageResponsive() {
  return <HomePageDesktop />;
}