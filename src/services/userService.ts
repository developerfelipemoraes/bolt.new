import { User, Company, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = 'https://localhost:61358/api/auth';
//const API_BASE_URL = 'https://auth-api-prod.thankfulground-3799b1b2.eastus.azurecontainerapps.io/api/auth';

const USERS_STORAGE_KEY = 'crm_users';
const COMPANIES_STORAGE_KEY = 'crm_companies';
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
    tenant: string;
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

export class UserService {
  private token: string | null = localStorage.getItem(AUTH_TOKEN_KEY);
  private currentCompanyId: string | null = null;

  constructor() {
    const savedCompany = localStorage.getItem(COMPANY_KEY);
    if (savedCompany) {
      try {
        const company = JSON.parse(savedCompany);
        this.currentCompanyId = company.id;
      } catch (error) {
        console.error('Error loading saved company:', error);
      }
    }
  }

  private initializeStorage() {
    // Kept for backward compatibility with other methods that rely on this
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(COMPANIES_STORAGE_KEY)) {
      localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify([]));
    }
  }

  private getUsers(): (User & { password: string })[] {
    this.initializeStorage();
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: (User & { password: string })[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  private getCompanies(): Company[] {
    this.initializeStorage();
    const companies = localStorage.getItem(COMPANIES_STORAGE_KEY);
    return companies ? JSON.parse(companies) : [];
  }

  private saveCompanies(companies: Company[]): void {
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));
  }

  // Authentication
  async authenticate(email: string, password: string): Promise<{ user: User; company: Company } | null> {
    try {
      const response = await this.login(email, password);

      if (response.Success && response.Data) {
        
        const { user: apiUser, company: apiCompany, access_token } = response.Data;

        // Map API Company to Internal Company
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

        // Map API User to Internal User
        // Note: Using the company ID from the returned company object
        const user: User = {
          id: apiUser.id.toString(),
          email: apiUser.email,
          name: apiUser.name,
          tenatyId: apiUser.tenant,
          companyId: company.name,
          role: apiUser.role as UserRole,
          permissions: [], // Permissions might need to be fetched or derived
          isActive: true,
          createdAt: new Date().toISOString(), // If not provided by API
          updatedAt: new Date().toISOString(), // If not provided by API
          lastLogin: new Date().toISOString()
        };

        // Persist session data
        this.token = access_token;
        this.currentCompanyId = company.name;

        localStorage.setItem(AUTH_TOKEN_KEY, access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.setItem(COMPANY_KEY, JSON.stringify(company));

        // Update mock storage for compatibility with other methods
        // This ensures that the logged-in user and company exist in the "database" for CRUD operations
        // that might still rely on these keys.
        const currentUsers = this.getUsers();
        console.log('Current Users before update:', currentUsers);
        const existingUserIndex = currentUsers.findIndex(u => u.id === user.id);
        if (existingUserIndex >= 0) {
            // Update existing
            currentUsers[existingUserIndex] = { ...currentUsers[existingUserIndex], ...user, password: '' }; // Don't save password here if we don't have it
        } else {
            // Add new
             currentUsers.push({ ...user, password: '' });
        }
        this.saveUsers(currentUsers);

        const currentCompanies = this.getCompanies();
        const existingCompanyIndex = currentCompanies.findIndex(c => c.id === company.id);
    
        if (existingCompanyIndex >= 0) {
            currentCompanies[existingCompanyIndex] = company;
        } else {
            currentCompanies.push(company);
        }
        this.saveCompanies(currentCompanies);

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

      console.log(`📡 Resposta recebida [${endpoint}]:`, response.status, response.statusText);

      const raw = await response.json();

      // Normaliza independente de camelCase/PascalCase e se já veio ou não com wrapper
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
    this.currentCompanyId = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COMPANY_KEY);
  }

  // User CRUD
  async getAllUsers(currentUser: User): Promise<User[]> {
    const users = this.getUsers();
    
    // Super admin vê todos os usuários
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return users.map(({ password, ...user }) => user as User);
    }
    
    // Company admin vê apenas usuários da própria empresa
    if (currentUser.role === UserRole.COMPANY_ADMIN) {
      return users
        .filter(u => u.companyId === currentUser.companyId)
        .map(({ password, ...user }) => user as User);
    }
    
    // Usuários comuns não veem lista de usuários
    return [];
  }

  async getUserById(id: string): Promise<User | null> {
    const users = this.getUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async createUser(userData: {
    email: string;
    name: string;
    companyId: string;
    role: UserRole;
    password: string;
  }, currentUser: User): Promise<User> {
    const users = this.getUsers();
    
    // Verificar se email já existe
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email já está em uso');
    }

    // Verificar permissões
    if (currentUser.role === UserRole.COMPANY_ADMIN && userData.companyId !== currentUser.companyId) {
      throw new Error('Você só pode criar usuários para sua empresa');
    }

    if (currentUser.role === UserRole.COMPANY_ADMIN && userData.role === UserRole.SUPER_ADMIN) {
      throw new Error('Você não pode criar super administradores');
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      companyId: userData.companyId,
      tenatyId: userData.companyId,
      role: userData.role,
      password: userData.password,

      permissions: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  async updateUser(id: string, updates: Partial<User>, currentUser: User): Promise<User> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const targetUser = users[userIndex];

    // Verificar permissões
    if (currentUser.role === UserRole.COMPANY_ADMIN) {
      if (targetUser.companyId !== currentUser.companyId) {
        throw new Error('Você só pode editar usuários da sua empresa');
      }
      if (targetUser.role === UserRole.SUPER_ADMIN) {
        throw new Error('Você não pode editar super administradores');
      }
    }

    // Não permitir que company admin se promova
    if (currentUser.role === UserRole.COMPANY_ADMIN && 
        targetUser.id === currentUser.id && 
        updates.role === UserRole.SUPER_ADMIN) {
      throw new Error('Você não pode se promover a super administrador');
    }

    const updatedUser = {
      ...targetUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    this.saveUsers(users);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  async deleteUser(id: string, currentUser: User): Promise<void> {
    const users = this.getUsers();
    const targetUser = users.find(u => u.id === id);
    
    if (!targetUser) {
      throw new Error('Usuário não encontrado');
    }

    // Não permitir auto-exclusão
    if (targetUser.id === currentUser.id) {
      throw new Error('Você não pode excluir sua própria conta');
    }

    // Verificar permissões
    if (currentUser.role === UserRole.COMPANY_ADMIN) {
      if (targetUser.companyId !== currentUser.companyId) {
        throw new Error('Você só pode excluir usuários da sua empresa');
      }
      if (targetUser.role === UserRole.SUPER_ADMIN) {
        throw new Error('Você não pode excluir super administradores');
      }
    }

    const updatedUsers = users.filter(u => u.id !== id);
    this.saveUsers(updatedUsers);
  }

  async toggleUserStatus(id: string, currentUser: User): Promise<User> {
    const users = this.getUsers();
    const targetUser = users.find(u => u.id === id);
    
    if (!targetUser) {
      throw new Error('Usuário não encontrado');
    }

    // Não permitir desativar própria conta
    if (targetUser.id === currentUser.id) {
      throw new Error('Você não pode desativar sua própria conta');
    }

    return this.updateUser(id, { isActive: !targetUser.isActive }, currentUser);
  }

  async changePassword(id: string, newPassword: string, currentUser: User): Promise<void> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const targetUser = users[userIndex];

    // Verificar permissões
    if (currentUser.id !== id && currentUser.role === UserRole.USER) {
      throw new Error('Você só pode alterar sua própria senha');
    }

    if (currentUser.role === UserRole.COMPANY_ADMIN && 
        targetUser.companyId !== currentUser.companyId) {
      throw new Error('Você só pode alterar senhas de usuários da sua empresa');
    }

    users[userIndex] = {
      ...targetUser,
      password: newPassword,
      updatedAt: new Date().toISOString()
    };

    this.saveUsers(users);
  }

  // Company methods
  async getAllCompanies(): Promise<Company[]> {
    return this.getCompanies();
  }

  async getCompanyById(id: string): Promise<Company | null> {
    const companies = this.getCompanies();
    return companies.find(c => c.id === id) || null;
  }

  async getUsersByCompany(companyId: string, currentUser: User): Promise<User[]> {
    const users = this.getUsers();
    
    // Verificar permissões
    if (currentUser.role === UserRole.COMPANY_ADMIN && currentUser.companyId !== companyId) {
      throw new Error('Você só pode ver usuários da sua empresa');
    }

    return users
      .filter(u => u.companyId === companyId)
      .map(({ password, ...user }) => user as User);
  }

  // Statistics
  async getUserStats(currentUser: User): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByRole: Record<UserRole, number>;
    usersByCompany: Record<string, number>;
  }> {
    const users = this.getUsers();
    const companies = this.getCompanies();
    
    let filteredUsers = users;
    
    // Filtrar por empresa se não for super admin
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      filteredUsers = users.filter(u => u.companyId === currentUser.companyId);
    }

    const stats = {
      totalUsers: filteredUsers.length,
      activeUsers: filteredUsers.filter(u => u.isActive).length,
      usersByRole: {
        [UserRole.SUPER_ADMIN]: filteredUsers.filter(u => u.role === UserRole.SUPER_ADMIN).length,
        [UserRole.COMPANY_ADMIN]: filteredUsers.filter(u => u.role === UserRole.COMPANY_ADMIN).length,
        [UserRole.USER]: filteredUsers.filter(u => u.role === UserRole.USER).length
      },
      usersByCompany: {}
    };

    // Contar usuários por empresa
    companies.forEach(company => {
      const companyUsers = filteredUsers.filter(u => u.companyId === company.id);
      if (companyUsers.length > 0) {
        stats.usersByCompany[company.name] = companyUsers.length;
      }
    });

    return stats;
  }

  // Audit log (simplified)
  async logUserAction(userId: string, action: string, details: any): Promise<void> {
    const logs = JSON.parse(localStorage.getItem('user_audit_logs') || '[]');
    
    const logEntry = {
      id: Date.now().toString(),
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip: 'localhost', // Mock IP
      userAgent: navigator.userAgent
    };

    logs.push(logEntry);
    
    // Manter apenas os últimos 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }

    localStorage.setItem('user_audit_logs', JSON.stringify(logs));
  }

  async getAuditLogs(currentUser: User): Promise<any[]> {
    if (currentUser.role === UserRole.USER) {
      return []; // Usuários comuns não veem logs
    }

    const logs = JSON.parse(localStorage.getItem('user_audit_logs') || '[]');
    
    // Company admin vê apenas logs da própria empresa
    if (currentUser.role === UserRole.COMPANY_ADMIN) {
      const companyUserIds = this.getUsers()
        .filter(u => u.companyId === currentUser.companyId)
        .map(u => u.id);
      
      return logs.filter((log: any) => companyUserIds.includes(log.userId));
    }

    return logs;
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
