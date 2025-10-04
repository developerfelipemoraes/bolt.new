import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { ContactData, Asset } from '../../types/contact';
import { formatCurrency, validateIncomeConsistency } from '../../utils/validators';

interface FinancialStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
}

export default function FinancialStep({ data, onDataChange }: FinancialStepProps) {
  const [manualTotal, setManualTotal] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    const updatedFinancial = { ...data.financial, [field]: value };
    
    // Auto-calculate total if not manual
    if ((field === 'salary' || field === 'otherIncome') && !manualTotal) {
      const salary = field === 'salary' ? Number(value) : (updatedFinancial.salary || 0);
      const otherIncome = field === 'otherIncome' ? Number(value) : (updatedFinancial.otherIncome || 0);
      updatedFinancial.totalIncome = salary + otherIncome;
    }
    
    onDataChange({ financial: updatedFinancial });
  };

  const handleTotalIncomeChange = (value: string) => {
    setManualTotal(true);
    handleInputChange('totalIncome', Number(value));
  };

  const handleAssetChange = (index: number, field: keyof Asset, value: string | number) => {
    const assets = [...(data.financial?.assets || [])];
    assets[index] = { ...assets[index], [field]: value };
    const updatedFinancial = { ...data.financial, assets };
    onDataChange({ financial: updatedFinancial });
  };

  const addAsset = () => {
    const newAsset: Asset = { type: '', description: '', value: 0 };
    const assets = [...(data.financial?.assets || []), newAsset];
    const updatedFinancial = { ...data.financial, assets };
    onDataChange({ financial: updatedFinancial });
  };

  const removeAsset = (index: number) => {
    const assets = [...(data.financial?.assets || [])];
    assets.splice(index, 1);
    const updatedFinancial = { ...data.financial, assets };
    onDataChange({ financial: updatedFinancial });
  };

  const calculatedTotal = (data.financial?.salary || 0) + (data.financial?.otherIncome || 0);
  const isIncomeConsistent = validateIncomeConsistency(
    data.financial?.salary || 0,
    data.financial?.otherIncome || 0,
    data.financial?.totalIncome || 0
  );

  const totalAssetValue = data.financial?.assets?.reduce((sum, asset) => sum + (asset.value || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Income Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salary">Salário/Pró-labore (R$)</Label>
          <Input
            id="salary"
            type="number"
            step="0.01"
            value={data.financial?.salary || ''}
            onChange={(e) => handleInputChange('salary', Number(e.target.value))}
            placeholder="0,00"
          />
          {data.financial?.salary && (
            <p className="text-sm text-gray-500">
              {formatCurrency(data.financial.salary)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherIncome">Outros Rendimentos (R$)</Label>
          <Input
            id="otherIncome"
            type="number"
            step="0.01"
            value={data.financial?.otherIncome || ''}
            onChange={(e) => handleInputChange('otherIncome', Number(e.target.value))}
            placeholder="0,00"
          />
          {data.financial?.otherIncome && (
            <p className="text-sm text-gray-500">
              {formatCurrency(data.financial.otherIncome)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalIncome">Total de Rendimentos (R$)</Label>
          <Input
            id="totalIncome"
            type="number"
            step="0.01"
            value={data.financial?.totalIncome || ''}
            onChange={(e) => handleTotalIncomeChange(e.target.value)}
            placeholder="0,00"
            className={!isIncomeConsistent ? 'border-yellow-500' : ''}
          />
          {data.financial?.totalIncome && (
            <p className="text-sm text-gray-500">
              {formatCurrency(data.financial.totalIncome)}
            </p>
          )}
        </div>
      </div>

      {/* Income Validation */}
      {!manualTotal && calculatedTotal > 0 && (
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Total calculado automaticamente: {formatCurrency(calculatedTotal)}
          </p>
        </div>
      )}

      {!isIncomeConsistent && data.financial?.totalIncome && (
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Diferença detectada entre o total informado ({formatCurrency(data.financial.totalIncome)}) 
            e a soma das parcelas ({formatCurrency(calculatedTotal)})
          </p>
        </div>
      )}

      {/* Assets Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900">Bens e Valores</h3>
            <p className="text-sm text-gray-600">Lista detalhada do patrimônio</p>
          </div>
          <Button onClick={addAsset} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Bem
          </Button>
        </div>

        <div className="space-y-4">
          {data.financial?.assets?.map((asset, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Bem {index + 1}</h4>
                <Button
                  onClick={() => removeAsset(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo/Espécie</Label>
                  <Input
                    value={asset.type}
                    onChange={(e) => handleAssetChange(index, 'type', e.target.value)}
                    placeholder="Ex: Imóvel, Veículo, Aplicação"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    value={asset.description}
                    onChange={(e) => handleAssetChange(index, 'description', e.target.value)}
                    placeholder="Descrição detalhada"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={asset.value}
                    onChange={(e) => handleAssetChange(index, 'value', Number(e.target.value))}
                    placeholder="0,00"
                  />
                  {asset.value > 0 && (
                    <p className="text-sm text-gray-500">
                      {formatCurrency(asset.value)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum bem cadastrado</p>
              <p className="text-sm">Clique em "Adicionar Bem" para começar</p>
            </div>
          )}
        </div>

        {/* Assets Summary */}
        {data.financial?.assets && data.financial.assets.length > 0 && (
          <div className="mt-4 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-900">Total de Bens Declarados:</span>
              <span className="text-lg font-bold text-blue-900">
                {formatCurrency(totalAssetValue)}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              {data.financial.assets.length} {data.financial.assets.length === 1 ? 'bem declarado' : 'bens declarados'}
            </p>
          </div>
        )}
      </div>

      {/* Financial Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Resumo Financeiro</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Renda Total Mensal</p>
            <p className="text-lg font-semibold">
              {formatCurrency(data.financial?.totalIncome || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Patrimônio Declarado</p>
            <p className="text-lg font-semibold">
              {formatCurrency(totalAssetValue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}