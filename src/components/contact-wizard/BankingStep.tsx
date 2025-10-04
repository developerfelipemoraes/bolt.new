import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactData, BankAccount } from '../../types/contact';
import { formatCPF } from '../../utils/validators';

interface BankingStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
}

export default function BankingStep({ data, onDataChange }: BankingStepProps) {
  const handleBankAccountChange = (
    accountType: 'primaryAccount' | 'secondaryAccount',
    field: keyof BankAccount,
    value: string
  ) => {
    const currentAccount = data.banking?.[accountType] || {} as BankAccount;
    const updatedAccount = { ...currentAccount, [field]: value };
    const updatedBanking = { ...data.banking, [accountType]: updatedAccount };
    onDataChange({ banking: updatedBanking });
    console.log('Dados bancários atualizados:', updatedBanking);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    const updatedBanking = { ...data.banking, [field]: value };
    onDataChange({ banking: updatedBanking });
  };

  const handleJointAccountHolderCpfChange = (value: string) => {
    const formattedCpf = formatCPF(value);
    handleInputChange('jointAccountHolderCpf', formattedCpf);
  };

  return (
    <div className="space-y-6">
      {/* Primary Bank Account */}
      <Card>
        <CardHeader>
          <CardTitle>Conta Bancária Principal</CardTitle>
          <CardDescription>Conta principal para movimentação financeira</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Banco</Label>
              <Input
                value={data.banking?.primaryAccount?.bank || ''}
                onChange={(e) => handleBankAccountChange('primaryAccount', 'bank', e.target.value)}
                placeholder="Ex: Banco do Brasil"
              />
            </div>

            <div className="space-y-2">
              <Label>Agência</Label>
              <Input
                value={data.banking?.primaryAccount?.agency || ''}
                onChange={(e) => handleBankAccountChange('primaryAccount', 'agency', e.target.value)}
                placeholder="1234-5"
              />
            </div>

            <div className="space-y-2">
              <Label>Conta</Label>
              <Input
                value={data.banking?.primaryAccount?.account || ''}
                onChange={(e) => handleBankAccountChange('primaryAccount', 'account', e.target.value)}
                placeholder="12345-6"
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
                value={data.banking?.secondaryAccount?.bank || ''}
                onChange={(e) => handleBankAccountChange('secondaryAccount', 'bank', e.target.value)}
                placeholder="Ex: Itaú"
              />
            </div>

            <div className="space-y-2">
              <Label>Agência</Label>
              <Input
                value={data.banking?.secondaryAccount?.agency || ''}
                onChange={(e) => handleBankAccountChange('secondaryAccount', 'agency', e.target.value)}
                placeholder="5678-9"
              />
            </div>

            <div className="space-y-2">
              <Label>Conta</Label>
              <Input
                value={data.banking?.secondaryAccount?.account || ''}
                onChange={(e) => handleBankAccountChange('secondaryAccount', 'account', e.target.value)}
                placeholder="98765-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Joint Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Conta Conjunta</CardTitle>
          <CardDescription>Se aplicável</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isJointAccount"
              checked={data.banking?.isJointAccount || false}
              onCheckedChange={(checked) => handleInputChange('isJointAccount', !!checked)}
            />
            <Label htmlFor="isJointAccount">Conta conjunta</Label>
          </div>

          {data.banking?.isJointAccount && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="space-y-2">
                <Label>Nome do Co-titular</Label>
                <Input
                  value={data.banking?.jointAccountHolderName || ''}
                  onChange={(e) => handleInputChange('jointAccountHolderName', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label>CPF do Co-titular</Label>
                <Input
                  value={data.banking?.jointAccountHolderCpf || ''}
                  onChange={(e) => handleJointAccountHolderCpfChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PIX Information */}
      <Card>
        <CardHeader>
          <CardTitle>Chave PIX</CardTitle>
          <CardDescription>Chave PIX para transferências (opcional)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Chave PIX</Label>
            <Input
              value={data.banking?.pixKey || ''}
              onChange={(e) => handleInputChange('pixKey', e.target.value)}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
            />
            <p className="text-xs text-gray-500">
              Pode ser CPF, e-mail, telefone ou chave aleatória
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Banking Summary */}
      {(data.banking?.primaryAccount?.bank || data.banking?.secondaryAccount?.bank) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Resumo Bancário</h4>
          <div className="space-y-2 text-sm">
            {data.banking.primaryAccount?.bank && (
              <div>
                <strong>Conta Principal:</strong> {data.banking.primaryAccount.bank}
                {data.banking.primaryAccount.agency && ` - Ag: ${data.banking.primaryAccount.agency}`}
                {data.banking.primaryAccount.account && ` - Cc: ${data.banking.primaryAccount.account}`}
              </div>
            )}
            
            {data.banking.secondaryAccount?.bank && (
              <div>
                <strong>Conta Secundária:</strong> {data.banking.secondaryAccount.bank}
                {data.banking.secondaryAccount.agency && ` - Ag: ${data.banking.secondaryAccount.agency}`}
                {data.banking.secondaryAccount.account && ` - Cc: ${data.banking.secondaryAccount.account}`}
              </div>
            )}
            
            {data.banking.isJointAccount && data.banking.jointAccountHolderName && (
              <div>
                <strong>Co-titular:</strong> {data.banking.jointAccountHolderName}
                {data.banking.jointAccountHolderCpf && ` - ${data.banking.jointAccountHolderCpf}`}
              </div>
            )}
            
            {data.banking.pixKey && (
              <div>
                <strong>Chave PIX:</strong> {data.banking.pixKey}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}