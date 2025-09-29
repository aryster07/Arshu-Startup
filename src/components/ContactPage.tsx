import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ContactPageProps {
  onNavigate?: (screen: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    legalArea: '',
    urgency: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your inquiry! We will contact you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      legalArea: '',
      urgency: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-2 bg-slate-900 text-white text-sm rounded-full mb-8">
              <Phone className="w-4 h-4 mr-2" />
              Contact LawB - Professional Legal Services
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Get Expert Legal
              <span className="block text-blue-600">Assistance Today</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Connect with our legal professionals for consultation, emergency assistance, 
              or any legal matters requiring expert guidance. We're here to help 24/7.
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
                className="border-slate-300 text-slate-900 hover:bg-slate-50 px-8"
                onClick={() => onNavigate?.('emergency')}
              >
                Emergency Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Get in Touch</h2>
              <p className="text-slate-600 mb-12 leading-relaxed">
                Our experienced legal team is ready to assist you with professional guidance 
                and comprehensive legal solutions. Reach out through any of the channels below.
              </p>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Phone Support</h3>
                    <p className="text-slate-600 mb-2">Available 24/7 for immediate assistance</p>
                    <a href="tel:+916230244977" className="text-blue-600 hover:text-blue-700 font-medium">
                      +91 62302-44977
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
                    <p className="text-slate-600 mb-2">Professional consultation via email</p>
                    <a href="mailto:contact@lawb.in" className="text-blue-600 hover:text-blue-700 font-medium">
                      contact@lawb.in
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Office Address</h3>
                    <p className="text-slate-600 mb-2">Visit us for in-person consultation</p>
                    <p className="text-slate-700">
                      Legal Complex, Sector 17<br />
                      Chandigarh, Punjab 160017<br />
                      India
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Office Hours</h3>
                    <p className="text-slate-600 mb-2">Regular consultation hours</p>
                    <div className="text-slate-700">
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 5:00 PM</p>
                      <p>Sunday: Emergency only</p>
                      <p className="text-red-600 font-medium mt-2">Emergency: 24/7 Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-2">Full Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="bg-white border-slate-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="bg-white border-slate-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="bg-white border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-2">Legal Area</label>
                    <Select value={formData.legalArea} onValueChange={(value) => handleInputChange('legalArea', value)}>
                      <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500">
                        <SelectValue placeholder="Select legal area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="criminal">Criminal Law</SelectItem>
                        <SelectItem value="civil">Civil Law</SelectItem>
                        <SelectItem value="family">Family Law</SelectItem>
                        <SelectItem value="corporate">Corporate Law</SelectItem>
                        <SelectItem value="consumer">Consumer Rights</SelectItem>
                        <SelectItem value="property">Property Law</SelectItem>
                        <SelectItem value="labor">Labor Law</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-2">Urgency Level</label>
                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                      <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergency">Emergency (Immediate)</SelectItem>
                        <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                        <SelectItem value="normal">Normal (Within 3 days)</SelectItem>
                        <SelectItem value="consultation">General Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Subject *</label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Brief subject of your legal matter"
                    required
                    className="bg-white border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Message *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Please describe your legal matter in detail..."
                    required
                    rows={5}
                    className="bg-white border-slate-200 focus:border-blue-500"
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <p className="text-xl text-slate-600">Need immediate assistance? Choose from our quick service options.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">Emergency Hotline</h3>
              <p className="text-slate-600 mb-6">Immediate legal assistance for urgent matters</p>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => window.location.href = 'tel:+916230244977'}
              >
                Call Emergency Line
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">Legal Rights Check</h3>
              <p className="text-slate-600 mb-6">Quick assessment of your legal rights and options</p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => onNavigate?.('legal-rights')}
              >
                Check Your Rights
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-4">Book Consultation</h3>
              <p className="text-slate-600 mb-6">Schedule a meeting with our legal experts</p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onNavigate?.('client')}
              >
                Book Appointment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}