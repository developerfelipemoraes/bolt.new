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
      const { data: categories } = await supabase
        .from('vehicle_categories')
        .select('id, name')
        .eq('is_active', true);

      const { data: subcategories } = await supabase
        .from('vehicle_subcategories')
        .select('id, name, category_id')
        .eq('is_active', true);

      const categoryId = categories?.find((c) => c.name === params.category)?.id;
      const subcategoryId = subcategories?.find((s) => s.name === params.subcategory)?.id;

      let query = supabase
        .from('bodywork_models')
        .select('*, bodywork_manufacturers!inner(name)', { count: 'exact' })
        .eq('is_active', true);

      if (params.bodyManufacturer || params.bodyworkManufacturer) {
        const manufacturer = params.bodyManufacturer || params.bodyworkManufacturer;
        query = query.ilike('bodywork_manufacturers.name', `%${manufacturer}%`);
      }

      if (params.model) {
        query = query.ilike('model', `%${params.model}%`);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }

      const page = params.pageNumber || 1;
      const pageSize = params.pageSize || 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      let filteredData = data;

      if (params.manufactureYear && params.modelYear) {
        filteredData = data?.filter((item: any) => {
          const yearEntries = item.year_entries_data || [];
          const yearRanges = item.year_ranges || [];

          const hasMatchingEntry = yearEntries.some(
            (entry: any) =>
              entry.manufactureYear === params.manufactureYear &&
              entry.modelYear === params.modelYear
          );

          const hasMatchingRange = yearRanges.some(
            (range: any) =>
              params.manufactureYear! >= range.start &&
              params.manufactureYear! <= range.end &&
              params.modelYear! >= range.start &&
              params.modelYear! <= range.end
          );

          return hasMatchingEntry || hasMatchingRange;
        });
      }

      const finalCount = filteredData?.length || 0;

      return {
        Success: true,
        Data: {
          items: filteredData as any[],
          totalCount: finalCount,
          pageNumber: page,
          pageSize: pageSize,
          totalPages: Math.ceil(finalCount / pageSize),
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

  async getBodywork(id: string): Promise<ApiResponse<BodyworkModel>> {
    return this.getBodyworkById(id);
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

  async getBodyworkManufacturers(
    category?: string,
    subcategory?: string,
    manufactureYear?: number,
    modelYear?: number
  ): Promise<ApiResponse<string[]>> {
    try {
      const { data: categories } = await supabase
        .from('vehicle_categories')
        .select('id, name')
        .eq('is_active', true);

      const { data: subcategories } = await supabase
        .from('vehicle_subcategories')
        .select('id, name, category_id')
        .eq('is_active', true);

      const categoryId = categories?.find((c) => c.name === category)?.id;
      const subcategoryId = subcategories?.find((s) => s.name === subcategory)?.id;

      let query = supabase
        .from('bodywork_models')
        .select('manufacturer_id, bodywork_manufacturers!inner(name)', { count: 'exact' })
        .eq('is_active', true)
        .eq('bodywork_manufacturers.is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data;

      if (manufactureYear && modelYear) {
        filteredData = data?.filter((item: any) => {
          const yearEntries = item.year_entries_data || [];
          const yearRanges = item.year_ranges || [];

          const hasMatchingEntry = yearEntries.some(
            (entry: any) =>
              entry.manufactureYear === manufactureYear && entry.modelYear === modelYear
          );

          const hasMatchingRange = yearRanges.some(
            (range: any) =>
              manufactureYear >= range.start &&
              manufactureYear <= range.end &&
              modelYear >= range.start &&
              modelYear <= range.end
          );

          return hasMatchingEntry || hasMatchingRange;
        });
      }

      const uniqueManufacturers = Array.from(
        new Set(
          filteredData
            ?.filter((item: any) => item.bodywork_manufacturers?.name)
            .map((item: any) => item.bodywork_manufacturers.name)
        )
      ).sort();

      return {
        Success: true,
        Data: uniqueManufacturers,
        Message: '',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao buscar fabricantes de carroceria:', error);
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
