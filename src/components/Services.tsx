import { Brain, TrendingUp, Shield, Target, PieChart, AlertTriangle, X } from "lucide-react";
import { useState, createElement } from "react";

const services = [
  {
    title: "Master Agent",
    description: "Welcomes customers, understands intent, and initiates the loan process via chat.",
    icon: Brain,
    learnMore: {
      overview: "Acts as the primary interface, guiding users into the loan journey.",
      features: [
        "Conversation orchestration and intent detection",
        "Customer onboarding and data capture",
        "Seamless handoff to Sales Agent",
      ],
      benefits: [
        "Friendly entry point for customers",
        "Clear guidance from first message",
        "Lower drop-off with conversational UX",
      ],
    },
  },
  {
    title: "Sales Agent",
    description: "Discusses loan amount, rate, tenure and computes EMI in real-time.",
    icon: TrendingUp,
    learnMore: {
      overview: "Captures loan preferences and provides instant EMI calculations.",
      features: [
        "Loan amount, rate, tenure capture",
        "EMI computation and scenarios",
        "Offer presentation and adjustments",
      ],
      benefits: [
        "Transparent repayment insights",
        "Fast iteration on loan terms",
        "Improved decision confidence",
      ],
    },
  },
  {
    title: "Verification Agent",
    description: "Validates PAN/Aadhaar via mock KYC APIs for compliance.",
    icon: Shield,
    learnMore: {
      overview: "Performs identity verification using simulated KYC endpoints.",
      features: [
        "PAN and Aadhaar validation",
        "Mock API integration",
        "KYC status reporting",
      ],
      benefits: [
        "Frictionless identity checks",
        "Compliance-ready workflows",
        "Reduced manual review",
      ],
    },
  },
  {
    title: "Underwriting Agent",
    description: "Fetches credit score and sets pre-approved limits.",
    icon: PieChart,
    learnMore: {
      overview: "Assesses creditworthiness and proposes safe lending thresholds.",
      features: [
        "Credit score retrieval",
        "Risk assessment logic",
        "Pre-approved limit calculation",
      ],
      benefits: [
        "Responsible lending decisions",
        "Aligned risk and exposure",
        "Faster underwriting cycles",
      ],
    },
  },
  {
    title: "Eligibility Agent",
    description: "Makes approval/rejection decisions based on policy and inputs.",
    icon: Target,
    learnMore: {
      overview: "Applies decision rules combining credit, loan terms, and KYC results.",
      features: [
        "Policy rules evaluation",
        "Edge case handling",
        "Decision explanation",
      ],
      benefits: [
        "Clear approvals or rejections",
        "Audit-friendly decisions",
        "Consistency across cases",
      ],
    },
  },
  {
    title: "PDF Agent",
    description: "Generates sanction letters for approved loans as final output.",
    icon: AlertTriangle,
    learnMore: {
      overview: "Creates formal sanction documentation from approved case data.",
      features: [
        "Dynamic PDF generation",
        "Template-driven letter formatting",
        "Delivery and archival hooks",
      ],
      benefits: [
        "Professional documents instantly",
        "Reduced operational workload",
        "End-to-end automation",
      ],
    },
  },
];

export const Services = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const openModal = (index: number) => {
    console.log('Opening modal for service index:', index);
    setSelectedService(index);
  };

  const closeModal = () => {
    setSelectedService(null);
  };
  return (
    <section className="py-32 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-20 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-20 w-64 h-64 bg-primary/60 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 mb-6">
              <Brain className="w-4 h-4" />
              AI Loan Processing Agents
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Specialized Agents Orchestrated via{" "}
              <span className="text-primary">MCP</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Exposed through FastAPI, this multi-agent workflow runs from customer chat to sanction letter generation.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={index}
                  className="group p-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-strong hover:-translate-y-2 animate-fade-in-up relative"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                        {service.description}
                      </p>
                      
                      {/* Learn more button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Button clicked, index:', index);
                          openModal(index);
                        }}
                        className="mt-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-all duration-300 group/btn cursor-pointer z-10 relative"
                        type="button"
                      >
                        <span className="text-sm font-medium">Learn more</span>
                        <div className="w-4 h-4 text-primary/70 group-hover/btn:text-primary transition-colors duration-300">
                          →
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Card background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedService !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                   {createElement(services[selectedService].icon, { className: "w-5 h-5 text-primary" })}
                 </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {services[selectedService].title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 bg-muted/50 hover:bg-muted rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Overview */}
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Overview</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {services[selectedService].learnMore.overview}
                </p>
              </div>
              
              {/* Features */}
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {services[selectedService].learnMore.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Benefits */}
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Benefits</h4>
                <ul className="space-y-2">
                  {services[selectedService].learnMore.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
