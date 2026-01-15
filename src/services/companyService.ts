import { ApiResponse } from '@/types/api';
import { CompanyData } from '@/types/company';
import { BaseService } from './baseService';

type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

class CompanyService extends BaseService {
  protected baseUrl = import.meta.env.VITE_API_CONTACT_URL || 'http://localhost:8081/api';

  // Company methods
  async getCompanies(): Promise<CompanyData[]> {
    const response = await this.request<Paged<CompanyData> | CompanyData[]>('/companies');

    if (!response.Success) {
        console.error('Failed to fetch companies:', response.Error);
        return [];
    }

    const data = response.Data;
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
