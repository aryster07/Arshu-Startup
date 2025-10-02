import React from 'react';
import { Scale, Phone, Mail, Linkedin, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white rounded-lg">
                <Scale className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h3 className="font-bold text-xl">LawB</h3>
                <p className="text-sm text-slate-400">Professional Legal Services</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Professional legal solutions platform connecting clients with certified legal professionals. 
              Expert guidance for comprehensive legal assistance across all practice areas.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/arsh-rana-259451342" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Legal Services */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Legal Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#legal-rights" className="text-slate-300 hover:text-white transition-colors">
                  Legal Rights Assessment
                </a>
              </li>
              <li>
                <a href="#consumer-rights" className="text-slate-300 hover:text-white transition-colors">
                  Consumer Protection
                </a>
              </li>
              <li>
                <a href="#legal-notice" className="text-slate-300 hover:text-white transition-colors">
                  Legal Notice Drafting
                </a>
              </li>
              <li>
                <a href="#advocates" className="text-slate-300 hover:text-white transition-colors">
                  Legal Consultation
                </a>
              </li>
              <li>
                <a href="#emergency" className="text-slate-300 hover:text-white transition-colors">
                  Emergency Legal Services
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-300 hover:text-white transition-colors">
                  About Our Firm
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Professional Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">24/7 Legal Hotline</p>
                  <p className="text-white font-medium">+91 62302-44977</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">Professional Email</p>
                  <p className="text-white font-medium">arshrana762@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">Service Jurisdiction</p>
                  <p className="text-white font-medium">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              © 2024 Law Bandhu (LawB). Professional Legal Services. All rights reserved.
            </div>
            <div className="flex space-x-8 text-sm">
              <a href="#privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#disclaimer" className="text-slate-400 hover:text-white transition-colors">
                Legal Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}