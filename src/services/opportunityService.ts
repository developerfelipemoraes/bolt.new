import {
  Opportunity,
  OpportunityCreatePayload,
  OpportunityUpdatePayload,
  OpportunityClosePayload,
  OpportunityStatus
} from '../types/opportunity';
import { TimelineEvent, TimelineEventCreate } from '../types/timeline';

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'OPP-001',
    title: 'SUV Executivo para Transporte Corporativo',
    status: 'PESQUISA_MATCH',
    pipeline_id: 'PIPE-DEFAULT',
    contact_id: 'CNT-00456',
    contact_name: 'Carlos Mendes',
    contact_phone: '+55 (11) 98765-4321',
    contact_email: 'carlos@empresa.com',
    estimated_value: 185000,
    notes: 'Cliente busca veículo com até 2 anos de uso',
    created_at: '2025-12-01T10:00:00Z',
    updated_at: '2025-12-03T14:30:00Z',
    created_by: 'USR-001',
    stage_entered_at: '2025-12-03T14:30:00Z'
  },
  {
    id: 'OPP-002',
    title: 'Ônibus Rodoviário 50 Lugares',
    status: 'PROPOSTA_NEGOCIACAO',
    pipeline_id: 'PIPE-DEFAULT',
    contact_id: 'CNT-00789',
    contact_name: 'Maria Silva',
    contact_phone: '+55 (21) 99876-5432',
    contact_email: 'maria@transportes.com',
    vehicle_id: 'VCL-00123',
    vehicle_model: 'Paradiso G7 1800 DD',
    vehicle_year: 2023,
    vehicle_price: 850000,
    supplier_id: 'SUP-001',
    supplier_name: 'Scania Brasil',
    estimated_value: 900000,
    notes: 'Negociação de pagamento parcelado',
    created_at: '2025-11-28T08:00:00Z',
    updated_at: '2025-12-07T16:45:00Z',
    created_by: 'USR-002',
    stage_entered_at: '2025-12-07T16:45:00Z'
  },
  {
    id: 'OPP-003',
    title: 'Van Executiva 15 Lugares',
    status: 'PEDIDO_CLIENTE',
    pipeline_id: 'PIPE-DEFAULT',
    contact_name: 'João Santos',
    contact_phone: '+55 (11) 91234-5678',
    estimated_value: 120000,
    notes: 'Lead recebido por indicação',
    created_at: '2025-12-08T09:15:00Z',
    updated_at: '2025-12-08T09:15:00Z',
    created_by: 'USR-001',
    stage_entered_at: '2025-12-08T09:15:00Z'
  }
];

const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 'EVT-001',
    opportunity_id: 'OPP-001',
    event_type: 'CREATED',
    title: 'Oportunidade criada',
    description: 'Pedido inicial do cliente',
    created_at: '2025-12-01T10:00:00Z',
    created_by: 'USR-001',
    created_by_name: 'Vendedor 1'
  },
  {
    id: 'EVT-002',
    opportunity_id: 'OPP-001',
    event_type: 'CONTACT_ASSIGNED',
    title: 'Contato vinculado',
    description: 'Carlos Mendes',
    metadata: {
      contact_id: 'CNT-00456',
      contact_name: 'Carlos Mendes'
    },
    created_at: '2025-12-01T10:05:00Z',
    created_by: 'USR-001',
    created_by_name: 'Vendedor 1'
  },
  {
    id: 'EVT-003',
    opportunity_id: 'OPP-001',
    event_type: 'STAGE_CHANGED',
    title: 'Mudança de estágio',
    description: 'De Pedido do Cliente para Pesquisa / Match',
    metadata: {
      from_stage: 'PEDIDO_CLIENTE',
      to_stage: 'PESQUISA_MATCH',
      from_stage_name: 'Pedido do Cliente',
      to_stage_name: 'Pesquisa / Match'
    },
    created_at: '2025-12-03T14:30:00Z',
    created_by: 'USR-001',
    created_by_name: 'Vendedor 1'
  }
];

