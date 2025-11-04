// Financial AI System API Service
// Dev uses Vite proxy (/api) if no env is provided; prod prefers env (VITE_API_URL or VITE_BACKEND_URL) then Render
const ENV_API_URL = (import.meta.env?.VITE_API_URL as string) || (import.meta.env?.VITE_BACKEND_URL as string) || '';
const API_BASE = import.meta.env?.DEV
  ? (ENV_API_URL || '/api')
  : (ENV_API_URL || 'https://savify-backend.onrender.com');
// Optional backend prefix (e.g., "/loan" or "/api/v1") to match deployment mount paths
const API_PREFIX = ((import.meta.env?.VITE_API_PREFIX as string) || '').trim();

// Types based on the backend models
export interface ExpenditureEntry {
  amount: number;
  category: string;
  description: string;
  date: string; // ISO datetime string
}

export interface ChatRequest {
  message: string;
  user_context?: string;
  expenditure_data?: ExpenditureEntry[];
}

export interface ChatResponse {
  response: string;
  query_type: 'expenditure_analysis' | 'insights_generation' | 'tax_advice' | 
              'investment_advice' | 'revenue_analysis' | 'general_chat';
  data?: any;
}

// Loan Advisor API shapes
export interface LoanChatRequest {
  customer_id: string;
  message: string;
  application_id?: string;
  data_update?: Record<string, any>;
}

export interface LoanChatResponse {
  application_id: string;
  agent_name: string;
  message: string;
  status: string;
  action_required?: string;
}

export interface FullAnalysisRequest {
  entries: ExpenditureEntry[];
  user_context?: string;
}

