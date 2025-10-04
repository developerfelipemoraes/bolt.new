import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, User, FileText, MapPin, Briefcase, Mail, DollarSign, CreditCard, Shield } from 'lucide-react';
import { ContactData } from '../../types/contact';
import { validateCPF, validateEmail, validateCEP, formatCurrency } from '../../utils/validators';

interface ReviewStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
  onComplete: () => void;
}

export default function ReviewStep({ data, onComplete }: ReviewStepProps) {
  const validationResults = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Personal Data Validation
    if (!data.personal?.fullName) errors.push('Nome completo é obrigatório');
    if (!data.personal?.cpf) errors.push('CPF é obrigatório');
    if (data.personal?.cpf && !validateCPF(data.personal.cpf)) errors.push('CPF inválido');
    if (!data.personal?.birthDate) errors.push('Data de nascimento é obrigatória');

    // Address Validation
    if (!data.address?.street) errors.push('Logradouro é obrigatório');
    if (!data.address?.city) errors.push('Cidade é obrigatória');
    if (!data.address?.state) errors.push('UF é obrigatória');
    if (!data.address?.zipCode) errors.push('CEP é obrigatório');
    if (data.address?.zipCode && !validateCEP(data.address.zipCode)) errors.push('CEP inválido');
    if (data.address?.email && !validateEmail(data.address.email)) errors.push('E-mail inválido');

    // Compliance Validation
    if (!data.compliance?.authorizeConsultations) errors.push('Autorização para consultas é obrigatória');
    if (!data.compliance?.declareAccuracy) errors.push('Declaração de veracidade é obrigatória');
    if (!data.compliance?.commitToUpdate) errors.push('Compromisso de atualização é obrigatório');
    if (!data.compliance?.coafAwareness) errors.push('Ciência sobre COAF é obrigatória');

    // Warnings
    if (!data.documents?.attachmentName) warnings.push('Documento de identidade não anexado');
    if (!data.address?.proofAttachment) warnings.push('Comprovante de endereço não anexado');
    if (!data.professional?.incomeProof) warnings.push('Comprovante de renda não anexado');
    if (!data.banking?.primaryAccount?.bank) warnings.push('Conta bancária principal não informada');

    return { errors, warnings };
  }, [data]);

  const completeness = useMemo(() => {
    const totalFields = 50; // Approximate total number of fields
    let filledFields = 0;

    // Count filled fields
    if (data.personal?.fullName) filledFields++;
    if (data.personal?.cpf) filledFields++;
    if (data.personal?.birthDate) filledFields++;
    if (data.personal?.gender) filledFields++;
    if (data.personal?.nationality) filledFields++;
    if (data.personal?.birthPlace) filledFields++;
    if (data.personal?.motherName) filledFields++;
    if (data.personal?.fatherName) filledFields++;
    if (data.personal?.maritalStatus) filledFields++;

    if (data.documents?.type) filledFields++;
    if (data.documents?.number) filledFields++;
    if (data.documents?.attachmentName) filledFields++;

    if (data.address?.street) filledFields++;
    if (data.address?.city) filledFields++;
    if (data.address?.state) filledFields++;
    if (data.address?.zipCode) filledFields++;
    if (data.address?.email) filledFields++;
    if (data.address?.mobile) filledFields++;

    if (data.professional?.occupation) filledFields += 2;
    if (data.professional?.company) filledFields += 2;

    if (data.correspondence?.type) filledFields++;

    if (data.financial?.salary) filledFields++;
    if (data.financial?.totalIncome) filledFields++;
    if (data.financial?.assets && data.financial.assets.length > 0) filledFields += 3;

    if (data.banking?.primaryAccount?.bank) filledFields += 3;
    if (data.banking?.pixKey) filledFields++;

    if (data.compliance?.authorizeConsultations) filledFields++;
    if (data.compliance?.declareAccuracy) filledFields++;
    if (data.compliance?.commitToUpdate) filledFields++;
    if (data.compliance?.coafAwareness) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }, [data]);

  const canComplete = validationResults.errors.length === 0;

  const stepSections = [
    {
      icon: User,
      title: 'Dados Pessoais',
      data: data.personal,
      items: [
        { label: 'Nome', value: data.personal?.fullName },
        { label: 'CPF', value: data.personal?.cpf },
        { label: 'Data de Nascimento', value: data.personal?.birthDate },
        { label: 'Estado Civil', value: data.personal?.maritalStatus },
      ]
    },
    {
      icon: FileText,
      title: 'Documentos',
      data: data.documents,
      items: [
        { label: 'Tipo', value: data.documents?.type },
        { label: 'Número', value: data.documents?.number },
        { label: 'Anexo', value: data.documents?.attachmentName ? 'Enviado' : 'Não enviado' },
      ]
    },
    {
      icon: MapPin,
      title: 'Endereço',
      data: data.address,
      items: [
        { label: 'Logradouro', value: data.address?.street },
        { label: 'Cidade/UF', value: data.address?.city && data.address?.state ? `${data.address.city} - ${data.address.state}` : '' },
        { label: 'CEP', value: data.address?.zipCode },
        { label: 'E-mail', value: data.address?.email },
      ]
    },
    {
      icon: Briefcase,
      title: 'Profissional',
      data: data.professional,
      items: [
        { label: 'Ocupação', value: data.professional?.occupation },
        { label: 'Empresa', value: data.professional?.company },
        { label: 'Comprovante', value: data.professional?.incomeProof ? 'Enviado' : 'Não enviado' },
      ]
    },
    {
      icon: Mail,
      title: 'Correspondência',
      data: data.correspondence,
      items: [
        { label: 'Preferência', value: data.correspondence?.type },
      ]
    },
    {
      icon: DollarSign,
      title: 'Financeiro',
      data: data.financial,
      items: [
        { label: 'Renda Total', value: data.financial?.totalIncome ? formatCurrency(data.financial.totalIncome) : '' },
        { label: 'Bens Declarados', value: data.financial?.assets ? `${data.financial.assets.length} itens` : '0 itens' },
      ]
    },
    {
      icon: CreditCard,
      title: 'Bancário',
      data: data.banking,
      items: [
        { label: 'Conta Principal', value: data.banking?.primaryAccount?.bank },
        { label: 'Chave PIX', value: data.banking?.pixKey },
      ]
    },
    {
      icon: Shield,
      title: 'Compliance',
      data: data.compliance,
      items: [
        { label: 'Status PEP', value: data.compliance?.isPep ? 'PEP Declarado' : 'Não PEP' },
        { label: 'Aceites', value: `${[data.compliance?.authorizeConsultations, data.compliance?.declareAccuracy, data.compliance?.commitToUpdate, data.compliance?.coafAwareness].filter(Boolean).length}/4` },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Completeness and Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{completeness}%</div>
            <p className="text-sm text-gray-600">Completude</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${validationResults.errors.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {validationResults.errors.length === 0 ? 'OK' : validationResults.errors.length}
            </div>
            <p className="text-sm text-gray-600">Pendências</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{validationResults.warnings.length}</div>
            <p className="text-sm text-gray-600">Alertas</p>
          </CardContent>
        </Card>
      </div>

      {/* Errors and Warnings */}
      {validationResults.errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong className="text-red-800">Campos obrigatórios pendentes:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {validationResults.errors.map((error, index) => (
                <li key={index} className="text-red-700">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {validationResults.warnings.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <strong className="text-yellow-800">Recomendações:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {validationResults.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-700">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stepSections.map((section, index) => {
          const Icon = section.icon;
          const hasData = section.items.some(item => item.value);
          
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="w-4 h-4" />
                  {section.title}
                  <Badge variant={hasData ? "secondary" : "outline"} className="ml-auto">
                    {hasData ? 'Preenchido' : 'Pendente'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.label}:</span>
                      <span className="font-medium text-right max-w-[60%] truncate">
                        {item.value || 'Não informado'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Actions */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="text-center space-y-4">
          {canComplete ? (
            <>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Pronto para finalizar!</span>
              </div>
              <p className="text-gray-600">
                Todos os campos obrigatórios foram preenchidos. Clique em "Concluir Cadastro" para finalizar.
              </p>
              <Button onClick={onComplete} size="lg" className="px-8">
                Concluir Cadastro
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 text-red-600">
                <XCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Campos obrigatórios pendentes</span>
              </div>
              <p className="text-gray-600">
                Complete os campos obrigatórios destacados em vermelho para finalizar o cadastro.
              </p>
              <Button disabled size="lg" className="px-8">
                Concluir Cadastro
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}