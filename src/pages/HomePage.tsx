import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoleSelectionCard from '../components/RoleSelectionCard';
import { useNavigation } from '../hooks/useNavigation';
import { ROUTES } from '../constants/routes';
import { Users, Scale, Shield, Clock, CheckCircle, Award, Users2, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function HomePage() {
  const { navigateTo } = useNavigation();

  const handleRoleSelection = (role: string) => {
    if (role === 'client') {
      navigateTo(ROUTES.CLIENT_DASHBOARD);
    } else if (role === 'lawyer') {
      navigateTo(ROUTES.LAWYER_DASHBOARD);
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
    <div className="min-h-screen bg-white">
      <Navbar />
      
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
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <RoleSelectionCard
              title="Client Services"
              subtitle="Legal Assistance & Consultation"
              description="Access professional legal services with certified advocates specializing in various domains of law."
              benefits={[
                "Expert legal consultation and advice",
                "Document preparation and review",
                "Court representation coordination", 
                "Case status tracking and updates",
                "Direct communication with advocates"
              ]}
              icon={<Users className="h-8 w-8 text-slate-700" />}
              buttonText="Access Client Portal"
              onClick={() => handleRoleSelection('client')}
            />

            <RoleSelectionCard
              title="Legal Professional Portal"
              subtitle="Advocate & Lawyer Platform"
              description="Professional platform for legal practitioners to manage practice, connect with clients, and grow their business."
              benefits={[
                "Client acquisition and management",
                "Practice management tools",
                "Professional networking platform",
                "Legal research and updates",
                "Business development resources"
              ]}
              icon={<Scale className="h-8 w-8 text-slate-700" />}
              buttonText="Professional Access"
              onClick={() => handleRoleSelection('lawyer')}
            />
          </div>
        </div>
      </section>

      {/* Emergency Services Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-slate-900 rounded-2xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Emergency Legal Services</h3>
              <p className="text-slate-300 mb-8">
                Immediate legal assistance available 24/7 for urgent matters requiring prompt professional intervention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8"
                  onClick={() => window.location.href = 'tel:+916230244977'}
                >
                  Emergency Hotline: +91 62302-44977
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-slate-300 text-slate-900 bg-white hover:bg-slate-50 px-8"
                  onClick={() => navigateToScreen('emergency')}
                >
                  Emergency Services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Credentials Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Professional Excellence</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our commitment to legal excellence is demonstrated through certified professionals, 
              comprehensive services, and continuous updates on legal developments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-4">Certified Legal Professionals</h4>
              <p className="text-slate-600 leading-relaxed">
                All legal professionals undergo rigorous certification processes and maintain specialized expertise 
                across criminal, civil, family, and corporate law domains.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users2 className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-4">24/7 Professional Support</h4>
              <p className="text-slate-600 leading-relaxed">
                Round-the-clock availability ensures immediate access to legal guidance with qualified professionals 
                ready to assist with urgent legal matters and consultations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-white" />
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

      <Footer />
    </div>
  );
}