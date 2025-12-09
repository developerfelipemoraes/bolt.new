import { OpportunityStatus } from './opportunity';

export interface PipelineStage {
  id: string;
  name: string;
  status_key: OpportunityStatus;
  color: string;
  order: number;
  is_final: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  stages: PipelineStage[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface PipelineCreatePayload {
  name: string;
  description?: string;
  stages: Omit<PipelineStage, 'id'>[];
}

export interface PipelineUpdatePayload {
  name?: string;
  description?: string;
  stages?: Omit<PipelineStage, 'id'>[];
}

export const DEFAULT_PIPELINE_STAGES: Omit<PipelineStage, 'id'>[] = [
  {
    name: 'Pedido do Cliente',
    status_key: 'PEDIDO_CLIENTE',
    color: '#6366f1',
    order: 1,
    is_final: false
  },
  {
    name: 'Pesquisa / Match',
    status_key: 'PESQUISA_MATCH',
    color: '#8b5cf6',
    order: 2,
    is_final: false
  },
  {
    name: 'Qualificação',
    status_key: 'QUALIFICACAO',
    color: '#ec4899',
    order: 3,
    is_final: false
  },
  {
    name: 'Proposta / Negociação',
    status_key: 'PROPOSTA_NEGOCIACAO',
    color: '#f59e0b',
    order: 4,
    is_final: false
  },
  {
    name: 'Geração de Contrato',
    status_key: 'GERACAO_CONTRATO',
    color: '#3b82f6',
    order: 5,
    is_final: false
  },
  {
    name: 'Ganho (Win)',
    status_key: 'WON',
    color: '#10b981',
    order: 6,
    is_final: true
  },
  {
    name: 'Perdido (Lost)',
    status_key: 'LOST',
    color: '#ef4444',
    order: 7,
    is_final: true
  }
];
