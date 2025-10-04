import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Building2, Settings, Crown, Shield } from 'lucide-react';
import { useAuth } from '@/components/auth';
import { LogoutButton } from '@/components/auth';
import { PermissionGuard } from '@/components/ui/permission-guard';
import { UserManagement } from '@/components/admin/UserManagement';
import { UserProfile } from '@/components/auth/UserProfile';
import { CompanySelector } from '@/components/admin/CompanySelector';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, company, isSuperAdmin, isCompanyAdmin } = useAuth();

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (!isSuperAdmin && !isCompanyAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Apenas administradores podem acessar esta área.</p>
          <Button onClick={handleBack} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                      <p className="text-gray-600">
                        Gestão de usuários e configurações • {company?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSuperAdmin && (
                      <Badge variant="default" className="bg-purple-600">
                        <Crown className="h-3 w-3 mr-1" />
                        Super Admin
                      </Badge>
                    )}
                    {isCompanyAdmin && (
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin da Empresa
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Admin Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Company Selector (Super Admin only) */}
                  {isSuperAdmin && (
                    <div className="lg:col-span-1">
                      <CompanySelector />
                    </div>
                  )}

                  {/* User Management */}
                  <div className={isSuperAdmin ? "lg:col-span-2" : "lg:col-span-3"}>
                    <UserManagement />
                  </div>
                </div>

                {/* User Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserProfile />
                  
                  {/* System Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Informações do Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Versão:</span>
                          <p className="font-medium">v1.0.0</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Ambiente:</span>
                          <p className="font-medium">Desenvolvimento</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Última Atualização:</span>
                          <p className="font-medium">15/01/2024</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Storage:</span>
                          <p className="font-medium">LocalStorage (Mock)</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Modo Demo:</strong> Os dados estão sendo armazenados no localStorage. 
                          Em produção, integre com um banco de dados real.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Gestão de Usuários
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Convide, edite e gerencie usuários da {isSuperAdmin ? 'empresa selecionada' : 'sua empresa'}.
                      </p>
                      <div className="space-y-2">
                        <PermissionGuard resource="users" action="create" showFallback={false}>
                          <Button variant="outline" className="w-full justify-start">
                            <Plus className="h-4 w-4 mr-2" />
                            Convidar Usuário
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard resource="users" action="read" showFallback={false}>
                          <Button variant="outline" className="w-full justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            Ver Todos os Usuários
                          </Button>
                        </PermissionGuard>
                      </div>
                    </CardContent>
                  </Card>

                  {isSuperAdmin && (
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-green-600" />
                          Gestão de Empresas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          Crie e gerencie empresas clientes no sistema.
                        </p>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Empresa Cliente
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Building2 className="h-4 w-4 mr-2" />
                            Gerenciar Empresas
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-purple-600" />
                        Configurações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Configure preferências e parâmetros do sistema.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurações Gerais
                        </Button>
                        {isCompanyAdmin && (
                          <Button variant="outline" className="w-full justify-start">
                            <Building2 className="h-4 w-4 mr-2" />
                            Configurações da Empresa
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Company Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Informações da Empresa Ativa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{company?.logo}</span>
                        <div>
                          <p className="font-semibold">{company?.name}</p>
                          <p className="text-sm text-gray-600">{company?.description}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Tipo</p>
                        <p className="font-medium">
                          {company?.type === 'master' ? 'Master (Aurovel)' : 'Cliente'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Máx. Usuários</p>
                        <p className="font-medium">{company?.settings.maxUsers}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge variant={company?.isActive ? "default" : "secondary"}>
                          {company?.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            } 
          />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
}