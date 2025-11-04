import { LiquidButton } from "./ui/liquid-glass-button";
import { ChevronDown, ArrowRight, Brain, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import heroBackground from "../assets/hero-background.png";

export const Hero = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleStartJourney = () => {
    if (currentUser) {
      // User is logged in, redirect to financial dashboard
      navigate('/dashboard');
    } else {
      // User is not logged in, redirect to login page
      navigate('/login');
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(139, 21, 56, 0.9) 0%, rgba(139, 21, 56, 0.7) 100%), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/4 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-5xl">
          <div className="mb-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
              <Brain className="w-4 h-4 animate-pulse" />
              AI-Driven Loan Processing
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.9] tracking-tight animate-fade-in-up delay-200">
            Synfin{" "}
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              AI Loan Processing
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl leading-relaxed animate-fade-in-up delay-400">
            Multi-agent MCP + FastAPI workflow from chat to sanction letter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-600">
            <LiquidButton 
              size="xxl" 
              variant="default"
              className="font-semibold text-base group text-white"
              onClick={handleStartJourney}
            >
              <span className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 group-hover:animate-pulse" />
                START LOAN APPLICATION
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </LiquidButton>
            
            <LiquidButton 
              size="xxl" 
              variant="outline"
              className="font-medium backdrop-blur-sm"
              onClick={() => {
                console.log('See How It Works button clicked - navigating to /development');
                navigate('/development');
              }}
            >
              See Workflow
            </LiquidButton>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 right-12 z-10 flex flex-col items-end gap-4 animate-fade-in-up delay-800">
        <span className="text-sm font-medium text-white/80 tracking-wider">DISCOVER YOUR POTENTIAL</span>
        <div className="flex flex-col items-center">
          <ChevronDown className="w-6 h-6 text-white/80 animate-bounce" />
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent mt-2"></div>
        </div>
      </div>
    </section>
  );
};
