export type OpportunityStatus =
  | 'PEDIDO_CLIENTE'
  | 'PESQUISA_MATCH'
  | 'QUALIFICACAO'
  | 'PROPOSTA_NEGOCIACAO'
  | 'GERACAO_CONTRATO'
  | 'WON'
  | 'LOST';

export type LossReason =
  | 'PRECO'
  | 'CONCORRENCIA'
  | 'CLIENTE_DESISTIU'
  | 'PRODUTO_INADEQUADO'
  | 'OUTRO';

export const LOSS_REASON_LABELS: Record<LossReason, string> = {
  PRECO: 'Preço',
  CONCORRENCIA: 'Concorrência',
  CLIENTE_DESISTIU: 'Cliente desistiu',
  PRODUTO_INADEQUADO: 'Produto inadequado',
  OUTRO: 'Outro'
};

export interface Opportunity {
  id: string;
  title: string;
  status: OpportunityStatus;
  pipeline_id: string;
  contact_id?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  vehicle_id?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_price?: number;
  supplier_id?: string;
  supplier_name?: string;
  estimated_value?: number;
  final_sale_value?: number;
  commission_paid?: number;
  contract_file?: string;
  notes?: string;
  loss_reason?: LossReason;
  loss_reason_notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  win_date?: string;
  loss_date?: string;
  stage_entered_at: string;
}

export interface OpportunityCreatePayload {
  title: string;
  pipeline_id: string;
  contact_id?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  estimated_value?: number;
  notes?: string;
}

export interface OpportunityUpdatePayload {
  title?: string;
  status?: OpportunityStatus;
  contact_id?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  vehicle_id?: string;
  supplier_id?: string;
  supplier_name?: string;
  estimated_value?: number;
  final_sale_value?: number;
  commission_paid?: number;
  contract_file?: string;
  notes?: string;
  loss_reason?: LossReason;
  loss_reason_notes?: string;
  win_date?: string;
  loss_date?: string;
}

export interface OpportunityClosePayload {
  status: 'WON' | 'LOST';
  final_sale_value?: number;
  commission_paid?: number;
  win_date?: string;
  loss_reason?: LossReason;
  loss_reason_notes?: string;
  loss_date?: string;
}
