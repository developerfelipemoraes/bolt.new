import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Users,
  FileText,
  Shield,
  Truck,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';
import { CompanyData } from '../types/company';

interface CompanyProfileProps {
  companyData: CompanyData;
  onEdit: () => void;
  onExport: () => void;
  onBack: () => void;
}

export default function CompanyProfile({ companyData, onEdit, onExport, onBack }: CompanyProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getKycColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string): string => {
    return status === 'client' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{companyData.identification?.tradeName || 'Empresa'}</h1>
                <p className="text-gray-600">{companyData.identification?.corporateName || 'N/A'}</p>
                <p className="text-sm text-gray-500">CNPJ: {companyData.identification?.cnpj || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(companyData.status)}>
                {companyData.status === 'client' ? 'Cliente' : 'Prospect'}
              </Badge>
              {companyData.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
              <Button onClick={onEdit} variant="outline">
                Editar Cadastro
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completude</p>
                    <p className="text-2xl font-bold">{companyData.completeness}%</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <Progress value={companyData.completeness} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ticket Médio</p>
                    <p className="text-2xl font-bold">{formatCurrency(companyData.monthlyTicket)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Veículos</p>
                    <p className="text-2xl font-bold">{companyData.vehicleCount}</p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Crédito</p>
                    <p className="text-2xl font-bold">{formatCurrency(companyData.credit)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Score KYC</p>
                    <p className={`text-2xl font-bold ${getKycColor(companyData.kycScore)}`}>
                      {companyData.kycScore}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Próxima revisão: {formatDate(companyData.nextReview)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="fleet">Frota & KYC</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{companyData.primaryEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{companyData.phone}</span>
                  </div>
                  {companyData.whatsapp && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>WhatsApp: {companyData.whatsapp}</span>
                    </div>
                  )}
                  {companyData.website && (
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 text-gray-500">🌐</span>
                      <span>{companyData.website}</span>
                    </div>
                  )}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Contatos-chave:</h4>
                    {companyData.keyContacts.map((contact, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded mb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{contact.name}</span>
                          <Badge variant="outline" className="capitalize text-xs">
                            {contact.role === 'fiscal' ? 'Fiscal' :
                             contact.role === 'financial' ? 'Financeiro' :
                             contact.role === 'logistics' ? 'Logística' : 'Comercial'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Endereço e Dados Cadastrais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Endereço:</span>
                    <p className="text-gray-600">
                      {companyData.commercialAddress?.street}, {companyData.commercialAddress?.number}
                      {companyData.commercialAddress?.complement && `, ${companyData.commercialAddress.complement}`}
                    </p>
                    <p className="text-gray-600">{companyData.commercialAddress?.neighborhood}</p>
                    <p className="text-gray-600">
                      {companyData.commercialAddress?.city} - {companyData.commercialAddress?.state} | CEP: {companyData.commercialAddress?.zipCode}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">CNPJ:</span>
                    <p className="text-gray-600">{companyData.cnpj}</p>
                  </div>
                  {companyData.stateRegistration && (
                    <div>
                      <span className="font-medium">IE:</span>
                      <p className="text-gray-600">{companyData.stateRegistration}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Porte:</span>
                    <p className="text-gray-600">{companyData.companySize} | {companyData.taxRegime}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fleet" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Score KYC da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={`text-4xl font-bold ${getKycColor(companyData.kycScore)}`}>
                        {companyData.kycScore}/100
                      </p>
                      <p className="text-sm text-gray-600">Próxima revisão: {formatDate(companyData.nextReview)}</p>
                    </div>
                    <div className="text-right">
                      <Progress value={companyData.kycScore} className="w-32 mb-2" />
                      <Badge variant={companyData.kycScore >= 80 ? 'default' : companyData.kycScore >= 60 ? 'secondary' : 'destructive'}>
                        {companyData.kycScore >= 80 ? 'Excelente' : companyData.kycScore >= 60 ? 'Bom' : 'Atenção'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Frota de Veículos ({companyData.vehicles.length})
                  </CardTitle>
                  <CardDescription>
                    {companyData.currentFleet}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companyData.vehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">{vehicle.type}</CardTitle>
                            <Badge 
                              variant={vehicle.status === 'active' ? 'default' : 
                                     vehicle.status === 'pending' ? 'secondary' : 'outline'}
                            >
                              {vehicle.status === 'active' ? 'Ativo' :
                               vehicle.status === 'pending' ? 'Pendente' : 'Inativo'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          <div className="text-sm">
                            <p className="font-medium">{vehicle.model}</p>
                            <p className="text-gray-600">{vehicle.year} | {vehicle.plate}</p>
                            <p className="text-gray-600">Uso: {vehicle.usage}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">KYC Score:</span>
                            <span className={`font-bold ${getKycColor(vehicle.kycScore)}`}>
                              {vehicle.kycScore}
                            </span>
                          </div>

                          {vehicle.pendencies.length > 0 && (
                            <div className="bg-red-50 p-2 rounded">
                              <div className="flex items-center gap-1 mb-1">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                <span className="text-xs font-medium text-red-700">Pendências</span>
                              </div>
                              {vehicle.pendencies.map((pendency, index) => (
                                <p key={index} className="text-xs text-red-600">• {pendency}</p>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Dados Financeiros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Capital Social</p>
                      <p className="text-lg font-bold">{formatCurrency(companyData.socialCapital)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Patrimônio Líquido</p>
                      <p className="text-lg font-bold">{formatCurrency(companyData.netWorth)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Faturamento 12m</p>
                      <p className="text-lg font-bold">{formatCurrency(companyData.revenue12m)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Limite de Crédito</p>
                      <p className="text-lg font-bold">{formatCurrency(companyData.creditLimit)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Condição de Pagamento</p>
                    <p className="font-medium">{companyData.paymentTerms}</p>
                  </div>
                  {companyData.relevantAssets && (
                    <div>
                      <p className="text-sm text-gray-600">Bens & Valores Relevantes</p>
                      <p className="text-gray-800">{companyData.relevantAssets}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dados Bancários</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Conta Principal:</span>
                    <p className="text-gray-600">
                      {companyData.primaryBankAccount.bank} | Ag: {companyData.primaryBankAccount.agency} | 
                      Conta: {companyData.primaryBankAccount.account}
                    </p>
                  </div>
                  {companyData.secondaryBankAccount?.bank && (
                    <div>
                      <span className="font-medium">Conta Secundária:</span>
                      <p className="text-gray-600">
                        {companyData.secondaryBankAccount.bank} | Ag: {companyData.secondaryBankAccount.agency} | 
                        Conta: {companyData.secondaryBankAccount.account}
                      </p>
                    </div>
                  )}
                  {companyData.pixKey && (
                    <div>
                      <span className="font-medium">Chave PIX:</span>
                      <p className="text-gray-600">{companyData.pixKey}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentos Anexados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(companyData.documents).map(([key, filename]) => (
                    <div key={key} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-800">
                          {key === 'cnpjCard' ? 'Cartão CNPJ' :
                           key === 'socialContract' ? 'Contrato Social' :
                           key === 'registrations' ? 'IE / IM' :
                           key === 'addressProof' ? 'Comprovante de Endereço' :
                           key === 'clearances' ? 'CNDs' :
                           key === 'powerOfAttorney' ? 'Procuração' :
                           key === 'digitalCertificate' ? 'Certificado Digital' :
                           key === 'licenses' ? 'RNTRC / Licenças' : key}
                        </p>
                        <p className="text-sm text-green-600">{filename}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {Object.keys(companyData.documents).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum documento anexado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}