import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Brain } from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      value: "+964 770 295 0000",
      href: "tel:+9647702950000",
      description: "Get instant support"
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@synfin.ai",
      href: "mailto:info@synfin.ai",
      description: "General inquiries"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Iraq, Sulaymaniyah, Malik Mahmud Street, District 305, Alley 10, Building 84",
      href: "https://maps.app.goo.gl/LzYYVmsVJoEu4aEo8",
      description: "Visit our office"
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "Quick Response",
      description: "We respond to all inquiries within 24 hours"
    },
    {
      icon: Brain,
      title: "AI-Powered Coaching",
      description: "Personalized financial guidance that learns from your patterns"
    },
    {
      icon: MessageCircle,
      title: "Expert Consultation",
      description: "Free initial consultation for your financial goals"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-wider animate-fade-in-up">
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">contact</span>
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-muted-foreground animate-fade-in-up delay-200">
            Financial Coaching and AI Support
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed animate-fade-in-up delay-400">
            Ready to transform your financial future? Let's discuss how Savify's AI-powered coaching can help you build better financial habits and achieve your goals, regardless of your income pattern.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className={`text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 animate-fade-in-up`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-secondary/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Start Your Financial Journey</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Ready to take control of your finances? Get in touch and let our AI-powered coaching help you build better financial habits.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="animate-fade-in-up delay-200">
                <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-3 text-foreground">
                        Your name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-12 text-lg border-border/50 focus:border-primary transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-3 text-foreground">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 text-lg border-border/50 focus:border-primary transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-3 text-foreground">
                        Your message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full min-h-[150px] text-lg resize-none border-border/50 focus:border-primary transition-colors"
                        placeholder="Tell us about your project or inquiry"
                      />
                    </div>

                    <div className="pt-4">
                      <LiquidButton 
                        type="submit" 
                        size="lg"
                        className="w-full font-medium"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </LiquidButton>
                    </div>
                  </form>
                </div>
              </div>

              {/* Contact Information */}
              <div className="animate-fade-in-up delay-400">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                  
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <div 
                        key={method.title}
                        className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{method.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                            <a 
                              href={method.href}
                              target={method.title === "Address" ? "_blank" : undefined}
                              rel={method.title === "Address" ? "noopener noreferrer" : undefined}
                              className="text-foreground hover:text-primary transition-colors break-words"
                            >
                              {method.value}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-background to-primary/5">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have improved their financial health with Savify's AI-powered coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LiquidButton size="lg" asChild className="font-medium">
                <a href="/about" className="flex items-center gap-2">
                  Learn More About Us
                  <Brain className="w-5 h-5" />
                </a>
              </LiquidButton>
              <LiquidButton size="lg" variant="outline" asChild className="font-medium">
                <a href="/services" className="flex items-center gap-2">
                  View Our Services
                  <MessageCircle className="w-5 h-5" />
                </a>
              </LiquidButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
