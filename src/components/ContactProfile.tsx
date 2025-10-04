import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  FileText, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CreditCard, 
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Edit,
  Download,
  Building
} from 'lucide-react';
import { ContactData } from '../types/contact';
import { formatCurrency, calculateAge } from '../utils/validators';

interface ContactProfileProps {
  contactData: ContactData;
  onEdit: () => void;
  onExport: () => void;
}

export default function ContactProfile({ contactData, onEdit, onExport }: ContactProfileProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Calculate KYC Score
  const calculateKYCScore = (): number => {
    let score = 0;
    
    // Identification (30 points)
    if (contactData.personal?.fullName && contactData.personal?.cpf) score += 20;
    if (contactData.documents?.type && contactData.documents?.number) score += 10;
    
    // Address & Contact (20 points)
    if (contactData.address?.street && contactData.address?.city && contactData.address?.zipCode) score += 15;
    if (contactData.address?.email) score += 5;
    
    // Professional & Income (20 points)
    if (contactData.professional?.occupation) score += 10;
    if (contactData.financial?.totalIncome && contactData.financial.totalIncome > 0) score += 10;
    
    // Banking (10 points)
    if (contactData.banking?.primaryAccount?.bank) score += 10;
    
    // Compliance (10 points)
    if (!contactData.compliance?.isPep) score += 5;
    const complianceCount = [
      contactData.compliance?.authorizeConsultations,
      contactData.compliance?.declareAccuracy,
      contactData.compliance?.commitToUpdate,
      contactData.compliance?.coafAwareness
    ].filter(Boolean).length;
    score += Math.round((complianceCount / 4) * 5);
    
    // Attachments (10 points)
    let attachmentScore = 0;
    if (contactData.documents?.attachmentName) attachmentScore += 4;
    if (contactData.address?.proofAttachment) attachmentScore += 3;
    if (contactData.professional?.incomeProof) attachmentScore += 3;
    score += attachmentScore;
    
    return Math.min(score, 100);
  };

  const kycScore = calculateKYCScore();
  const getKYCClassification = (score: number): { type: 'ok' | 'atenção' | 'alto risco', color: string, nextReview: string } => {
    if (score >= 80) {
      return { type: 'ok', color: 'text-green-600', nextReview: '365 dias' };
    } else if (score >= 60) {
      return { type: 'atenção', color: 'text-yellow-600', nextReview: '180 dias' };
    } else {
      return { type: 'alto risco', color: 'text-red-600', nextReview: '90 dias' };
    }
  };

  const kycClassification = getKYCClassification(kycScore);

  const getPendencies = (): string[] => {
    const pendencies: string[] = [];
    
    if (!contactData.documents?.attachmentName) pendencies.push('Documento de identidade');
    if (!contactData.address?.proofAttachment) pendencies.push('Comprovante de endereço');
    if (!contactData.professional?.incomeProof) pendencies.push('Comprovante de renda');
    if (!contactData.banking?.primaryAccount?.bank) pendencies.push('Conta bancária');
    if (contactData.compliance?.isPep) pendencies.push('Revisão PEP');
    
    return pendencies;
  };

  const pendencies = getPendencies();
  const totalAssets = contactData.financial?.assets?.reduce((sum, asset) => sum + asset.value, 0) || 0;

  return (
    <div className={`min-h-screen py-8 transition-colors ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Perfil 360° - {contactData.personal?.fullName}
            </h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              CPF: {contactData.personal?.cpf} | Cadastrado em {new Date(contactData.createdAt || Date.now()).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              variant="outline"
              size="sm"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
            <Button onClick={onExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{contactData.completeness || Math.round((Object.keys(contactData).length / 15) * 100)}%</div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completude</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {contactData.financial?.totalIncome ? formatCurrency(contactData.financial.totalIncome) : 'N/A'}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Renda Mensal</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {contactData.financial?.assets?.length || 0}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Bens Declarados</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${kycClassification.color}`}>
                {kycScore}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Score KYC</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${contactData.compliance?.isPep ? 'text-red-600' : 'text-green-600'}`}>
                {contactData.compliance?.isPep ? 'PEP' : 'OK'}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Compliance</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="kyc">KYC & Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                    <User className="w-5 h-5" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Nome:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{contactData.personal?.fullName}</p>
                    </div>
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>CPF:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{contactData.personal?.cpf}</p>
                    </div>
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Nascimento:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>
                        {contactData.personal?.birthDate ? new Date(contactData.personal.birthDate).toLocaleDateString('pt-BR') : 'N/A'}
                        {contactData.personal?.birthDate && (
                          <span className="ml-2 text-gray-500">
                            ({calculateAge(contactData.personal.birthDate)} anos)
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Estado Civil:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{contactData.personal?.maritalStatus || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                    <MapPin className="w-5 h-5" />
                    Contato & Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Endereço:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>
                        {contactData.address?.street}
                        {contactData.address?.number && `, ${contactData.address.number}`}
                        {contactData.address?.complement && `, ${contactData.address.complement}`}
                      </p>
                      <p className={isDarkMode ? 'text-white' : ''}>
                        {contactData.address?.neighborhood && `${contactData.address.neighborhood}, `}
                        {contactData.address?.city} - {contactData.address?.state}
                      </p>
                      <p className={isDarkMode ? 'text-white' : ''}>{contactData.address?.zipCode}</p>
                    </div>
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>E-mail:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{contactData.address?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Telefone:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{contactData.address?.mobile || contactData.address?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                    <DollarSign className="w-5 h-5" />
                    Informações Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Salário/Pró-labore:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{formatCurrency(contactData.financial?.salary || 0)}</p>
                    </div>
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Outros Rendimentos:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{formatCurrency(contactData.financial?.otherIncome || 0)}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Renda Total:</span>
                      <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : ''}`}>{formatCurrency(contactData.financial?.totalIncome || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                    <CreditCard className="w-5 h-5" />
                    Informações Bancárias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Conta Principal:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{contactData.banking?.primaryAccount?.bank || 'N/A'}</p>
                    </div>
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Chave PIX:</span>
                      <p className={isDarkMode ? 'text-white' : ''}>{contactData.banking?.pixKey || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assets */}
            {contactData.financial?.assets && contactData.financial.assets.length > 0 && (
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : ''}>Bens e Patrimônio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contactData.financial.assets.map((asset, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{asset.type}</p>
                          <p className="text-sm text-gray-600">{asset.description}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(asset.value)}</p>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(totalAssets)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                  <FileText className="w-5 h-5" />
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Documento de Identidade</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {contactData.documents?.type} - {contactData.documents?.number}
                    </p>
                    <Badge variant={contactData.documents?.attachmentName ? "default" : "secondary"}>
                      {contactData.documents?.attachmentName ? 'Anexado' : 'Pendente'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Comprovante de Endereço</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comprovante residencial</p>
                    <Badge variant={contactData.address?.proofAttachment ? "default" : "secondary"}>
                      {contactData.address?.proofAttachment ? 'Anexado' : 'Pendente'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Comprovante de Renda</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Holerite ou declaração</p>
                    <Badge variant={contactData.professional?.incomeProof ? "default" : "secondary"}>
                      {contactData.professional?.incomeProof ? 'Anexado' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                    <Shield className="w-5 h-5" />
                    Score KYC
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className={`text-6xl font-bold ${kycClassification.color}`}>
                      {kycScore}
                    </div>
                    <Badge 
                      variant={kycClassification.type === 'ok' ? 'default' : kycClassification.type === 'atenção' ? 'secondary' : 'destructive'}
                      className="text-lg px-4 py-2"
                    >
                      {kycClassification.type.toUpperCase()}
                    </Badge>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Próxima revisão: {kycClassification.nextReview}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? 'text-white' : ''}>Pendências</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendencies.length > 0 ? (
                    <div className="space-y-2">
                      {pendencies.map((pendency, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className={`text-sm ${isDarkMode ? 'text-white' : ''}`}>{pendency}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Nenhuma pendência identificada</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Compliance Status */}
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={isDarkMode ? 'text-white' : ''}>Status de Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${contactData.compliance?.isPep ? 'text-red-600' : 'text-green-600'}`}>
                      {contactData.compliance?.isPep ? 'PEP' : 'Não PEP'}
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status PEP</p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${contactData.compliance?.hasPepRelationship ? 'text-yellow-600' : 'text-green-600'}`}>
                      {contactData.compliance?.hasPepRelationship ? 'Sim' : 'Não'}
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Relacionamento PEP</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {[
                        contactData.compliance?.authorizeConsultations,
                        contactData.compliance?.declareAccuracy,
                        contactData.compliance?.commitToUpdate,
                        contactData.compliance?.coafAwareness
                      ].filter(Boolean).length}/4
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Aceites</p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${new Date() > new Date(contactData.nextReview || '') ? 'text-red-600' : 'text-green-600'}`}>
                      {new Date(contactData.nextReview || Date.now()).toLocaleDateString('pt-BR')}
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Próxima Revisão</p>
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