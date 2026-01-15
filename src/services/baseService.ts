import { ApiResponse } from '@/types/api';

const AUTH_TOKEN_KEY = 'auth_token';
const COMPANY_KEY = 'company';
const USER_KEY = 'user';

export abstract class BaseService {
  protected abstract baseUrl: string;

  protected get token(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  protected get currentCompanyId(): string | null {
    try {
      const savedCompany = localStorage.getItem(COMPANY_KEY);
      if (savedCompany) {
        const company = JSON.parse(savedCompany);
        return company.id || company._id || null;
      }
    } catch (error) {
      console.error('Erro ao ler empresa do storage', error);
    }
    return null;
  }

  protected async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      // Common custom headers
      'X-Company-ID': this.currentCompanyId || '',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.getHeaders();

      // console.log(`🔗 Requesting: ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle 401 globally if needed
      if (response.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(COMPANY_KEY);
        localStorage.removeItem(USER_KEY);

        window.location.href = '/login';

        return {
          Success: false,
          Data: null as any,
          Error: 'Sessão expirada',
          Message: 'Sessão expirada. Por favor, faça login novamente.'
        };
      }

      // Try to parse JSON, handle empty responses
      const text = await response.text();
      let raw: any = null;
      try {
        raw = text ? JSON.parse(text) : null;
      } catch (e) {
        console.error('Failed to parse JSON response', e);
      }

      // If backend returns a structured ApiResponse
      if (raw && typeof raw === 'object') {
          // Check for PascalCase or camelCase success flag
          const success = (raw.Success ?? raw.success ?? response.ok) as boolean;
          const data = (raw.Data ?? raw.data ?? raw) as T;
          const message = (raw.Message ?? raw.message ?? '') as string;
          const error = (raw.Error ?? raw.error ?? '') as string;

          // If it looks like a wrapped response
          if ('Success' in raw || 'success' in raw) {
              return {
                  Success: success,
                  Data: data,
                  Message: message,
                  Error: error
              };
          }
      }

      // Fallback for direct data return or errors
      return {
        Success: response.ok,
        Data: raw as T,
        Message: response.ok ? '' : (raw?.message || response.statusText),
        Error: response.ok ? '' : (raw?.error || 'Request failed'),
      };

    } catch (error) {
      console.error('API Request Error:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro de conexão',
        Message: error instanceof Error ? error.message : 'Não foi possível conectar com o servidor',
      };
    }
  }
}
