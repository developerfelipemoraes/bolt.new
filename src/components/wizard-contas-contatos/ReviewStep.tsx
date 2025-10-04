import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { CompanyData } from '../../types/company';

interface ReviewStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
  onComplete: () => void;
}

export default function ReviewStep({ data, onComplete }: ReviewStepProps) {
  const validateData = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!data.corporateName) errors.push('Razão Social é obrigatória');
    if (!data.tradeName) errors.push('Nome Fantasia é obrigatório');
    if (!data.cnpj) errors.push('CNPJ é obrigatório');
    if (!data.primaryEmail) errors.push('E-mail principal é obrigatório');
    if (!data.phone) errors.push('Telefone é obrigatório');
    if (!data.commercialAddress?.street) errors.push('Endereço comercial é obrigatório');
    if (!data.commercialAddress?.city) errors.push('Cidade é obrigatória');
    if (!data.commercialAddress?.state) errors.push('UF é obrigatório');
    if (!data.commercialAddress?.zipCode) errors.push('CEP é obrigatório');
    if (!data.primaryBankAccount?.bank) errors.push('Banco principal é obrigatório');
    if (!data.primaryBankAccount?.agency) errors.push('Agência é obrigatória');
    if (!data.primaryBankAccount?.account) errors.push('Conta bancária é obrigatória');

    // Warnings for recommended fields
    if (!data.stateRegistration && !data.municipalRegistration) {
      warnings.push('Inscrição Estadual ou Municipal recomendada');
    }
    if (!data.keyContacts?.length) warnings.push('Contatos-chave recomendados');
    if (!data.socialCapital) warnings.push('Capital Social recomendado');
    if (!data.documents?.cnpjCard) warnings.push('Cartão CNPJ recomendado');
    if (!data.documents?.socialContract) warnings.push('Contrato Social recomendado');

    return { errors, warnings };
  };

  const { errors, warnings } = validateData();
  const canSubmit = errors.length === 0;

  const calculateCompleteness = (): number => {
    const totalFields = 50;
    let filledFields = 0;

    if (data.corporateName) filledFields++;
    if (data.tradeName) filledFields++;
    if (data.cnpj) filledFields++;
    if (data.primaryEmail) filledFields++;
    if (data.phone) filledFields++;
    if (data.commercialAddress?.street) filledFields++;
    if (data.commercialAddress?.city) filledFields++;
    if (data.commercialAddress?.state) filledFields++;
    if (data.commercialAddress?.zipCode) filledFields++;
    if (data.primaryBankAccount?.bank) filledFields++;
    if (data.primaryBankAccount?.agency) filledFields++;
    if (data.primaryBankAccount?.account) filledFields++;
    if (data.stateRegistration) filledFields++;
    if (data.municipalRegistration) filledFields++;
    if (data.primaryCnae) filledFields++;
    if (data.legalNature) filledFields++;
    if (data.incorporationDate) filledFields++;
    if (data.whatsapp) filledFields++;
    if (data.website) filledFields++;
    if (data.keyContacts?.length) filledFields += Math.min(data.keyContacts.length, 4);
    if (data.accountingOffice?.companyName) filledFields++;
    if (data.finalBeneficiaries?.length) filledFields += Math.min(data.finalBeneficiaries.length * 2, 6);
    if (data.administrators?.length) filledFields += Math.min(data.administrators.length * 2, 4);
    if (data.socialCapital) filledFields++;
    if (data.netWorth) filledFields++;
    if (data.revenue12m) filledFields++;
    if (data.creditLimit) filledFields++;
    if (data.paymentTerms) filledFields++;
    if (data.secondaryBankAccount?.bank) filledFields++;
    if (data.pixKey) filledFields++;
    if (data.businessLine) filledFields++;
    if (data.currentFleet) filledFields++;
    if (data.intendedUse) filledFields++;
    if (data.preferredBrands) filledFields++;
    if (data.interestCategories?.length) filledFields++;
    if (data.rntrc) filledFields++;
    if (data.operatingLicense) filledFields++;
    if (data.insurances?.length) filledFields += Math.min(data.insurances.length, 3);
    if (data.dpoName) filledFields++;
    if (data.legalBasis) filledFields++;

    const documentCount = Object.keys(data.documents || {}).length;
    filledFields += Math.min(documentCount, 8);

    return Math.min(Math.round((filledFields / totalFields) * 100), 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {canSubmit ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            Validação do Cadastro
          </CardTitle>
          <CardDescription>
            Status da completude: {completeness}%
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Campos obrigatórios pendentes:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Recomendações:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {canSubmit && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Cadastro válido! Todos os campos obrigatórios foram preenchidos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Razão Social:</strong> {data.corporateName || 'Não informado'}</p>
            <p><strong>Nome Fantasia:</strong> {data.tradeName || 'Não informado'}</p>
            <p><strong>CNPJ:</strong> {data.cnpj || 'Não informado'}</p>
            <p><strong>Porte:</strong> {data.companySize || 'Não informado'}</p>
            <p><strong>Regime Tributário:</strong> {data.taxRegime || 'Não informado'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contatos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>E-mail:</strong> {data.primaryEmail || 'Não informado'}</p>
            <p><strong>Telefone:</strong> {data.phone || 'Não informado'}</p>
            <p><strong>WhatsApp:</strong> {data.whatsapp || 'Não informado'}</p>
            <p><strong>Website:</strong> {data.website || 'Não informado'}</p>
            <p><strong>Contatos-chave:</strong> {data.keyContacts?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Logradouro:</strong> {data.commercialAddress?.street || 'Não informado'}</p>
            <p><strong>Cidade:</strong> {data.commercialAddress?.city || 'Não informado'}</p>
            <p><strong>UF:</strong> {data.commercialAddress?.state || 'Não informado'}</p>
            <p><strong>CEP:</strong> {data.commercialAddress?.zipCode || 'Não informado'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Capital Social:</strong> {data.socialCapital ? `R$ ${data.socialCapital.toLocaleString('pt-BR')}` : 'Não informado'}</p>
            <p><strong>Faturamento 12m:</strong> {data.revenue12m ? `R$ ${data.revenue12m.toLocaleString('pt-BR')}` : 'Não informado'}</p>
            <p><strong>Limite de Crédito:</strong> {data.creditLimit ? `R$ ${data.creditLimit.toLocaleString('pt-BR')}` : 'Não informado'}</p>
            <p><strong>Condição Pagamento:</strong> {data.paymentTerms || 'Não informado'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Documents Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos Anexados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(data.documents || {}).map(([key, filename]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{filename}</span>
              </div>
            ))}
            {Object.keys(data.documents || {}).length === 0 && (
              <p className="text-gray-500">Nenhum documento anexado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={onComplete}
          disabled={!canSubmit}
          size="lg"
          className="px-8"
        >
          {canSubmit ? 'Concluir & Gerar Perfil' : 'Complete os campos obrigatórios'}
        </Button>
      </div>
    </div>
  );
}