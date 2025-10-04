import React from 'react';
import { useAuth } from '@/components/auth';
import { PermissionAction } from '@/types/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  resource: string;
  action: PermissionAction;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  resource,
  action,
  fallback,
  showFallback = true
}) => {
  const { hasPermission, user } = useAuth();

  const hasAccess = hasPermission(resource, action);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showFallback) {
      return null;
    }

    return (
      <Alert className="border-orange-200 bg-orange-50">
        <Lock className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Acesso Restrito:</strong> Você não tem permissão para {action} {resource}.
          {user?.role === 'user' && (
            <span className="block mt-1 text-sm">
              Entre em contato com o administrador da sua empresa para solicitar acesso.
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

// Hook para verificação de permissões
export const usePermission = (resource: string, action: PermissionAction) => {
  const { hasPermission } = useAuth();
  return hasPermission(resource, action);
};

// HOC para componentes protegidos
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  resource: string,
  action: PermissionAction
) => {
  return (props: P) => (
    <PermissionGuard resource={resource} action={action}>
      <Component {...props} />
    </PermissionGuard>
  );
};

export default PermissionGuard;