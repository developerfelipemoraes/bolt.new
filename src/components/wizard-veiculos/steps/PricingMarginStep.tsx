import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Calculator, DollarSign, TrendingUp, Users } from 'lucide-react';
import {
  CommissionConfig,
  CommissionMode,
  COMMISSION_MODE_LABELS,
  calculateCommissionBruta,
  calculateParticipantCommission,
  calculateTotals,
  validateCommissionConfig,
  Supplier
} from '@/types/commission';
import { SupplierSelector } from '@/components/commission/SupplierSelector';
import { ParticipantSelector } from '@/components/commission/ParticipantSelector';

interface PricingMarginStepProps {
  data?: Partial<CommissionConfig>;
  supplier?: Supplier;
  onChange?: (data: CommissionConfig) => void;
  onSupplierChange?: (supplier: Supplier | undefined) => void;
}

export default function PricingMarginStep({ data, supplier, onChange, onSupplierChange }: PricingMarginStepProps) {
  const [config, setConfig] = useState<CommissionConfig>({
    preco_venda_final: data?.preco_venda_final || 0,
    commissionMode: data?.commissionMode || 'PERCENTUAL',
    percentual_comissao: data?.percentual_comissao,
    valor_ofertado_pelo_dono: data?.valor_ofertado_pelo_dono,
    valor_desejado_proprietario: data?.valor_desejado_proprietario,
    valor_comissao_bruta: 0,
    participants: data?.participants || [],
    rbt12: data?.rbt12,
    aliquota_efetiva: data?.aliquota_efetiva,
    imposto_devido: 0,
    comissao_liquida_recebimento: 0
  });

  useEffect(() => {
    const comissaoBruta = calculateCommissionBruta(config);

    const updatedParticipants = config.participants.map(p => {
      const calc = calculateParticipantCommission(p, comissaoBruta, config.aliquota_efetiva);
      return {
        ...p,
        ...calc
      };
    });

    const totals = calculateTotals({
      ...config,
      participants: updatedParticipants,
      valor_comissao_bruta: comissaoBruta
    });

    const updatedConfig: CommissionConfig = {
      ...config,
      valor_comissao_bruta: comissaoBruta,
      participants: updatedParticipants,
      ...totals
    };

    setConfig(updatedConfig);

    if (onChange) {
      onChange(updatedConfig);
    }
  }, [
    config.preco_venda_final,
    config.commissionMode,
    config.percentual_comissao,
    config.valor_ofertado_pelo_dono,
    config.valor_desejado_proprietario,
    config.participants.length,
    config.participants.map(p => `${p.percent}_${p.role}`).join(','),
    config.rbt12,
    config.aliquota_efetiva
  ]);

  const handleConfigChange = (field: keyof CommissionConfig, value: unknown) => {
    setConfig(prev => ({
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

  const validation = validateCommissionConfig(config);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Seção 1: Fornecedor do Veículo
          </CardTitle>
          <CardDescription>
            Selecione a empresa ou pessoa física dona do veículo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierSelector
            value={supplier}
            onChange={onSupplierChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Seção 2: Preço de Venda e Modo de Comissionamento
          </CardTitle>
          <CardDescription>
            Configure o valor de venda e como a comissão será calculada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preco_venda_final" className="flex items-center gap-2">
              Preço de Venda Final
              <Badge variant="destructive">Obrigatório</Badge>
            </Label>
            <CurrencyInput
              id="preco_venda_final"
              value={config.preco_venda_final}
              onChange={(value) => handleConfigChange('preco_venda_final', value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Este valor será salvo no registro do veículo
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="commissionMode" className="flex items-center gap-2">
              Modo de Comissionamento
              <Badge variant="destructive">Obrigatório</Badge>
            </Label>
            <Select
              value={config.commissionMode}
              onValueChange={(value: CommissionMode) => handleConfigChange('commissionMode', value)}
            >
              <SelectTrigger id="commissionMode">
                <SelectValue placeholder="Selecione o modo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COMMISSION_MODE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {config.commissionMode === 'PERCENTUAL' && (
            <div className="space-y-2">
              <Label htmlFor="percentual_comissao" className="flex items-center gap-2">
                Percentual de Comissão sobre Venda (%)
                <Badge variant="destructive">Obrigatório</Badge>
              </Label>
              <Input
                id="percentual_comissao"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Ex: 6"
                value={config.percentual_comissao || ''}
                onChange={(e) => handleConfigChange('percentual_comissao', parseFloat(e.target.value) || undefined)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Fórmula: Comissão = Preço de Venda × {config.percentual_comissao || 0}%
              </p>
            </div>
          )}

          {config.commissionMode === 'OFERTA_DONO' && (
            <div className="space-y-2">
              <Label htmlFor="valor_ofertado_pelo_dono" className="flex items-center gap-2">
                Valor Ofertado pelo Dono (Fixo)
                <Badge variant="destructive">Obrigatório</Badge>
              </Label>
              <CurrencyInput
                id="valor_ofertado_pelo_dono"
                value={config.valor_ofertado_pelo_dono || 0}
                onChange={(value) => handleConfigChange('valor_ofertado_pelo_dono', value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Este valor permanece fixo independente do preço final de venda
              </p>
            </div>
          )}

          {config.commissionMode === 'DIFERENCA_BRUTA' && (
            <div className="space-y-2">
              <Label htmlFor="valor_desejado_proprietario" className="flex items-center gap-2">
                Valor Desejado pelo Proprietário
                <Badge variant="destructive">Obrigatório</Badge>
              </Label>
              <CurrencyInput
                id="valor_desejado_proprietario"
                value={config.valor_desejado_proprietario || 0}
                onChange={(value) => handleConfigChange('valor_desejado_proprietario', value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Fórmula: Comissão = MAX(0, Preço de Venda - Valor Desejado)
              </p>
            </div>
          )}

          <div className="space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
              <Calculator className="h-5 w-5" />
              Comissão Bruta Calculada
            </div>

            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-green-800">Comissão Total:</span>
              <span className="font-bold text-green-700">{formatCurrency(config.valor_comissao_bruta)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Seção 3: Participantes e Divisão da Comissão
          </CardTitle>
          <CardDescription>
            Defina quem participa da comissão e em qual proporção
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Importante:</strong> A soma dos percentuais deve ser exatamente 100%.
              Apenas participantes com role "Aurovel" terão impostos calculados.
            </AlertDescription>
          </Alert>

          <ParticipantSelector
            participants={config.participants}
            onChange={(participants) => handleConfigChange('participants', participants)}
          />

          {config.participants.length > 0 && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm">Distribuição da Comissão:</h4>
              {config.participants.map((p) => (
                <div key={p.id} className="flex justify-between items-center text-sm">
                  <span>
                    {p.name} ({p.percent}%)
                  </span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(p.commission_gross)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Seção 4: Impacto Fiscal (Simples Nacional)
          </CardTitle>
          <CardDescription>
            Dados fiscais para cálculo de impostos sobre a comissão da Aurovel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              O imposto será aplicado apenas sobre a comissão dos participantes com role "Aurovel".
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rbt12">RBT12 (Receita Bruta 12 Meses)</Label>
              <CurrencyInput
                id="rbt12"
                value={config.rbt12 || 0}
                onChange={(value) => handleConfigChange('rbt12', value)}
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
                placeholder="Ex: 6"
                value={config.aliquota_efetiva || ''}
                onChange={(e) => handleConfigChange('aliquota_efetiva', parseFloat(e.target.value) || undefined)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Imposto Devido (Aurovel):</span>
              <span className="text-lg font-bold text-amber-700">
                {formatCurrency(config.imposto_devido)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Comissão Líquida (Aurovel):</span>
              <span className="text-xl font-bold text-green-700">
                {formatCurrency(config.comissao_liquida_recebimento)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Resumo Final</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Preço de Venda</p>
              <p className="text-xl font-bold">{formatCurrency(config.preco_venda_final)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Comissão Bruta Total</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(config.valor_comissao_bruta)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Imposto (Aurovel)</p>
              <p className="text-xl font-bold text-amber-600">{formatCurrency(config.imposto_devido)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Líquido (Aurovel)</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(config.comissao_liquida_recebimento)}</p>
            </div>
          </div>

          {!validation.valid && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validation.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
