import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyData, BankAccount } from '../../types/company';

interface BankingStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

export default function BankingStep({ data, onDataChange }: BankingStepProps) {
  const handleBankAccountChange = (
    accountType: 'primaryBankAccount' | 'secondaryBankAccount',
    field: keyof BankAccount,
    value: string
  ) => {
    const currentAccount = data[accountType] || {} as BankAccount;
    const updatedAccount = { ...currentAccount, [field]: value };
    onDataChange({ [accountType]: updatedAccount });
  };

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    onDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Primary Bank Account */}
      <Card>
        <CardHeader>
          <CardTitle>Conta Bancária Principal</CardTitle>
          <CardDescription>Conta principal para movimentação financeira (obrigatório)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Banco *</Label>
              <Input
                value={data.primaryBankAccount?.bank || ''}
                onChange={(e) => handleBankAccountChange('primaryBankAccount', 'bank', e.target.value)}
                placeholder="Ex: Banco do Brasil"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Agência *</Label>
              <Input
                value={data.primaryBankAccount?.agency || ''}
                onChange={(e) => handleBankAccountChange('primaryBankAccount', 'agency', e.target.value)}
                placeholder="1234-5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Conta *</Label>
              <Input
                value={data.primaryBankAccount?.account || ''}
                onChange={(e) => handleBankAccountChange('primaryBankAccount', 'account', e.target.value)}
                placeholder="12345-6"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Bank Account */}
      <Card>
        <CardHeader>
          <CardTitle>Conta Bancária Secundária</CardTitle>
          <CardDescription>Conta adicional (opcional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Banco</Label>
              <Input
                value={data.secondaryBankAccount?.bank || ''}
                onChange={(e) => handleBankAccountChange('secondaryBankAccount', 'bank', e.target.value)}
                placeholder="Ex: Itaú"
              />
            </div>

            <div className="space-y-2">
              <Label>Agência</Label>
              <Input
                value={data.secondaryBankAccount?.agency || ''}
                onChange={(e) => handleBankAccountChange('secondaryBankAccount', 'agency', e.target.value)}
                placeholder="5678-9"
              />
            </div>

            <div className="space-y-2">
              <Label>Conta</Label>
              <Input
                value={data.secondaryBankAccount?.account || ''}
                onChange={(e) => handleBankAccountChange('secondaryBankAccount', 'account', e.target.value)}
                placeholder="98765-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PIX and Beneficiary */}
      <Card>
        <CardHeader>
          <CardTitle>PIX e Favorecido</CardTitle>
          <CardDescription>Informações adicionais para transferências</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chave PIX</Label>
              <Input
                value={data.pixKey || ''}
                onChange={(e) => handleInputChange('pixKey', e.target.value)}
                placeholder="CNPJ, e-mail, telefone ou chave aleatória"
              />
            </div>

            <div className="space-y-2">
              <Label>Favorecido</Label>
              <Input
                value={data.beneficiary || ''}
                onChange={(e) => handleInputChange('beneficiary', e.target.value)}
                placeholder="Nome do favorecido (se diferente da razão social)"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}