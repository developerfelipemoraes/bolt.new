import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Company, AuthContextType, UserRole, PermissionAction, ROLE_PERMISSIONS } from '@/types/auth';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se há sessão ativa
    const savedUser = localStorage.getItem('user');
    const savedCompany = localStorage.getItem('company');
    const savedSessionId = localStorage.getItem('sessionId');
    
    if (savedUser && savedCompany && savedSessionId) {
      try {
        const userData = JSON.parse(savedUser);
        const companyData = JSON.parse(savedCompany);
        setUser(userData);
        setCompany(companyData);
        setSessionId(savedSessionId);
        
        // Validar sessão
        userService.validateSession(savedSessionId).then(result => {
          if (!result) {
            // Sessão inválida, fazer logout
            logout();
            toast.error('Sessão expirada. Faça login novamente.');
          }
        });
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
      }
    }
  }, []);

  const login = async (userData: User, companyData: Company) => {
    // Criar sessão
    const newSessionId = await userService.createSession(userData, companyData);
    
    setUser(userData);
    setCompany(companyData);
    setSessionId(newSessionId);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('company', JSON.stringify(companyData));
    localStorage.setItem('sessionId', newSessionId);

    // Log da ação de login
    await userService.logUserAction(userData.id, 'user_login', {
      companyId: companyData.id,
      sessionId: newSessionId
    });
  };

  const logout = async () => {
    if (sessionId) {
      await userService.invalidateSession(sessionId);
    }
    
    setUser(null);
    setCompany(null);
    setSessionId(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    localStorage.removeItem('sessionId');
  };

  const hasPermission = (resource: string, action: PermissionAction): boolean => {
    if (!user) return false;
    
    // Super admin tem todas as permissões
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    
    // Verificar permissões específicas do role
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    
    return rolePermissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
    );
  };

  const canAccessCompany = (companyId: string): boolean => {
    if (!user || !company) return false;
    
    // Super admin pode acessar qualquer empresa
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    
    // Outros usuários só podem acessar sua própria empresa
    return user.companyId === companyId;
  };

  const canManageUser = (targetUserId: string): boolean => {
    if (!user) return false;
    
    // Super admin pode gerenciar qualquer usuário
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    
    // Company admin pode gerenciar usuários da sua empresa
    if (user.role === UserRole.COMPANY_ADMIN) {
      // Aqui verificaríamos se o target user é da mesma empresa
      return true; // Simplificado para MVP
    }
    
    return false;
  };

  const switchCompany = async (companyId: string): Promise<void> => {
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      throw new Error('Apenas super admin pode trocar de empresa');
    }
    
    const targetCompany = await userService.getCompanyById(companyId);
    if (targetCompany) {
      setCompany(targetCompany);
      localStorage.setItem('company', JSON.stringify(targetCompany));
      
      // Log da troca de empresa
      await userService.logUserAction(user.id, 'company_switched', {
        fromCompanyId: company?.id,
        toCompanyId: companyId,
        toCompanyName: targetCompany.name
      });
      
      toast.success(`Empresa alterada para: ${targetCompany.name}`);
    }
  };

  // Computed properties
  const isAurovel = company?.type === 'master';
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isCompanyAdmin = user?.role === UserRole.COMPANY_ADMIN;

  const value: AuthContextType = {
    user,
    company,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    canAccessCompany,
    canManageUser,
    isAurovel,
    isSuperAdmin,
    isCompanyAdmin,
    switchCompany
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;