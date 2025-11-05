import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { FormattedText } from "@/components/ui/formatted-text";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// Removed Select import after consolidating agent selector UI
import { financialApi } from "@/lib/financialApi";
import {
  Brain,
  Send,
  Loader2,
  MessageCircle,
  Shield,
  TrendingUp,
  CheckCircle,
  FileText,
  Calculator,
  User,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  agent: string;
  content: string;
  timestamp: Date;
}

const agents = [
  { key: "Master", label: "Master Agent", icon: MessageCircle, desc: "Guided conversation and orchestration" },
  { key: "Sales", label: "Sales Agent", icon: Calculator, desc: "Collect loan details, compute EMI" },
  { key: "KYC", label: "KYC Agent", icon: Shield, desc: "PAN/Aadhaar verification" },
  { key: "Underwriting", label: "Underwriting Agent", icon: TrendingUp, desc: "Credit score and risk" },
  { key: "Eligibility", label: "Eligibility Agent", icon: CheckCircle, desc: "Approval rules and policy" },
  { key: "PDF", label: "PDF Agent", icon: FileText, desc: "Generate sanction letter" },
];

export default function ChatPage() {
  const [activeAgent, setActiveAgent] = useState<string>(agents[0].key);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userContext, setUserContext] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  // Conversation cues
  const [awaitingSalary, setAwaitingSalary] = useState(false);
  // Detected monthly salary indicator
  const [detectedMonthlySalary, setDetectedMonthlySalary] = useState<number | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [customerId] = useState<string>(() => {
    const existing = localStorage.getItem("customer_id");
    if (existing) return existing;
    const generated = (window.crypto?.randomUUID?.() || `cust-${Date.now()}`);
    localStorage.setItem("customer_id", generated);
    return generated;
  });
  const [healthStatus, setHealthStatus] = useState<string>("Not checked");
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [previewErrors, setPreviewErrors] = useState<Record<string, string>>({});
  const [htmlPreviews, setHtmlPreviews] = useState<Record<string, JSX.Element>>({});

  // Auto-scroll only if the user is already near the bottom
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    if (isAtBottom) {
      // Prefer direct scroll to avoid repeated smooth animations
      const el = messagesContainerRef.current;
      el.scrollTop = el.scrollHeight;
      // Anchor as a fallback for some browsers
      endOfMessagesRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages, isLoading, isAtBottom]);

  // Track whether the user is near the bottom of the thread
  const handleThreadScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const threshold = 48; // px threshold to consider "at bottom"
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsAtBottom(atBottom);
  };

  const previewLetter = async (messageId: string) => {
    if (!applicationId) {
      setPreviewErrors((prev) => ({ ...prev, [messageId]: 'No application ID available' }));
      return;
    }
    try {
      const blob = await financialApi.getSanctionLetter(applicationId);
      const url = URL.createObjectURL(blob);
      setPreviewUrls((prev) => ({ ...prev, [messageId]: url }));
    } catch (e) {
      const errMsg = (e as any)?.message || 'Unable to fetch sanction letter';
      setPreviewErrors((prev) => ({ ...prev, [messageId]: errMsg }));
      try {
        const app = await financialApi.getApplication(applicationId);
        const html = (
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-semibold mb-2">Sanction Letter (Preview)</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Applicant:</strong> {app?.customer?.name || app?.customer?.customer_id}</p>
              <p><strong>Application ID:</strong> {app.application_id}</p>
              <p><strong>Loan Amount:</strong> {app.loan_amount ? `₹${Number(app.loan_amount).toLocaleString()}` : '-'}</p>
              <p><strong>Interest Rate:</strong> {app.interest_rate ? `${app.interest_rate}%` : '-'}</p>
              <p><strong>Tenure:</strong> {app.tenure_months ? `${app.tenure_months} months` : '-'}</p>
              <p><strong>EMI:</strong> {app.emi ? `₹${Number(app.emi).toLocaleString()}` : '-'}</p>
              <p><strong>Status:</strong> {app.status}</p>
            </div>
            <p className="text-xs text-gray-500 mt-3">Note: PDF file couldn’t be fetched; showing HTML preview.</p>
          </div>
        );
        setHtmlPreviews((prev) => ({ ...prev, [messageId]: html }));
      } catch (_) {
        // leave error surfaced
      }
    }
  };

  const quickPrompts = [
    { agent: "Sales", text: "Calculate EMI for ₹20,000 at 12% for 36 months" },
    { agent: "KYC", text: "Run PAN and Aadhaar verification" },
    { agent: "Underwriting", text: "Fetch credit score and suggest pre-approved limit" },
    { agent: "Eligibility", text: "Check eligibility for a ₹20,000 loan" },
    { agent: "PDF", text: "Generate a sanction letter for approved loan" },
  ];

  // Attempt to extract a monthly salary amount from free-form input.
  // Supports numbers, Indian units (lakh/crore), thousand/K suffix, and month/year qualifiers.
  const extractMonthlySalary = (text: string): number | undefined => {
    const lower = text.toLowerCase();
    // Helper to convert a numeric string with optional lakh/crore unit into rupees
    const toRupees = (numStr: string, unit?: string): number => {
      const base = parseFloat(numStr.replace(/,/g, ''));
      if (!isFinite(base)) return NaN;
      if (!unit) return base;
      // Normalize common unit variants: lakh, lakhs, lac, lacs, lkhs
      const u = unit.toLowerCase();
      const isCrore = /crore|crores/.test(u);
      const isLakh = /lakh|lakhs|lac|lacs|lkhs|lkh/.test(u);
      const isThousand = /^(k|thousand|thousands)$/.test(u);
      if (isCrore) return base * 10000000;
      if (isLakh) return base * 100000;
      if (isThousand) return base * 1000;
      return base;
    };

    // Case 1: Messages explicitly mentioning salary with a number
    const salaryNum = text.match(/salary[^\d]*(\d[\d,]*)(?:\s*)(k|thousand|thousands|lakh|lakhs|lac|lacs|lkhs|lkh|crore|crores)?/i);
    if (salaryNum) {
      const value = toRupees(salaryNum[1], salaryNum[2]);
      if (isFinite(value)) {
        const isMonthly = /\b(month|monthly)\b/i.test(lower);
        const isYearly = /\b(year|yearly|annum|annual)\b/i.test(lower);
        if (isMonthly) return value;
        if (isYearly) return Math.round(value / 12);
        return value; // default to monthly if unspecified
      }
    }

    // Case 2: Generic number + optional lakh/crore and month/year context
    // Find first amount occurrence
    // Support tight forms like "2lakh", "2lkhs"
    const amountMatch = text.match(/(\d[\d,]*)(?:\s*)(k|thousand|thousands|lakh|lakhs|lac|lacs|lkhs|lkh|crore|crores)?/i);
    if (amountMatch) {
      const value = toRupees(amountMatch[1], amountMatch[2]);
      if (!isFinite(value)) return undefined;
      const isMonthly = /\b(month|monthly)\b/i.test(lower);
      const isYearly = /\b(year|yearly|annum|annual)\b/i.test(lower);
      if (isMonthly) return value;
      if (isYearly) return Math.round(value / 12);
    }

    // Case 3: Two amounts with explicit month/year hints (e.g., "2 lakh a month or 24 lakhs a year")
    const matches = [...text.matchAll(/(\d[\d,]*)(?:\s*)(k|thousand|thousands|lakh|lakhs|lac|lacs|lkhs|lkh|crore|crores)?/gi)];
    if (matches.length >= 2) {
      // Prefer the one near "month" if present
      const indexOfMonth = lower.indexOf('month');
      if (indexOfMonth !== -1) {
        // pick the amount whose match index is closest to "month"
        let bestIdx = 0;
        let bestDist = Infinity;
        matches.forEach((m, idx) => {
          const dist = Math.abs((m.index || 0) - indexOfMonth);
          if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
        });
        const m = matches[bestIdx];
        const value = toRupees(m[1], m[2]);
        if (isFinite(value)) return value;
      }
      const indexOfYear = lower.indexOf('year');
      if (indexOfYear !== -1) {
        let bestIdx = 0;
        let bestDist = Infinity;
        matches.forEach((m, idx) => {
          const dist = Math.abs((m.index || 0) - indexOfYear);
          if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
        });
        const m = matches[bestIdx];
        const value = toRupees(m[1], m[2]);
        if (isFinite(value)) return Math.round(value / 12);
      }
    }

    return undefined;
  };

  // Extract loan amount in rupees, supporting lakh/crore and comma formatting.
  const extractLoanAmount = (text: string): number | undefined => {
    const m = text.match(/(\d[\d,]*)(?:\s*)(lakh|lakhs|crore|crores)?/i);
    if (!m) return undefined;
    const base = parseFloat(m[1].replace(/,/g, ''));
    if (!isFinite(base)) return undefined;
    const unit = m[2]?.toLowerCase();
    if (!unit) return base;
    if (unit.startsWith('crore')) return base * 10000000;
    if (unit.startsWith('lakh')) return base * 100000;
    return base;
  };

  // Extract tenure in months, supporting "months" or "years".
  const extractTenureMonths = (text: string): number | undefined => {
    const lower = text.toLowerCase();
    const m = lower.match(/(\d+)\s*(months?|years?)/);
    if (!m) return undefined;
    const n = parseInt(m[1], 10);
    if (!Number.isFinite(n)) return undefined;
    const unit = m[2];
    if (/year/.test(unit)) return n * 12;
    return n;
  };

  // Extract all tenure mentions in months to detect ambiguity like "4 or 5 years".
  const extractTenureList = (text: string): number[] => {
    const lower = text.toLowerCase();
    const matches = [...lower.matchAll(/(\d+)\s*(months?|month|years?|yrs?|y)/g)];
    return matches.map((m) => {
      const n = parseInt(m[1], 10);
      const unit = m[2] || '';
      if (!Number.isFinite(n)) return NaN;
      return (/^y|^yr|year/.test(unit)) ? n * 12 : n;
    }).filter((n) => Number.isFinite(n) && n > 0);
  };

  // Format a human name using title case, preserving hyphenated parts.
  const formatName = (name: string): string => {
    if (!name) return name;
    return name
      .split(/\s+/)
      .map((part) => part
        .split('-')
        .map((seg) => seg ? seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase() : seg)
        .join('-')
      )
      .join(' ');
  };

  // Map message intent to backend status strings to steer agent selection server-side.
  const intentToStatus = (text: string, currentAgent: string, expectingSalary: boolean): string | undefined => {
    const ml = text.toLowerCase();
    const containsAny = (tokens: string[]) => tokens.some((t) => ml.includes(t));
    const hasPan = /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(text.toUpperCase());
    const hasAadhar = /\b\d{12}\b/.test(text);

    // If we are awaiting salary, steer conversation to eligibility and avoid sales diversion
    if (expectingSalary || currentAgent === 'Eligibility') return 'eligibility_check';

    // Verification intents: PAN/Aadhar/KYC
    if (containsAny(['kyc', 'pan', 'aadhar']) || hasPan || hasAadhar) return 'kyc_verification';

    // Sales intents: EMI/interest/tenure/amount
    if (
      containsAny(['emi', 'interest', 'rate', 'tenure', 'months', 'years', 'loan', 'amount', 'rupees', '₹', 'lakh', 'lac', 'crore'])
    ) {
      return 'sales_discussion';
    }

    // Underwriting intents
    if (containsAny(['credit score', 'underwriting'])) return 'underwriting';

    // Eligibility intents
    if (containsAny(['eligibility', 'approve', 'approval', 'salary'])) return 'eligibility_check';

    // PDF intents
    if (containsAny(['sanction letter', 'pdf'])) return 'approved';

    // Default: no override
    return undefined;
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setIsLoading(true);
    // If the user typed only a name (without phrases like "my name is"),
    // rewrite message for better backend extraction.
    const isSingleWord = /^\w+$/.test(content);
    const isGreeting = /^(hello|hi|hey|howdy|namaste|hola|bonjour)$/i.test(content.trim());
    const looksLikeBareName = /^(?:[A-Za-z][A-Za-z'.-]+)(?:\s+[A-Za-z][A-Za-z'.-]+)+$/.test(content) && !/(my name is|i am|i'm)/i.test(content);
    let effectiveContent = (!isGreeting && looksLikeBareName && !isSingleWord)
      ? `My name is ${formatName(content)}`
      : content;
    // If the message includes a name phrase, normalize the name part to title case
    const namePhraseMatch = effectiveContent.match(/\b(?:my name is|i am|i'm)\s+([A-Za-z][A-Za-z'.-]+(?:\s+[A-Za-z][A-Za-z'.-]+)+)/i);
    if (namePhraseMatch) {
      const rawName = namePhraseMatch[1];
      const formatted = formatName(rawName);
      effectiveContent = effectiveContent.replace(rawName, formatted);
    }
    // Try to extract structured info so backend reliably captures intent
    // Extract loan amount only when context suggests monetary intent
    const canExtractLoan = (
      activeAgent === 'Sales' ||
      /\b(loan|amount|rupees|lakh|lakhs|crore|crores|₹)\b/i.test(effectiveContent)
    );
    const looksLikeAadharOnly = /^\s*\d{12}\s*$/.test(effectiveContent);
    const loanAmount = (canExtractLoan && !looksLikeAadharOnly) ? extractLoanAmount(effectiveContent) : undefined;
    const tenureMentions = extractTenureList(effectiveContent);
    const isUncertain = /\b(unsure|not sure|confus(?:e|ed)|uncertain|hesitant|nervous|worried|dilemma|overwhelmed)\b/i.test(effectiveContent);
    const tenureMonths = (tenureMentions.length === 1 && !isUncertain) ? tenureMentions[0] : undefined;
    // Extract salary if explicitly mentioned, when talking to Eligibility, or when assistant asked for salary
    const allowSalaryExtraction = /\bsalary\b/i.test(effectiveContent) || activeAgent === 'Eligibility' || awaitingSalary;
    const monthlySalary = allowSalaryExtraction ? extractMonthlySalary(effectiveContent) : undefined;
    // If user didn't include the word "salary" but we detected an amount in an eligibility context,
    // augment the message to help backend parsing.
    const needsSalaryTag = monthlySalary && !/\bsalary\b/i.test(effectiveContent) && activeAgent === 'Eligibility';
    let effectiveWithTag = needsSalaryTag
      ? `${effectiveContent}. My salary is ${monthlySalary}`
      : effectiveContent;
    // If tenure mentions are ambiguous or the user expresses uncertainty, append an explicit hint
    const isAmbiguousTenure = (tenureMentions.length > 1) || isUncertain;
    if (isAmbiguousTenure && !/\b(unsure|not sure|uncertain|confus(?:e|ed))\b/i.test(effectiveWithTag)) {
      const options = tenureMentions.length ? ` (considering ${tenureMentions.map((n) => `${n} months`).join(' or ')})` : '';
      effectiveWithTag = `${effectiveWithTag}. I am unsure about the tenure${options}`;
    }
    const agentPrefixed = `[Agent: ${activeAgent}] ${effectiveWithTag}`;
    const intentStatus = intentToStatus(effectiveWithTag, activeAgent, awaitingSalary);

    try {
      const userMsg: ChatMessage = {
        id: Date.now().toString() + "-u",
        role: "user",
        agent: activeAgent,
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      const apiResponse = await financialApi.loanChat({
        customer_id: customerId,
        message: agentPrefixed,
        application_id: applicationId || undefined,
        data_update: {
          ...(userContext ? { user_context: userContext } : {}),
          ...(monthlySalary ? { salary: monthlySalary } : {}),
          ...(loanAmount ? { loan_amount: loanAmount } : {}),
          ...(tenureMonths ? { tenure_months: tenureMonths } : {}),
          ...(intentStatus ? { status: intentStatus } : {}),
        },
      });

      // Track application id for continued conversation
      if (!applicationId && apiResponse.application_id) {
        setApplicationId(apiResponse.application_id);
      }

      // Persist detected monthly salary for UI confirmation chip
      if (typeof monthlySalary === 'number' && monthlySalary > 0) {
        setDetectedMonthlySalary(monthlySalary);
      }

      const assistantMsg: ChatMessage = {
        id: Date.now().toString() + "-a",
        role: "assistant",
        agent: apiResponse.agent_name || activeAgent,
        content: `${apiResponse.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      // If assistant asks for salary, set awaitingSalary cue
      if (/monthly\s+salary|provide\s+your\s+salary|salary\b/i.test(assistantMsg.content)) {
        setAwaitingSalary(true);
      } else {
        // Clear on non-salary prompts to avoid sticky state
        setAwaitingSalary(false);
      }
      setInput("");
    } catch (error) {
      const err = error as any;
      const isNotFound = /404|Application not found/i.test(err?.message || "");
      if (applicationId && isNotFound) {
        try {
          // Clear invalid application and retry starting a new session
          setApplicationId(null);
          const retryResponse = await financialApi.loanChat({
            customer_id: customerId,
            message: agentPrefixed,
            data_update: {
              ...(userContext ? { user_context: userContext } : {}),
              ...(monthlySalary ? { salary: monthlySalary } : {}),
              ...(loanAmount ? { loan_amount: loanAmount } : {}),
              ...(tenureMonths ? { tenure_months: tenureMonths } : {}),
              ...(intentStatus ? { status: intentStatus } : {}),
            },
          });
          if (!applicationId && retryResponse.application_id) {
            setApplicationId(retryResponse.application_id);
          }
          // Persist detected monthly salary for UI confirmation chip on retry
          if (typeof monthlySalary === 'number' && monthlySalary > 0) {
            setDetectedMonthlySalary(monthlySalary);
          }
          const assistantMsg: ChatMessage = {
            id: Date.now().toString() + "-a",
            role: "assistant",
            agent: retryResponse.agent_name || activeAgent,
            content: `${retryResponse.message}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          if (/monthly\s+salary|provide\s+your\s+salary|salary\b/i.test(assistantMsg.content)) {
            setAwaitingSalary(true);
          } else {
            setAwaitingSalary(false);
          }
          setInput("");
        } catch (retryError) {
          const assistantMsg: ChatMessage = {
            id: Date.now().toString() + "-e",
            role: "assistant",
            agent: activeAgent,
            content: `Connection issue after retry: ${(retryError as any)?.message || 'Unable to reach backend.'}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      } else {
        const assistantMsg: ChatMessage = {
          id: Date.now().toString() + "-e",
          role: "assistant",
          agent: activeAgent,
          content: `Connection issue: ${err?.message || 'Unable to reach backend.'}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // If backend failed to generate or serve the sanction letter due to read-only filesystem,
        // attempt to provide an inline HTML preview from application data.
        const isReadOnly = /Read-only file system|Errno\s*30/i.test(err?.message || "");
        const isLetterMissing = /Sanction letter not found/i.test(err?.message || "");
        if (applicationId && (isReadOnly || isLetterMissing)) {
          try {
            const app = await financialApi.getApplication(applicationId);
            const previewMsg: ChatMessage = {
              id: Date.now().toString() + "-p",
              role: "assistant",
              agent: "PDF Agent",
              content: `Sanction letter preview generated inline due to backend file restriction.`,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, previewMsg]);

            const html = (
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="text-lg font-semibold mb-2">Sanction Letter (Preview)</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Applicant:</strong> {app?.customer?.name || app?.customer?.customer_id}</p>
                  <p><strong>Application ID:</strong> {app.application_id}</p>
                  <p><strong>Loan Amount:</strong> {app.loan_amount ? `₹${Number(app.loan_amount).toLocaleString()}` : '-'}</p>
                  <p><strong>Interest Rate:</strong> {app.interest_rate ? `${app.interest_rate}%` : '-'}</p>
                  <p><strong>Tenure:</strong> {app.tenure_months ? `${app.tenure_months} months` : '-'}</p>
                  <p><strong>EMI:</strong> {app.emi ? `₹${Number(app.emi).toLocaleString()}` : '-'}</p>
                  <p><strong>Status:</strong> {app.status}</p>
                </div>
                <p className="text-xs text-gray-500 mt-3">Note: PDF file couldn’t be fetched; showing HTML preview.</p>
              </div>
            );
            setHtmlPreviews((prev) => ({ ...prev, [previewMsg.id]: html }));
          } catch (_) {
            // silently ignore if application fetch fails
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkBackend = async () => {
    setIsHealthLoading(true);
    try {
      const res = await financialApi.healthCheck();
      const status = res.status || res.message || 'unknown';
      setHealthStatus(`Online (${status})`);
    } catch (e) {
      const err = e as any;
      setHealthStatus(`Offline (${err?.message || 'error'})`);
    } finally {
      setIsHealthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Unified AI Loan Chat</h1>
          <p className="mt-2 text-slate-600">Quick links to agents: Master, Sales, KYC, Underwriting, Eligibility, and PDF.</p>
        </div>

        {/* Top Agent Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {agents.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveAgent(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-all ${activeAgent === key ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-white/80 border-gray-200 hover:border-primary/30'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Pane */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg"><MessageCircle className="w-6 h-6 text-primary" /></div>
                  Conversation
                  <Badge variant="outline" className="ml-2">{activeAgent}</Badge>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => { setMessages([]); setInput(""); setApplicationId(null); }}>
                    New Chat
                  </Button>
                </div>
              </div>
              <CardDescription>Converse with the AI across agents. The active agent tags your message.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Detected Monthly Salary Chip */}
              {typeof detectedMonthlySalary === 'number' && detectedMonthlySalary > 0 && (
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Detected monthly salary: ₹{Number(detectedMonthlySalary).toLocaleString()}
                  </Badge>
                  <span className="text-xs text-gray-500">Type “My monthly salary is …” to update.</span>
                </div>
              )}
              {/* Thread */}
              <div
                className="space-y-5 mb-4 h-[60vh] overflow-y-auto bg-gray-50 rounded-xl p-6"
                ref={messagesContainerRef}
                onScroll={handleThreadScroll}
              >
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium mb-2">Start a conversation with your AI loan assistant</p>
                    <p className="text-gray-500 text-sm">Choose an agent above or type your question below</p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-end gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {m.role === 'user' ? 'You' : (m.agent || 'AI')[0]}
                          </AvatarFallback>
                        </Avatar>
                        {/* Bubble */}
                        <div className={`${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm'} p-4 shadow-sm`}> 
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{m.role === 'user' ? 'You' : 'AI Assistant'}</p>
                            {m.role !== 'user' && (
                              <Badge variant="outline" className="text-xs">{m.agent}</Badge>
                            )}
                            <span className="text-xs text-gray-500 ml-auto">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          {m.role === 'user' ? (
                            <p>{m.content}</p>
                          ) : (
                            <FormattedText text={m.content} className="text-gray-700" />
                          )}
                          {m.role !== 'user' && ( /sanction_letter|Document:/i.test(m.content) || previewUrls[m.id] || htmlPreviews[m.id]) && (
                            <div className="mt-3 space-y-2">
                              {!previewUrls[m.id] && !htmlPreviews[m.id] && (
                                <Button variant="outline" size="sm" onClick={() => previewLetter(m.id)}>Preview Letter</Button>
                              )}
                              {previewErrors[m.id] && (
                                <p className="text-xs text-red-600">{previewErrors[m.id]}</p>
                              )}
                              {previewUrls[m.id] && (
                                <object data={previewUrls[m.id]} type="application/pdf" className="w-full h-64 rounded-md border" />
                              )}
                              {!previewUrls[m.id] && htmlPreviews[m.id]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">AI Assistant</p>
                          <Badge variant="outline" className="text-xs">{activeAgent}</Badge>
                          <span className="text-xs text-gray-500 ml-auto">typing...</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating response</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endOfMessagesRef} />
              </div>

              {/* Composer */}
              <div className="flex flex-col sm:flex-row gap-3 items-end sticky bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-3 rounded-b-xl">
                <Textarea
                  placeholder={`Message for ${activeAgent}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[80px]"
                />
                <LiquidButton 
                  onClick={() => sendMessage()}
                  disabled={isLoading}
                  variant="default"
                  size="lg"
                  className="font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send
                    </>
                  )}
                </LiquidButton>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Pane */}
          <div className="space-y-6">
            {/* Applicant Context */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg"><Brain className="w-5 h-5 text-primary" /></div>
                  Applicant Context
                </CardTitle>
                <CardDescription>Employment, income, desired loan amount & tenure</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., Salaried, ₹60k/year, requesting ₹20k over 36 months"
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    const looksLikeNameOnly = /^(?:[A-Za-z][A-Za-z'.-]+)(?:\s+[A-Za-z][A-Za-z'.-]+)+$/.test(val);
                    if (looksLikeNameOnly) {
                      setUserContext(formatName(val));
                    }
                  }}
                  className="text-base py-3"
                />
              </CardContent>
            </Card>

            {/* Removed duplicate Agent Details list to avoid redundant controls */}

            {/* Backend Status */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Backend Status</CardTitle>
                <CardDescription>Check connectivity to AI Loan API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-700">{healthStatus}</p>
                  <Button variant="outline" size="sm" onClick={checkBackend} disabled={isHealthLoading}>
                    {isHealthLoading ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Checking</span>
                    ) : (
                      'Check'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Prompts */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Prompts</CardTitle>
                <CardDescription>One-click actions for common tasks.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    className="text-left p-4 bg-gradient-to-br from-card to-secondary/40 rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                    onClick={() => { setActiveAgent(qp.agent); sendMessage(qp.text); }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{qp.agent}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{qp.text}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">Tip: Switch agents anytime using the quick links for targeted actions.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}