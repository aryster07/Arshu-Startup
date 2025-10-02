import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Scale, Phone, Clock, ChevronDown, Home, Users, FileText, Shield, AlertTriangle, Info, Mail, Briefcase, Award } from 'lucide-react';
import { Button } from './ui/button';
import { ROUTES } from '../../core/constants/routes';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleServices = () => setIsServicesOpen(!isServicesOpen);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const serviceItems = [
    {
      title: 'All Services',
      description: 'Complete overview of our legal services',
      path: ROUTES.SERVICES,
      icon: <Briefcase className="h-3 w-3 lg:h-4 lg:w-4" />
    },
    {
      title: 'Legal Rights Checker',
      description: 'Check your legal rights and get guidance',
      path: ROUTES.LEGAL_RIGHTS,
      icon: <Shield className="h-3 w-3 lg:h-4 lg:w-4" />
    },
    {
      title: 'Consumer Rights',
      description: 'Consumer protection and rights assistance',
      path: ROUTES.CONSUMER_RIGHTS,
      icon: <Users className="h-3 w-3 lg:h-4 lg:w-4" />
    },
    {
      title: 'Legal Notice Service',
      description: 'Professional legal notice drafting',
      path: ROUTES.LEGAL_NOTICE,
      icon: <FileText className="h-4 w-4" />
    },
    {
      title: 'Emergency Services',
      description: '24/7 urgent legal assistance',
      path: ROUTES.EMERGENCY_SERVICES,
      icon: <AlertTriangle className="h-4 w-4" />
    }
  ];

  const mainNavItems = [
    { title: 'Home', path: ROUTES.HOME, icon: <Home className="h-4 w-4" /> },
    { title: 'About', path: ROUTES.ABOUT, icon: <Info className="h-4 w-4" /> },
    { title: 'Contact', path: ROUTES.CONTACT, icon: <Mail className="h-4 w-4" /> }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-lg'
        : 'bg-white border-b border-slate-200'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-4 group transition-all duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 flex-shrink-0">
              <img src="/logo.svg" alt="Law Bandhu" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                Law Bandhu
              </span>
              <span className="text-xs text-slate-600 hidden sm:block group-hover:text-slate-700 transition-colors duration-300">
                AI Legal Assistant & More
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 group ${isActive(item.path)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {item.icon}
                  <span>{item.title}</span>
                </span>
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive(item.path) ? 'opacity-100' : ''
                  }`}></div>
              </Link>
            ))}


          </div>

          {/* Contact Info & CTA */}
          <div className="hidden xl:flex items-center space-x-6">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-all duration-300 cursor-pointer hover:scale-105">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Clock className="h-4 w-4" />
                <span className="font-medium">24/7</span>
              </div>
              <div
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-all duration-300 cursor-pointer hover:scale-105 group"
                onClick={() => window.location.href = 'tel:+916230244977'}
              >
                <Phone className="h-4 w-4 group-hover:animate-pulse" />
                <span className="font-medium">+91 62302-44977</span>
              </div>
            </div>
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-xl shadow-lg"
              onClick={() => navigate(ROUTES.CONTACT)}
            >
              Get Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu - Enhanced responsive design */}
        {isMenuOpen && (
          <div className="md:hidden py-6 lg:py-8 border-t border-slate-200">
            <div className="space-y-4 lg:space-y-6">
              {/* Main Navigation - Mobile responsive */}
              <div className="space-y-2 lg:space-y-3">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm lg:text-base ${isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>

              {/* Services Section */}
              <div>
                <button
                  onClick={toggleServices}
                  className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors rounded-xl hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4" />
                    <span>Services</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''
                    }`} />
                </button>
                {isServicesOpen && (
                  <div className="mt-3 ml-6 space-y-2">
                    {serviceItems.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                      >
                        {service.icon}
                        <span>{service.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Contact Info */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center space-x-3 text-sm text-slate-600 px-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">24/7 Available</span>
                </div>
                <div
                  className="flex items-center space-x-3 text-sm text-slate-600 px-4 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => window.location.href = 'tel:+916230244977'}
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">+91 62302-44977</span>
                </div>
                <div className="px-4">
                  <Button
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={() => navigate(ROUTES.CONTACT)}
                  >
                    Get Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}