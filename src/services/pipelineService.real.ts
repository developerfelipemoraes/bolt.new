import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type PipelineRow = Database['public']['Tables']['sales_pipelines']['Row'];
type PipelineInsert = Database['public']['Tables']['sales_pipelines']['Insert'];
type PipelineUpdate = Database['public']['Tables']['sales_pipelines']['Update'];

export const pipelineServiceReal = {
  async getAll() {
    const { data, error } = await supabase
      .from('sales_pipelines')
      .select(`
        *,
        stages:pipeline_stages(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('sales_pipelines')
      .select(`
        *,
        stages:pipeline_stages(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getDefault() {
    const { data, error } = await supabase
      .from('sales_pipelines')
      .select(`
        *,
        stages:pipeline_stages(*)
      `)
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  },

  async create(payload: PipelineInsert & { stages?: any[] }) {
    const { data: user } = await supabase.auth.getUser();

    const { stages, ...pipelineData } = payload;

    const { data, error } = await supabase
      .from('sales_pipelines')
      .insert({
        ...pipelineData,
        created_by: user.user?.id
      })
      .select()
      .single();

    if (error) throw error;

    if (stages && stages.length > 0) {
      const { error: stagesError } = await supabase
        .from('pipeline_stages')
        .insert(
          stages.map((stage, index) => ({
            pipeline_id: data.id,
            name: stage.name,
            description: stage.description,
            color: stage.color,
            order_position: stage.order || index,
            is_final: stage.is_final || false
          }))
        );

      if (stagesError) throw stagesError;
    }

    return this.getById(data.id);
  },

  async update(id: string, payload: PipelineUpdate) {
    const { data, error } = await supabase
      .from('sales_pipelines')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('sales_pipelines')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
