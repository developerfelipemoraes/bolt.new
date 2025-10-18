export type SupplierType = 'company' | 'individual';

export interface CompanySupplier {
  supplierType: 'company';
  companyName: string;
  email?: string;
  phone?: string;
  cnpj: string;
  id?: string;
}

export interface IndividualSupplier {
  supplierType: 'individual';
  fullName: string;
  email?: string;
  phone?: string;
  cpf: string;
  id?: string;
}

export type Supplier = CompanySupplier | IndividualSupplier;

export type ParticipantRole = 'Aurovel' | 'Corretor' | 'Indicador' | 'Outro';

export type CommissionMode = 'PERCENTUAL' | 'OFERTA_DONO' | 'DIFERENCA_BRUTA';

export interface CommissionParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
  percent: number;
  contactId?: string;
  companyId?: string;
  commission_gross: number;
  tax: number;
  commission_net: number;
}

export interface CommissionConfig {
  preco_venda_final: number;

  commissionMode: CommissionMode;

  percentual_comissao?: number;

  valor_ofertado_pelo_dono?: number;

  valor_desejado_proprietario?: number;

  valor_comissao_bruta: number;

  participants: CommissionParticipant[];

  rbt12?: number;
  aliquota_efetiva?: number;

  imposto_devido: number;
  comissao_liquida_recebimento: number;
}

export const COMMISSION_MODE_LABELS: Record<CommissionMode, string> = {
  PERCENTUAL: 'Modo 1: Percentual sobre Preço de Venda',
  OFERTA_DONO: 'Modo 2: Valor Ofertado pelo Dono',
  DIFERENCA_BRUTA: 'Modo 3: Diferença Bruta (Margem sobre Valor Desejado)'
};

export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  Aurovel: 'Aurovel (Empresa)',
  Corretor: 'Corretor',
  Indicador: 'Indicador',
  Outro: 'Outro'
};

export function calculateCommissionBruta(config: Pick<CommissionConfig, 'preco_venda_final' | 'commissionMode' | 'percentual_comissao' | 'valor_ofertado_pelo_dono' | 'valor_desejado_proprietario'>): number {
  const { preco_venda_final, commissionMode, percentual_comissao, valor_ofertado_pelo_dono, valor_desejado_proprietario } = config;

  switch (commissionMode) {
    case 'PERCENTUAL':
      if (!percentual_comissao || percentual_comissao <= 0) return 0;
      return preco_venda_final * (percentual_comissao / 100);

    case 'OFERTA_DONO':
      return valor_ofertado_pelo_dono || 0;

    case 'DIFERENCA_BRUTA':
      if (!valor_desejado_proprietario) return 0;
      const diferenca = preco_venda_final - valor_desejado_proprietario;
      return Math.max(0, diferenca);

    default:
      return 0;
  }
}

export function calculateParticipantCommission(
  participant: Pick<CommissionParticipant, 'role' | 'percent'>,
  valor_comissao_bruta: number,
  aliquota_efetiva: number = 0
): Pick<CommissionParticipant, 'commission_gross' | 'tax' | 'commission_net'> {
  const commission_gross = valor_comissao_bruta * (participant.percent / 100);

  let tax = 0;
  if (participant.role === 'Aurovel' && aliquota_efetiva > 0) {
    tax = commission_gross * (aliquota_efetiva / 100);
  }

  const commission_net = commission_gross - tax;

  return {
    commission_gross,
    tax,
    commission_net
  };
}

export function calculateTotals(config: CommissionConfig): {
  imposto_devido: number;
  comissao_liquida_recebimento: number;
} {
  const aurovelParticipant = config.participants.find(p => p.role === 'Aurovel');

  if (!aurovelParticipant) {
    return {
      imposto_devido: 0,
      comissao_liquida_recebimento: 0
    };
  }

  return {
    imposto_devido: aurovelParticipant.tax,
    comissao_liquida_recebimento: aurovelParticipant.commission_net
  };
}

export function validateParticipants(participants: CommissionParticipant[]): {
  valid: boolean;
  error?: string;
} {
  if (participants.length === 0) {
    return { valid: false, error: 'Adicione ao menos um participante (Aurovel)' };
  }

  const hasAurovel = participants.some(p => p.role === 'Aurovel');
  if (!hasAurovel) {
    return { valid: false, error: 'Deve haver ao menos um participante com role "Aurovel"' };
  }

  const totalPercent = participants.reduce((sum, p) => sum + p.percent, 0);
  if (Math.abs(totalPercent - 100) > 0.01) {
    return { valid: false, error: `A soma dos percentuais deve ser 100%. Atual: ${totalPercent.toFixed(2)}%` };
  }

  return { valid: true };
}

export function validateCommissionConfig(config: CommissionConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.preco_venda_final <= 0) {
    errors.push('Preço de venda final deve ser maior que zero');
  }

  switch (config.commissionMode) {
    case 'PERCENTUAL':
      if (!config.percentual_comissao || config.percentual_comissao <= 0 || config.percentual_comissao > 100) {
        errors.push('Percentual de comissão deve estar entre 0 e 100%');
      }
      break;

    case 'OFERTA_DONO':
      if (!config.valor_ofertado_pelo_dono || config.valor_ofertado_pelo_dono < 0) {
        errors.push('Valor ofertado pelo dono deve ser maior ou igual a zero');
      }
      break;

    case 'DIFERENCA_BRUTA':
      if (!config.valor_desejado_proprietario || config.valor_desejado_proprietario < 0) {
        errors.push('Valor desejado pelo proprietário deve ser maior ou igual a zero');
      }
      break;
  }

  const participantsValidation = validateParticipants(config.participants);
  if (!participantsValidation.valid && participantsValidation.error) {
    errors.push(participantsValidation.error);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
