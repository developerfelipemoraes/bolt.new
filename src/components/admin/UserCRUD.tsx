import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Shield,
  Building2,
  Crown,
  UserCheck,
  UserX,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Activity
} from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth';
import { User, UserRole, Company } from '@/types/auth';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface UserCRUDProps {
  className?: string;
}

export const UserCRUD: React.FC<UserCRUDProps> = ({ className = "" }) => {
  const { user: currentUser, company, isSuperAdmin, isCompanyAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    email: '',
    name: '',
    companyId: '',
    role: UserRole.USER,
    password: '',
    confirmPassword: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    role: UserRole.USER,
    isActive: true
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    usersByRole: {} as Record<UserRole, number>,
    usersByCompany: {} as Record<string, number>
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const [usersData, companiesData, statsData] = await Promise.all([
        userService.getAllUsers(currentUser),
        userService.getAllCompanies(),
        userService.getUserStats(currentUser)
      ]);
      
      setUsers(usersData);
      setCompanies(companiesData);
      setStats(statsData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!currentUser) return;

    try {
      // Validações
      if (!userService.validateEmail(createForm.email)) {
        toast.error('Email inválido');
        return;
      }

      const passwordValidation = userService.validatePassword(createForm.password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors.join(', '));
        return;
      }

      if (createForm.password !== createForm.confirmPassword) {
        toast.error('Senhas não coincidem');
        return;
      }

      const newUser = await userService.createUser({
        email: createForm.email,
        name: createForm.name,
        companyId: createForm.companyId || currentUser.companyId,
        role: createForm.role,
        password: createForm.password
      }, currentUser);

      await userService.logUserAction(currentUser.id, 'user_created', {
        targetUserId: newUser.id,
        targetUserEmail: newUser.email,
        role: newUser.role
      });

      setUsers(prev => [...prev, newUser]);
      setShowCreateDialog(false);
      setCreateForm({
        email: '',
        name: '',
        companyId: '',
        role: UserRole.USER,
        password: '',
        confirmPassword: ''
      });
      
      toast.success('Usuário criado com sucesso!');
      loadData(); // Recarregar stats
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar usuário');
    }
  };

  const handleEditUser = async () => {
    if (!currentUser || !selectedUser) return;

    try {
      const updatedUser = await userService.updateUser(selectedUser.id, {
        name: editForm.name,
        role: editForm.role,
        isActive: editForm.isActive
      }, currentUser);

      await userService.logUserAction(currentUser.id, 'user_updated', {
        targetUserId: updatedUser.id,
        changes: editForm
      });

      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setShowEditDialog(false);
      setSelectedUser(null);
      
      toast.success('Usuário atualizado com sucesso!');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser || !selectedUser) return;

    try {
      await userService.deleteUser(selectedUser.id, currentUser);
      
      await userService.logUserAction(currentUser.id, 'user_deleted', {
        targetUserId: selectedUser.id,
        targetUserEmail: selectedUser.email
      });

      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setShowDeleteDialog(false);
      setSelectedUser(null);
      
      toast.success('Usuário excluído com sucesso!');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir usuário');
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (!currentUser) return;

    try {
      const updatedUser = await userService.toggleUserStatus(user.id, currentUser);
      
      await userService.logUserAction(currentUser.id, 'user_status_changed', {
        targetUserId: user.id,
        newStatus: updatedUser.isActive ? 'active' : 'inactive'
      });

      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      
      toast.success(`Usuário ${updatedUser.isActive ? 'ativado' : 'desativado'} com sucesso!`);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar status');
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser || !selectedUser) return;

    try {
      const passwordValidation = userService.validatePassword(passwordForm.newPassword);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors.join(', '));
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('Senhas não coincidem');
        return;
      }

      await userService.changePassword(selectedUser.id, passwordForm.newPassword, currentUser);
      
      await userService.logUserAction(currentUser.id, 'password_changed', {
        targetUserId: selectedUser.id
      });

      setShowPasswordDialog(false);
      setPasswordForm({ newPassword: '', confirmPassword: '', showPassword: false });
      setSelectedUser(null);
      
      toast.success('Senha alterada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar senha');
    }
  };

  const handleForceLogout = async (user: User) => {
    if (!currentUser) return;

    try {
      await userService.invalidateAllUserSessions(user.id);
      
      await userService.logUserAction(currentUser.id, 'force_logout', {
        targetUserId: user.id,
        targetUserEmail: user.email
      });

      toast.success(`Logout forçado para ${user.name}`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao forçar logout');
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      role: user.role,
      isActive: user.isActive
    });
    setShowEditDialog(true);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setPasswordForm({ newPassword: '', confirmPassword: '', showPassword: false });
    setShowPasswordDialog(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const generatePassword = () => {
    const password = userService.generateRandomPassword();
    setCreateForm(prev => ({ ...prev, password, confirmPassword: password }));
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-purple-600" />;
      case UserRole.COMPANY_ADMIN:
        return <Shield className="h-4 w-4 text-blue-600" />;
      case UserRole.USER:
        return <Users className="h-4 w-4 text-gray-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.COMPANY_ADMIN:
        return 'Admin da Empresa';
      case UserRole.USER:
        return 'Usuário';
      default:
        return role;
    }
  };

  const getCompanyName = (companyId: string) => {
    const comp = companies.find(c => c.id === companyId);
    return comp?.name || 'Empresa não encontrada';
  };

  const canManageUser = (targetUser: User) => {
    if (!currentUser) return false;
    
    // Super admin pode gerenciar qualquer usuário
    if (isSuperAdmin) return true;
    
    // Company admin pode gerenciar usuários da própria empresa (exceto outros admins)
    if (isCompanyAdmin && targetUser.companyId === currentUser.companyId) {
      return targetUser.role !== UserRole.SUPER_ADMIN;
    }
    
    return false;
  };

  if (!isCompanyAdmin && !isSuperAdmin) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(stats.usersByRole[UserRole.SUPER_ADMIN] || 0) + (stats.usersByRole[UserRole.COMPANY_ADMIN] || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Empresas</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Object.keys(stats.usersByCompany).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestão de Usuários
              <Badge variant="secondary">{users.length}</Badge>
            </CardTitle>
            
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="audit">Auditoria</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando usuários...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-lg">{user.name}</span>
                            <Badge 
                              variant={user.isActive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {user.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getRoleLabel(user.role)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3 w-3" />
                              {getCompanyName(user.companyId)}
                            </div>
                            {user.lastLogin && (
                              <div className="flex items-center gap-2">
                                <Activity className="h-3 w-3" />
                                Último login: {new Date(user.lastLogin).toLocaleString('pt-BR')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {canManageUser(user) && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPasswordDialog(user)}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.isActive ? (
                              <UserX className="h-4 w-4 text-red-600" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(user)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          {/* Force Logout Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleForceLogout(user)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Forçar logout do usuário"
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Nenhum usuário encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Usuários por Role</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(stats.usersByRole).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role as UserRole)}
                          <span>{getRoleLabel(role as UserRole)}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Usuários por Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(stats.usersByCompany).map(([companyName, count]) => (
                      <div key={companyName} className="flex items-center justify-between">
                        <span>{companyName}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Log de Auditoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Logs de auditoria serão exibidos aqui</p>
                    <p className="text-sm">Todas as ações de usuários são registradas</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@empresa.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-name">Nome Completo *</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>

            {isSuperAdmin && (
              <div className="space-y-2">
                <Label htmlFor="create-company">Empresa *</Label>
                <Select
                  value={createForm.companyId}
                  onValueChange={(value) => setCreateForm(prev => ({ ...prev, companyId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(comp => (
                      <SelectItem key={comp.id} value={comp.id}>
                        <div className="flex items-center gap-2">
                          <span>{comp.logo}</span>
                          {comp.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="create-role">Nível de Acesso *</Label>
              <Select
                value={createForm.role}
                onValueChange={(value: UserRole) => setCreateForm(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {isSuperAdmin && (
                    <SelectItem value={UserRole.COMPANY_ADMIN}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin da Empresa
                      </div>
                    </SelectItem>
                  )}
                  <SelectItem value={UserRole.USER}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Usuário
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="create-password">Senha *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePassword}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Gerar
                </Button>
              </div>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-confirm">Confirmar Senha *</Label>
              <Input
                id="create-confirm"
                type="password"
                value={createForm.confirmPassword}
                onChange={(e) => setCreateForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirme a senha"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateUser} className="flex-1">
                Criar Usuário
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-role">Nível de Acesso</Label>
              <Select
                value={editForm.role}
                onValueChange={(value: UserRole) => setEditForm(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {isSuperAdmin && (
                    <SelectItem value={UserRole.COMPANY_ADMIN}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin da Empresa
                      </div>
                    </SelectItem>
                  )}
                  <SelectItem value={UserRole.USER}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Usuário
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Status do Usuário</Label>
              <Badge variant={editForm.isActive ? "default" : "secondary"}>
                {editForm.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleEditUser} className="flex-1">
                Salvar Alterações
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

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                Alterando senha para: <strong>{selectedUser?.name}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={passwordForm.showPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setPasswordForm(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                >
                  {passwordForm.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type={passwordForm.showPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirme a nova senha"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleChangePassword} className="flex-1">
                Alterar Senha
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

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <Trash2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> Esta ação não pode ser desfeita.
                <br />
                Usuário: <strong>{selectedUser?.name}</strong>
                <br />
                Email: <strong>{selectedUser?.email}</strong>
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser} 
                className="flex-1"
              >
                Confirmar Exclusão
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserCRUD;