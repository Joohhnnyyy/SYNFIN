import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LiquidButton } from "../components/ui/liquid-glass-button";
import { AnimatedBeamDemo } from "../components/animated-beam-demo";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Target, 
  Users, 
  Brain, 
  BarChart3, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  Zap,
  Building,
  Rocket,
  Shield,
  FileText
} from "lucide-react";

const DevelopmentPage = () => {
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

  const developmentAreas = [
    {
      icon: Users,
      title: "Master Agent",
      description: "Initial customer interaction and intent capture. Welcomes users and routes them into the loan flow.",
      features: ["Greeting and onboarding", "Interest generation", "Intent understanding", "Flow handoff to Sales"]
    },
    {
      icon: TrendingUp,
      title: "Sales Agent",
      description: "Discusses loan amount, rate, and tenure; calculates EMI and presents payment schedules.",
      features: ["Loan requirement discovery", "EMI calculation", "Tenure and rate discussion", "Schedule preview"]
    },
    {
      icon: Shield,
      title: "Verification Agent",
      description: "Validates PAN/Aadhaar via mock KYC APIs, performs fraud checks and document intake.",
      features: ["PAN/Aadhaar validation", "Mock KYC API integration", "Document collection", "Fraud signals"]
    },
    {
      icon: Brain,
      title: "Underwriting Agent",
      description: "Fetches credit score, sets pre-approved limits, and runs risk assessment.",
      features: ["Credit score retrieval", "Limit setting", "Risk analysis", "Policy checks"]
    },
    {
      icon: CheckCircle,
      title: "Eligibility Agent",
      description: "Makes approval/rejection decisions based on score, policy, and requested amount.",
      features: ["Threshold evaluation", "Approval decisioning", "Rejection rationale", "Next-step guidance"]
    },
    {
      icon: FileText,
      title: "PDF Agent",
      description: "Generates sanction letters with loan details and shareable, branded PDF output.",
      features: ["Sanction letter generation", "Template rendering", "Shareable PDF", "Audit trail"]
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Faster Approvals",
      description: "Reduce time-to-decision with parallelized, agent-driven processing"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "KYC validation and audit trails ensure trust and regulatory alignment"
    },
    {
      icon: Brain,
      title: "Explainable Decisions",
      description: "Transparent eligibility outcomes with rationale and policy checks"
    },
    {
      icon: Building,
      title: "Scalable & Modular",
      description: "MCP orchestration lets you add or swap agents easily"
    }
  ];

  const stats = [
    { number: "5K+", label: "Loans Processed" },
    { number: "< 2m", label: "Approval Speed" },
    { number: "100%", label: "KYC Coverage" },
    { number: "99.9%", label: "Gateway Uptime" }
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
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Architecture</span>
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-muted-foreground animate-fade-in-up delay-200">
            MCP + FastAPI Orchestration for AI-Driven Loan Processing
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12 animate-fade-in-up delay-400">
            An end-to-end multi-agent workflow: customers chat with our Master Agent, Sales calculates EMI, Verification runs KYC, Underwriting fetches credit scores, Eligibility decides, and PDF Agent issues the sanction letter.
          </p>

          <div className="animate-fade-in-up delay-600">
            <LiquidButton size="lg" className="font-medium" onClick={handleStartJourney}>
              Start Loan Application
              <ArrowRight className="w-5 h-5 ml-2" />
            </LiquidButton>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`text-center animate-fade-in-up`}
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Areas Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-secondary/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Specialized AI Agents</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              MCP-orchestrated agents collaborate to process loans efficiently, securely, and transparently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {developmentAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div 
                  key={area.title}
                  className={`p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group animate-fade-in-up`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">{area.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{area.description}</p>
                  
                  <div className="space-y-2">
                    {area.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MCP + FastAPI Architecture Section */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">MCP + FastAPI Architecture</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Agents communicate via MCP with a FastAPI gateway exposing REST endpoints for CRM and back-office integration. The beam demo illustrates data flow between agents.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <AnimatedBeamDemo />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our AI Loan System?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A robust, explainable, and secure pipeline from chat to sanction letter, ready to integrate with your stack.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={benefit.title}
                  className={`text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group animate-fade-in-up`}
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Workflow: From Chat to Sanction Letter</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A streamlined pipeline across agents to deliver fast, secure, and transparent loan decisions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Chat & Interest (Master Agent)",
                  description: "Welcome users, capture intent, and initiate the loan flow."
                },
                {
                  step: "02",
                  title: "Loan Discussion & EMI (Sales)",
                  description: "Gather loan details, compute EMI, and present schedules."
                },
                {
                  step: "03",
                  title: "KYC Verification (Verification)",
                  description: "Validate PAN/Aadhaar via mock APIs and collect documents."
                },
                {
                  step: "04",
                  title: "Underwriting & Credit Score",
                  description: "Fetch scores, set limits, and assess risk and policy."
                },
                {
                  step: "05",
                  title: "Eligibility Decision",
                  description: "Approve or reject based on score, amount, and policies."
                },
                {
                  step: "06",
                  title: "Sanction Letter (PDF Agent)",
                  description: "Generate and deliver the sanction letter as a shareable PDF."
                }
              ].map((phase, index) => (
                <div 
                  key={phase.step}
                  className={`text-center p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 animate-fade-in-up`}
                  style={{ animationDelay: `${500 + index * 150}ms` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-primary">{phase.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{phase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-background to-primary/5">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Ready to Process Loans with AI?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get a production-ready, multi-agent pipeline integrated via FastAPI. Start now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LiquidButton size="lg" asChild className="font-medium">
                <a href="/login" className="flex items-center gap-2">
                  Start Loan Application
                  <ArrowRight className="w-5 h-5" />
                </a>
              </LiquidButton>
              <LiquidButton size="lg" variant="outline" asChild className="font-medium">
                <a href="/about" className="flex items-center gap-2">
                  Explore Architecture
                  <Brain className="w-5 h-5" />
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

export default DevelopmentPage;
