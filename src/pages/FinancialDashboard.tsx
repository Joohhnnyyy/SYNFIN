import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator,
  MessageCircle, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Brain,
  Shield,
  FileText,
  CheckCircle,
  Send,
  Loader2
} from 'lucide-react';
// Local storage key for expenses
const EXPENSES_STORAGE_KEY = 'financial_dashboard_expenses';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { FormattedText } from '@/components/ui/formatted-text';
import { financialApi, createExpenditureEntry } from '@/lib/financialApi';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  queryType: string;
  timestamp: Date;
  data?: any;
}

interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
}

export const FinancialDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [userContext, setUserContext] = useState('');
  const { currentUser } = useAuth();

  // Applicant context and EMI calculator inputs
  const [emiInputs, setEmiInputs] = useState({
    principal: '',
    annualRate: '',
    tenureMonths: ''
  });
  const [emiResult, setEmiResult] = useState<string>('');

  useEffect(() => {
    console.log('=== AUTH STATE CHANGE ===');
    console.log('Current user from Firebase Auth:', currentUser);
    console.log('User UID:', currentUser?.uid);
    console.log('User email:', currentUser?.email);
    console.log('User display name:', currentUser?.displayName);
    
    if (currentUser) {
      console.log('User is authenticated, loading expenses...');
      // Load expenses from local storage
      loadExpenses(currentUser.uid);
    } else {
      console.log('No user authenticated');
      setExpenses([]); // Clear expenses when no user
    }
  }, [currentUser]);

  const loadExpenses = (userId: string) => {
    console.log('=== LOADING EXPENSES FROM LOCAL STORAGE ===');
    console.log('Loading expenses for user:', userId);
    
    try {
      const storedExpenses = localStorage.getItem(`${EXPENSES_STORAGE_KEY}_${userId}`);
      if (storedExpenses) {
        const parsedExpenses: Expense[] = JSON.parse(storedExpenses);
        console.log('Loaded expenses from local storage:', parsedExpenses);
        setExpenses(parsedExpenses);
      } else {
        console.log('No expenses found in local storage');
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error loading expenses from local storage:', error);
      setExpenses([]);
    }
  };

  const saveExpensesToStorage = (userId: string, expenses: Expense[]) => {
    try {
      localStorage.setItem(`${EXPENSES_STORAGE_KEY}_${userId}`, JSON.stringify(expenses));
      console.log('Expenses saved to local storage');
    } catch (error) {
      console.error('Error saving expenses to local storage:', error);
    }
  };

  const calculateEmi = () => {
    const P = parseFloat(emiInputs.principal);
    const annualRate = parseFloat(emiInputs.annualRate);
    const n = parseInt(emiInputs.tenureMonths);
    if (!P || !annualRate || !n || P <= 0 || annualRate <= 0 || n <= 0) {
      setEmiResult('Please enter valid principal, rate, and tenure.');
      return;
    }
    const r = annualRate / 12 / 100; // monthly interest rate
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const interestPayable = totalPayable - P;
    setEmiResult(`Monthly EMI: $${emi.toFixed(2)} | Interest: $${interestPayable.toFixed(2)} | Total: $${totalPayable.toFixed(2)}`);
  };

  const removeExpense = (index: number) => {
    if (!currentUser) return;
    
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
    saveExpensesToStorage(currentUser.uid, updatedExpenses);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    setIsLoading(true);
    try {
      // Convert expenses to the format expected by the API
      const expenditureData = expenses.map(expense => 
        createExpenditureEntry(
          expense.amount,
          expense.category,
          expense.description,
          new Date(expense.transaction_date)
        )
      );

      // Call the real API
      const apiResponse = await financialApi.chat({
        message: currentMessage,
        user_context: `User has ${expenses.length} expenses totaling $${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}`,
        expenditure_data: expenditureData
      });

      const newChatMessage: ChatMessage = {
        id: Date.now().toString(),
        message: currentMessage,
        response: apiResponse.response,
        queryType: apiResponse.query_type,
        timestamp: new Date(),
        data: apiResponse.data
      };
      
      setChatMessages([...chatMessages, newChatMessage]);
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to a user-friendly error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: currentMessage,
        response: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        queryType: "error",
        timestamp: new Date(),
        data: null
      };
      setChatMessages([...chatMessages, errorMessage]);
      setCurrentMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeExpenses = async () => {
    if (expenses.length === 0) return;
    
    setIsLoading(true);
    try {
      // Convert expenses to the format expected by the API
      const expenditureData = expenses.map(expense => 
        createExpenditureEntry(
          expense.amount,
          expense.category,
          expense.description,
          new Date(expense.transaction_date)
        )
      );

      // Call the real API for expense analysis
      const apiResponse = await financialApi.analyzeSpendingWithInsights(
        expenditureData,
        `User requesting analysis of ${expenses.length} expenses`
      );

      const newChatMessage: ChatMessage = {
        id: Date.now().toString(),
        message: 'Analyze my expenses',
        response: apiResponse.response,
        queryType: apiResponse.query_type,
        timestamp: new Date(),
        data: apiResponse.data
      };
      setChatMessages([...chatMessages, newChatMessage]);
    } catch (error) {
      console.error('Error analyzing expenses:', error);
      
      // Fallback to local analysis if API fails
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);
      
      const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
      
      const fallbackMessage: ChatMessage = {
        id: Date.now().toString(),
        message: 'Analyze my expenses',
        response: `Based on your ${expenses.length} expenses totaling $${totalSpent.toFixed(2)}, your highest spending category is ${topCategory[0]} at $${topCategory[1].toFixed(2)}. Consider reviewing this category for potential savings opportunities.`,
        queryType: "expense_analysis",
        timestamp: new Date(),
        data: { totalSpent, categoryTotals }
      };
      setChatMessages([...chatMessages, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">Loan Dashboard</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Manage your AI-driven loan processing workflow — EMI, KYC, underwriting, eligibility, and sanction letters</p>
          </div>

          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                Applicant Context
              </CardTitle>
              <CardDescription className="text-base">
                Provide a short summary (e.g., employment, income, desired loan amount & tenure)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Salaried, $60k/year, requesting $20k over 36 months"
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                className="text-base py-3"
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="services" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-white/80 backdrop-blur-sm shadow-sm">
              <TabsTrigger value="services" className="text-base font-medium">Loan Services</TabsTrigger>
              <TabsTrigger value="chat" className="text-base font-medium">AI Loan Chat</TabsTrigger>
              <TabsTrigger value="overview" className="text-base font-medium">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-8">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-primary" /> EMI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Principal Amount</label>
                      <Input
                        type="number"
                        placeholder="Enter principal"
                        value={emiInputs.principal}
                        onChange={(e) => setEmiInputs({...emiInputs, principal: e.target.value})}
                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
                      <Input
                        type="number"
                        placeholder="e.g., 12"
                        value={emiInputs.annualRate}
                        onChange={(e) => setEmiInputs({...emiInputs, annualRate: e.target.value})}
                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Tenure (months)</label>
                      <Input
                        type="number"
                        placeholder="e.g., 36"
                        value={emiInputs.tenureMonths}
                        onChange={(e) => setEmiInputs({...emiInputs, tenureMonths: e.target.value})}
                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Result</label>
                      <Input
                        placeholder="EMI result will appear here"
                        value={emiResult}
                        readOnly
                        className="h-12 border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <LiquidButton 
                      onClick={calculateEmi} 
                      variant="default"
                      size="lg"
                      className="font-semibold"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate EMI
                    </LiquidButton>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-800">Agent Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-primary/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MessageCircle className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Master Agent Chat</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Start the application with a guided conversation.</p>
                      <LiquidButton asChild size="sm"><a href="/chat">Start Chat</a></LiquidButton>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-primary/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-800">KYC Verification</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Validate PAN/Aadhaar via mock KYC APIs.</p>
                      <LiquidButton size="sm" variant="outline">Run KYC</LiquidButton>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-primary/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Underwriting</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Fetch credit score and set pre-approved limits.</p>
                      <LiquidButton size="sm" variant="outline">Run Underwriting</LiquidButton>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-primary/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Eligibility Decision</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Approve or reject based on policy thresholds.</p>
                      <LiquidButton size="sm" variant="outline">Check Eligibility</LiquidButton>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-primary/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Sanction Letter</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Generate and share a branded PDF sanction letter.</p>
                      <LiquidButton size="sm" variant="outline">Generate Letter</LiquidButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-8">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                    <div className="p-3 bg-primary/10 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    AI Loan Assistant
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 mt-2">
                    Ask about EMI, KYC, underwriting, eligibility decisions, and sanction letters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Input Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div 
                      className="p-4 bg-gradient-to-br from-card to-secondary/50 rounded-xl border border-border hover:border-primary/30 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                      onClick={() => setCurrentMessage("Calculate EMI for $20,000 at 12% for 36 months")}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                          <Calculator className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">EMI Calculation</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Compute monthly EMI and payment schedule</p>
                    </div>

                    <div 
                      className="p-4 bg-gradient-to-br from-card to-secondary/50 rounded-xl border border-border hover:border-primary/30 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                      onClick={() => setCurrentMessage("Run KYC verification for PAN and Aadhaar")}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                          <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">KYC Verification</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Validate PAN/Aadhaar and collect documents</p>
                    </div>

                    <div 
                      className="p-4 bg-gradient-to-br from-card to-secondary/50 rounded-xl border border-border hover:border-primary/30 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                      onClick={() => setCurrentMessage("Fetch credit score and set pre-approved limit")}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Underwriting</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Risk analysis and policy checks</p>
                    </div>

                    <div 
                      className="p-4 bg-gradient-to-br from-card to-secondary/50 rounded-xl border border-border hover:border-primary/30 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                      onClick={() => setCurrentMessage("Run eligibility decision and generate sanction letter")}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Eligibility & Sanction</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Decisioning and PDF generation</p>
                    </div>
                  </div>
                  <div className="space-y-6 mb-6 max-h-96 overflow-y-auto bg-gray-50 rounded-xl p-6">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Brain className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-gray-600 text-lg font-medium mb-2">Start a conversation with your AI loan assistant</p>
                        <p className="text-gray-500 text-sm">Try asking: "Compute my EMI" or "Verify my KYC"</p>
                      </div>
                    ) : (
                      chatMessages.map((chat) => (
                        <div key={chat.id} className="space-y-4">
                          <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-br-sm max-w-[80%] ml-auto">
                            <p className="font-medium mb-1">You:</p>
                            <p>{chat.message}</p>
                          </div>
                          <div className="bg-white p-4 rounded-2xl rounded-bl-sm max-w-[80%] shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-gray-800">AI Assistant:</p>
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                                {chat.queryType.replace('_', ' ')}
                              </Badge>
                            </div>
                            <FormattedText text={chat.response} className="text-gray-700" />
                            {chat.data && (
                              <details className="mt-3">
                                <summary className="text-sm text-primary cursor-pointer hover:text-primary/80 font-medium">
                                  View detailed data
                                </summary>
                                <pre className="text-xs bg-gray-100 p-3 rounded-lg mt-2 overflow-x-auto border">
                                  {JSON.stringify(chat.data, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
                    <Textarea
                      placeholder="Ask about investments, taxes, budgeting, or anything financial..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="flex-1 min-h-[60px] bg-background border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                      rows={2}
                    />
                    <LiquidButton 
                      onClick={sendMessage} 
                      disabled={isLoading || !currentMessage.trim()}
                      variant="default"
                      size="lg"
                      className="self-end font-semibold"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </LiquidButton>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="space-y-10 p-6">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                  Application Overview
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Track key metrics across EMI, KYC, underwriting, eligibility, and PDF generation
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-6">
                    <CardTitle className="text-xl font-bold text-foreground">EMI Result</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl shadow-sm">
                      <Calculator className="h-7 w-7 text-emerald-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-xl font-semibold text-foreground mb-1">{emiResult || 'Calculate EMI to view details'}</div>
                    <p className="text-base text-muted-foreground flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                      EMI summary based on your inputs
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-6">
                    <CardTitle className="text-xl font-bold text-foreground">KYC Status</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl shadow-sm">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold text-foreground mb-3">Pending</div>
                    <p className="text-base text-muted-foreground flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                      PAN/Aadhaar validation and documents
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-6">
                    <CardTitle className="text-xl font-bold text-foreground">AI Insights</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl shadow-sm">
                      <TrendingUp className="h-7 w-7 text-violet-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-4xl font-bold text-foreground mb-3">{chatMessages.length}</div>
                    <p className="text-base text-muted-foreground flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-violet-500 rounded-full"></span>
                      AI loan conversations completed
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Category Breakdown */}
              {Object.keys(categoryTotals).length > 0 && (
                <Card className="group relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
                        <PieChart className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-foreground">Spending by Category</CardTitle>
                    </div>
                    <CardDescription className="text-lg text-muted-foreground">
                      Detailed breakdown of your expenses across different categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-5">
                      {Object.entries(categoryTotals)
                        .sort(([,a], [,b]) => b - a)
                        .map(([category, amount], index) => {
                          const percentage = ((amount / totalSpent) * 100).toFixed(1);
                          const colors = [
                            'from-primary/20 to-primary/10 border-primary/30',
                            'from-emerald-100/80 to-emerald-50/80 border-emerald-200',
                            'from-violet-100/80 to-violet-50/80 border-violet-200',
                            'from-amber-100/80 to-amber-50/80 border-amber-200',
                            'from-rose-100/80 to-rose-50/80 border-rose-200',
                            'from-blue-100/80 to-blue-50/80 border-blue-200'
                          ];
                          const colorClass = colors[index % colors.length];
                          
                          return (
                            <div key={category} className={`flex items-center justify-between p-5 bg-gradient-to-r ${colorClass} rounded-xl border hover:shadow-md transition-all duration-200`}>
                              <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-primary rounded-full shadow-sm"></div>
                                <span className="font-semibold text-foreground capitalize text-lg">{category}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-foreground text-xl">${amount.toFixed(2)}</div>
                                <div className="text-sm text-muted-foreground font-medium">{percentage}% of total</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
              {expenses.length > 0 && (
                <Card className="group relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-foreground">Recent Transactions</CardTitle>
                    </div>
                    <CardDescription className="text-lg text-muted-foreground">
                      Your latest expense entries and spending activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-4">
                      {expenses.slice(-5).reverse().map((expense, index) => (
                        <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                          <div className="flex-1">
                            <div className="font-semibold text-foreground text-lg mb-1">{expense.description}</div>
                            <div className="text-muted-foreground capitalize flex items-center gap-2">
                              <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                              {expense.category} • {expense.transaction_date}
                            </div>
                          </div>
                          <div className="font-bold text-foreground text-xl">${expense.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};