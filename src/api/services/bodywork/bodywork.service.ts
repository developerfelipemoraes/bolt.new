import { ApiFactory, handleRequest, ApiResponse } from '@/api/factory/apiFactory';
import {
  BodyworkModel,
  BodyworkSearchParams,
  CreateBodyworkMinimal,
  PagedResponse,
  bodyworkSearchParamsSchema,
  createBodyworkMinimalSchema,
  updateBodyworkSchema,
} from './bodywork.types';

const BASE_URL = import.meta.env.VITE_API_CATALOG_URL || 'https://vehicle-catolog-api.kindstone-8d4454d6.eastus2.azurecontainerapps.io/api';

console.log(`[BodyworkService] BASE_URL: ${BASE_URL}`);

const api = ApiFactory.getInstance(BASE_URL);

console.log('[BodyworkService] API instance created');

console.log('[BodyworkService] API instance created' +  api);


export const BodyworkService = {
  searchBodywork: async (params: BodyworkSearchParams): Promise<ApiResponse<PagedResponse<BodyworkModel>>> => {
    try {
      const validated = bodyworkSearchParamsSchema.parse(params);
      const normalized: Record<string, string | number | undefined> = { ...validated };
      ['bodyManufacturer', 'model', 'category', 'subcategory'].forEach(key => {
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

      return handleRequest(api.get<PagedResponse<BodyworkModel>>(`/BodyworkModels?${queryParams.toString()}`));
    } catch (error) {
       return {
         Success: false,
         Data: null! as PagedResponse<BodyworkModel>,
         Error: 'Parâmetros de busca inválidos',
         Message: error instanceof Error ? error.message : 'Erro de validação'
       };
    }
  },

  getBodywork: async (id: string): Promise<ApiResponse<BodyworkModel>> => {
    return handleRequest(api.get<BodyworkModel>(`/BodyworkModels/${id}`));
  },

  createBodywork: async (dto: CreateBodyworkMinimal): Promise<ApiResponse<BodyworkModel>> => {
    try {
      const validated = createBodyworkMinimalSchema.parse(dto);
      return handleRequest(api.post<BodyworkModel>('/BodyworkModels', validated));
    } catch (error) {
      return {
         Success: false,
         Data: null! as BodyworkModel,
         Error: 'Dados inválidos',
         Message: error instanceof Error ? error.message : 'Erro de validação'
       };
    }
  },

  updateBodywork: async (id: string, dto: Partial<CreateBodyworkMinimal>): Promise<ApiResponse<BodyworkModel>> => {
    try {
      console.log(`[BodyworkService] updateBodywork - ID: ${id}`);
      console.log(`[BodyworkService] updateBodywork - Payload (Raw):`, dto);

      const validated = updateBodyworkSchema.parse(dto);
      console.log(`[BodyworkService] updateBodywork - Payload (Validated):`, validated);
      console.log(`[BodyworkService] updateBodywork - Endpoint: /BodyworkModels/${id}`);

      console.log(api)

      const response = await handleRequest(api.put<BodyworkModel>(`/BodyworkModels/${id}`, validated));

      console.log(`[BodyworkService] updateBodywork - Response:`, response);
      return response;
    } catch (error) {
      console.error(`[BodyworkService] updateBodywork - Error:`, error);
      return {
         Success: false,
         Data: null! as BodyworkModel,
         Error: 'Dados inválidos',
         Message: error instanceof Error ? error.message : 'Erro de validação'
       };
    }
  },

  deleteBodywork: async (id: string): Promise<ApiResponse<void>> => {
    return handleRequest(api.delete(`/BodyworkModels/${id}`));
  },

  getBodyworkManufacturers: async (): Promise<ApiResponse<string[]>> => {
      // API returns { success: true, data: [...] }
      // Using plural endpoint /Manufacturers/bodyworks as verified
      return handleRequest(api.get<string[]>('/Manufacturers/bodyworks'));
  }
};
