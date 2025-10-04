import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ContactWizardComponent,
  CompanyWizardComponent,
  SmartMatchingComponent,
  ContactListComponent,
  CompanyListComponent,
  CRMDashboardComponent,
  type ContactData,
  type CompanyData
} from '@/components/CRMComponents';
import { UserMenu, useAuth } from '@/components/auth';
import { 
  Users, 
  Building2, 
  Search, 
  BarChart3,
  UserPlus,
  Building,
  Sparkles,
  Crown,
  Shield,
  Info
} from 'lucide-react';

export default function CRMTestPage() {
  const { user, isAurovel, hasPermission, canAccessCompany } = useAuth();
  const [contacts, setContacts] = useState<ContactData[]>([
    {
      id: '1',
      nome: 'João Silva',
      cpf: '123.456.789-00',
      email: 'joao.silva@email.com',
      celular: '(11) 99999-9999',
      cep: '01234-567',
      endereco: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cargo: 'Gerente de Vendas',
      empresa: 'Tech Solutions Ltda',
      departamento: 'Comercial'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      email: 'maria.santos@email.com',
      celular: '(11) 88888-8888',
      cep: '04567-890',
      endereco: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cargo: 'Diretora de Marketing',
      empresa: 'Inovação Digital',
      departamento: 'Marketing'
    }
  ]);

  const [companies, setCompanies] = useState<CompanyData[]>([
    {
      id: '1',
      nomeFantasia: 'Tech Solutions',
      razaoSocial: 'Tech Solutions Ltda',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techsolutions.com',
      telefone: '(11) 3333-3333',
      cep: '01234-567',
      endereco: 'Rua Comercial',
      numero: '456',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      segmento: 'Tecnologia',
      porte: 'Média',
      faturamento: 'R$ 1M - R$ 5M',
      numeroFuncionarios: '50-100'
    },
    {
      id: '2',
      nomeFantasia: 'Inovação Digital',
      razaoSocial: 'Inovação Digital S.A.',
      cnpj: '98.765.432/0001-10',
      email: 'info@inovacaodigital.com',
      telefone: '(11) 4444-4444',
      cep: '04567-890',
      endereco: 'Av. Inovação',
      numero: '2000',
      bairro: 'Vila Olímpia',
      cidade: 'São Paulo',
      estado: 'SP',
      segmento: 'Marketing Digital',
      porte: 'Grande',
      faturamento: 'R$ 5M+',
      numeroFuncionarios: '100+'
    }
  ]);

  const [matches, setMatches] = useState([
    {
      contact: contacts[0],
      company: companies[0],
      score: 95,
      reasons: ['Mesmo segmento', 'Localização próxima', 'Cargo compatível']
    }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showContactWizard, setShowContactWizard] = useState(false);
  const [showCompanyWizard, setShowCompanyWizard] = useState(false);
  const [showMatching, setShowMatching] = useState(false);

  const handleNewContact = (contactData: ContactData) => {
    const newContact = { ...contactData, id: Date.now().toString() };
    setContacts(prev => [...prev, newContact]);
    setShowContactWizard(false);
    setActiveTab('contacts');
  };

  const handleNewCompany = (companyData: CompanyData) => {
    const newCompany = { ...companyData, id: Date.now().toString() };
    setCompanies(prev => [...prev, newCompany]);
    setShowCompanyWizard(false);
    setActiveTab('companies');
  };

  const handleEditContact = (contact: ContactData) => {
    console.log('Editar contato:', contact);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  };

  const handleEditCompany = (company: CompanyData) => {
    console.log('Editar empresa:', company);
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId));
  };

  const handleStartMatching = () => {
    setShowMatching(true);
    setActiveTab('matching');
  };

  if (showContactWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowContactWizard(false)}
              className="mb-4"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
          <ContactWizardComponent
            onSubmit={handleNewContact}
            onCancel={() => setShowContactWizard(false)}
          />
        </div>
      </div>
    );
  }

  if (showCompanyWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowCompanyWizard(false)}
              className="mb-4"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
          <CompanyWizardComponent
            onSubmit={handleNewCompany}
            onCancel={() => setShowCompanyWizard(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${isAurovel ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-lg flex items-center justify-center`}>
                {isAurovel ? <Crown className="h-6 w-6 text-white" /> : <Sparkles className="h-6 w-6 text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isAurovel ? 'CRM Master Control' : 'CRM Sistema'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isAurovel ? 'Controle Total - Aurovel' : `${user?.companyData.name} - Sistema CRM`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAurovel && (
                <Badge variant="default" className="bg-purple-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Controle Total
                </Badge>
              )}
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {contacts.length} Contatos
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {companies.length} Empresas
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {matches.length} Matches
              </Badge>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Access Control Info */}
      {isAurovel && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <Alert className="border-purple-200 bg-purple-50">
            <Crown className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>Modo Aurovel:</strong> Você tem controle total do sistema e pode acessar dados de todas as empresas.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Contatos
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresas
            </TabsTrigger>
            <TabsTrigger value="matching" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Matching
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Ações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <CRMDashboardComponent
              contacts={contacts}
              companies={companies}
              matches={matches}
              onNewContact={() => setShowContactWizard(true)}
              onNewCompany={() => setShowCompanyWizard(true)}
              onStartMatching={handleStartMatching}
            />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactListComponent
              contacts={contacts}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyListComponent
              companies={companies}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
            />
          </TabsContent>

          <TabsContent value="matching">
            <SmartMatchingComponent
              contacts={contacts}
              companies={companies}
              onMatchConfirmed={(newMatches) => {
                setMatches(prev => [...prev, ...newMatches]);
              }}
            />
          </TabsContent>

          <TabsContent value="actions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowContactWizard(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    Novo Contato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cadastrar um novo contato usando o wizard completo com validações.
                  </p>
                  <Button className="w-full mt-4">
                    Abrir Wizard de Contato
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowCompanyWizard(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-green-600" />
                    Nova Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cadastrar uma nova empresa usando o wizard completo com validações.
                  </p>
                  <Button variant="outline" className="w-full mt-4">
                    Abrir Wizard de Empresa
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleStartMatching}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-purple-600" />
                    Executar Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Executar o algoritmo de correspondência inteligente entre contatos e empresas.
                  </p>
                  <Button variant="outline" className="w-full mt-4">
                    Iniciar Correspondência
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Instruções */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>📋 Instruções de Teste</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">🎯 Funcionalidades Testáveis:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Dashboard com estatísticas em tempo real</li>
                      <li>• Wizard de cadastro de contatos (5 etapas)</li>
                      <li>• Wizard de cadastro de empresas (5 etapas)</li>
                      <li>• Sistema de matching inteligente</li>
                      <li>• Listas com busca e filtros</li>
                      <li>• Modais de detalhes expandidos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">✅ Validações Implementadas:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• CPF e CNPJ com validação real</li>
                      <li>• Email com formato válido</li>
                      <li>• CEP com busca automática</li>
                      <li>• Campos obrigatórios</li>
                      <li>• Formatação automática de campos</li>
                      <li>• Feedback visual de erros</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}