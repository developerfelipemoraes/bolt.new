import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, LogOut } from 'lucide-react';

interface UserProfileProps {
  user: {
    email: string;
    name?: string;
    [key: string]: unknown;
  };
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'VIEWER':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'Acesso total ao sistema';
      case 'MANAGER':
        return 'Gerenciamento de empresas e contatos';
      case 'VIEWER':
        return 'Visualização de dados';
      default:
        return 'Usuário padrão';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Perfil do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{user?.name || 'Nome não disponível'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{user?.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-500" />
          <div className="flex flex-col gap-1">
            <Badge className={`${getRoleBadgeColor(user?.role)} font-semibold w-fit`}>
              {user?.role?.toUpperCase() || 'USER'}
            </Badge>
            <span className="text-xs text-gray-500">
              {getRoleDescription(user?.role)}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={onLogout} 
            variant="outline" 
            className="w-full text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Sistema
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}