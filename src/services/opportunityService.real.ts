import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import { addOrganizationId } from '@/lib/organizationHelpers';

type OpportunityRow = Database['public']['Tables']['sales_opportunities']['Row'];
type OpportunityInsert = Database['public']['Tables']['sales_opportunities']['Insert'];
type OpportunityUpdate = Database['public']['Tables']['sales_opportunities']['Update'];
type TimelineRow = Database['public']['Tables']['opportunity_timeline']['Row'];
type TimelineInsert = Database['public']['Tables']['opportunity_timeline']['Insert'];

export const opportunityServiceReal = {
  async getAll(pipelineId?: string) {
    let query = supabase
      .from('sales_opportunities')
      .select(`
        *,
        pipeline:sales_pipelines(*),
        stage:pipeline_stages(*),
        contact:contacts(*),
        vehicle:vehicles(*),
        supplier:companies(*)
      `)
      .order('created_at', { ascending: false });

    if (pipelineId) {
      query = query.eq('pipeline_id', pipelineId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('sales_opportunities')
      .select(`
        *,
        pipeline:sales_pipelines(*),
        stage:pipeline_stages(*),
        contact:contacts(*),
        vehicle:vehicles(*),
        supplier:companies(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(payload: OpportunityInsert) {
    const { data: user } = await supabase.auth.getUser();

    const dataWithOrg = await addOrganizationId({
      ...payload,
      created_by: user.user?.id,
      status: 'OPEN'
    });

    const { data, error } = await supabase
      .from('sales_opportunities')
      .insert(dataWithOrg)
      .select()
      .single();

    if (error) throw error;

    await this.addTimelineEvent({
      opportunity_id: data.id,
      event_type: 'CREATED',
      event_description: 'Oportunidade criada'
    });

    return data;
  },

  async update(id: string, payload: OpportunityUpdate) {
    const { data, error } = await supabase
      .from('sales_opportunities')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async close(id: string, closeData: {
    status: 'WON' | 'LOST';
    final_sale_value?: number;
    commission_value?: number;
    win_date?: string;
    loss_reason_id?: string;
    loss_date?: string;
  }) {
    const { data, error } = await supabase
      .from('sales_opportunities')
      .update(closeData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('sales_opportunities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getTimeline(opportunityId: string) {
    const { data, error } = await supabase
      .from('opportunity_timeline')
      .select('*')
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addTimelineEvent(event: TimelineInsert) {
    const { data: user } = await supabase.auth.getUser();

    const dataWithOrg = await addOrganizationId({
      ...event,
      created_by: user.user?.id
    });

    const { data, error } = await supabase
      .from('opportunity_timeline')
      .insert(dataWithOrg)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async moveToStage(opportunityId: string, stageId: string) {
    const { data, error } = await supabase
      .from('sales_opportunities')
      .update({ stage_id: stageId })
      .eq('id', opportunityId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
