import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Keys for localStorage
const AUTH_TOKEN_KEY = 'auth_token';
const COMPANY_KEY = 'company';
const USER_KEY = 'user';

// Standard API Response interface (matches your existing BaseService assumptions)
export interface ApiResponse<T> {
  Success: boolean;
  Data: T;
  Message: string;
  Error: string;
}

export class ApiFactory {
  private static instances: Map<string, AxiosInstance> = new Map();

  /**
   * Creates or retrieves a singleton Axios instance for a specific base URL.
   * @param baseURL The base URL for the API domain.
   * @returns Configured AxiosInstance.
   */
  public static getInstance(baseURL: string): AxiosInstance {
    if (!this.instances.has(baseURL)) {
      const instance = axios.create({
        baseURL,
        timeout: 30000, // 30 seconds timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.setupInterceptors(instance);
      this.instances.set(baseURL, instance);
    }

    return this.instances.get(baseURL)!;
  }

  private static setupInterceptors(instance: AxiosInstance): void {
    // Request Interceptor: Inject Token and Company Context
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Inject Company Context header if available
        try {
          const savedCompany = localStorage.getItem(COMPANY_KEY);
          if (savedCompany) {
            const company = JSON.parse(savedCompany);
            const companyId = company.id || company._id;
            if (companyId) {
              config.headers['X-Company-ID'] = companyId;
            }
          }
        } catch (error) {
          console.warn('Failed to parse company context:', error);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Global Error Handling and Response Unwrapping
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Option 1: Return the raw axios response (standard)
        // Option 2: Unwrap the data if it follows the ApiResponse structure (custom convenience)
        // Here we keep it standard but check for business logic errors if possible.
        // However, axios throws on 4xx/5xx by default unless validateStatus is changed.

        // If the backend returns 200 OK but Success: false in the body (common in legacy .NET/Java apps)
        if (response.data && typeof response.data === 'object' && 'Success' in response.data) {
             // We can handle this here or let the service handle it.
             // For uniformity, let's pass it through and let the service helper handle typing.
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response) {
          // Handle 401 Unauthorized
          if (error.response.status === 401 && !originalRequest._retry) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(COMPANY_KEY);
            localStorage.removeItem(USER_KEY);

            toast.error('Sessão expirada. Por favor, faça login novamente.');

            window.location.href = '/login';
            return Promise.reject(error);
          }

          // Handle 403 Forbidden
          if (error.response.status === 403) {
            toast.error('Acesso negado.');
          }

          // Handle 500 Server Error
          if (error.response.status >= 500) {
            toast.error('Erro interno no servidor. Tente novamente mais tarde.');
          }
        } else if (error.request) {
          // Network Error
          toast.error('Erro de conexão com a API.');
        } else {
          // Other errors
          console.error('API Error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }
}

/**
 * Helper to unwrap standard ApiResponse structure
 */
export async function handleRequest<T>(request: Promise<AxiosResponse<ApiResponse<T> | T>>): Promise<ApiResponse<T>> {
    try {
        const response = await request;
        const data = response.data as any; // Cast to check properties

        // Normalize response if it matches ApiResponse structure
        if (data && typeof data === 'object') {
             const success = data.Success ?? data.success ?? true; // Default true if not wrapped (assuming 2xx)
             // If wrapped
             if ('Success' in data || 'success' in data) {
                 return {
                     Success: success,
                     Data: data.Data ?? data.data ?? data,
                     Message: data.Message ?? data.message ?? '',
                     Error: data.Error ?? data.error ?? ''
                 } as ApiResponse<T>;
             }
        }

        // If not wrapped, wrap it
        return {
            Success: true,
            Data: data as T,
            Message: 'Success',
            Error: ''
        };

    } catch (error: any) {
        // Normalize axios error to ApiResponse
        const message = error.response?.data?.Message || error.message || 'Request failed';
        return {
            Success: false,
            Data: null as unknown as T,
            Message: message,
            Error: message
        };
    }
}
