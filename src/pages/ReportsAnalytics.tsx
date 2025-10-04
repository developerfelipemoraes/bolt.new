import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2,
  Car,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Target,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

export default function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data para demonstração
  const analyticsData = {
    overview: {
      totalContacts: 156,
      totalCompanies: 43,
      totalVehicles: 89,
      totalRevenue: 2450000,
      growthRate: 15.3,
      conversionRate: 23.5,
      averageTicket: 45000,
      customerSatisfaction: 4.7
    },
    trends: {
      contactsGrowth: [120, 135, 142, 156],
      companiesGrowth: [35, 38, 41, 43],
      vehiclesGrowth: [65, 72, 81, 89],
      revenueGrowth: [1800000, 2100000, 2300000, 2450000]
    },
    segments: {
      contactsByState: [
        { state: 'SP', count: 67, percentage: 43 },
        { state: 'RJ', count: 34, percentage: 22 },
        { state: 'MG', count: 28, percentage: 18 },
        { state: 'RS', count: 15, percentage: 10 },
        { state: 'Outros', count: 12, percentage: 7 }
      ],
      companiesBySegment: [
        { segment: 'Tecnologia', count: 15, percentage: 35 },
        { segment: 'Logística', count: 12, percentage: 28 },
        { segment: 'Varejo', count: 8, percentage: 19 },
        { segment: 'Serviços', count: 5, percentage: 12 },
        { segment: 'Outros', count: 3, percentage: 7 }
      ],
      vehiclesByCategory: [
        { category: 'Ônibus', count: 34, percentage: 38 },
        { category: 'Caminhões', count: 28, percentage: 31 },
        { category: 'Vans', count: 15, percentage: 17 },
        { category: 'Carros', count: 12, percentage: 13 }
      ]
    },
    performance: {
      topSalesReps: [
        { name: 'Ana Vendas', deals: 12, revenue: 680000, conversion: 85 },
        { name: 'Carlos Vendas', deals: 10, revenue: 590000, conversion: 78 },
        { name: 'Maria Vendas', deals: 8, revenue: 420000, conversion: 72 }
      ],
      topProducts: [
        { name: 'Ônibus Mercedes OF-1721', sales: 8, revenue: 560000 },
        { name: 'Caminhão Volvo FH', sales: 6, revenue: 480000 },
        { name: 'Van Sprinter', sales: 12, revenue: 360000 }
      ]
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios & Analytics</h1>
          <p className="text-gray-600">Insights e análises detalhadas do seu CRM</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analyticsData.overview.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatPercentage(analyticsData.overview.growthRate)} vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPercentage(analyticsData.overview.conversionRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Leads para clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(analyticsData.overview.averageTicket)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por transação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {analyticsData.overview.customerSatisfaction}/5
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliação média dos clientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="segments">Segmentação</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumo por Módulo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumo por Módulo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Contatos (PF)</p>
                      <p className="text-sm text-muted-foreground">Pessoas físicas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalContacts}</p>
                    <p className="text-xs text-muted-foreground">+12 este mês</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Empresas (PJ)</p>
                      <p className="text-sm text-muted-foreground">Pessoas jurídicas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{analyticsData.overview.totalCompanies}</p>
                    <p className="text-xs text-muted-foreground">+8 este mês</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Veículos</p>
                      <p className="text-sm text-muted-foreground">Estoque de produtos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{analyticsData.overview.totalVehicles}</p>
                    <p className="text-xs text-muted-foreground">+15 este mês</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Atividade Recente */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade dos Últimos 30 Dias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-xs text-muted-foreground">Novos Contatos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">8</p>
                      <p className="text-xs text-muted-foreground">Novas Empresas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">15</p>
                      <p className="text-xs text-muted-foreground">Novos Veículos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">23</p>
                      <p className="text-xs text-muted-foreground">Matches</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Crescimento Mensal</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Contatos</span>
                        <span className="text-green-600 font-medium">+8.3%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Empresas</span>
                        <span className="text-green-600 font-medium">+22.9%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Veículos</span>
                        <span className="text-green-600 font-medium">+20.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contatos por Estado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contatos por Estado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.segments.contactsByState.map((item, index) => (
                  <div key={item.state} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.state}</span>
                      <div className="text-right">
                        <span className="font-bold">{item.count}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Empresas por Segmento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Empresas por Segmento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.segments.companiesBySegment.map((item, index) => (
                  <div key={item.segment} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.segment}</span>
                      <div className="text-right">
                        <span className="font-bold">{item.count}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Veículos por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Veículos por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.segments.vehiclesByCategory.map((item, index) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.category}</span>
                      <div className="text-right">
                        <span className="font-bold">{item.count}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Vendedores */}
            <Card>
              <CardHeader>
                <CardTitle>Top Vendedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.topSalesReps.map((rep, index) => (
                    <div key={rep.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{rep.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rep.deals} vendas • {formatCurrency(rep.revenue)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {rep.conversion}% conversão
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.performance.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sales} vendas • {formatCurrency(product.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Crescimento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Tendência de Crescimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Contatos</h4>
                    <div className="flex items-center gap-2">
                      {analyticsData.trends.contactsGrowth.map((value, index) => (
                        <div key={index} className="flex-1 text-center">
                          <div 
                            className="bg-blue-500 rounded-t"
                            style={{ height: `${(value / 156) * 60}px`, minHeight: '10px' }}
                          />
                          <p className="text-xs mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Empresas</h4>
                    <div className="flex items-center gap-2">
                      {analyticsData.trends.companiesGrowth.map((value, index) => (
                        <div key={index} className="flex-1 text-center">
                          <div 
                            className="bg-green-500 rounded-t"
                            style={{ height: `${(value / 43) * 60}px`, minHeight: '10px' }}
                          />
                          <p className="text-xs mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Veículos</h4>
                    <div className="flex items-center gap-2">
                      {analyticsData.trends.vehiclesGrowth.map((value, index) => (
                        <div key={index} className="flex-1 text-center">
                          <div 
                            className="bg-purple-500 rounded-t"
                            style={{ height: `${(value / 89) * 60}px`, minHeight: '10px' }}
                          />
                          <p className="text-xs mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previsões */}
            <Card>
              <CardHeader>
                <CardTitle>Previsões e Metas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Meta de Contatos (200)</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Meta de Empresas (50)</span>
                      <span>86%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '86%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Meta de Receita (R$ 3M)</span>
                      <span>82%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Projeções</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-yellow-800">• Meta de contatos será atingida em 15 dias</p>
                    <p className="text-yellow-800">• Receita projetada: {formatCurrency(2980000)} até fim do mês</p>
                    <p className="text-yellow-800">• Crescimento esperado: +18% no próximo trimestre</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Relatórios Personalizados */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Personalizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>Relatório de Vendas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <PieChart className="h-6 w-6 mb-2" />
              <span>Análise de Segmentos</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Projeções Futuras</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}