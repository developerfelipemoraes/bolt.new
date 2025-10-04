import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CompanyData } from '../../types/company';

interface FinancialStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

export default function FinancialStep({ data, onDataChange }: FinancialStepProps) {
  const handleInputChange = (field: keyof CompanyData, value: string | number) => {
    onDataChange({ [field]: value });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="socialCapital">Capital Social (R$)</Label>
          <Input
            id="socialCapital"
            type="number"
            value={data.socialCapital || ''}
            onChange={(e) => handleInputChange('socialCapital', Number(e.target.value))}
            placeholder="0"
            min="0"
          />
          {data.socialCapital && (
            <p className="text-sm text-gray-500">
              {formatCurrency(data.socialCapital)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="netWorth">Patrimônio Líquido (R$)</Label>
          <Input
            id="netWorth"
            type="number"
            value={data.netWorth || ''}
            onChange={(e) => handleInputChange('netWorth', Number(e.target.value))}
            placeholder="0"
            min="0"
          />
          {data.netWorth && (
            <p className="text-sm text-gray-500">
              {formatCurrency(data.netWorth)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue12m">Faturamento 12 meses (R$)</Label>
          <Input
            id="revenue12m"
            type="number"
            value={data.revenue12m || ''}
            onChange={(e) => handleInputChange('revenue12m', Number(e.target.value))}
            placeholder="0"
            min="0"
          />
          {data.revenue12m && (
            <p className="text-sm text-gray-500">
              {formatCurrency(data.revenue12m)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditLimit">Limite de Crédito Interno (R$)</Label>
          <Input
            id="creditLimit"
            type="number"
            value={data.creditLimit || ''}
            onChange={(e) => handleInputChange('creditLimit', Number(e.target.value))}
            placeholder="0"
            min="0"
          />
          {data.creditLimit && (
            <p className="text-sm text-gray-500">
              {formatCurrency(data.creditLimit)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Condição de Pagamento</Label>
          <Input
            id="paymentTerms"
            value={data.paymentTerms || ''}
            onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
            placeholder="à vista, 30 dias, 45 dias, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="relevantAssets">Bens & Valores Relevantes</Label>
        <Textarea
          id="relevantAssets"
          value={data.relevantAssets || ''}
          onChange={(e) => handleInputChange('relevantAssets', e.target.value)}
          placeholder="Ex: Imóveis, veículos, aplicações financeiras, etc."
          rows={4}
        />
        <p className="text-sm text-gray-500">
          Descreva os principais bens e ativos da empresa (imóveis, veículos, aplicações, etc.)
        </p>
      </div>
    </div>
  );
}