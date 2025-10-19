import { Scale, Shield, Users, Clock, ArrowRight, Mail, Phone, MapPin, Gavel, BookOpen, Award, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { motion } from "motion/react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 lg:py-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }} />
        </div>
        
        {/* Floating Scale Icons */}
        <motion.div
          className="absolute top-20 left-10 text-gold opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Scale className="w-24 h-24" style={{ color: '#f59e0b' }} />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-gold opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gavel className="w-20 h-20" style={{ color: '#f59e0b' }} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full mb-6">
                <Award className="w-4 h-4 text-gold" style={{ color: '#f59e0b' }} />
                <span className="text-gold" style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>
                  Your Personalised Legal Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-white mb-6 font-serif-legal"
              style={{ fontSize: '56px', fontWeight: 700, lineHeight: '1.1' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your Trusted Legal Partner
            </motion.h1>

            <motion.p
              className="text-slate-300 mb-8 max-w-2xl mx-auto"
              style={{ fontSize: '20px', lineHeight: '1.7' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connect with experienced legal professionals instantly. Get expert consultation, track your cases, and manage everything from one platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                onClick={onGetStarted}
                className="bg-gold hover:bg-yellow-600 text-slate-900 px-8 py-6 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold/50"
                style={{ borderRadius: '8px', fontSize: '18px', backgroundColor: '#f59e0b', fontWeight: 600 }}
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 bg-white/10 backdrop-blur-sm px-8 py-6 transition-all hover:scale-105 active:scale-95"
                style={{ borderRadius: '8px', fontSize: '18px' }}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              
              
              
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Platform Benefits */}
      <section id="about" className="py-16 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-slate-900 mb-4 font-serif-legal" style={{ fontSize: '36px', fontWeight: 700 }}>
              Why Choose Law Bandhu?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto" style={{ fontSize: '18px' }}>
              We make legal services accessible, transparent, and efficient for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Expert Lawyers",
                description: "Access to verified legal professionals across all specializations",
                color: "#2563eb"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your data and communications are fully encrypted and protected",
                color: "#10b981"
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Get legal assistance whenever you need it, day or night",
                color: "#f59e0b"
              },
              {
                icon: Scale,
                title: "Fair Pricing",
                description: "Transparent pricing with no hidden fees or surprises",
                color: "#8b5cf6"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white border border-slate-200 p-6 text-center transition-all hover:shadow-xl group cursor-pointer relative overflow-hidden"
                style={{ borderRadius: '12px' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${benefit.color}10, transparent)`,
                  }}
                />
                <motion.div
                  className="inline-flex p-4 rounded-full mb-4 relative"
                  style={{
                    backgroundColor: `${benefit.color}15`,
                    borderRadius: '9999px'
                  }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <benefit.icon className="w-8 h-8" style={{ color: benefit.color }} />
                </motion.div>
                <h3 className="text-slate-900 mb-2 font-serif-legal" style={{ fontWeight: 600 }}>{benefit.title}</h3>
                <p className="text-slate-600" style={{ fontSize: '14px' }}>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-slate-900 mb-4 font-serif-legal" style={{ fontSize: '36px', fontWeight: 700 }}>
              How It Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto" style={{ fontSize: '18px' }}>
              Get legal help in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: Users,
                title: "Find Your Lawyer",
                description: "Browse through our verified network of expert lawyers based on your legal needs"
              },
              {
                step: "02",
                icon: BookOpen,
                title: "Get Consultation",
                description: "Connect instantly via call, chat, or video consultation at your convenience"
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Track Progress",
                description: "Monitor your case progress, documents, and payments all in one place"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative h-full"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="bg-white border border-slate-200 p-8 relative z-10 h-full" style={{ borderRadius: '12px' }}>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gold rounded-full flex items-center justify-center font-serif-legal text-slate-900 shadow-lg" style={{ fontSize: '18px', fontWeight: 700, backgroundColor: '#f59e0b' }}>
                    {step.step}
                  </div>
                  <motion.div
                    className="inline-flex p-4 bg-blue-50 rounded-full mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-8 h-8 text-primary" style={{ color: '#2563eb' }} />
                  </motion.div>
                  <h3 className="text-slate-900 mb-2 font-serif-legal" style={{ fontSize: '20px', fontWeight: 600 }}>
                    {step.title}
                  </h3>
                  <p className="text-slate-600" style={{ fontSize: '14px' }}>{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-0">
                    <ArrowRight className="w-8 h-8 text-gold" style={{ color: '#f59e0b' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-slate-900 mb-4 font-serif-legal" style={{ fontSize: '36px', fontWeight: 700 }}>
              Our Team
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto" style={{ fontSize: '18px' }}>
              Meet the dedicated professionals behind Law Bandhu
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Arsh Rana",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
              },
              {
                name: "Sarah Johnson",
                role: "Chief Technology Officer",
                image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
              },
              {
                name: "Michael Chen",
                role: "Head of Legal Operations",
                image: "https://images.unsplash.com/photo-1758599543154-76ec1c4257df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDc3Mjk2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-white border border-slate-200 p-6 text-center transition-all hover:shadow-xl group"
                style={{ borderRadius: '12px' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 mx-auto mb-4 object-cover border-4 border-gold/20"
                    style={{ borderRadius: '9999px' }}
                  />
                </motion.div>
                <h3 className="text-slate-900 mb-1 font-serif-legal" style={{ fontWeight: 600 }}>{member.name}</h3>
                <p className="text-slate-600" style={{ fontSize: '14px' }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white mb-4 font-serif-legal" style={{ fontSize: '40px', fontWeight: 700 }}>
              Ready to Get Started?
            </h2>
            <p className="text-slate-300 mb-8" style={{ fontSize: '18px' }}>
              Join thousands of satisfied clients who found the legal help they needed
            </p>
            <Button
              onClick={onGetStarted}
              className="bg-gold hover:bg-yellow-600 text-slate-900 px-8 py-6 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold/50"
              style={{ borderRadius: '8px', fontSize: '18px', backgroundColor: '#f59e0b', fontWeight: 600 }}
            >
              Start Your Legal Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-8 h-8 text-gold" style={{ color: '#f59e0b' }} />
                <span className="font-serif-legal" style={{ fontSize: '20px', fontWeight: 600 }}>Law Bandhu</span>
              </div>
              <p className="text-slate-400" style={{ fontSize: '14px' }}>
                Making legal services accessible to everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="mb-4 font-serif-legal" style={{ fontWeight: 600 }}>Contact Info</h4>
              <div className="space-y-2 text-slate-400" style={{ fontSize: '14px' }}>
                <div className="flex items-center gap-2 hover:text-gold transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>support@lawbandhu.com</span>
                </div>
                <div className="flex items-center gap-2 hover:text-gold transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 hover:text-gold transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span>123 Legal Street, Law City</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="mb-4 font-serif-legal" style={{ fontWeight: 600 }}>Legal</h4>
              <div className="space-y-2 text-slate-400" style={{ fontSize: '14px' }}>
                <a href="#" className="block hover:text-gold transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-gold transition-colors">Terms of Service</a>
                <a href="#" className="block hover:text-gold transition-colors">Disclaimer</a>
              </div>
            </motion.div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400" style={{ fontSize: '14px' }}>
            <p>© 2025 Law Bandhu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
