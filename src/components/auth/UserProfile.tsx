import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Building2, 
  Shield, 
  Crown, 
  Calendar,
  Key,
  Edit,
  Save,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = "" }) => {
  const { user, company, logout } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPasswords: false
  });

  const [isUpdating, setIsUpdating] = useState(false);

  if (!user || !company) return null;

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    try {
      const updatedUser = await userService.updateUser(user.id, {
        name: editForm.name,
        email: editForm.email
      }, user);

      await userService.logUserAction(user.id, 'profile_updated', {
        changes: { name: editForm.name, email: editForm.email }
      });

      // Atualizar dados no localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setShowEditDialog(false);
      toast.success('Perfil atualizado com sucesso!');
      
      // Recarregar página para atualizar contexto
      window.location.reload();
      
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    setIsUpdating(true);
    
    try {
      // Validar senha atual (simulado)
      if (passwordForm.currentPassword !== 'senha_atual_mock') {
        // Em produção, validaria com o backend
      }

      const passwordValidation = userService.validatePassword(passwordForm.newPassword);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors.join(', '));
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('Senhas não coincidem');
        return;
      }

      await userService.changePassword(user.id, passwordForm.newPassword, user);
      
      await userService.logUserAction(user.id, 'password_changed', {
        userId: user.id
      });

      setShowPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showPasswords: false
      });
      
      toast.success('Senha alterada com sucesso!', {
        description: 'Você será redirecionado para fazer login novamente'
      });

      // Logout após trocar senha
      setTimeout(() => {
        logout();
      }, 2000);
      
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar senha');
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'super_admin':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'company_admin':
        return <Shield className="h-5 w-5 text-blue-600" />;
      default:
        return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'super_admin':
        return 'Super Administrador';
      case 'company_admin':
        return 'Administrador da Empresa';
      default:
        return 'Usuário';
    }
  };

  const getRoleBadgeVariant = () => {
    switch (user.role) {
      case 'super_admin':
        return 'default';
      case 'company_admin':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Meu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <Badge variant={getRoleBadgeVariant()} className="flex items-center gap-1">
                {getRoleIcon()}
                {getRoleLabel()}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {company.name}
              </div>
              {user.lastLogin && (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Último login: {new Date(user.lastLogin).toLocaleString('pt-BR')}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Membro desde: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Informações da Empresa
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Nome:</span>
              <p className="font-medium">{company.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Tipo:</span>
              <p className="font-medium">
                {company.type === 'master' ? 'Master (Aurovel)' : 'Cliente'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Máx. Usuários:</span>
              <p className="font-medium">{company.settings.maxUsers}</p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <Badge variant={company.isActive ? "default" : "secondary"}>
                {company.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nome Completo</Label>
                  <Input
                    id="profile-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpdateProfile} 
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Key className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar Senha</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={passwordForm.showPasswords ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Digite sua senha atual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setPasswordForm(prev => ({ ...prev, showPasswords: !prev.showPasswords }))}
                    >
                      {passwordForm.showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type={passwordForm.showPasswords ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-new-password"
                    type={passwordForm.showPasswords ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirme a nova senha"
                  />
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Após alterar a senha, você será desconectado e precisará fazer login novamente.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleChangePassword} 
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPasswordDialog(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Logout Section */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-800">
            <Shield className="h-4 w-4" />
            Sair do Sistema
          </h4>
          <p className="text-sm text-red-600 mb-3">
            Encerrar sua sessão e sair do sistema com segurança.
          </p>
          <LogoutButton 
            variant="destructive" 
            size="sm" 
            className="w-full"
          />
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
            <Shield className="h-4 w-4" />
            Informações de Segurança
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-600">Nível de Acesso:</span>
              <span className="font-medium">{getRoleLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Empresa:</span>
              <span className="font-medium">{company.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Status da Conta:</span>
              <Badge variant={user.isActive ? "default" : "secondary"}>
                {user.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            {user.lastLogin && (
              <div className="flex justify-between">
                <span className="text-blue-600">Último Login:</span>
                <span className="font-medium">
                  {new Date(user.lastLogin).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Permissions Summary */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-800">
            <Shield className="h-4 w-4" />
            Suas Permissões
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {user.role === 'super_admin' && (
              <Badge variant="default" className="justify-center">
                <Crown className="h-3 w-3 mr-1" />
                Acesso Total
              </Badge>
            )}
            {user.role === 'company_admin' && (
              <>
                <Badge variant="outline" className="justify-center text-xs">Gerenciar Usuários</Badge>
                <Badge variant="outline" className="justify-center text-xs">Todos os Módulos</Badge>
                <Badge variant="outline" className="justify-center text-xs">Relatórios</Badge>
                <Badge variant="outline" className="justify-center text-xs">Configurações</Badge>
              </>
            )}
            {user.role === 'user' && (
              <>
                <Badge variant="outline" className="justify-center text-xs">Visualizar Dados</Badge>
                <Badge variant="outline" className="justify-center text-xs">Criar Registros</Badge>
                <Badge variant="outline" className="justify-center text-xs">Editar Próprios</Badge>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;