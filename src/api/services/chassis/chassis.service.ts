import { ApiFactory, handleRequest, ApiResponse } from '@/api/factory/apiFactory';
import {
  ChassisModel,
  ChassisModelComplete,
  ChassisModelSummary,
  ChassisSearchParams,
  CreateChassisMinimal,
  PagedResponse,
  chassisSearchParamsSchema,
  createChassisMinimalSchema,
  updateChassisSchema,
} from './chassis.types';

// Using the same base URL as vehicle service or defined via env
const BASE_URL = import.meta.env.VITE_API_CATALOG_URL || 'https://vehicle-catolog-api.kindstone-8d4454d6.eastus2.azurecontainerapps.io/api';
const api = ApiFactory.getInstance(BASE_URL);

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (sourceValue === undefined) {
        continue;
      }

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        output[key] = deepMerge(targetValue, sourceValue) as any;
      } else {
        output[key] = sourceValue as any;
      }
    }
  }

  return output;
}

export const ChassisService = {
  searchChassis: async (params: ChassisSearchParams): Promise<ApiResponse<PagedResponse<ChassisModel>>> => {
    try {
      const validated = chassisSearchParamsSchema.parse(params);

      // Manual normalization since z.transform is not used in schema to keep types simple
      const normalized: Record<string, string | number | undefined> = { ...validated };
      ['chassisManufacturer', 'model', 'enginePosition', 'drivetrain', 'category', 'subcategory'].forEach(key => {
         const val = normalized[key];
         if (typeof val === 'string') {
            normalized[key] = val
              .split(',')
              .map(part => part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim())
              .join(',');
         }
      });

      const queryParams = new URLSearchParams();
      Object.entries(normalized).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      return handleRequest(api.get<PagedResponse<ChassisModel>>(`/ChassisModels?${queryParams.toString()}`));
    } catch (error) {
       // Ideally we should return an ApiResponse with error, but handleRequest might throw.
       // Here we just rethrow or return formatted error matching ApiResponse
       return {
         Success: false,
         Data: null! as PagedResponse<ChassisModel>,
         Error: 'Parâmetros de busca inválidos',
         Message: error instanceof Error ? error.message : 'Erro de validação'
       };
    }
  },

  searchChassisSummary: async (params: ChassisSearchParams): Promise<ApiResponse<PagedResponse<ChassisModelSummary>>> => {
     try {
      const validated = chassisSearchParamsSchema.parse(params);
      const normalized: Record<string, string | number | undefined> = { ...validated };
      ['chassisManufacturer', 'model', 'enginePosition', 'drivetrain', 'category', 'subcategory'].forEach(key => {
         const val = normalized[key];
         if (typeof val === 'string') {
            normalized[key] = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
         }
      });

      const queryParams = new URLSearchParams();
      Object.entries(normalized).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      // Special handling for summary if it returns array instead of paged response
      // ApiFactory expects structured response. If endpoint returns plain array, handleRequest might need adjustment or we manually handle.
      // However, ApiFactory usually returns AxiosResponse. The wrapper `handleRequest` expects standard structure.
      // If the API returns raw array for this specific endpoint (as seen in original service), we might need to wrap it.

      const response = await api.get<any>(`/ChassisModels/summary?${queryParams.toString()}`);

      // Replicate logic from original service to handle array response
      if (Array.isArray(response.data)) {
         const pagedResponse: PagedResponse<ChassisModelSummary> = {
          items: response.data,
          total: response.data.length,
          page: Number(params.page) || 1,
          pageSize: Number(params.pageSize) || response.data.length
        };
        return {
          Success: true,
          Data: pagedResponse,
          Message: '',
          Error: ''
        };
      }

      return handleRequest(Promise.resolve(response));

    } catch (error) {
       return {
         Success: false,
         Data: null! as PagedResponse<ChassisModelSummary>,
         Error: 'Parâmetros de busca inválidos',
         Message: error instanceof Error ? error.message : 'Erro de validação'
       };
    }
  },

  getChassis: async (id: string): Promise<ApiResponse<ChassisModel>> => {
    return handleRequest(api.get<ChassisModel>(`/ChassisModels/${id}`));
  },

  getChassisComplete: async (id: string): Promise<ApiResponse<ChassisModelComplete>> => {
    return handleRequest(api.get<ChassisModelComplete>(`/ChassisModels/${id}/complete`));
  },

  createChassis: async (dto: CreateChassisMinimal): Promise<ApiResponse<ChassisModel>> => {
    try {
      const validated = createChassisMinimalSchema.parse(dto);
      return handleRequest(api.post<ChassisModel>('/ChassisModels', validated));
    } catch (error) {
      return {
         Success: false,
         Data: null! as ChassisModel,
         Error: 'Dados inválidos',
         Message: error instanceof Error ? error.message : 'Erro de validação'
       };
    }
  },

  createChassisComplete: async (dto: ChassisModelComplete): Promise<ApiResponse<ChassisModelComplete>> => {
     return handleRequest(api.post<ChassisModelComplete>('/ChassisModels/complete', dto));
  },

  updateChassis: async (id: string, dto: Partial<CreateChassisMinimal>): Promise<ApiResponse<ChassisModel>> => {
    try {
      const validated = updateChassisSchema.parse(dto);
      return handleRequest(api.put<ChassisModel>(`/ChassisModels/${id}`, validated));
    } catch (error) {
      return {
         Success: false,
         Data: null! as ChassisModel,
         Error: 'Dados inválidos',
         Message: error instanceof Error ? error.message : 'Erro de validação'
       };
    }
  },

  updateChassisComplete: async (id: string, dto: Partial<ChassisModelComplete>): Promise<ApiResponse<ChassisModelComplete>> => {
    // We need to fetch current first to merge, as per original logic
    const currentResponse = await ChassisService.getChassisComplete(id);
    if (!currentResponse.Success || !currentResponse.Data) {
        return {
          Success: false,
          Data: null! as ChassisModelComplete,
          Error: 'Erro ao buscar dados atuais',
          Message: currentResponse.Message || 'Não foi possível carregar o chassi atual',
        };
    }
    const merged = deepMerge(currentResponse.Data, dto);
    return handleRequest(api.put<ChassisModelComplete>(`/ChassisModels/${id}/complete`, merged));
  },

  deleteChassis: async (id: string): Promise<ApiResponse<void>> => {
    return handleRequest(api.delete(`/ChassisModels/${id}`));
  },

  getChassisManufacturers: async (): Promise<ApiResponse<string[]>> => {
      // API returns nested result: { success: true, data: { result: [...] } }
      // ApiFactory/handleRequest might need adaptation or we manually unwrap
      const response = await api.get<any>('/Manufacturers/chassis');
      if (response.data?.data?.result && Array.isArray(response.data.data.result)) {
           return {
               Success: true,
               Data: response.data.data.result,
               Message: '',
               Error: ''
           };
      }
      return handleRequest(Promise.resolve(response));
  }
};
