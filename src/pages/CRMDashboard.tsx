import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building2, 
  Car,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  Bell,
  Activity,
  BarChart3,
  PieChart,
  ArrowRight,
  Plus,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/components/auth';
import { LogoutButton } from '@/components/auth';
import { useNavigate } from 'react-router-dom';

export default function CRMDashboard() {
  const { user, company, isAurovel, hasPermission } = useAuth();
  const navigate = useNavigate();

  // Mock data - em produção viria da API
  const dashboardData = {
    kpis: {
      totalContacts: 156,
      totalCompanies: 43,
      totalVehicles: 89,
      totalRevenue: 2450000,
      monthlyGrowth: 15.3,
      conversionRate: 23.5,
      averageTicket: 45000,
      activeOpportunities: 12
    },
    recentActivity: [
      { 
        id: '1',
        type: 'contact_created',
        title: 'Novo contato cadastrado',
        description: 'João Silva Santos - CEO TechCorp',
        time: '2 horas atrás',
        icon: Users,
        color: 'text-blue-600'
      },
      { 
        id: '2',
        type: 'opportunity_won',
        title: 'Oportunidade fechada',
        description: 'LogiBrasil - R$ 850.000 em veículos',
        time: '4 horas atrás',
        icon: DollarSign,
        color: 'text-green-600'
      },
      { 
        id: '3',
        type: 'vehicle_added',
        title: 'Veículo adicionado',
        description: 'Ônibus Mercedes OF-1721 Paradiso',
        time: '6 horas atrás',
        icon: Car,
        color: 'text-purple-600'
      },
      { 
        id: '4',
        type: 'task_completed',
        title: 'Tarefa concluída',
        description: 'Follow-up com InovaCorp realizado',
        time: '1 dia atrás',
        icon: CheckCircle,
        color: 'text-green-600'
      }
    ],
    upcomingTasks: [
      {
        id: '1',
        title: 'Ligar para João Silva',
        type: 'call',
        dueDate: '2024-01-15T14:00:00',
        priority: 'high',
        relatedTo: 'TechCorp'
      },
      {
        id: '2',
        title: 'Enviar proposta LogiBrasil',
        type: 'proposal',
        dueDate: '2024-01-15T17:00:00',
        priority: 'urgent',
        relatedTo: 'LogiBrasil'
      },
      {
        id: '3',
        title: 'Reunião InovaCorp',
        type: 'meeting',
        dueDate: '2024-01-16T10:00:00',
        priority: 'medium',
        relatedTo: 'InovaCorp'
      }
    ],
    salesPipeline: {
      prospecting: { count: 8, value: 450000 },
      qualification: { count: 5, value: 320000 },
      proposal: { count: 3, value: 680000 },
      negotiation: { count: 2, value: 890000 },
      closed: { count: 4, value: 1200000 }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-3 w-3" />;
      case 'email': return <Mail className="h-3 w-3" />;
      case 'meeting': return <Calendar className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard CRM</h1>
          <p className="text-gray-600">
            Bem-vindo, {user?.name} • {company?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
            <Badge variant="secondary" className="ml-2">3</Badge>
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {hasPermission('contacts', 'read') && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contacts')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contatos (PF)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dashboardData.kpis.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                +12 este mês
              </p>
            </CardContent>
          </Card>
        )}

        {hasPermission('companies', 'read') && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/companies')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas (PJ)</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardData.kpis.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">
                +8 este mês
              </p>
            </CardContent>
          </Card>
        )}

        {hasPermission('vehicles', 'read') && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vehicles')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Veículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{dashboardData.kpis.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                +15 este mês
              </p>
            </CardContent>
          </Card>
        )}

        {hasPermission('sales', 'read') && (
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/sales')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(dashboardData.kpis.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{dashboardData.kpis.monthlyGrowth}% este mês
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline de Vendas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Pipeline de Vendas
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/sales')}>
                Ver Detalhes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dashboardData.salesPipeline).map(([stage, data]) => {
                const stageLabels = {
                  prospecting: 'Prospecção',
                  qualification: 'Qualificação',
                  proposal: 'Proposta',
                  negotiation: 'Negociação',
                  closed: 'Fechado'
                };
                
                const stageColors = {
                  prospecting: 'bg-gray-500',
                  qualification: 'bg-blue-500',
                  proposal: 'bg-yellow-500',
                  negotiation: 'bg-orange-500',
                  closed: 'bg-green-500'
                };

                return (
                  <div key={stage} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${stageColors[stage as keyof typeof stageColors]}`} />
                      <span className="font-medium">{stageLabels[stage as keyof typeof stageLabels]}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{data.count} oportunidades</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(data.value)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas Pendentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Tarefas
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.upcomingTasks.map(task => (
              <div key={task.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <Badge className={getPriorityColor(task.priority)} size="sm">
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getTaskIcon(task.type)}
                  <span>{new Date(task.dueDate).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{task.relatedTo}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentActivity.map(activity => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start h-12"
              onClick={() => navigate('/contacts/new')}
              disabled={!hasPermission('contacts', 'create')}
            >
              <Users className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium">Cadastrar Contato</p>
                <p className="text-xs opacity-80">Wizard completo PF</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={() => navigate('/companies/new')}
              disabled={!hasPermission('companies', 'create')}
            >
              <Building2 className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium">Cadastrar Empresa</p>
                <p className="text-xs opacity-60">Wizard completo PJ</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={() => navigate('/vehicles/new')}
              disabled={!hasPermission('vehicles', 'create')}
            >
              <Car className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium">Cadastrar Veículo</p>
                <p className="text-xs opacity-60">Wizard completo</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={() => navigate('/matching')}
              disabled={!hasPermission('contacts', 'read')}
            >
              <Target className="h-4 w-4 mr-3" />
              <div className="text-left">
                <p className="font-medium">Smart Matching</p>
                <p className="text-xs opacity-60">Correspondência IA</p>
              </div>
            </Button>

            {(hasPermission('users', 'create') || hasPermission('users', 'read')) && (
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-4 w-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Gerenciar Usuários</p>
                  <p className="text-xs opacity-60">Cadastro e controle</p>
                </div>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Métricas Avançadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taxa de Conversão</span>
                  <span className="font-medium">{dashboardData.kpis.conversionRate}%</span>
                </div>
                <Progress value={dashboardData.kpis.conversionRate} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Crescimento Mensal</span>
                  <span className="font-medium text-green-600">+{dashboardData.kpis.monthlyGrowth}%</span>
                </div>
                <Progress value={dashboardData.kpis.monthlyGrowth} className="h-2" />
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(dashboardData.kpis.averageTicket)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm">Contatos</span>
                </div>
                <span className="font-medium">{dashboardData.kpis.totalContacts}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm">Empresas</span>
                </div>
                <span className="font-medium">{dashboardData.kpis.totalCompanies}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm">Veículos</span>
                </div>
                <span className="font-medium">{dashboardData.kpis.totalVehicles}</span>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Total de Registros</p>
                <p className="text-lg font-bold">
                  {dashboardData.kpis.totalContacts + dashboardData.kpis.totalCompanies + dashboardData.kpis.totalVehicles}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Oportunidades Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{dashboardData.kpis.activeOpportunities}</p>
                <p className="text-sm text-muted-foreground">oportunidades em andamento</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Valor Total Pipeline</span>
                  <span className="font-medium">{formatCurrency(2340000)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Valor Ponderado</span>
                  <span className="font-medium text-green-600">{formatCurrency(1560000)}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => navigate('/sales')}>
                Gerenciar Pipeline
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas e Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-800">3 tarefas vencidas</p>
                <p className="text-sm text-red-600">Verifique suas tarefas pendentes</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/tasks')}>
                Ver Tarefas
              </Button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">5 follow-ups hoje</p>
                <p className="text-sm text-yellow-600">Contatos agendados para hoje</p>
              </div>
              <Button size="sm" variant="outline">
                Ver Agenda
              </Button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-800">Meta mensal: 85% atingida</p>
                <p className="text-sm text-green-600">Faltam apenas 3 vendas para bater a meta</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/reports')}>
                Ver Relatório
              </Button>
            </div>
            <LogoutButton 
              variant="outline" 
              size="sm" 
              showText={false}
              className="text-red-600 hover:text-red-600 hover:bg-red-50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}