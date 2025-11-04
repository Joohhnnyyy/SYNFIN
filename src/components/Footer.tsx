import { Mail, Phone, MapPin, Linkedin, Twitter, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-white/50 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 animate-fade-in-up">
            <div className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              Synfin
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-6 max-w-md">
              Your trusted partner for intelligent financial coaching and AI-powered insights.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/80 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@synfin.com</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Global Headquarters</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="animate-fade-in-up delay-200">
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <div className="space-y-3">
              {['Home', 'About', 'Services', 'Philosophy', 'Contact'].map((link) => (
                <a 
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="block text-primary-foreground/80 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          {/* Services */}
          <div className="animate-fade-in-up delay-400">
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <div className="space-y-3">
              {['Market Entry', 'Operations', 'Partnerships', 'Franchising', 'Development'].map((service) => (
                <a 
                  key={service}
                  href="#"
                  className="block text-primary-foreground/80 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200"
                >
                  {service}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-sm text-primary-foreground/80 animate-fade-in-up delay-600">
              © 2025 Savify. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 animate-fade-in-up delay-800">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
            
            {/* Legal Links */}
            <div className="flex gap-6 animate-fade-in-up delay-1000">
              <a href="#" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
