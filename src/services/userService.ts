import { User, Company, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = 'http://localhost:8081/api/auth';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const COMPANY_KEY = 'company';

// Internal types to match the C# backend response structure
interface BackendCompany {
  Id: string;
  Name: string;
  Type: string;
  Logo?: string;
  Description?: string;
  Settings: {
    maxUsers: number;
    allowedModules: string[];
    customBranding: boolean;
    dataRetentionDays: number;
  };
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

interface BackendUser {
  Id: string;
  Email: string;
  Tenant: string;
  Permissions: string[];
  Active: boolean;
}

interface LoginResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
  tenant: string;
  roles: string;
  company: BackendCompany;
  user: BackendUser;
}

export class UserService {
  private token: string | null = localStorage.getItem(AUTH_TOKEN_KEY);

  // Authentication
  async authenticate(email: string, password: string): Promise<{ user: User; company: Company } | null> {
    try {
      const response = await this.login(email, password);

      if (response.Success && response.Data) {
        const data = response.Data;
        const { access_token, user: apiUser, company: apiCompany, roles } = data;

        // Map Backend Company to Frontend Company
        // Handling potential casing differences if backend serializes differently
        const company: Company = {
          id: apiCompany.Id || (apiCompany as any).id || (apiCompany as any)._id,
          name: apiCompany.Name || (apiCompany as any).name,
          type: (apiCompany.Type || (apiCompany as any).type) as 'master' | 'client',
          logo: apiCompany.Logo || (apiCompany as any).logo || '',
          description: apiCompany.Description || (apiCompany as any).description || '',
          settings: apiCompany.Settings || (apiCompany as any).settings,
          isActive: apiCompany.IsActive ?? (apiCompany as any).isActive,
          createdAt: apiCompany.CreatedAt || (apiCompany as any).createdAt,
          updatedAt: apiCompany.UpdatedAt || (apiCompany as any).updatedAt
        };

        // Map Backend User to Frontend User
        const user: User = {
          id: apiUser.Id || (apiUser as any).id,
          email: apiUser.Email || (apiUser as any).email,
          name: (apiUser as any).Name || (apiUser as any).name || apiUser.Email || 'Usuário', // Fallback as Name is missing in anonymous object
          tenatyId: apiUser.Tenant || (apiUser as any).tenant,
          companyId: company.id,
          role: (roles || (apiUser as any).Role || (apiUser as any).role) as UserRole,
          permissions: [], // TODO: Parse apiUser.Permissions (string[]) to Permission[] if needed
          isActive: apiUser.Active ?? (apiUser as any).active,
          createdAt: new Date().toISOString(), // Not in anonymous object
          updatedAt: new Date().toISOString(), // Not in anonymous object
          lastLogin: new Date().toISOString()
        };

        // Persist session data
        this.token = access_token;

        localStorage.setItem(AUTH_TOKEN_KEY, access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.setItem(COMPANY_KEY, JSON.stringify(company));

        return { user, company };
      }

      if (!response.Success) {
        toast.error(response.Message || 'Falha na autenticação');
      }

      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Erro ao realizar login');
      return null;
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
    return this.request<LoginResponseData>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
        },
      });

      const raw = await response.json();

      // Normalize response structure
      const success = (raw?.Success ?? raw?.success ?? response.ok) as boolean;
      const data = (raw?.Data ?? raw?.data ?? raw) as T;
      const message = (raw?.Message ?? raw?.message ?? '') as string;
      const error = (raw?.Error ?? raw?.error ?? '') as string;

      return {
        Success: success,
        Data: data,
        Message: message,
        Error: error,
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

  logout(): void {
    this.token = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COMPANY_KEY);
  }

  // Placeholder methods for CRUD - these would need real API endpoints
  // For now, they return empty or mock data to prevent app crashes, but strictly avoid local storage sync

  async getAllUsers(currentUser: User): Promise<User[]> {
    // TODO: Implement GET /users API
    return [];
  }

  async getUserById(id: string): Promise<User | null> {
    // TODO: Implement GET /users/:id API
    // For currently logged in user, we can return the session user
    const sessionUser = localStorage.getItem(USER_KEY);
    if (sessionUser) {
        const user = JSON.parse(sessionUser) as User;
        if (user.id === id) return user;
    }
    return null;
  }

  async createUser(userData: any, currentUser: User): Promise<User> {
     throw new Error('Not implemented via API yet');
  }

  async updateUser(id: string, updates: Partial<User>, currentUser: User): Promise<User> {
    throw new Error('Not implemented via API yet');
  }

  async deleteUser(id: string, currentUser: User): Promise<void> {
    throw new Error('Not implemented via API yet');
  }

  async toggleUserStatus(id: string, currentUser: User): Promise<User> {
    throw new Error('Not implemented via API yet');
  }

  async changePassword(id: string, newPassword: string, currentUser: User): Promise<void> {
    throw new Error('Not implemented via API yet');
  }

  async getAllCompanies(): Promise<Company[]> {
     // TODO: Implement GET /companies API
    return [];
  }

  async getCompanyById(id: string): Promise<Company | null> {
    // For current company, return session company
    const sessionCompany = localStorage.getItem(COMPANY_KEY);
    if (sessionCompany) {
        const company = JSON.parse(sessionCompany) as Company;
        if (company.id === id) return company;
    }
    return null;
  }

  async getUsersByCompany(companyId: string, currentUser: User): Promise<User[]> {
    return [];
  }

  async getUserStats(currentUser: User): Promise<any> {
    return {
        totalUsers: 0,
        activeUsers: 0,
        usersByRole: {},
        usersByCompany: {}
    };
  }

  async logUserAction(userId: string, action: string, details: any): Promise<void> {
    // TODO: Send audit log to API
    console.log('Audit Log:', { userId, action, details });
  }

  async getAuditLogs(currentUser: User): Promise<any[]> {
    return [];
  }

  // Utility methods
  generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (password.length < 6) errors.push('Senha deve ter pelo menos 6 caracteres');
    return { isValid: errors.length === 0, errors };
  }
}

export const userService = new UserService();
