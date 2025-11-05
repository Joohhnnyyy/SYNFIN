import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Database, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const About = () => {
  return (
    <section id="about" className="py-32 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/50 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main content */}
          <div className="mb-16 animate-fade-in-up">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                <Brain className="w-4 h-4" />
                Development
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Strong Foundations
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-4xl">
              Every successful expansion starts with solid groundwork and clear strategic planning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button 
                  variant="default"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-6 h-auto rounded-full shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 group"
                >
                  <span className="flex items-center gap-3">
                    Start Loan Application
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <Link to="/development">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 font-medium px-8 py-6 h-auto rounded-full transition-all duration-300"
                >
                  See Workflow
                </Button>
              </Link>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up delay-400">
            <div className="group p-8 bg-white rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Strong Foundations</h3>
              <p className="text-muted-foreground leading-relaxed">Every successful expansion starts with solid groundwork and clear strategic planning.</p>
            </div>
            <div className="group p-8 bg-white rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Predictable Growth</h3>
              <p className="text-muted-foreground leading-relaxed">Systematic approaches that deliver consistent, measurable results across markets.</p>
            </div>
            <div className="group p-8 bg-white rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Clear Processes</h3>
              <p className="text-muted-foreground leading-relaxed">Transparent methodologies that eliminate guesswork and reduce market entry risks.</p>
            </div>
            <div className="group p-8 bg-white rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Compound Value</h3>
              <p className="text-muted-foreground leading-relaxed">Investments and strategies that build upon each other for exponential returns.</p>
            </div>
          </div>

          {/* Quote */}
          <div className="animate-fade-in-up delay-600 mt-16">
            <blockquote className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto text-center text-muted-foreground">
              “Success in global markets isn't about luck—it's about building systems that work consistently, everywhere.”
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
