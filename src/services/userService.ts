import { User, Company, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';
import { BaseService } from './baseService';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const COMPANY_KEY = 'company';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    tenaty: string;
  };
  company: {
    _id: string;
    name: string;
    type: string;
    logo: string;
    description: string;
    settings: {
      maxUsers: number;
      allowedModules: string[];
      customBranding: boolean;
      dataRetentionDays: number;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  expiresIn: string;
}

export class UserService extends BaseService {
  protected baseUrl = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:8081/api/auth';

  // Authentication
  async authenticate(email: string, password: string): Promise<{ user: User; company: Company } | null> {
    try {
      const response = await this.login(email, password);

      if (response.Success && response.Data) {
        const { user: apiUser, company: apiCompany, access_token } = response.Data;

        const company: Company = {
          id: apiCompany._id,
          name: apiCompany.name,
          type: apiCompany.type as 'master' | 'client',
          logo: apiCompany.logo,
          description: apiCompany.description,
          settings: apiCompany.settings,
          isActive: apiCompany.isActive,
          createdAt: apiCompany.createdAt,
          updatedAt: apiCompany.updatedAt
        };

        const user: User = {
          id: apiUser.id.toString(),
          email: apiUser.email,
          name: apiUser.name,
          tenatyId: apiUser.tenaty,
          companyId: company.id,
          role: apiUser.role as UserRole,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

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

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COMPANY_KEY);
  }

  // User CRUD - Real API Implementation
  async getAllUsers(currentUser: User): Promise<User[]> {
    const response = await this.request<User[]>('/users');
    if (response.Success && Array.isArray(response.Data)) {
         return response.Data;
    }
    return [];
  }

  async getUserById(id: string): Promise<User | null> {
    const response = await this.request<User>(`/users/${id}`);
    if (response.Success && response.Data) {
        return response.Data;
    }
    return null;
  }

  async createUser(userData: {
    email: string;
    name: string;
    companyId: string;
    role: UserRole;
    password: string;
  }, currentUser: User): Promise<User> {
     const response = await this.request<User>('/users', {
         method: 'POST',
         body: JSON.stringify(userData)
     });

     if (!response.Success) {
         throw new Error(response.Message || 'Failed to create user');
     }
     return response.Data;
  }

  async updateUser(id: string, updates: Partial<User>, currentUser: User): Promise<User> {
     const response = await this.request<User>(`/users/${id}`, {
         method: 'PUT',
         body: JSON.stringify(updates)
     });

     if (!response.Success) {
        throw new Error(response.Message || 'Failed to update user');
     }
     return response.Data;
  }

  async deleteUser(id: string, currentUser: User): Promise<void> {
    const response = await this.request<void>(`/users/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.Success) {
        throw new Error(response.Message || 'Failed to delete user');
    }
  }

  async toggleUserStatus(id: string, currentUser: User): Promise<User> {
     const user = await this.getUserById(id);
     if (!user) throw new Error("User not found");

     return this.updateUser(id, { isActive: !user.isActive }, currentUser);
  }

  async changePassword(id: string, newPassword: string, currentUser: User): Promise<void> {
    const response = await this.request<void>(`/users/${id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ password: newPassword })
    });
     if (!response.Success) {
        throw new Error(response.Message || 'Failed to change password');
    }
  }

  // Company methods
  async getAllCompanies(): Promise<Company[]> {
    // This is problematic. UserService (Auth) shouldn't be fetching companies if we have a CompanyService.
    // Ideally, we'd use CompanyService for this.
    // However, if the Auth API provides /companies, we can keep it.
    // Given the user provided a separate Company API URL, it's safer to assume Auth API handles Login/Users
    // and Company API handles Companies.
    // But UserService currently has this method.
    // If we remove it, we break usage in UserCRUD.
    // I will try to point this to the AUTH API's /companies endpoint if it exists, or...
    // A better approach is to change the consumer to use companyService.

    // For now, I will keep it pointing to BaseUrl (Auth).
    // If the Auth service also serves companies (common in some architectures), this works.
    // But since there is a dedicated Company API, it's likely wrong here.
    // I will update the consumer (UserCRUD) later in this plan.
    const response = await this.request<Company[]>('/companies');
    return response.Success && Array.isArray(response.Data) ? response.Data : [];
  }

  async getCompanyById(id: string): Promise<Company | null> {
     const response = await this.request<Company>(`/companies/${id}`);
     return (response.Success && response.Data) ? response.Data : null;
  }

  async getUsersByCompany(companyId: string, currentUser: User): Promise<User[]> {
     const response = await this.request<User[]>(`/companies/${companyId}/users`);
     return response.Success && Array.isArray(response.Data) ? response.Data : [];
  }

  // Statistics
  async getUserStats(currentUser: User): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: Record<UserRole, number>;
    usersByCompany: Record<string, number>;
  }> {
     const response = await this.request<any>('/stats/users');
     if (response.Success) return response.Data;

    return {
      totalUsers: 0,
      activeUsers: 0,
      usersByRole: {
        [UserRole.SUPER_ADMIN]: 0,
        [UserRole.COMPANY_ADMIN]: 0,
        [UserRole.USER]: 0
      },
      usersByCompany: {}
    };
  }

  // Audit log
  async logUserAction(userId: string, action: string, details: any): Promise<void> {
      await this.request('/audit-logs', {
          method: 'POST',
          body: JSON.stringify({ userId, action, details })
      });
  }

  async getAuditLogs(currentUser: User): Promise<any[]> {
    const response = await this.request<any[]>('/audit-logs');
    return response.Success && Array.isArray(response.Data) ? response.Data : [];
  }

  // Utility methods
  generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const userService = new UserService();