export const opportunityService = {
  async getAll(pipelineId?: string): Promise<Opportunity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (pipelineId) {
      return MOCK_OPPORTUNITIES.filter(opp => opp.pipeline_id === pipelineId);
    }

    return [...MOCK_OPPORTUNITIES];
  },

  async getById(id: string): Promise<Opportunity | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const opportunity = MOCK_OPPORTUNITIES.find(opp => opp.id === id);
    return opportunity ? { ...opportunity } : null;
  },

  async create(payload: OpportunityCreatePayload): Promise<Opportunity> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const newOpportunity: Opportunity = {
      id: `OPP-${String(MOCK_OPPORTUNITIES.length + 1).padStart(3, '0')}`,
      title: payload.title,
      status: 'PEDIDO_CLIENTE',
      pipeline_id: payload.pipeline_id,
      contact_id: payload.contact_id,
      contact_name: payload.contact_name,
      contact_phone: payload.contact_phone,
      contact_email: payload.contact_email,
      estimated_value: payload.estimated_value,
      notes: payload.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'USR-001',
      stage_entered_at: new Date().toISOString()
    };

    MOCK_OPPORTUNITIES.push(newOpportunity);

    return { ...newOpportunity };
  },

  async update(id: string, payload: OpportunityUpdatePayload): Promise<Opportunity> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = MOCK_OPPORTUNITIES.findIndex(opp => opp.id === id);
    if (index === -1) {
      throw new Error('Oportunidade não encontrada');
    }

    const currentStatus = MOCK_OPPORTUNITIES[index].status;
    const newStatus = payload.status;

    MOCK_OPPORTUNITIES[index] = {
      ...MOCK_OPPORTUNITIES[index],
      ...payload,
      updated_at: new Date().toISOString(),
      stage_entered_at: newStatus && newStatus !== currentStatus
        ? new Date().toISOString()
        : MOCK_OPPORTUNITIES[index].stage_entered_at
    };

    return { ...MOCK_OPPORTUNITIES[index] };
  },

  async close(id: string, payload: OpportunityClosePayload): Promise<Opportunity> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = MOCK_OPPORTUNITIES.findIndex(opp => opp.id === id);
    if (index === -1) {
      throw new Error('Oportunidade não encontrada');
    }

    MOCK_OPPORTUNITIES[index] = {
      ...MOCK_OPPORTUNITIES[index],
      status: payload.status,
      final_sale_value: payload.final_sale_value,
      commission_paid: payload.commission_paid,
      win_date: payload.win_date,
      loss_reason: payload.loss_reason,
      loss_reason_notes: payload.loss_reason_notes,
      loss_date: payload.loss_date,
      updated_at: new Date().toISOString(),
      stage_entered_at: new Date().toISOString()
    };

    return { ...MOCK_OPPORTUNITIES[index] };
  },

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = MOCK_OPPORTUNITIES.findIndex(opp => opp.id === id);
    if (index !== -1) {
      MOCK_OPPORTUNITIES.splice(index, 1);
    }
  },

  async getTimeline(opportunityId: string): Promise<TimelineEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return MOCK_TIMELINE.filter(event => event.opportunity_id === opportunityId);
  },

  async addTimelineEvent(event: TimelineEventCreate): Promise<TimelineEvent> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const newEvent: TimelineEvent = {
      id: `EVT-${String(MOCK_TIMELINE.length + 1).padStart(3, '0')}`,
      ...event,
      created_at: new Date().toISOString(),
      created_by: 'USR-001',
      created_by_name: 'Usuário Atual'
    };

    MOCK_TIMELINE.push(newEvent);

    return { ...newEvent };
  },

  async moveToStage(id: string, newStatus: OpportunityStatus): Promise<Opportunity> {
    return this.update(id, { status: newStatus });
  }
};
