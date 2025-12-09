import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Users,
  Building2,
  Car,
  Search,
  BarChart3,
  Crown,
  Shield,
  Home,
  TrendingUp,
  Calendar,
  FileText,
  Settings,
  Bell,
  Target,
  DollarSign,
  Activity,
  Menu
} from 'lucide-react';
import { UserMenu, useAuth } from '@/components/auth';
import { LogoutButton } from '@/components/auth';
import { CompanySelector } from '@/components/admin/CompanySelector';
import { PermissionGuard } from '@/components/ui/permission-guard';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MainLayout() {
  const { user, company, isAurovel, isSuperAdmin, isCompanyAdmin, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const mainMenuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Visão geral e métricas',
      resource: 'reports',
      action: 'read' as const
    },
    { 
      path: '/contacts', 
      label: 'Contatos (PF)', 
      icon: Users,
      description: 'Gestão de pessoas físicas',
      resource: 'contacts',
      action: 'read' as const
    },
    { 
      path: '/companies', 
      label: 'Empresas (PJ)', 
      icon: Building2,
      description: 'Gestão de pessoas jurídicas',
      resource: 'companies',
      action: 'read' as const
    },
    {
      path: '/vehicles',
      label: 'Veículos',
      icon: Car,
      description: 'Estoque e produtos',
      resource: 'vehicles',
      action: 'read' as const
    },
    {
      path: '/chassis-models',
      label: 'Modelos Chassi',
      icon: Settings,
      description: 'Catálogo de chassis',
      resource: 'vehicles',
      action: 'read' as const
    },
    {
      path: '/bodywork-models',
      label: 'Modelos Carroceria',
      icon: Settings,
      description: 'Catálogo de carrocerias',
      resource: 'vehicles',
      action: 'read' as const
    },
    {
      path: '/vehicle-categories',
      label: 'Categorias',
      icon: Settings,
      description: 'Categorias de veículos',
      resource: 'vehicles',
      action: 'read' as const
    },
    {
      path: '/vehicle-subcategories',
      label: 'Subcategorias',
      icon: Settings,
      description: 'Subcategorias de veículos',
      resource: 'vehicles',
      action: 'read' as const
    },
    {
      path: '/chassis-manufacturers',
      label: 'Fabricantes Chassi',
      icon: Building2,
      description: 'Fabricantes de chassi',
      resource: 'vehicles',
      action: 'read' as const
    },
    {
      path: '/bodywork-manufacturers',
      label: 'Fabricantes Carroceria',
      icon: Building2,
      description: 'Fabricantes de carroceria',
      resource: 'vehicles',
      action: 'read' as const
    },
  ];

  const crmMenuItems = [
    {
      path: '/opportunities',
      label: 'Oportunidades',
      icon: Target,
      description: 'Gestão de oportunidades de vendas',
      resource: 'sales',
      action: 'read' as const
    },
    {
      path: '/sales',
      label: 'Vendas & Pipeline',
      icon: DollarSign,
      description: 'Funil de vendas e oportunidades',
      resource: 'sales',
      action: 'read' as const
    },
    {
      path: '/matching',
      label: 'Smart Matching',
      icon: Search,
      description: 'Correspondência inteligente',
      resource: 'contacts',
      action: 'read' as const
    },
    {
      path: '/tasks',
      label: 'Tarefas & Atividades',
      icon: Calendar,
      description: 'Agenda e follow-ups',
      resource: 'sales',
      action: 'read' as const
    },
    {
      path: '/reports',
      label: 'Relatórios',
      icon: FileText,
      description: 'Analytics e insights',
      resource: 'reports',
      action: 'read' as const
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${isAurovel ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-lg flex items-center justify-center`}>
            {isAurovel ? <Crown className="h-5 w-5 text-white" /> : <Shield className="h-5 w-5 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {isAurovel ? 'CRM Master' : 'Sistema CRM'}
            </h2>
            <p className="text-xs text-gray-600 truncate">{company?.name}</p>
          </div>
        </div>
        {isAurovel && (
          <div className="mt-2">
            <Badge variant="default" className="bg-purple-600 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Controle Total
            </Badge>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Company Selector for Super Admin */}
          {isSuperAdmin && (
            <div>
              <CompanySelector />
            </div>
          )}

          {/* Search */}
          <div>
            <Input
              placeholder="Buscar no CRM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Main Navigation */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Módulos Principais</h3>
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const hasAccess = hasPermission(item.resource, item.action);
                if (!hasAccess) return null;

                return (
                  <Button
                    key={item.path}
                    variant={isActivePath(item.path) ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      onNavigate?.();
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* CRM Features */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">CRM Avançado</h3>
            <div className="space-y-1">
              {crmMenuItems.map((item) => {
                const Icon = item.icon;
                const hasAccess = hasPermission(item.resource, item.action);
                if (!hasAccess) return null;

                return (
                  <Button
                    key={item.path}
                    variant={isActivePath(item.path) ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(item.path);
                      onNavigate?.();
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Admin Section */}
          {(isSuperAdmin || isCompanyAdmin) && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Administração</h3>
              <div className="space-y-1">
                <Button
                  variant={isActivePath('/admin') ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/admin');
                    onNavigate?.();
                  }}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Painel Admin
                </Button>
                <Button
                  variant={isActivePath('/admin/users') ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/admin/users');
                    onNavigate?.();
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Usuários
                </Button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Estatísticas Rápidas</h3>
            <div className="space-y-2 text-sm">
              {hasPermission('contacts', 'read') && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contatos</span>
                  <span className="font-medium">156</span>
                </div>
              )}
              {hasPermission('companies', 'read') && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Empresas</span>
                  <span className="font-medium">43</span>
                </div>
              )}
              {hasPermission('vehicles', 'read') && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Veículos</span>
                  <span className="font-medium">89</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Matches</span>
                <span className="font-medium text-green-600">67</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        <UserMenu />
        <LogoutButton
          variant="outline"
          size="sm"
          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center gap-2 border-b bg-white px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent onNavigate={() => {}} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-3 flex-1">
          <div className={`w-8 h-8 ${isAurovel ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-lg flex items-center justify-center`}>
            {isAurovel ? <Crown className="h-4 w-4 text-white" /> : <Shield className="h-4 w-4 text-white" />}
          </div>
          <div className="hidden md:block">
            <h2 className="text-sm font-bold text-gray-900">
              {isAurovel ? 'CRM Master' : 'Sistema CRM'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}