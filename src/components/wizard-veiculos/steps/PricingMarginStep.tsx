import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Calculator, TrendingUp, Percent, DollarSign } from 'lucide-react';
import {
  PricingData,
  MarginType,
  MARGIN_TYPE_LABELS,
  calculateMargins,
  CalculatedMargins
} from '@/types/salesOpportunity';

interface PricingMarginStepProps {
  data?: PricingData;
  onChange?: (data: PricingData) => void;
}

export default function PricingMarginStep({ data, onChange }: PricingMarginStepProps) {
  const [pricing, setPricing] = useState<PricingData>({
    valor_venda_final: data?.valor_venda_final || 0,
    valor_custo: data?.valor_custo || 0,
    tipo_margem: data?.tipo_margem || 'diferenca_bruta',
    parametro_margem: data?.parametro_margem || null,
    percentual_comissao_vendedor: data?.percentual_comissao_vendedor || 0,
    custo_outros_participantes: data?.custo_outros_participantes || 0,
    rbt12: data?.rbt12 || null,
    aliquota_efetiva: data?.aliquota_efetiva || null
  });

  const [calculated, setCalculated] = useState<CalculatedMargins>({
    margem_lucro_bruta: 0,
    valor_comissao_bruta: 0,
    lucro_liquido_assessoria: 0,
    imposto_devido: 0,
    comissao_liquida_recebimento: 0
  });

  useEffect(() => {
    const results = calculateMargins(pricing);
    setCalculated(results);
    if (onChange) {
      onChange(pricing);
    }
  }, [pricing]);

  const handleInputChange = (field: keyof PricingData, value: string | number | null) => {
    setPricing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Seção 1: Informações Básicas da Venda
          </CardTitle>
          <CardDescription>
            Configure os valores base da transação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_venda_final" className="flex items-center gap-2">
                Valor de Venda Final
                <Badge variant="destructive">Obrigatório</Badge>
              </Label>
              <Input
                id="valor_venda_final"
                type="number"
                step="0.01"
                min="0"
                placeholder="R$ 0,00"
                value={pricing.valor_venda_final || ''}
                onChange={(e) => handleInputChange('valor_venda_final', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_custo">Valor de Custo</Label>
              <Input
                id="valor_custo"
                type="number"
                step="0.01"
                min="0"
                placeholder="R$ 0,00"
                value={pricing.valor_custo || ''}
                onChange={(e) => handleInputChange('valor_custo', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Seção 2: Regra de Margem de Lucro
          </CardTitle>
          <CardDescription>
            Defina como a margem será calculada para este cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_margem" className="flex items-center gap-2">
              Tipo de Margem
              <Badge variant="destructive">Obrigatório</Badge>
            </Label>
            <Select
              value={pricing.tipo_margem}
              onValueChange={(value: MarginType) => handleInputChange('tipo_margem', value)}
            >
              <SelectTrigger id="tipo_margem">
                <SelectValue placeholder="Selecione o tipo de margem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diferenca_bruta">{MARGIN_TYPE_LABELS.diferenca_bruta}</SelectItem>
                <SelectItem value="percentual_venda">{MARGIN_TYPE_LABELS.percentual_venda}</SelectItem>
                <SelectItem value="valor_fixo">{MARGIN_TYPE_LABELS.valor_fixo}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {pricing.tipo_margem !== 'diferenca_bruta' && (
            <div className="space-y-2">
              <Label htmlFor="parametro_margem">
                {pricing.tipo_margem === 'percentual_venda'
                  ? 'Percentual (%)'
                  : 'Valor Fixo (R$)'}
              </Label>
              <Input
                id="parametro_margem"
                type="number"
                step="0.01"
                min="0"
                placeholder={pricing.tipo_margem === 'percentual_venda' ? '0%' : 'R$ 0,00'}
                value={pricing.parametro_margem || ''}
                onChange={(e) => handleInputChange('parametro_margem', parseFloat(e.target.value) || null)}
              />
            </div>
          )}

          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              <strong>Margem de Lucro Bruta Calculada:</strong>{' '}
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(calculated.margem_lucro_bruta)}
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Seção 3: Divisão do Lucro (Comissão)
          </CardTitle>
          <CardDescription>
            Configure a distribuição da margem entre participantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="percentual_comissao_vendedor" className="flex items-center gap-2">
              % de Comissão do Vendedor
              <Badge variant="destructive">Obrigatório</Badge>
            </Label>
            <Input
              id="percentual_comissao_vendedor"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="0%"
              value={pricing.percentual_comissao_vendedor || ''}
              onChange={(e) => handleInputChange('percentual_comissao_vendedor', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custo_outros_participantes">
              Outros Participantes (Custos/Comissões)
            </Label>
            <Input
              id="custo_outros_participantes"
              type="number"
              step="0.01"
              min="0"
              placeholder="R$ 0,00"
              value={pricing.custo_outros_participantes || ''}
              onChange={(e) => handleInputChange('custo_outros_participantes', parseFloat(e.target.value) || 0)}
            />
          </div>

          <Separator />

          <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Valor da Minha Comissão (Bruta):</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(calculated.valor_comissao_bruta)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Lucro Líquido da Assessoria:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(calculated.lucro_liquido_assessoria)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Seção 4: Impacto Fiscal (Simulação)
          </CardTitle>
          <CardDescription>
            Dados para simulação do Simples Nacional (controle externo)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Estes valores devem ser atualizados mensalmente e refletem a situação fiscal da empresa.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rbt12">RBT12 (Receita Bruta 12 Meses)</Label>
              <Input
                id="rbt12"
                type="number"
                step="0.01"
                min="0"
                placeholder="R$ 0,00"
                value={pricing.rbt12 || ''}
                onChange={(e) => handleInputChange('rbt12', parseFloat(e.target.value) || null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aliquota_efetiva">Alíquota Efetiva do Simples (%)</Label>
              <Input
                id="aliquota_efetiva"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0%"
                value={pricing.aliquota_efetiva || ''}
                onChange={(e) => handleInputChange('aliquota_efetiva', parseFloat(e.target.value) || null)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Imposto Devido nesta Comissão:</span>
              <span className="text-lg font-bold text-amber-700">
                {formatCurrency(calculated.imposto_devido)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Comissão Líquida (Seu Recebimento):</span>
              <span className="text-xl font-bold text-green-700">
                {formatCurrency(calculated.comissao_liquida_recebimento)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Resumo dos Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Venda Final</p>
              <p className="text-xl font-bold">{formatCurrency(pricing.valor_venda_final)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Margem Bruta</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(calculated.margem_lucro_bruta)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Comissão Bruta</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(calculated.valor_comissao_bruta)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Comissão Líquida</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(calculated.comissao_liquida_recebimento)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
