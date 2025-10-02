import React from 'react';
import { Scale, Shield, Users, Target, Award, Clock, CheckCircle, Globe } from 'lucide-react';
import { Button } from './ui/button';

interface AboutPageProps {
  onNavigate?: (screen: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-2 bg-slate-900 text-white text-sm rounded-full mb-8">
              <Scale className="w-4 h-4 mr-2" />
              About LawB - Law Bandhu
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Your Trusted Legal
              <span className="block text-blue-600">Companion</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              LawB (Law Bandhu) is a comprehensive legal services platform dedicated to connecting individuals 
              facing legal rights violations with qualified advocates and providing accessible legal solutions 
              for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8"
                onClick={() => onNavigate?.('contact')}
              >
                Get Legal Consultation
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-slate-300 text-slate-900 hover:bg-slate-50 px-8"
                onClick={() => onNavigate?.('services')}
              >
                View Our Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                To democratize access to legal services by providing a comprehensive platform where individuals 
                can easily connect with qualified legal professionals, understand their rights, and receive 
                expert guidance in navigating complex legal matters.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Make legal services accessible to everyone</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Connect clients with certified legal professionals</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Provide transparent and professional services</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                To become the leading legal services platform in India, transforming how people access and 
                experience legal assistance through technology, expertise, and unwavering commitment to justice.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Build India's most trusted legal platform</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Revolutionize legal service delivery</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Ensure justice is accessible to all</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The principles that guide everything we do at LawB and shape our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-4">Integrity</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                We uphold the highest ethical standards in all our legal services and client interactions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-4">Client-Centric</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every decision we make is focused on delivering the best outcomes for our clients.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-4">Excellence</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                We strive for excellence in legal expertise, service delivery, and professional standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-4">Reliability</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Consistent, dependable service available 24/7 when our clients need us most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose LawB?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover what makes us the preferred choice for legal assistance across India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">Certified Legal Professionals</h3>
              <p className="text-slate-600 leading-relaxed">
                All our advocates are thoroughly vetted, certified, and maintain specialized expertise 
                across various domains of law including criminal, civil, family, and corporate matters.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">24/7 Availability</h3>
              <p className="text-slate-600 leading-relaxed">
                Legal emergencies don't wait for business hours. Our emergency hotline and support 
                services are available round-the-clock to assist with urgent legal matters.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">Comprehensive Services</h3>
              <p className="text-slate-600 leading-relaxed">
                From legal rights checking to consumer protection, emergency assistance to consultation 
                booking - we provide end-to-end legal solutions under one platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who trust LawB for their legal needs. 
            Get professional legal assistance today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 px-8"
              onClick={() => onNavigate?.('contact')}
            >
              Contact Us Today
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-slate-300 text-[rgba(19,0,95,1)] hover:bg-slate-800 px-8"
              onClick={() => window.location.href = 'tel:+916230244977'}
            >
              Call: +91 62302-44977
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}