import { User, Company, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { apiService } from '@/services/companyService';

const API_BASE_URL = 'https://auth.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api/auth';
//const API_BASE_URL = 'https://localhost:61358/api/auth';
// Mock data storage keys
const USERS_STORAGE_KEY = 'crm_users';
const COMPANIES_STORAGE_KEY = 'crm_companies';

type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  expiresIn: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}


// Initial mock data
const INITIAL_COMPANIES: Company[] = [
  {
    id: 'aurovel',
    name: 'Aurovel',
    type: 'master',
    logo: '👑',
    description: 'Controle Total do Sistema',
    settings: {
      maxUsers: 1000,
      allowedModules: ['all'],
      customBranding: true,
      dataRetentionDays: 365
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'tech-solutions',
    name: 'Tech Solutions Ltda',
    type: 'client',
    logo: '🏢',
    description: 'Empresa Cliente - Tecnologia',
    settings: {
      maxUsers: 50,
      allowedModules: ['contacts', 'companies', 'vehicles'],
      customBranding: false,
      dataRetentionDays: 90
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'inovacao-digital',
    name: 'Inovação Digital S.A.',
    type: 'client',
    logo: '💡',
    description: 'Empresa Cliente - Inovação',
    settings: {
      maxUsers: 25,
      allowedModules: ['contacts', 'companies'],
      customBranding: false,
      dataRetentionDays: 60
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const INITIAL_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@aurovel.com',
    password: 'admin123',
    name: 'Administrador Aurovel',
    companyId: 'aurovel',
    tenatyId: 'Aurovel',
    role: UserRole.SUPER_ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-15T10:30:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    email: 'manager@aurovel.com',
    password: 'manager123',
    name: 'Gerente Aurovel',
    companyId: 'aurovel',
    tenatyId: 'Aurovel',
    role: UserRole.SUPER_ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-14T16:20:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    email: 'admin@techsolutions.com',
    password: 'tech123',
    name: 'Admin Tech Solutions',
    companyId: 'tech-solutions',
    tenatyId: 'Tech-solutions',
    role: UserRole.COMPANY_ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-14T15:20:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-14'
  },
  {
    id: '4',
    email: 'user@techsolutions.com',
    password: 'user123',
    name: 'Usuário Tech Solutions',
    companyId: 'tech-solutions',
    tenatyId: 'Tech-solutions',
    role: UserRole.USER,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-13T09:15:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-13'
  },
  {
    id: '5',
    email: 'admin@inovacaodigital.com',
    password: 'inov123',
    name: 'Admin Inovação Digital',
    companyId: 'inovacao-digital',
    tenatyId: 'Inovacao-solutions',
    role: UserRole.COMPANY_ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-12T14:10:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12'
  },
  {
    id: '6',
    email: 'vendas@techsolutions.com',
    password: 'vendas123',
    name: 'Equipe de Vendas',
    companyId: 'tech-solutions',
    tenatyId: 'Tech-solutions',
    role: UserRole.USER,
    permissions: [],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '7',
    email: 'viewer@inovacaodigital.com',
    password: 'viewer123',
    name: 'Visualizador Inovação',
    companyId: 'inovacao-digital',
    tenatyId: 'Inovacao-solutions',
    role: UserRole.USER,
    permissions: [],
    isActive: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export class UserService {
  private token: string | null = null;
  private currentCompanyId: string | null = null;

  private initializeStorage() {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(COMPANIES_STORAGE_KEY)) {
      localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(INITIAL_COMPANIES));
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
    const users = this.getUsers();
    const companies = this.getCompanies();
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user || !user.isActive) {
      return null;
    }

    const loginResponse = await this.login(email, password);

    console.log('Login Response:', loginResponse);

    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies));

    const company = companies.find(c => c.id === user.companyId);
    
    if (!company || !company.isActive) {
      return null;
    }

    // Update last login
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, lastLogin: new Date().toISOString() }
        : u
    );
    this.saveUsers(updatedUsers);

    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword as User,
      company
    };
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    
    const response = await this.request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data) {
      this.token = response.data.access_token;
      
      // Atualizar empresa atual baseada no usuário
      const savedCompany = localStorage.getItem('company');

      if (savedCompany) {
        try {
          const company = JSON.parse(savedCompany);
          this.currentCompanyId = company.id;
        } catch (error) {
          console.error('Erro ao carregar empresa:', error);
        }
      }
      
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    
    try 
    {
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json' // Garanta que o tipo de mídia está correto
        },
      });
      
      console.log(`📡 Resposta recebida:`, response.status, response.statusText);

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Erro na requisição',
          message: data.message || data.details?.join(', '),
        };
      }

      console.log(data);

      return { data };
    } 
    catch (error) 
    {
      console.error('API Error:', error);
      return {
        error: 'Erro de conexão',
        message: 'Não foi possível conectar com o servidor',
      };
    }
  }

  logout(): void {
    this.token = null;
    this.currentCompanyId = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
  }


  // Company authentication (for Aurovel)
  async authenticateByCompany(companyName: string, password: string): Promise<{ user: User; company: Company } | null> {
    if (companyName === 'aurovel' && password === 'aurovel2024') {
      const users = this.getUsers();
      const companies = this.getCompanies();
      
      const aurovelAdmin = users.find(u => u.companyId === 'aurovel' && u.role === UserRole.SUPER_ADMIN);
      const aurovelCompany = companies.find(c => c.id === 'aurovel');
      
      if (aurovelAdmin && aurovelCompany) {
        // Update last login
        const updatedUsers = users.map(u => 
          u.id === aurovelAdmin.id 
            ? { ...u, lastLogin: new Date().toISOString() }
            : u
        );
        this.saveUsers(updatedUsers);

        const { password: _, ...userWithoutPassword } = aurovelAdmin;
        return {
          user: userWithoutPassword as User,
          company: aurovelCompany
        };
      }
    }
    
    return null;
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

  // Session management
  async createSession(user: User, company: Company): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      userId: user.id,
      companyId: company.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 horas
      isActive: true
    };

    const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
    sessions.push(session);
    localStorage.setItem('user_sessions', JSON.stringify(sessions));

    return sessionId;
  }

  async validateSession(sessionId: string): Promise<{ user: User; company: Company } | null> {
    const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
    const session = sessions.find((s: any) => s.id === sessionId && s.isActive);
    
    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }

    const user = await this.getUserById(session.userId);
    const company = await this.getCompanyById(session.companyId);
    
    if (!user || !company) {
      return null;
    }

    return { user, company };
  }

  async invalidateSession(sessionId: string): Promise<void> {
    const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
    const updatedSessions = sessions.map((s: any) => 
      s.id === sessionId ? { ...s, isActive: false } : s
    );
    localStorage.setItem('user_sessions', JSON.stringify(updatedSessions));
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
    const updatedSessions = sessions.map((s: any) => 
      s.userId === userId ? { ...s, isActive: false } : s
    );
    localStorage.setItem('user_sessions', JSON.stringify(updatedSessions));
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