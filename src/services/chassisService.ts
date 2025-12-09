import {
  ChassisModel,
  ChassisModelComplete,
  ChassisModelSummary,
  ChassisSearchParams,
  CreateChassisMinimal,
  PagedResponse,
} from '../types/vehicleModels';
import { ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';

class ChassisService {
  async searchChassis(params: ChassisSearchParams): Promise<ApiResponse<PagedResponse<ChassisModel>>> {
    try {
      let query = supabase
        .from('chassis_models')
        .select('*, chassis_manufacturers(name)', { count: 'exact' });

      if (params.chassisManufacturer) {
        query = query.ilike('chassis_manufacturers.name', `%${params.chassisManufacturer}%`);
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
      console.error('Erro ao buscar chassis:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao buscar chassis',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async searchChassisSummary(params: ChassisSearchParams): Promise<ApiResponse<PagedResponse<ChassisModelSummary>>> {
    try {
      let query = supabase
        .from('chassis_models')
        .select('id, model, manufacturer_id, segments, manufacture_model_year_pairs, chassis_manufacturers!inner(name)', { count: 'exact' })
        .eq('is_active', true);

      if (params.chassisManufacturer) {
        query = query.ilike('chassis_manufacturers.name', `%${params.chassisManufacturer}%`);
      }

      if (params.model) {
        query = query.ilike('model', `%${params.model}%`);
      }

      if (params.category && params.subcategory) {
        query = query.contains('segments', [
          { segment: params.category, vehicleType: params.subcategory },
        ]);
      }

      if (params.manufactureYear && params.modelYear) {
        query = query.contains('manufacture_model_year_pairs', [
          { manufactureYear: params.manufactureYear, modelYear: params.modelYear },
        ]);
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
      console.error('Erro ao buscar resumo de chassis:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao buscar resumo',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async getChassis(id: string): Promise<ApiResponse<ChassisModelComplete>> {
    return this.getChassisById(id);
  }

  async getChassisById(id: string): Promise<ApiResponse<ChassisModelComplete>> {
    try {
      const { data, error } = await supabase
        .from('chassis_models')
        .select('*, chassis_manufacturers(name)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return {
          Success: false,
          Data: null as any,
          Error: 'Chassis não encontrado',
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
      console.error('Erro ao buscar chassis por ID:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao buscar chassis',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async createChassis(chassis: CreateChassisMinimal): Promise<ApiResponse<ChassisModelComplete>> {
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
        .from('chassis_models')
        .insert({
          organization_id: systemUser.organization_id,
          manufacturer_id: chassis.chassisManufacturer,
          model_name: chassis.model,
          manufacture_year: chassis.manufactureYear,
          model_year: chassis.modelYear,
          engine_data: chassis.engineData || {},
          transmission_data: chassis.transmissionData || {},
          suspension_data: chassis.suspensionData || {},
          wheel_tire_data: chassis.wheelTireData || {},
          chassis_frame_data: chassis.chassisFrameData || {},
          brake_data: chassis.brakeData || {},
          air_compressor_data: chassis.airCompressorData || {},
          year_entries: chassis.yearEntries || [],
          year_ranges: chassis.yearRanges || [],
          year_rules: chassis.yearRules || {},
          created_by: user.user.id,
        })
        .select('*, chassis_manufacturers(name)')
        .single();

      if (error) throw error;

      return {
        Success: true,
        Data: data as any,
        Message: 'Chassis criado com sucesso',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao criar chassis:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao criar chassis',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async updateChassis(id: string, chassis: Partial<ChassisModelComplete>): Promise<ApiResponse<ChassisModelComplete>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (chassis.chassisManufacturer) updateData.manufacturer_id = chassis.chassisManufacturer;
      if (chassis.model) updateData.model_name = chassis.model;
      if (chassis.manufactureYear) updateData.manufacture_year = chassis.manufactureYear;
      if (chassis.modelYear) updateData.model_year = chassis.modelYear;
      if (chassis.engineData) updateData.engine_data = chassis.engineData;
      if (chassis.transmissionData) updateData.transmission_data = chassis.transmissionData;
      if (chassis.suspensionData) updateData.suspension_data = chassis.suspensionData;
      if (chassis.wheelTireData) updateData.wheel_tire_data = chassis.wheelTireData;
      if (chassis.chassisFrameData) updateData.chassis_frame_data = chassis.chassisFrameData;
      if (chassis.brakeData) updateData.brake_data = chassis.brakeData;
      if (chassis.airCompressorData) updateData.air_compressor_data = chassis.airCompressorData;
      if (chassis.yearEntries) updateData.year_entries = chassis.yearEntries;
      if (chassis.yearRanges) updateData.year_ranges = chassis.yearRanges;
      if (chassis.yearRules) updateData.year_rules = chassis.yearRules;

      const { data, error } = await supabase
        .from('chassis_models')
        .update(updateData)
        .eq('id', id)
        .select('*, chassis_manufacturers(name)')
        .single();

      if (error) throw error;

      return {
        Success: true,
        Data: data as any,
        Message: 'Chassis atualizado com sucesso',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao atualizar chassis:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao atualizar chassis',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async deleteChassis(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('chassis_models')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        Success: true,
        Data: undefined as any,
        Message: 'Chassis excluído com sucesso',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao excluir chassis:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro ao excluir chassis',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async getManufacturers(): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    try {
      const { data, error } = await supabase
        .from('chassis_manufacturers')
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

  async getChassisManufacturers(
    category?: string,
    subcategory?: string,
    manufactureYear?: number,
    modelYear?: number
  ): Promise<ApiResponse<string[]>> {
    try {
      let query = supabase
        .from('chassis_models')
        .select('manufacturer_id, chassis_manufacturers!inner(name)', { count: 'exact' })
        .eq('is_active', true)
        .eq('chassis_manufacturers.is_active', true);

      if (category && subcategory) {
        query = query.contains('segments', [{ segment: category, vehicleType: subcategory }]);
      }

      if (manufactureYear && modelYear) {
        query = query.contains('manufacture_model_year_pairs', [
          { manufactureYear, modelYear },
        ]);
      }

      const { data, error } = await query;

      if (error) throw error;

      const uniqueManufacturers = Array.from(
        new Set(
          data
            ?.filter((item: any) => item.chassis_manufacturers?.name)
            .map((item: any) => item.chassis_manufacturers.name)
        )
      ).sort();

      return {
        Success: true,
        Data: uniqueManufacturers,
        Message: '',
        Error: '',
      };
    } catch (error) {
      console.error('Erro ao buscar fabricantes de chassi:', error);
      return {
        Success: false,
        Data: [],
        Error: 'Erro ao buscar fabricantes',
        Message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }
}

export const chassisService = new ChassisService();
