import React from 'react';
import { useAuth } from './AuthContext';
import LoginComponent from './LoginComponent';
import { PermissionAction } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredResource?: string;
  requiredAction?: PermissionAction;
  requiredRole?: string;
  allowedCompanies?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredResource,
  requiredAction = 'read',
  requiredRole,
  allowedCompanies
}) => {
  const { user, company, isAuthenticated, hasPermission, login } = useAuth();

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated || !user || !company) {
    return <LoginComponent onLogin={(userData, companyData) => login(userData, companyData)} />;
  }

  // Verificar permissão específica
  if (requiredResource && !hasPermission(requiredResource, requiredAction)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">
            Você não tem permissão para {requiredAction} {requiredResource}.
          </p>
        </div>
      </div>
    );
  }

  // Verificar role específico
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Seu nível de acesso não permite visualizar esta área.</p>
        </div>
      </div>
    );
  }

  // Verificar empresas permitidas
  if (allowedCompanies && !allowedCompanies.includes(user.companyId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Empresa Não Autorizada</h2>
          <p className="text-gray-600">Sua empresa não tem acesso a esta funcionalidade.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;