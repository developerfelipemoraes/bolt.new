import { ApiResponse } from '@/types/api';
import { CompanyData } from '@/types/company';
import { ContactData } from '@/types/contact';

// Unify API Base URL with UserService
const API_BASE_URL = 'http://localhost:8081/api';

type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

class CompanyService {

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    const companyStr = localStorage.getItem('company');
    let companyId = '';

    if (companyStr) {
      try {
        const company = JSON.parse(companyStr);
        // Handle both new API (id) and old/potential formats
        companyId = company.id || company._id || '';
      } catch (e) {
        console.error('Error parsing company from storage', e);
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      // 'API-Version': 'v1', // Remove if not needed by new backend
      'X-Company-ID': companyId,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      console.log(`🔗 Fazendo requisição para: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        mode: 'cors',
        // credentials: 'include', // Only if needed for cookies
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      console.log(`📡 Resposta recebida [${endpoint}]:`, response.status);

      if (response.status === 401) {
         // Handle unauthorized - maybe trigger logout via event or window reload
         // For now just return error
      }

      const raw = await response.json();

      // Normalize response
      if (raw && typeof raw === 'object') {
         // Check if it matches ApiResponse structure
         if ('Success' in raw) {
             return raw as ApiResponse<T>;
         }
         // If direct data is returned (e.g. array or object)
         return {
             Success: response.ok,
             Data: raw as T,
             Message: '',
             Error: response.ok ? '' : 'Unknown error'
         };
      }

      return {
        Success: false,
        Data: null as any,
        Error: 'Invalid response format',
        Message: ''
      };

    } catch (error) {
      console.error('API Error:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro de conexão',
        Message: 'Não foi possível conectar com o servidor',
      };
    }
  }

  // Company methods
  async getCompanies(): Promise<CompanyData[]> {
    // Assuming new API endpoint structure matches
    const response = await this.request<Paged<CompanyData> | CompanyData[]>('/companies');

    if (!response.Success) {
        console.error('Failed to fetch companies:', response.Error);
        return [];
    }

    const data = response.Data;

    // Handle Paged or Array response
    if (Array.isArray(data)) {
        return data;
    } else if (data && 'items' in data && Array.isArray(data.items)) {
        return data.items;
    }

    return [];
  }

  async createCompany(company: unknown): Promise<unknown> {
    const response = await this.request<unknown>('/companies', {
      method: 'POST',
      body: JSON.stringify(company),
    });
    return response.Data;
  }

  async updateCompany(id: string, company: unknown): Promise<unknown> {
    const response = await this.request<unknown>(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(company),
    });
    return response.Data;
  }

  async deleteCompany(id: string): Promise<ApiResponse<void>> {
    return this.request(`/companies/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact methods
  async getContacts(): Promise<ContactData[]> {
    const response = await this.request<Paged<ContactData> | ContactData[]>('/contacts');

    if (!response.Success) return [];

    const data = response.Data;
    if (Array.isArray(data)) {
        return data;
    } else if (data && 'items' in data && Array.isArray(data.items)) {
        return data.items;
    }
    return [];
  }

  async createContact(contact: any): Promise<ContactData> {
    const response = await this.request<ContactData>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
    return response.Data;
  }

  async updateContact(id: string, contact: ContactData): Promise<ContactData> {
    const response = await this.request<ContactData>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contact),
    });
    return response.Data;
  }

  async deleteContact(id: string): Promise<ApiResponse<void>> {
    return this.request(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Matching methods
  async getBestMatches(): Promise<ApiResponse<unknown[]>> {
    return this.request('/matching/best-matches');
  }

  // User management methods
  async getCompanyUsers(): Promise<unknown[]> {
    const response = await this.request<unknown[]>('/users');
    return response.Data || [];
  }

  async inviteUser(userData: { email: string; name: string; role: string }): Promise<unknown> {
    const response = await this.request<unknown>('/users/invite', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.Data;
  }

  async updateUserRole(userId: string, role: string): Promise<unknown> {
    const response = await this.request<unknown>(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    return response.Data;
  }
}

export const apiService = new CompanyService();
export default apiService;
