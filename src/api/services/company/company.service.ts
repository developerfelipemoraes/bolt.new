import { ApiFactory, handleRequest, ApiResponse } from '@/api/factory/apiFactory';
import { API_CONFIG } from '@/api/config/api.config';
import { CompanyData, PagedCompanies } from './company.types';

const api = ApiFactory.getInstance(API_CONFIG.company.baseURL);

export const CompanyService = {
  getCompanies: async (): Promise<ApiResponse<PagedCompanies | CompanyData[]>> => {
    return handleRequest(api.get<PagedCompanies | CompanyData[]>('/companies'));
  },

  createCompany: async (company: Partial<CompanyData>): Promise<ApiResponse<CompanyData>> => {
    return handleRequest(api.post<CompanyData>('/companies', company));
  },

  updateCompany: async (id: string, company: Partial<CompanyData>): Promise<ApiResponse<CompanyData>> => {
    return handleRequest(api.put<CompanyData>(`/companies/${id}`, company));
  },

  deleteCompany: async (id: string): Promise<ApiResponse<void>> => {
    return handleRequest(api.delete(`/companies/${id}`));
  },

  getCompanyUsers: async (): Promise<ApiResponse<any[]>> => {
    return handleRequest(api.get<any[]>('/users'));
  },

  inviteUser: async (userData: { email: string; name: string; role: string }): Promise<ApiResponse<any>> => {
    return handleRequest(api.post<any>('/users/invite', userData));
  },

  updateUserRole: async (userId: string, role: string): Promise<ApiResponse<any>> => {
    return handleRequest(api.put<any>(`/users/${userId}/role`, { role }));
  },

  getBestMatches: async (): Promise<ApiResponse<any[]>> => {
    return handleRequest(api.get<any[]>('/matching/best-matches'));
  }
};
