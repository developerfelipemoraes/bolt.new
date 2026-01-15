export interface Company {
  id: string;
  name: string;
  type: 'master' | 'client';
  logo: string;
  description: string;
  settings: CompanySettings;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  maxUsers: number;
  allowedModules: string[];
  customBranding: boolean;
  dataRetentionDays: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  companyId: string;
  tenatyId: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  COMPANY_ADMIN = 'company_admin', 
  USER = 'user'
}

export interface Permission {
  resource: 'contacts' | 'companies' | 'vehicles' | 'sales' | 'reports' | 'users';
  actions: PermissionAction[];
  scope: 'own' | 'company' | 'all';
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export interface AuthContextType {
  user: User | null;
  company: Company | null;
  login: (userData: User, companyData: Company) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (resource: string, action: PermissionAction) => boolean;
  canAccessCompany: (companyId: string) => boolean;
  canManageUser: (targetUserId: string) => boolean;
  isAurovel: boolean;
  isSuperAdmin: boolean;
  isCompanyAdmin: boolean;
  switchCompany: (companyId: string) => Promise<void>;
}

// Role-based permissions matrix
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    {
      resource: 'contacts',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'all'
    },
    {
      resource: 'companies', 
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'all'
    },
    {
      resource: 'vehicles',
      actions: ['create', 'read', 'update', 'delete'], 
      scope: 'all'
    },
    {
      resource: 'sales',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'all'
    },
    {
      resource: 'reports',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'all'
    },
    {
      resource: 'users',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'all'
    }
  ],
  [UserRole.COMPANY_ADMIN]: [
    {
      resource: 'contacts',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'company'
    },
    {
      resource: 'companies',
      actions: ['read', 'update'],
      scope: 'company'
    },
    {
      resource: 'vehicles',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'company'
    },
    {
      resource: 'sales',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'company'
    },
    {
      resource: 'reports',
      actions: ['read'],
      scope: 'company'
    },
    {
      resource: 'users',
      actions: ['create', 'read', 'update'],
      scope: 'company'
    }
  ],
  [UserRole.USER]: [
    {
      resource: 'contacts',
      actions: ['create', 'read', 'update'],
      scope: 'own'
    },
    {
      resource: 'companies',
      actions: ['read'],
      scope: 'company'
    },
    {
      resource: 'vehicles',
      actions: ['create', 'read', 'update'],
      scope: 'own'
    },
    {
      resource: 'sales',
      actions: ['read'],
      scope: 'company'
    },
    {
      resource: 'reports',
      actions: ['read'],
      scope: 'company'
    }
  ]
};