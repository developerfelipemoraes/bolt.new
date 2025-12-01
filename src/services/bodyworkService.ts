import {
  BodyworkModel,
  BodyworkSearchParams,
  CreateBodyworkMinimal,
  PagedResponse,
  bodyworkSearchParamsSchema,
  createBodyworkMinimalSchema,
  updateBodyworkSchema,
} from '../types/vehicleModels';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = 'https://vehiclecatalog-api.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api';

class BodyworkService {
  private token: string | null = null;
  private currentCompanyId: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');

    const savedCompany = localStorage.getItem('company');
    if (savedCompany) {
      try {
        const company = JSON.parse(savedCompany);
        this.currentCompanyId = company.id;
      } catch (error) {
        console.error('Erro ao carregar empresa:', error);
      }
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'API-Version': 'v1',
      'X-Company-ID': this.currentCompanyId || '',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

    return filtered.length > 0 ? `?${filtered.join('&')}` : '';
  }

  private normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private normalizeSearchParams(params: BodyworkSearchParams): BodyworkSearchParams {
    const normalized = { ...params };

    if (normalized.bodyManufacturer) {
      normalized.bodyManufacturer = this.normalizeString(normalized.bodyManufacturer);
    }
    if (normalized.model) {
      normalized.model = this.normalizeString(normalized.model);
    }
    if (normalized.category) {
      normalized.category = this.normalizeString(normalized.category);
    }
    if (normalized.subcategory) {
      normalized.subcategory = this.normalizeString(normalized.subcategory);
    }

    return normalized;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const headerAuth = await this.getHeaders();

      console.log(`🔗 Fazendo requisição para: ${API_BASE_URL}${endpoint}`);
      console.log(`🏢 Empresa atual: ${this.currentCompanyId}`);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        mode: 'cors',
        credentials: 'include',
        headers: {
          ...headerAuth,
          ...options.headers,
        },
      });

      console.log(`📡 Resposta recebida:`, response.status, response.statusText);

      const data = await response.json();

      if (data && typeof data === 'object' && 'Success' in data) {
        return data as ApiResponse<T>;
      }

      if (!response.ok) {
        console.error('API Error:', data);
        return {
          Success: false,
          Data: null as any,
          Error: data.error || 'Erro na requisição',
          Message: data.message || data.details?.join(', ') || '',
        };
      }

      return {
        Success: true,
        Data: data,
        Message: '',
        Error: ''
      };
    } catch (error) {
      console.error('Connection Error:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro de conexão',
        Message: 'Não foi possível conectar com o servidor',
      };
    }
  }

  async searchBodywork(params: BodyworkSearchParams): Promise<ApiResponse<PagedResponse<BodyworkModel>>> {
    try {
      const validated = bodyworkSearchParamsSchema.parse(params);
      const normalized = this.normalizeSearchParams(validated);
      const queryString = this.buildQueryString(normalized);

      return await this.request<PagedResponse<BodyworkModel>>(`/BodyworkModels${queryString}`);
    } catch (error) {
      console.error('Validation error:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Parâmetros de busca inválidos',
        Message: error instanceof Error ? error.message : 'Erro de validação',
      };
    }
  }

  async getBodywork(id: string): Promise<ApiResponse<BodyworkModel>> {
    return await this.request<BodyworkModel>(`/BodyworkModels/${id}`);
  }

  async createBodywork(dto: CreateBodyworkMinimal): Promise<ApiResponse<BodyworkModel>> {
    try {
      const validated = createBodyworkMinimalSchema.parse(dto);

      return await this.request<BodyworkModel>('/BodyworkModels', {
        method: 'POST',
        body: JSON.stringify(validated),
      });
    } catch (error) {
      console.error('Validation error:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Dados inválidos',
        Message: error instanceof Error ? error.message : 'Erro de validação',
      };
    }
  }

  async updateBodywork(id: string, dto: Partial<CreateBodyworkMinimal>): Promise<ApiResponse<BodyworkModel>> {
    try {
      const validated = updateBodyworkSchema.parse(dto);

      return await this.request<BodyworkModel>(`/BodyworkModels/${id}`, {
        method: 'PUT',
        body: JSON.stringify(validated),
      });
    } catch (error) {
      console.error('Validation error:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Dados inválidos',
        Message: error instanceof Error ? error.message : 'Erro de validação',
      };
    }
  }

  async deleteBodywork(id: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/BodyworkModels/${id}`, {
      method: 'DELETE',
    });
  }

  async getBodyworkManufacturers(): Promise<ApiResponse<string[]>> {
    return await this.request<string[]>('/Manufacturers/bodyworks');
  }

  updateCompanyContext(companyId: string): void {
    this.currentCompanyId = companyId;
  }
}

export const bodyworkService = new BodyworkService();
