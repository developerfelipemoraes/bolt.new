import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Calculator, TrendingUp, Percent, DollarSign, Plus, Trash2 } from 'lucide-react';
import {
  PricingData,
  MarginType,
  MARGIN_TYPE_LABELS,
  calculateMargins,
  calculateSalePrice,
  CalculatedMargins,
  Comissionario
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
    comissionarios: data?.comissionarios || [],
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
    const calculatedSalePrice = calculateSalePrice(
      pricing.valor_custo,
      pricing.tipo_margem,
      pricing.parametro_margem
    );

    const updatedPricing = {
      ...pricing,
      valor_venda_final: calculatedSalePrice
    };

    const results = calculateMargins(updatedPricing);
    setCalculated(results);

    if (onChange) {
      onChange(updatedPricing);
    }
  }, [pricing.valor_custo, pricing.tipo_margem, pricing.parametro_margem, pricing.percentual_comissao_vendedor, pricing.comissionarios, pricing.custo_outros_participantes, pricing.rbt12, pricing.aliquota_efetiva]);

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
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Importante:</strong> O valor de venda será calculado automaticamente com base no custo e na margem definida abaixo.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_custo" className="flex items-center gap-2">
                Valor de Custo (Base)
                <Badge variant="destructive">Obrigatório</Badge>
              </Label>
              <CurrencyInput
                id="valor_custo"
                value={pricing.valor_custo}
                onChange={(value) => handleInputChange('valor_custo', value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Este é o custo base para o cálculo da margem
              </p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Valor de Venda Final (Calculado)
                <Badge variant="secondary">Automático</Badge>
              </Label>
              <div className="flex items-center h-10 px-3 py-2 text-lg font-bold text-green-700 bg-green-50 border border-green-200 rounded-md">
                {formatCurrency(pricing.valor_venda_final)}
              </div>
              <p className="text-xs text-muted-foreground">
                Calculado automaticamente: Custo + Margem
              </p>
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

          {pricing.tipo_margem === 'diferenca_bruta' && (
            <div className="space-y-2">
              <Label htmlFor="parametro_margem" className="flex items-center gap-2">
                Margem de Lucro (R$)
                <Badge variant="destructive">Obrigatório</Badge>
              </Label>
              <CurrencyInput
                id="parametro_margem"
                value={pricing.parametro_margem || 0}
                onChange={(value) => handleInputChange('parametro_margem', value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Valor que será adicionado ao custo para obter o preço de venda
              </p>
            </div>
          )}

          {pricing.tipo_margem === 'percentual_venda' && (
            <div className="space-y-2">
              <Label htmlFor="parametro_margem" className="flex items-center gap-2">
                Percentual sobre a Venda (%)
                <Badge variant="destructive">Obrigatório</Badge>
              </Label>
              <Input
                id="parametro_margem"
                type="number"
                step="0.01"
                min="0"
                max="99"
                placeholder="Ex: 15 para 15%"
                value={pricing.parametro_margem || ''}
                onChange={(e) => handleInputChange('parametro_margem', parseFloat(e.target.value) || null)}
                required
              />
              <p className="text-xs text-muted-foreground">
                A margem será este percentual do valor final de venda. Ex: 15% significa que a margem será 15% do preço final.
              </p>
            </div>
          )}

          {pricing.tipo_margem === 'valor_fixo' && (
            <div className="space-y-2">
              <Label htmlFor="parametro_margem" className="flex items-center gap-2">
                Valor Fixo de Margem (R$)
                <Badge variant="destructive">Obrigatório</Badge>
              </Label>
              <CurrencyInput
                id="parametro_margem"
                value={pricing.parametro_margem || 0}
                onChange={(value) => handleInputChange('parametro_margem', value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Valor fixo que será adicionado ao custo (igual à Diferença Bruta)
              </p>
            </div>
          )}

          <div className="space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
              <Calculator className="h-5 w-5" />
              Resultado do Cálculo
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Custo Base:</span>
                <span className="font-medium">{formatCurrency(pricing.valor_custo)}</span>
              </div>

              {pricing.tipo_margem === 'diferenca_bruta' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">+ Margem Fixa:</span>
                  <span className="font-medium">{formatCurrency(pricing.parametro_margem || 0)}</span>
                </div>
              )}

              {pricing.tipo_margem === 'percentual_venda' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">% de Margem sobre Venda:</span>
                    <span className="font-medium">{pricing.parametro_margem || 0}%</span>
                  </div>
                  <div className="text-xs text-gray-600 italic">
                    Fórmula: Custo / (1 - {pricing.parametro_margem || 0}%)
                  </div>
                </>
              )}

              {pricing.tipo_margem === 'valor_fixo' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">+ Margem Fixa:</span>
                  <span className="font-medium">{formatCurrency(pricing.parametro_margem || 0)}</span>
                </div>
              )}

              <div className="h-px bg-green-300 my-2"></div>

              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-green-800">= Preço de Venda:</span>
                <span className="font-bold text-green-700">{formatCurrency(pricing.valor_venda_final)}</span>
              </div>

              <div className="flex justify-between items-center text-base">
                <span className="font-semibold text-green-800">Margem Bruta:</span>
                <span className="font-semibold text-green-600">{formatCurrency(calculated.margem_lucro_bruta)}</span>
              </div>
            </div>
          </div>
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

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Comissionários Adicionais</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newComissionario: Comissionario = {
                    id: `com_${Date.now()}`,
                    nome: '',
                    telefone: '',
                    empresa: '',
                    percentual_comissao: 0
                  };
                  setPricing(prev => ({
                    ...prev,
                    comissionarios: [...prev.comissionarios, newComissionario]
                  }));
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Comissionário
              </Button>
            </div>

            {pricing.comissionarios.map((com, index) => (
              <Card key={com.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Comissionário {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPricing(prev => ({
                          ...prev,
                          comissionarios: prev.comissionarios.filter(c => c.id !== com.id)
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`nome_${com.id}`}>Nome</Label>
                      <Input
                        id={`nome_${com.id}`}
                        value={com.nome}
                        onChange={(e) => {
                          const updated = pricing.comissionarios.map(c =>
                            c.id === com.id ? { ...c, nome: e.target.value } : c
                          );
                          setPricing(prev => ({ ...prev, comissionarios: updated }));
                        }}
                        placeholder="Nome do comissionário"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`telefone_${com.id}`}>Telefone</Label>
                      <Input
                        id={`telefone_${com.id}`}
                        value={com.telefone}
                        onChange={(e) => {
                          const updated = pricing.comissionarios.map(c =>
                            c.id === com.id ? { ...c, telefone: e.target.value } : c
                          );
                          setPricing(prev => ({ ...prev, comissionarios: updated }));
                        }}
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`empresa_${com.id}`}>Empresa</Label>
                      <Input
                        id={`empresa_${com.id}`}
                        value={com.empresa}
                        onChange={(e) => {
                          const updated = pricing.comissionarios.map(c =>
                            c.id === com.id ? { ...c, empresa: e.target.value } : c
                          );
                          setPricing(prev => ({ ...prev, comissionarios: updated }));
                        }}
                        placeholder="Nome da empresa"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`percentual_${com.id}`}>% de Comissão</Label>
                      <Input
                        id={`percentual_${com.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={com.percentual_comissao}
                        onChange={(e) => {
                          const updated = pricing.comissionarios.map(c =>
                            c.id === com.id ? { ...c, percentual_comissao: parseFloat(e.target.value) || 0 } : c
                          );
                          setPricing(prev => ({ ...prev, comissionarios: updated }));
                        }}
                        placeholder="0%"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {pricing.comissionarios.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Nenhum comissionário adicional configurado
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="custo_outros_participantes">
              Outros Custos (Não Comissionados)
            </Label>
            <CurrencyInput
              id="custo_outros_participantes"
              value={pricing.custo_outros_participantes}
              onChange={(value) => handleInputChange('custo_outros_participantes', value)}
            />
            <p className="text-xs text-muted-foreground">
              Custos adicionais que não são comissões (ex: despesas operacionais)
            </p>
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
              <CurrencyInput
                id="rbt12"
                value={pricing.rbt12 || 0}
                onChange={(value) => handleInputChange('rbt12', value)}
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
