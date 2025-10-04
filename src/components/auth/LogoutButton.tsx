import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from './AuthContext';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  className?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'ghost',
  size = 'sm',
  showText = true,
  className = ""
}) => {
  const { user, company, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!user) return;

    setIsLoggingOut(true);
    
    try {
      // Log da ação de logout
      await userService.logUserAction(user.id, 'user_logout', {
        companyId: company?.id,
        timestamp: new Date().toISOString()
      });

      // Invalidar todas as sessões do usuário
      await userService.invalidateAllUserSessions(user.id);

      // Fazer logout
      logout();
      
      toast.success('Logout realizado com sucesso', {
        description: 'Você foi desconectado do sistema'
      });
      
    } catch (error) {
      toast.error('Erro ao fazer logout');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getLogoutMessage = () => {
    if (!user || !company) return '';
    
    return `Você será desconectado como ${user.name} da empresa ${company.name}.`;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`${className} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {showText && <span className="ml-2">Sair</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Confirmar Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>{getLogoutMessage()}</p>
            <p className="text-sm text-muted-foreground">
              Todas as suas sessões ativas serão encerradas.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Saindo...' : 'Confirmar Logout'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;