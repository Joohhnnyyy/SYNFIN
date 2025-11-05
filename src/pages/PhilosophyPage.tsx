import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { 
  Target, 
  Eye, 
  Compass, 
  Users, 
  Lightbulb, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Award,
  Brain,
  FileText
}  from "lucide-react";

const PhilosophyPage = () => {
    const philosophyPillars = [
    {
      icon: Heart,
      title: "Empathy by Design",
      description: "Loans are emotional decisions. Our agents communicate with care, acknowledge uncertainty, and guide users with supportive language and clear options.",
      principles: ["Human-centered messaging", "Calm tone under uncertainty", "Actionable next steps", "Inclusive UX"]
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Privacy-first architecture. We separate concerns across agents, minimize sensitive data surface area, and use transparent APIs with controlled scopes.",
      principles: ["Least-privilege access", "Explicit consent", "Clear data boundaries", "Auditable flows"]
    },
    {
      icon: TrendingUp,
      title: "Outcome-Driven",
      description: "Every step advances the user toward a decision: discover, verify, assess, decide, document. We measure clarity and completion, not just clicks.",
      principles: ["EMI clarity", "Verification confidence", "Risk transparency", "Decision explainability"]
    }
  ];


    const coreValues = [
    {
      icon: Compass,
      title: "Multi-Agent Orchestration",
      description: "Clear boundaries and responsibilities across agents coordinated via MCP and FastAPI for predictable, testable flows.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Eye,
      title: "Transparent",
      description: "Readable messages, explainable decisions, and observable logs so users and developers understand what happened and why.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Lightbulb,
      title: "Open & Extensible",
      description: "Composable components, documented APIs, and minimal coupling so new policies and agents can be added safely.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Empathy-first design with practical guidance, not jargon. We optimize for understanding and confidence.",
      color: "from-red-500 to-red-600"
    }
  ];


  const achievements = [
    { icon: Award, number: "10K+", label: "Users Coached" },
    { icon: Users, number: "85%", label: "Improved Finances" },
    { icon: Brain, number: "24/7", label: "AI Monitoring" },
    { icon: Star, number: "98%", label: "User Satisfaction" }
  ];

    const principles = [
    { title: "Privacy by Design", description: "Minimize sensitive data exposure, isolate responsibilities, and require explicit user consent." },
    { title: "Transparent Orchestration", description: "Make flows and decisions observable with clear logs, statuses, and error messages." },
    { title: "Empathetic UX", description: "Use supportive language and concrete options when users are unsure or anxious." },
    { title: "Reliability & Safety", description: "Prefer predictable control over agents, validate inputs, and fail safely." },
    { title: "Auditability", description: "Trace actions across agents for reviews and compliance checks." },
    { title: "Modularity & Extensibility", description: "Add or update policies and agents without brittle cross-dependencies." }
  ];
  const agents = [
    { icon: Brain, title: "Master (AURA)", description: "Welcomes users, captures intent, and routes to the right agent." },
    { icon: TrendingUp, title: "Sales (FINA)", description: "Collects loan amount, rate, tenure; explains EMI options clearly." },
    { icon: Shield, title: "Verification (VERA)", description: "Runs PAN/Aadhaar checks and KYC via mock APIs; flags risks." },
    { icon: Target, title: "Underwriting (CREDO)", description: "Fetches credit signals and suggests pre-approved limits and policies." },
    { icon: CheckCircle, title: "Eligibility (ELIA)", description: "Applies policy rules to decide approval with rationale and next steps." },
    { icon: FileText, title: "PDF Agent (DOCON)", description: "Generates the sanction letter and captures user acknowledgment." },
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
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">philosophy</span>
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-muted-foreground animate-fade-in-up delay-200">
            Responsible Multi‑Agent AI for Loan Processing
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12 animate-fade-in-up delay-400">
            We coordinate specialized agents via MCP and FastAPI to create a clear, safe, and empathetic loan journey: welcome and intent capture, loan discussion and EMI clarity, verification, underwriting, eligibility, and documentation. Transparency and privacy guide every step.
          </p>

          <div className="animate-fade-in-up delay-600">
            <LiquidButton size="lg" asChild className="font-medium">
              <a href="/development" className="flex items-center gap-2">
                Explore the Architecture
                <ArrowRight className="w-5 h-5" />
              </a>
            </LiquidButton>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.label}
                  className={`text-center animate-fade-in-up`}
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{achievement.number}</div>
                  <div className="text-muted-foreground text-sm">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy Pillars Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-secondary/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Three Pillars</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These foundational principles shape our approach to every client relationship and project we undertake.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {philosophyPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={pillar.title}
                  className={`p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group animate-fade-in-up`}
                  style={{ animationDelay: `${300 + index * 150}ms` }}
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{pillar.description}</p>
                  
                  <div className="space-y-3">
                    {pillar.principles.map((principle, principleIndex) => (
                      <div key={principleIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{principle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These values define who we are and how we approach every challenge, ensuring consistent excellence in everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={value.title}
                  className={`p-8 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group animate-fade-in-up`}
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* System Architecture Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">System Architecture</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AURA orchestrates the flow; specialized agents handle focused responsibilities. This separation keeps decisions explainable and the experience consistent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div 
                  key={agent.title}
                  className={`p-8 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group animate-fade-in-up`}
                  style={{ animationDelay: `${350 + index * 120}ms` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{agent.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{agent.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Principles Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Guiding Principles</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These principles guide our daily operations and long-term strategic decisions, ensuring we consistently deliver exceptional value.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {principles.map((principle, index) => (
              <div 
                key={principle.title}
                className={`p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md group animate-fade-in-up`}
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div className="w-3 h-3 bg-primary rounded-full mb-4 group-hover:scale-125 transition-transform duration-300"></div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{principle.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Build trustworthy, empathetic loan experiences by coordinating specialized agents that make every step clear: discussion, verification, underwriting, eligibility, and documentation.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-background to-primary/5">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Ready to Experience Our Philosophy in Action?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how our principles and values can drive exceptional results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LiquidButton size="lg" asChild className="font-medium">
                <a href="/chat" className="flex items-center gap-2">
                  Start Loan Application
                  <ArrowRight className="w-5 h-5" />
                </a>
              </LiquidButton>
              <LiquidButton size="lg" variant="outline" asChild className="font-medium">
                <a href="/development" className="flex items-center gap-2">
                  See Agent Architecture
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

export default PhilosophyPage;
