export type MarginType = 'diferenca_bruta' | 'percentual_venda' | 'valor_fixo';

export interface PricingData {
  valor_venda_final: number;
  valor_custo: number;
  tipo_margem: MarginType;
  parametro_margem: number | null;
  percentual_comissao_vendedor: number;
  custo_outros_participantes: number;
  rbt12: number | null;
  aliquota_efetiva: number | null;
}

export interface CalculatedMargins {
  margem_lucro_bruta: number;
  valor_comissao_bruta: number;
  lucro_liquido_assessoria: number;
  imposto_devido: number;
  comissao_liquida_recebimento: number;
}

export interface SalesOpportunity {
  id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  cliente_id: string;
  vehicle_id?: string;
  valor_venda_final: number;
  valor_custo: number;
  tipo_margem: MarginType;
  parametro_margem: number | null;
  percentual_comissao_vendedor: number;
  custo_outros_participantes: number;
  rbt12: number | null;
  aliquota_efetiva: number | null;
  status: string;
  observacoes: string | null;
}

export const MARGIN_TYPE_LABELS: Record<MarginType, string> = {
  diferenca_bruta: '1. Diferença Bruta',
  percentual_venda: '2. Percentual de Venda',
  valor_fixo: '3. Valor Fixo'
};

export function calculateMargins(pricing: PricingData): CalculatedMargins {
  let margem_lucro_bruta = 0;

  switch (pricing.tipo_margem) {
    case 'diferenca_bruta':
      margem_lucro_bruta = pricing.valor_venda_final - pricing.valor_custo;
      break;
    case 'percentual_venda':
      if (pricing.parametro_margem !== null) {
        margem_lucro_bruta = pricing.valor_venda_final * (pricing.parametro_margem / 100);
      }
      break;
    case 'valor_fixo':
      margem_lucro_bruta = pricing.parametro_margem || 0;
      break;
  }

  const valor_comissao_bruta = margem_lucro_bruta * (pricing.percentual_comissao_vendedor / 100);

  const lucro_liquido_assessoria =
    margem_lucro_bruta - valor_comissao_bruta - pricing.custo_outros_participantes;

  const imposto_devido = pricing.aliquota_efetiva
    ? valor_comissao_bruta * (pricing.aliquota_efetiva / 100)
    : 0;

  const comissao_liquida_recebimento = valor_comissao_bruta - imposto_devido;

  return {
    margem_lucro_bruta,
    valor_comissao_bruta,
    lucro_liquido_assessoria,
    imposto_devido,
    comissao_liquida_recebimento
  };
}
