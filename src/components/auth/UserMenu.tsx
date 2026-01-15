import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  Settings, 
  Crown, 
  Building2, 
  Shield,
  Users,
  ChevronDown,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { LogoutButton } from './LogoutButton';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

interface UserMenuProps {
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ className = "" }) => {
  const { user, company, logout, isAurovel, isSuperAdmin, isCompanyAdmin, switchCompany } = useAuth();

  if (!user || !company) return null;

  const handleCompanySwitch = async (companyId: string) => {
    try {
      await switchCompany(companyId);
    } catch (error) {
      toast.error('Erro ao trocar empresa');
    }
  };

  const getRoleDisplay = (role: string) => {
    const roles = {
      [UserRole.SUPER_ADMIN]: 'Super Admin',
      [UserRole.COMPANY_ADMIN]: 'Admin da Empresa',
      [UserRole.USER]: 'Usuário'
    };
    return roles[role as UserRole] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === UserRole.SUPER_ADMIN) return 'default';
    if (role === UserRole.COMPANY_ADMIN) return 'outline';
    return 'secondary';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-10 w-10 rounded-full ${className}`}>
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`${isAurovel ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-lg">{company.logo}</div>
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={getRoleBadgeVariant(user.role)}
                className="text-xs"
              >
                {isSuperAdmin && <Crown className="h-3 w-3 mr-1" />}
                {isCompanyAdmin && <Building2 className="h-3 w-3 mr-1" />}
                {user.role === UserRole.USER && <Users className="h-3 w-3 mr-1" />}
                {getRoleDisplay(user.role)}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {company.name}
                </span>
              </div>
              {isSuperAdmin && (
                <div className="flex items-center gap-2">
                  <Crown className="h-3 w-3 text-purple-600" />
                  <span className="text-xs text-purple-600 font-medium">
                    Controle Total do Sistema
                  </span>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Company Switcher for Super Admin */}
        {isSuperAdmin && (
          <>
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2">Empresa Ativa:</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{company.logo}</span>
                  <span className="text-sm font-medium">{company.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCompanySwitch(company.id === 'aurovel' ? 'tech-solutions' : 'aurovel')}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Permissions Display */}
        <div className="p-2">
          <div className="text-xs text-muted-foreground mb-2">Nível de Acesso:</div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {getRoleDisplay(user.role)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {company.type === 'master' ? 'Todas Empresas' : 'Empresa Própria'}
            </Badge>
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>
        
        {isCompanyAdmin && (
          <DropdownMenuItem className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            <span>Gerenciar Usuários</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <div className="p-1">
          <LogoutButton 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;