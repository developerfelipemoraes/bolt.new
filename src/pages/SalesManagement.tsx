import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Calendar,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Phone,
  Mail,
  Building2,
  User,
  Clock,
  CheckCircle,
  Activity
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  lastActivity: string;
  assignedTo: string;
  source: string;
  products: string[];
}

interface SalesActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal';
  title: string;
  description: string;
  date: string;
  duration?: number;
  outcome: string;
  nextAction?: string;
  opportunityId: string;
}

export default function SalesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Mock data - em produção viria da API
  const opportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Renovação de Frota - TechCorp',
      company: 'TechCorp Soluções',
      contact: 'João Silva Santos',
      value: 850000,
      stage: 'proposal',
      probability: 75,
      expectedCloseDate: '2024-02-15',
      lastActivity: '2024-01-10',
      assignedTo: 'Ana Vendas',
      source: 'Indicação',
      products: ['Ônibus Mercedes OF-1721', 'Van Sprinter']
    },
    {
      id: '2',
      title: 'Expansão Logística - LogiBrasil',
      company: 'LogiBrasil Transportes',
      contact: 'Roberto Silva',
      value: 1200000,
      stage: 'negotiation',
      probability: 85,
      expectedCloseDate: '2024-01-30',
      lastActivity: '2024-01-08',
      assignedTo: 'Carlos Vendas',
      source: 'Website',
      products: ['Caminhão Volvo FH', 'Carreta Randon']
    },
    {
      id: '3',
      title: 'Startup Fleet - InovaCorp',
      company: 'InovaCorp Tecnologia',
      contact: 'Ana Paula Costa',
      value: 320000,
      stage: 'qualification',
      probability: 45,
      expectedCloseDate: '2024-03-01',
      lastActivity: '2024-01-05',
      assignedTo: 'Maria Vendas',
      source: 'Cold Call',
      products: ['Van Ducato', 'Carro Executivo']
    }
  ];

  const salesActivities: SalesActivity[] = [
    {
      id: '1',
      type: 'call',
      title: 'Ligação de Follow-up',
      description: 'Discussão sobre proposta comercial e condições de pagamento',
      date: '2024-01-10T14:30:00',
      duration: 45,
      outcome: 'Cliente interessado, solicitou ajustes na proposta',
      nextAction: 'Enviar proposta revisada até sexta-feira',
      opportunityId: '1'
    },
    {
      id: '2',
      type: 'meeting',
      title: 'Reunião Presencial',
      description: 'Apresentação da frota e test drive',
      date: '2024-01-08T10:00:00',
      duration: 120,
      outcome: 'Cliente aprovou os veículos, negociando condições',
      nextAction: 'Preparar contrato final',
      opportunityId: '2'
    }
  ];

  const stages = [
    { id: 'prospecting', label: 'Prospecção', color: 'bg-gray-500' },
    { id: 'qualification', label: 'Qualificação', color: 'bg-blue-500' },
    { id: 'proposal', label: 'Proposta', color: 'bg-yellow-500' },
    { id: 'negotiation', label: 'Negociação', color: 'bg-orange-500' },
    { id: 'closed-won', label: 'Fechado', color: 'bg-green-500' },
    { id: 'closed-lost', label: 'Perdido', color: 'bg-red-500' }
  ];

  const getStageInfo = (stage: string) => {
    return stages.find(s => s.id === stage) || stages[0];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || opp.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  // Calcular métricas do pipeline
  const pipelineMetrics = {
    totalValue: opportunities.reduce((sum, opp) => sum + opp.value, 0),
    weightedValue: opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0),
    averageDealSize: opportunities.length > 0 ? opportunities.reduce((sum, opp) => sum + opp.value, 0) / opportunities.length : 0,
    conversionRate: opportunities.filter(opp => opp.stage === 'closed-won').length / opportunities.length * 100
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas & Pipeline</h1>
          <p className="text-gray-600">Gerencie oportunidades e acompanhe o funil de vendas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Métricas do Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pipelineMetrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              {opportunities.length} oportunidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Ponderado</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(pipelineMetrics.weightedValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado na probabilidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(pipelineMetrics.averageDealSize)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por oportunidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {pipelineMetrics.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Oportunidades fechadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar oportunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Todos os estágios</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pipeline Kanban */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stages.slice(0, 3).map(stage => {
              const stageOpportunities = filteredOpportunities.filter(opp => opp.stage === stage.id);
              const stageValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0);
              
              return (
                <Card key={stage.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        {stage.label}
                      </div>
                      <Badge variant="secondary">{stageOpportunities.length}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(stageValue)}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stageOpportunities.map(opportunity => (
                      <Card key={opportunity.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">{opportunity.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {opportunity.company}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {opportunity.contact}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-green-600">
                                {formatCurrency(opportunity.value)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {opportunity.probability}%
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(opportunity.expectedCloseDate).toLocaleDateString('pt-BR')}
                            </div>
                            <Progress value={opportunity.probability} className="h-1" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Lista Detalhada */}
          <Card>
            <CardHeader>
              <CardTitle>Todas as Oportunidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOpportunities.map(opportunity => {
                  const stageInfo = getStageInfo(opportunity.stage);
                  
                  return (
                    <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                            <Badge className={`${stageInfo.color} text-white`}>
                              {stageInfo.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {opportunity.company}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {opportunity.contact}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(opportunity.expectedCloseDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-4">
                            <span className="font-bold text-green-600 text-lg">
                              {formatCurrency(opportunity.value)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Probabilidade:</span>
                              <Progress value={opportunity.probability} className="w-20 h-2" />
                              <span className="text-sm font-medium">{opportunity.probability}%</span>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-1">
                            {opportunity.products.map((product, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividades de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {salesActivities.map(activity => {
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'call': return <Phone className="h-4 w-4" />;
                    case 'email': return <Mail className="h-4 w-4" />;
                    case 'meeting': return <Calendar className="h-4 w-4" />;
                    default: return <Activity className="h-4 w-4" />;
                  }
                };

                return (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{activity.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(activity.date).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="bg-green-50 p-2 rounded text-sm">
                          <strong className="text-green-800">Resultado:</strong>
                          <p className="text-green-700">{activity.outcome}</p>
                        </div>
                        {activity.nextAction && (
                          <div className="bg-blue-50 p-2 rounded text-sm mt-2">
                            <strong className="text-blue-800">Próxima Ação:</strong>
                            <p className="text-blue-700">{activity.nextAction}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Estágio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stages.map(stage => {
                    const stageOpportunities = opportunities.filter(opp => opp.stage === stage.id);
                    const stageValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0);
                    const percentage = opportunities.length > 0 ? (stageOpportunities.length / opportunities.length) * 100 : 0;
                    
                    return (
                      <div key={stage.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                            <span className="font-medium">{stage.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{stageOpportunities.length}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(stageValue)}
                            </div>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Ônibus Mercedes OF-1721', 'Caminhão Volvo FH', 'Van Sprinter', 'Carreta Randon'].map((product, index) => (
                    <div key={product} className="flex items-center justify-between">
                      <span className="text-sm">{product}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={80 - (index * 15)} className="w-16 h-2" />
                        <span className="text-sm font-medium">{5 - index}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}