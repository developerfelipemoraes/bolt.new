import {
  ChassisModel,
  ChassisModelSummary,
  ChassisSearchParams,
  CreateChassisMinimal,
  PagedResponse,
  chassisSearchParamsSchema,
  createChassisMinimalSchema,
  updateChassisSchema,
} from '../types/vehicleModels';

const API_BASE_URL = 'https://localhost:61847/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ChassisService {
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

  private normalizeSearchParams(params: ChassisSearchParams): ChassisSearchParams {
    const normalized = { ...params };

    if (normalized.chassisManufacturer) {
      normalized.chassisManufacturer = this.normalizeString(normalized.chassisManufacturer);
    }
    if (normalized.model) {
      normalized.model = this.normalizeString(normalized.model);
    }
    if (normalized.enginePosition) {
      normalized.enginePosition = this.normalizeString(normalized.enginePosition);
    }
    if (normalized.drivetrain) {
      normalized.drivetrain = this.normalizeString(normalized.drivetrain);
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

      if (!response.ok) {
        console.error('API Error:', data);
        return {
          error: data.error || 'Erro na requisição',
          message: data.message || data.details?.join(', '),
        };
      }

      return { data };
    } catch (error) {
      console.error('Connection Error:', error);
      return {
        error: 'Erro de conexão',
        message: 'Não foi possível conectar com o servidor',
      };
    }
  }

  async searchChassis(params: ChassisSearchParams): Promise<ApiResponse<PagedResponse<ChassisModel>>> {
    try {
      const validated = chassisSearchParamsSchema.parse(params);
      const normalized = this.normalizeSearchParams(validated);
      const queryString = this.buildQueryString(normalized);

      return await this.request<PagedResponse<ChassisModel>>(`/ChassisModels${queryString}`);
    } catch (error) {
      console.error('Validation error:', error);
      return {
        error: 'Parâmetros de busca inválidos',
        message: error instanceof Error ? error.message : 'Erro de validação',
      };
    }
  }

  async searchChassisSummary(params: ChassisSearchParams): Promise<ApiResponse<PagedResponse<ChassisModelSummary>>> {
    try {
      const validated = chassisSearchParamsSchema.parse(params);
      const normalized = this.normalizeSearchParams(validated);
      const queryString = this.buildQueryString(normalized);

      return await this.request<PagedResponse<ChassisModelSummary>>(`/ChassisModels/summary${queryString}`);
    } catch (error) {
      console.error('Validation error:', error);
      return {
        error: 'Parâmetros de busca inválidos',
        message: error instanceof Error ? error.message : 'Erro de validação',
      };
    }
  }

  async getChassis(id: string): Promise<ApiResponse<ChassisModel>> {
    return await this.request<ChassisModel>(`/ChassisModels/${id}`);
  }

  async createChassis(dto: CreateChassisMinimal): Promise<ApiResponse<ChassisModel>> {
    try {
      const validated = createChassisMinimalSchema.parse(dto);

      return await this.request<ChassisModel>('/ChassisModels', {
        method: 'POST',
        body: JSON.stringify(validated),
      });
    } catch (error) {
      console.error('Validation error:', error);
      return {
        error: 'Dados inválidos',
        message: error instanceof Error ? error.message : 'Erro de validação',
      };
    }
  }

  async updateChassis(id: string, dto: Partial<CreateChassisMinimal>): Promise<ApiResponse<ChassisModel>> {
    try {
      const validated = updateChassisSchema.parse(dto);

      return await this.request<ChassisModel>(`/ChassisModels/${id}`, {
        method: 'PUT',
        body: JSON.stringify(validated),
      });
    } catch (error) {
      console.error('Validation error:', error);
      return {
        error: 'Dados inválidos',
        message: error instanceof Error ? error.message : 'Erro de validação',
      };
    }
  }

  async deleteChassis(id: string): Promise<ApiResponse<void>> {
    return await this.request<void>(`/ChassisModels/${id}`, {
      method: 'DELETE',
    });
  }

  updateCompanyContext(companyId: string): void {
    this.currentCompanyId = companyId;
  }
}

export const chassisService = new ChassisService();
