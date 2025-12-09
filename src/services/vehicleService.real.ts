import { supabase } from '@/lib/supabase';
import { Vehicle, VehicleFormData } from '@/types/vehicle';

interface VehicleFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  city?: string;
  state?: string;
  supplierId?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

class VehicleServiceReal {
  async getVehicles(
    page: number = 1,
    limit: number = 20,
    filters?: VehicleFilters
  ): Promise<PaginatedResponse<Vehicle>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('vehicles')
        .select('*, companies!vehicles_supplier_id_fkey(id, trade_name, legal_name)', { count: 'exact' });

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.category) {
        query = query.eq('category_name', filters.category);
      }

      if (filters?.subcategory) {
        query = query.eq('subcategory_name', filters.subcategory);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('sale_value', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('sale_value', filters.maxPrice);
      }

      if (filters?.minYear !== undefined) {
        query = query.gte('fabrication_year', filters.minYear);
      }

      if (filters?.maxYear !== undefined) {
        query = query.lte('fabrication_year', filters.maxYear);
      }

      if (filters?.city) {
        query = query.eq('location_city', filters.city);
      }

      if (filters?.state) {
        query = query.eq('location_state', filters.state);
      }

      if (filters?.supplierId) {
        query = query.eq('supplier_id', filters.supplierId);
      }

      // Ordenar por data de criação (mais recente primeiro)
      query = query.order('created_at', { ascending: false });

      // Aplicar paginação
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Erro ao buscar veículos:', error);
        throw error;
      }

      return {
        items: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, companies!vehicles_supplier_id_fkey(id, trade_name, legal_name)')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar veículo:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      throw error;
    }
  }

  async createVehicle(vehicleData: any): Promise<Vehicle> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar organization_id do usuário
      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle();

      // Mapear estrutura nested do wizard para flat do Supabase
      const payload = {
        // Tipo e Categoria
        vehicle_type_id: vehicleData.vehicleType?.id || '',
        vehicle_type_name: vehicleData.vehicleType?.name || '',
        category_id: vehicleData.category?.id || '',
        category_name: vehicleData.category?.name || '',
        subcategory_id: vehicleData.subcategory?.id || null,
        subcategory_name: vehicleData.subcategory?.name || null,

        // Identificação do Produto
        title: vehicleData.productIdentification?.title || '',
        description: vehicleData.secondaryInfo?.description || '',

        // Informações de Chassi e Carroceria
        chassis_manufacturer: vehicleData.chassisInfo?.chassisManufacturer || null,
        chassis_model: vehicleData.chassisInfo?.chassisModel || null,
        body_manufacturer: vehicleData.chassisInfo?.bodyManufacturer || null,
        body_model: vehicleData.chassisInfo?.bodyModel || null,

        // Dados do Veículo
        fabrication_year: vehicleData.vehicleData?.fabricationYear || null,
        model_year: vehicleData.vehicleData?.modelYear || null,
        mileage: vehicleData.vehicleData?.mileage || 0,
        license_plate: vehicleData.vehicleData?.licensePlate || null,
        renavam: vehicleData.vehicleData?.renavam || null,
        chassis_number: vehicleData.vehicleData?.chassis || null,
        bus_prefix: vehicleData.vehicleData?.busPrefix || null,
        available_quantity: vehicleData.vehicleData?.availableQuantity || 1,

        // Informações Secundárias
        capacity: vehicleData.secondaryInfo?.capacity || null,
        condition: vehicleData.secondaryInfo?.condition || 'used',
        fuel_type: vehicleData.secondaryInfo?.fuelType || null,
        steering: vehicleData.secondaryInfo?.steering || null,
        single_owner: vehicleData.secondaryInfo?.singleOwner || false,

        // Composição de Assentos
        seat_conventional: vehicleData.seatComposition?.totals?.conventional || 0,
        seat_executive: vehicleData.seatComposition?.totals?.executive || 0,
        seat_semi_sleeper: vehicleData.seatComposition?.totals?.semiSleeper || 0,
        seat_sleeper: vehicleData.seatComposition?.totals?.sleeper || 0,
        seat_sleeper_bed: vehicleData.seatComposition?.totals?.sleeperBed || 0,
        seat_fixed: vehicleData.seatComposition?.totals?.fixed || 0,
        seat_total_capacity: vehicleData.seatComposition?.totalCapacity || 0,
        seat_composition_text: vehicleData.seatComposition?.compositionText || null,
        seat_composition_details: vehicleData.seatComposition?.composition || [],

        // Opcionais
        optional_air_conditioning: vehicleData.optionals?.airConditioning || false,
        optional_usb: vehicleData.optionals?.usb || false,
        optional_package_holder: vehicleData.optionals?.packageHolder || false,
        optional_sound_system: vehicleData.optionals?.soundSystem || false,
        optional_monitor: vehicleData.optionals?.monitor || false,
        optional_wifi: vehicleData.optionals?.wifi || false,
        optional_bathroom: vehicleData.optionals?.bathroom || false,
        optional_glass_type: vehicleData.optionals?.glasType || null,
        optional_curtain: vehicleData.optionals?.curtain || false,
        optional_cabin: vehicleData.optionals?.cabin || false,
        optional_accessibility: vehicleData.optionals?.accessibility || false,
        optional_factory_retarder: vehicleData.optionals?.factoryRetarder || false,
        optional_optional_retarder: vehicleData.optionals?.optionalRetarder || false,
        optional_leg_support: vehicleData.optionals?.legSupport || false,
        optional_coffee_maker: vehicleData.optionals?.coffeeMaker || false,

        // Localização
        location_address: vehicleData.location?.address || null,
        location_neighborhood: vehicleData.location?.neighborhood || null,
        location_city: vehicleData.location?.city || null,
        location_state: vehicleData.location?.state || null,
        location_zip_code: vehicleData.location?.zipCode || null,
        location_lat: vehicleData.location?.lat || null,
        location_lng: vehicleData.location?.lng || null,

        // Mídia
        media_original_interior: vehicleData.media?.originalPhotosInteriorUrls || [],
        media_original_exterior: vehicleData.media?.originalPhotosExteriorUrls || [],
        media_original_instruments: vehicleData.media?.originalPhotosInstrumentsUrls || [],
        media_treated_photos: vehicleData.media?.treatedPhotosUrls || [],
        media_document_photos: vehicleData.media?.documentPhotosUrls || [],
        media_video: vehicleData.media?.video || null,

        // Precificação
        cost_value: vehicleData.pricing?.costValue || 0,
        sale_value: vehicleData.pricing?.saleValue || 0,
        margin_type: vehicleData.pricing?.marginType || null,
        margin_parameter: vehicleData.pricing?.marginParameter || null,
        commission_percentage: vehicleData.commissionConfig?.percentage || 0,

        // Fornecedor
        supplier_id: vehicleData.supplier?.id || null,
        supplier_name: vehicleData.supplier?.companyName || null,

        // Status
        status: 'Disponível',
        internal_notes: '',
        tags: [],

        // Metadados
        created_by: user.id,
        organization_id: systemUser?.organization_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('vehicles')
        .insert([payload])
        .select('*, companies!vehicles_supplier_id_fkey(id, trade_name, legal_name)')
        .single();

      if (error) {
        console.error('Erro ao criar veículo:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  }

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const payload = {
        ...vehicleData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('vehicles')
        .update(payload)
        .eq('id', id)
        .select('*, companies!vehicles_supplier_id_fkey(id, trade_name, legal_name)')
        .single();

      if (error) {
        console.error('Erro ao atualizar veículo:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  }

  async deleteVehicle(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar veículo:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      throw error;
    }
  }

  async searchVehicles(searchTerm: string, filters?: VehicleFilters): Promise<Vehicle[]> {
    try {
      let query = supabase
        .from('vehicles')
        .select('*, companies!vehicles_supplier_id_fkey(id, trade_name, legal_name)');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,chassis_manufacturer.ilike.%${searchTerm}%,chassis_model.ilike.%${searchTerm}%,body_manufacturer.ilike.%${searchTerm}%,body_model.ilike.%${searchTerm}%`);
      }

      // Aplicar filtros adicionais
      if (filters?.category) {
        query = query.eq('category_name', filters.category);
      }

      if (filters?.subcategory) {
        query = query.eq('subcategory_name', filters.subcategory);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('sale_value', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('sale_value', filters.maxPrice);
      }

      if (filters?.minYear !== undefined) {
        query = query.gte('fabrication_year', filters.minYear);
      }

      if (filters?.maxYear !== undefined) {
        query = query.lte('fabrication_year', filters.maxYear);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar veículos:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, companies!vehicles_supplier_id_fkey(id, trade_name, legal_name)')
        .in('status', ['Disponível', 'AVAILABLE'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar veículos disponíveis:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar veículos disponíveis:', error);
      throw error;
    }
  }

  async updateVehicleStatus(id: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar status do veículo:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar status do veículo:', error);
      throw error;
    }
  }

  async getVehicleCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('category_name')
        .not('category_name', 'is', null);

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
      }

      const categories = [...new Set(data.map(v => v.category_name))];
      return categories.filter(Boolean) as string[];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  async getVehicleSubcategories(category?: string): Promise<string[]> {
    try {
      let query = supabase
        .from('vehicles')
        .select('subcategory_name')
        .not('subcategory_name', 'is', null);

      if (category) {
        query = query.eq('category_name', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar subcategorias:', error);
        throw error;
      }

      const subcategories = [...new Set(data.map(v => v.subcategory_name))];
      return subcategories.filter(Boolean) as string[];
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
      throw error;
    }
  }
}

export const vehicleServiceReal = new VehicleServiceReal();
export default vehicleServiceReal;
