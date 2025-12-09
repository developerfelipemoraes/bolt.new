import {
  BodyworkModel,
  BodyworkSearchParams,
  CreateBodyworkMinimal,
  PagedResponse,
} from '../types/vehicleModels';
import { ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';

class BodyworkService {
  async searchBodywork(params: BodyworkSearchParams): Promise<ApiResponse<PagedResponse<BodyworkModel>>> {
    try {
      let query = supabase
        .from('bodywork_models')
        .select('*, bodywork_manufacturers(name)', { count: 'exact' });

      if (params.bodyworkManufacturer) {
        query = query.ilike('bodywork_manufacturers.name', `%${params.bodyworkManufacturer}%`);
      }

      if (params.model) {
        query = query.ilike('model_name', `%${params.model}%`);
      }

      if (params.manufactureYear) {
        query = query.eq('manufacture_year', params.manufactureYear);
      }

      if (params.modelYear) {
        query = query.eq('model_year', params.modelYear);
      }

      const page = params.pageNumber || 1;
      const pageSize = params.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        Success: true,
        Data: {
          items: data as any[],
          totalCount: count || 0,
          pageNumber: page,
          pageSize: pageSize,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
        Message: '',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao buscar carrocerias:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao buscar carrocerias',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async getBodyworkById(id: string): Promise<ApiResponse<BodyworkModel>> {
    try {
      const { data, error } = await supabase
        .from('bodywork_models')
        .select('*, bodywork_manufacturers(name)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return {
          Success: false,
          Data: null as any,
          Error: 'Carroceria não encontrada',
          Message: 'ID não existe',
        };
      }

      return {
        Success: true,
        Data: data as any,
        Message: '',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao buscar carroceria por ID:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao buscar carroceria',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async createBodywork(bodywork: CreateBodyworkMinimal): Promise<ApiResponse<BodyworkModel>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', user.user.id)
        .single();

      if (!systemUser) throw new Error('Usuário não encontrado');

      const { data, error } = await supabase
        .from('bodywork_models')
        .insert({
          organization_id: systemUser.organization_id,
          manufacturer_id: bodywork.bodyworkManufacturer,
          model_name: bodywork.model,
          manufacture_year: bodywork.manufactureYear,
          model_year: bodywork.modelYear,
          year_entries: bodywork.yearEntries || [],
          year_ranges: bodywork.yearRanges || [],
          year_rules: bodywork.yearRules || {},
          created_by: user.user.id,
        })
        .select('*, bodywork_manufacturers(name)')
        .single();

      if (error) throw error;

      return {
        Success: true,
        Data: data as any,
        Message: 'Carroceria criada com sucesso',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao criar carroceria:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao criar carroceria',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async updateBodywork(id: string, bodywork: Partial<BodyworkModel>): Promise<ApiResponse<BodyworkModel>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (bodywork.bodyworkManufacturer) updateData.manufacturer_id = bodywork.bodyworkManufacturer;
      if (bodywork.model) updateData.model_name = bodywork.model;
      if (bodywork.manufactureYear) updateData.manufacture_year = bodywork.manufactureYear;
      if (bodywork.modelYear) updateData.model_year = bodywork.modelYear;
      if (bodywork.yearEntries) updateData.year_entries = bodywork.yearEntries;
      if (bodywork.yearRanges) updateData.year_ranges = bodywork.yearRanges;
      if (bodywork.yearRules) updateData.year_rules = bodywork.yearRules;

      const { data, error } = await supabase
        .from('bodywork_models')
        .update(updateData)
        .eq('id', id)
        .select('*, bodywork_manufacturers(name)')
        .single();

      if (error) throw error;

      return {
        Success: true,
        Data: data as any,
        Message: 'Carroceria atualizada com sucesso',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao atualizar carroceria:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao atualizar carroceria',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async deleteBodywork(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('bodywork_models')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        Success: true,
        Data: undefined as any,
        Message: 'Carroceria excluída com sucesso',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao excluir carroceria:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao excluir carroceria',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async getManufacturers(): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    try {
      const { data, error } = await supabase
        .from('bodywork_manufacturers')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      return {
        Success: true,
        Data: data || [],
        Message: '',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao buscar fabricantes:', error);
      return {
        Success: false,
        Data: [],
        Error: 'Erro ao buscar fabricantes',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }
}

export const bodyworkService = new BodyworkService();