// API Service Class
export class FinancialApiService {
  private baseUrl: string;
  private prefix: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
    this.prefix = API_PREFIX ? `/${API_PREFIX.replace(/^\/|\/$/g, '')}` : '';
  }

  // Generic API call method with error handling
  private async apiCall<T>(endpoint: string, data: any): Promise<T> {
    try {
      const url = `${this.baseUrl.replace(/\/$/, '')}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Prefer text to surface HTML or plain errors; fallback to JSON
        const rawText = await response.text().catch(() => '');
        let detail = '';
        try {
          const json = JSON.parse(rawText);
          detail = json.detail || '';
        } catch (_) {
          detail = rawText || '';
        }
        const pathInfo = ` (endpoint: ${endpoint})`;
        throw new Error(detail || `HTTP ${response.status}: ${response.statusText}${pathInfo}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Attempt multiple POST endpoints until one succeeds
  private async postWithFallback<T>(endpoints: string[], data: any): Promise<T> {
    const errors: string[] = [];
    for (const ep of endpoints) {
      try {
        return await this.apiCall<T>(ep, data);
      } catch (e: any) {
        errors.push(e?.message || `Failed on ${ep}`);
        // If not 404, don't continue; rethrow immediately for non-route issues
        if (!/404|Not Found/i.test(e?.message || '')) {
          throw e;
        }
      }
    }
    throw new Error(`All endpoints failed: ${errors.join(' | ')}`);
  }

  // Build endpoint variants respecting optional prefix and dev proxy
  private resolvePaths(path: string, includeApiVariant: boolean = true): string[] {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const baseIsApiProxy = this.baseUrl.replace(/\/$/, '') === '/api';
    const variants: string[] = [];
    if (this.prefix) variants.push(`${this.prefix}${cleanPath}`);
    variants.push(cleanPath);
    if (includeApiVariant && !baseIsApiProxy) variants.push(`/api${cleanPath}`);
    return variants;
  }

  // Main chat endpoint - handles all query types intelligently
  async chat(request: ChatRequest): Promise<ChatResponse> {
    // Try variants in case backend is mounted with a prefix
    return this.postWithFallback<ChatResponse>(this.resolvePaths('/chat'), request);
  }

  // Loan advisor chat endpoint (FastAPI)
  async loanChat(request: LoanChatRequest): Promise<LoanChatResponse> {
    // Loan advisor chat uses /chat under the mounted app; include prefix variants
    return this.postWithFallback<LoanChatResponse>(this.resolvePaths('/chat'), request);
  }

  // Get application details
  async getApplication(appId: string): Promise<any> {
    const base = this.baseUrl.replace(/\/$/, '');
    const endpoints = this.resolvePaths(`/application/${appId}`, true);
    const errors: string[] = [];
    for (const ep of endpoints) {
      const url = `${base}${ep}`;
      const res = await fetch(url);
      if (res.ok) return res.json();
      const rawText = await res.text().catch(() => '');
      errors.push(rawText || `HTTP ${res.status}: ${res.statusText} (endpoint: ${ep})`);
      if (!/404|Not Found/i.test(rawText || '')) break; // stop on non-404
    }
    throw new Error(`All endpoints failed: ${errors.join(' | ')}`);
  }

  // Fetch sanction letter PDF as Blob
  async getSanctionLetter(appId: string): Promise<Blob> {
    const base = this.baseUrl.replace(/\/$/, '');
    const endpoints = this.resolvePaths(`/sanction-letter/${appId}`, true);
    const errors: string[] = [];
    for (const ep of endpoints) {
      const url = `${base}${ep}`;
      const res = await fetch(url);
      if (res.ok) return res.blob();
      const text = await res.text().catch(() => '');
      errors.push(text || `HTTP ${res.status}: ${res.statusText} (endpoint: ${ep})`);
      if (!/404|Not Found/i.test(text || '')) break; // stop on non-404
    }
    throw new Error(`All endpoints failed: ${errors.join(' | ')}`);
  }

  // Direct expenditure analysis
  async analyzeExpenditure(entries: ExpenditureEntry[]): Promise<ChatResponse> {
    return this.postWithFallback<ChatResponse>(this.resolvePaths('/analyze-expenditure'), entries);
  }

  // Complete analysis pipeline
  async fullAnalysis(request: FullAnalysisRequest): Promise<ChatResponse> {
    return this.postWithFallback<ChatResponse>(this.resolvePaths('/full-analysis'), request);
  }

  // Convenience methods for specific query types
  async askFinancialQuestion(message: string, userContext?: string): Promise<ChatResponse> {
    return this.chat({ message, user_context: userContext });
  }

  async getInvestmentAdvice(message: string, userContext?: string): Promise<ChatResponse> {
    return this.chat({ 
      message: `Investment advice: ${message}`, 
      user_context: userContext 
    });
  }

  async getTaxAdvice(message: string, userContext?: string): Promise<ChatResponse> {
    return this.chat({ 
      message: `Tax advice: ${message}`, 
      user_context: userContext 
    });
  }

  async analyzeSpendingWithInsights(
    entries: ExpenditureEntry[], 
    userContext?: string
  ): Promise<ChatResponse> {
    return this.chat({
      message: "Analyze my spending and provide insights",
      user_context: userContext,
      expenditure_data: entries
    });
  }

  // Health check
  async healthCheck(): Promise<{ status?: string; service?: string; message?: string }> {
    try {
      const base = this.baseUrl.replace(/\/$/, '');
      const endpoints = this.resolvePaths('/health');
      let lastErrorText = '';
      for (const ep of endpoints) {
        const response = await fetch(`${base}${ep}`);
        if (response.ok) return await response.json();
        lastErrorText = await response.text().catch(() => '');
        if (!/404|Not Found/i.test(lastErrorText || '')) break; // stop on non-404
      }
      throw new Error(lastErrorText || 'Backend service is not available');
    } catch (error) {
      throw new Error('Backend service is not available');
    }
  }
}

// Default instance
export const financialApi = new FinancialApiService();

// Utility functions
export const createExpenditureEntry = (
  amount: number,
  category: string,
  description: string,
  date?: Date
): ExpenditureEntry => ({
  amount,
  category,
  description,
  date: (date || new Date()).toISOString()
});

// Common expense categories
export const EXPENSE_CATEGORIES = [
  'food',
  'transport',
  'housing',
  'utilities',
  'entertainment',
  'healthcare',
  'shopping',
  'education',
  'travel',
  'other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];