import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  UserPlus, 
  Building, 
  Search,
  Calendar,
  Mail,
  Phone,
  MapPin,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { ContactData } from './ContactWizardComponent';
import { CompanyData } from './CompanyWizardComponent';

interface CRMDashboardProps {
  contacts?: ContactData[];
  companies?: CompanyData[];
  matches?: any[];
  onNewContact?: () => void;
  onNewCompany?: () => void;
  onStartMatching?: () => void;
  className?: string;
}

export const CRMDashboardComponent: React.FC<CRMDashboardProps> = ({
  contacts = [],
  companies = [],
  matches = [],
  onNewContact,
  onNewCompany,
  onStartMatching,
  className = ""
}) => {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Calculate statistics
  const stats = {
    totalContacts: contacts.length,
    totalCompanies: companies.length,
    totalMatches: matches.length,
    contactsThisMonth: contacts.filter(c => {
      const createdAt = new Date(c.id || Date.now());
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length,
    companiesThisMonth: companies.filter(c => {
      const createdAt = new Date(c.id || Date.now());
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length
  };

  // Get state distribution
  const stateDistribution = contacts.reduce((acc, contact) => {
    if (contact.estado) {
      acc[contact.estado] = (acc[contact.estado] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Get segment distribution
  const segmentDistribution = companies.reduce((acc, company) => {
    if (company.segmento) {
      acc[company.segmento] = (acc[company.segmento] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Recent contacts
  const recentContacts = contacts
    .sort((a, b) => new Date(b.id || 0).getTime() - new Date(a.id || 0).getTime())
    .slice(0, 5);

  // Recent companies
  const recentCompanies = companies
    .sort((a, b) => new Date(b.id || 0).getTime() - new Date(a.id || 0).getTime())
    .slice(0, 5);

  useEffect(() => {
    // Simulate recent activity
    const activities = [
      { type: 'contact', action: 'Novo contato cadastrado', time: '2 horas atrás' },
      { type: 'company', action: 'Empresa atualizada', time: '4 horas atrás' },
      { type: 'match', action: 'Correspondência confirmada', time: '1 dia atrás' },
      { type: 'contact', action: 'Contato editado', time: '2 dias atrás' },
      { type: 'company', action: 'Nova empresa cadastrada', time: '3 dias atrás' }
    ];
    setRecentActivity(activities);
  }, [contacts, companies, matches]);

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard CRM</h1>
          <p className="text-muted-foreground">Visão geral do seu sistema de relacionamento</p>
        </div>
        <div className="flex gap-2">
          {onNewContact && (
            <Button onClick={onNewContact}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Contato
            </Button>
          )}
          {onNewCompany && (
            <Button onClick={onNewCompany} variant="outline">
              <Building className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.contactsThisMonth} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.companiesThisMonth} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correspondências</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              Conexões identificadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalContacts > 0 ? Math.round((stats.totalMatches / stats.totalContacts) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Contatos com match
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="companies">Empresas</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'contact' ? 'bg-blue-500' :
                      activity.type === 'company' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {onNewContact && (
                  <Button onClick={onNewContact} className="w-full justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastrar Novo Contato
                  </Button>
                )}
                {onNewCompany && (
                  <Button onClick={onNewCompany} variant="outline" className="w-full justify-start">
                    <Building className="h-4 w-4 mr-2" />
                    Cadastrar Nova Empresa
                  </Button>
                )}
                {onStartMatching && (
                  <Button onClick={onStartMatching} variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Executar Correspondência
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contatos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentContacts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum contato cadastrado
                  </p>
                ) : (
                  recentContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{contact.nome}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                        {contact.cargo && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {contact.cargo}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Contacts by State */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Contatos por Estado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(stateDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([state, count]) => (
                    <div key={state} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{state}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(count / stats.totalContacts) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Empresas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCompanies.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma empresa cadastrada
                  </p>
                ) : (
                  recentCompanies.map((company) => (
                    <div key={company.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{company.nomeFantasia}</p>
                        <p className="text-sm text-muted-foreground">{company.email}</p>
                        <div className="flex gap-2 mt-1">
                          {company.segmento && (
                            <Badge variant="secondary" className="text-xs">
                              {company.segmento}
                            </Badge>
                          )}
                          {company.porte && (
                            <Badge variant="outline" className="text-xs">
                              {company.porte}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Companies by Segment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Empresas por Segmento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(segmentDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([segment, count]) => (
                    <div key={segment} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{segment}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${(count / stats.totalCompanies) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Métricas de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalContacts}</div>
                    <p className="text-sm text-muted-foreground">Total de Contatos</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.totalCompanies}</div>
                    <p className="text-sm text-muted-foreground">Total de Empresas</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalMatches}</div>
                    <p className="text-sm text-muted-foreground">Correspondências</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.totalContacts > 0 ? Math.round((stats.totalMatches / stats.totalContacts) * 100) : 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">Taxa de Match</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growth Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Crescimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Contatos este mês</span>
                    <span className="font-medium">+{stats.contactsThisMonth}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min((stats.contactsThisMonth / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Empresas este mês</span>
                    <span className="font-medium">+{stats.companiesThisMonth}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min((stats.companiesThisMonth / 5) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMDashboardComponent;