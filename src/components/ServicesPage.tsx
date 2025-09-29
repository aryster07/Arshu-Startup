import React from 'react';
import { 
  Scale, Shield, Users, FileText, Gavel, Building, Heart, Car, 
  Home, Briefcase, ShoppingCart, AlertTriangle, Clock, Phone, 
  CheckCircle, ArrowRight, Star 
} from 'lucide-react';
import { Button } from './ui/button';

interface ServicesPageProps {
  onNavigate?: (screen: string) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const primaryServices = [
    {
      title: "Legal Rights Checker",
      description: "Comprehensive analysis of your legal rights with AI-powered assessment and expert guidance.",
      icon: <Scale className="h-8 w-8 text-blue-600" />,
      features: [
        "AI-powered legal rights analysis",
        "Multi-language voice input support",
        "Detailed legal recommendations",
        "Case precedent references"
      ],
      route: 'legal-rights',
      buttonText: "Check Your Rights",
      color: "blue"
    },
    {
      title: "Consumer Rights Protection",
      description: "Specialized assistance for consumer disputes, warranty claims, and marketplace issues.",
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      features: [
        "Consumer complaint filing",
        "Warranty and refund disputes",
        "E-commerce fraud protection",
        "Product liability cases"
      ],
      route: 'consumer-rights',
      buttonText: "Consumer Protection",
      color: "green"
    },
    {
      title: "Emergency Legal Services",
      description: "24/7 emergency legal assistance for urgent matters requiring immediate professional intervention.",
      icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
      features: [
        "24/7 emergency hotline",
        "Immediate legal guidance",
        "Emergency document preparation",
        "Urgent court matters"
      ],
      route: 'emergency',
      buttonText: "Emergency Services",
      color: "red"
    }
  ];

  const legalAreas = [
    {
      title: "Criminal Law",
      description: "Expert defense and guidance for criminal charges, investigations, and court proceedings.",
      icon: <Gavel className="h-6 w-6 text-slate-700" />,
      services: [
        "Criminal defense representation",
        "Bail applications and hearings",
        "Investigation assistance",
        "Appeals and revisions",
        "White-collar crime defense"
      ]
    },
    {
      title: "Civil Law",
      description: "Comprehensive civil litigation services for disputes, contracts, and legal matters.",
      icon: <FileText className="h-6 w-6 text-slate-700" />,
      services: [
        "Civil litigation and disputes",
        "Contract disputes and breaches",
        "Tort and negligence claims",
        "Property and boundary disputes",
        "Injunction and interim orders"
      ]
    },
    {
      title: "Family Law",
      description: "Sensitive handling of family matters including divorce, custody, and domestic issues.",
      icon: <Heart className="h-6 w-6 text-slate-700" />,
      services: [
        "Divorce and separation proceedings",
        "Child custody and support",
        "Maintenance and alimony",
        "Domestic violence protection",
        "Adoption and guardianship"
      ]
    },
    {
      title: "Corporate Law",
      description: "Business legal services including compliance, contracts, and corporate governance.",
      icon: <Building className="h-6 w-6 text-slate-700" />,
      services: [
        "Business formation and registration",
        "Corporate compliance and governance",
        "Mergers and acquisitions",
        "Employment law and contracts",
        "Intellectual property protection"
      ]
    },
    {
      title: "Property Law",
      description: "Real estate transactions, property disputes, and title verification services.",
      icon: <Home className="h-6 w-6 text-slate-700" />,
      services: [
        "Property buying and selling",
        "Title verification and clearance",
        "Property dispute resolution",
        "Rental and lease agreements",
        "Construction and development law"
      ]
    },
    {
      title: "Motor Vehicle Law",
      description: "Specialized assistance for traffic violations, accidents, and vehicle-related legal matters.",
      icon: <Car className="h-6 w-6 text-slate-700" />,
      services: [
        "Traffic violation defense",
        "Accident claim assistance",
        "Insurance dispute resolution",
        "License suspension appeals",
        "Hit and run case assistance"
      ]
    }
  ];

  const additionalServices = [
    {
      title: "Legal Document Preparation",
      description: "Professional drafting and review of legal documents, contracts, and agreements.",
      features: ["Contracts and agreements", "Legal notices and letters", "Affidavits and declarations", "Power of attorney documents"]
    },
    {
      title: "Court Representation",
      description: "Experienced advocates for court proceedings across all levels of judiciary.",
      features: ["Trial court representation", "High court matters", "Supreme court cases", "Tribunal proceedings"]
    },
    {
      title: "Legal Research & Analysis",
      description: "Comprehensive legal research services with case law analysis and precedent studies.",
      features: ["Case law research", "Legal precedent analysis", "Statutory interpretation", "Legal opinion drafting"]
    },
    {
      title: "Mediation & Arbitration",
      description: "Alternative dispute resolution services for efficient and cost-effective solutions.",
      features: ["Commercial arbitration", "Family mediation", "Construction disputes", "Employment conflicts"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-2 bg-slate-900 text-white text-sm rounded-full mb-8">
              <Shield className="w-4 h-4 mr-2" />
              Comprehensive Legal Services
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Professional Legal
              <span className="block text-blue-600">Solutions</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Comprehensive legal services across all major areas of law with certified professionals, 
              modern technology, and 24/7 availability for your peace of mind.
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Certified Advocates</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">24/7 Emergency Support</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-medium">Expert Legal Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our flagship services designed to provide immediate and comprehensive legal assistance.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {primaryServices.map((service, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 bg-${service.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full bg-${service.color}-600 hover:bg-${service.color}-700 text-white`}
                  onClick={() => onNavigate?.(service.route)}
                >
                  {service.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Areas Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Legal Practice Areas</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Specialized expertise across all major areas of law with experienced advocates and comprehensive solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                  {area.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-4">{area.title}</h3>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">{area.description}</p>
                
                <ul className="space-y-2">
                  {area.services.map((service, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-xs text-slate-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Additional Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive support services to complement our legal expertise and ensure complete client satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8">
                <h3 className="font-semibold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How We Work</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our streamlined process ensures efficient and effective legal assistance from consultation to resolution.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-4">Initial Consultation</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Free initial consultation to understand your legal matter and provide preliminary guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-4">Case Analysis</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Thorough analysis of your case with legal research and strategy development.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal Action</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Implementation of legal strategy with professional representation and documentation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-4">Resolution</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Achieving favorable outcomes through negotiation, settlement, or court proceedings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services CTA */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Need Immediate Legal Assistance?</h3>
            <p className="text-slate-300 mb-8">
              Our emergency legal services are available 24/7 for urgent matters requiring immediate professional intervention.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8"
                onClick={() => window.location.href = 'tel:+916230244977'}
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergency Hotline: +91 62302-44977
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-slate-300 text-white hover:bg-slate-800 px-8"
                onClick={() => onNavigate?.('contact')}
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}