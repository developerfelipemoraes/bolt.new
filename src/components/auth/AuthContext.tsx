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

  useEffect(() => {
    const validateSession = async () => {
      // Verificar se há dados salvos no localStorage (compatível com userService)
      const savedUser = localStorage.getItem('user');
      const savedCompany = localStorage.getItem('company');
      const authToken = localStorage.getItem('auth_token');

      if (savedUser && savedCompany && authToken) {
        try {
          const userData = JSON.parse(savedUser);
          const companyData = JSON.parse(savedCompany);

          // Otimisticamente define os dados do usuário para renderizar a interface
          setUser(userData);
          setCompany(companyData);

          // Valida o token com o backend
          // Se o token for inválido (401), o BaseService irá redirecionar para login
          if (userData?.id) {
            try {
              const validatedUser = await userService.getUserById(userData.id);

              if (validatedUser) {
                setUser(validatedUser);
              } else {
                console.warn('Sessão inválida: Usuário não encontrado ou erro na validação');
                logout();
              }
            } catch (validationError) {
              console.error('Erro na validação do token:', validationError);
              logout();
            }
          }
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          logout();
        }
      }
    };

    validateSession();
  }, []);

  const login = async (userData: User, companyData: Company) => {
    // O estado e localStorage já devem ter sido atualizados pelo userService antes de chamar este método
    // mas por garantia atualizamos o estado local do contexto
    setUser(userData);
    setCompany(companyData);

    // Log da ação de login (mock/client-side log)
    await userService.logUserAction(userData.id, 'user_login', {
      companyId: companyData.id
    });
  };

  const logout = async () => {
    userService.logout();
    setUser(null);
    setCompany(null);
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