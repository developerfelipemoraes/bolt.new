const API_BASE_URL = 'https://vehicles.bravewave-de2e6ca9.westus2.azurecontainerapps.io/api';
//const API_BASE_URL = 'https://localhost:60920/api';
//const API_BASE_URL = "http://localhost:8084/api";

type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  expiresIn: string;
}

import { ApiResponse } from '@/types/api';

class VehicleService {
  private token: string | null = null;
  private currentCompanyId: string | null = null;


  constructor() {
    // Recuperar token do localStorage
    this.token = localStorage.getItem('auth_token');
    
    // Recuperar empresa atual
    const savedCompany = localStorage.getItem('company');

    if (savedCompany) {
      try 
      {
        const company = JSON.parse(savedCompany);
        this.currentCompanyId = company.id;
      } catch (error) {
        console.error('Erro ao carregar empresa:', error);
      }
    }
  }

  private async getHeaders(): Promise<HeadersInit> {
    // Recuperar usuário atual
    const savedUser = localStorage.getItem('user');

    const user = JSON.parse(savedUser);
    
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


private async getHeadersWithoutToken(): Promise<HeadersInit> {
    // Recuperar usuário atual
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    return headers;
  }

  private addCompanyFilter(endpoint: string): string {
    // Para super admin, não adicionar filtro automático
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role === 'super_admin') {
          return endpoint;
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    }
    
    // Para outros usuários, adicionar filtro de empresa
    const separator = endpoint.includes('?') ? '&' : '?';

    return `${endpoint}${separator}companyId=${this.currentCompanyId}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    
    try {

      const filteredEndpoint = this.addCompanyFilter(endpoint);
      
      var headerAuth = await this.getHeaders();
    
      console.log(`🔗 Fazendo requisição para: ${API_BASE_URL}${filteredEndpoint}`);
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
        console.log(response);
        return {
          Success: false,
          Data: null as any,
          Error: data.error || 'Erro na requisição',
          Message: data.message || data.details?.join(', ') || '',
        };
      }

      return {
        Success: true,
        Data: data.data as T,
        Message: '',
        Error: ''
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        Success: false,
        Data: null as any,
        Error: 'Erro de conexão',
        Message: 'Não foi possível conectar com o servidor',
      };
    }
  }


  updateCompanyContext(companyId: string): void {
    this.currentCompanyId = companyId;
  }

  // Company methods
  async getVehicles(): Promise<Vehicle[]> {

    const user =  localStorage.getItem('user') && JSON.parse( localStorage.getItem('user'));

    console.log('Usuário para autenticação de veículos:', user.email);

    console.log('Usuário para autenticação de veículos:', user.tenatyId);

    const response = await this.request<Paged<Vehicle> | Vehicle[]>('/vehicles?page=1&limit=1000&sortBy=createdAt&sortOrder=desc');

    const data = response.Data;

    // Se a API já retorna array, usa direto; senão usa data.items
    const items: Vehicle[] = Array.isArray(data)
      ? data
      : (data?.items ?? []);
    
    console.log('Veiculos carregadas:', items);
  
    return items;
  }

  async uploadImages (files: File[]) {
    
    var urlUploadImage = API_BASE_URL + "/upload/images";

    console.log('Fazendo upload para:', urlUploadImage);

    if(files == null) return [];

    const fd = new FormData();
      
     for (const f of files) {
        if (f instanceof File) {
          fd.append("files", f); // nome do campo pode ser qualquer um
        }
      }
    
    if (files.length === 0) return [];

    if (!files || files.length === 0) {
      throw new Error("Nenhum arquivo selecionado para upload.");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    for (const f of files) {
      if (!allowedTypes.includes(f.type)) {
        throw new Error(`Tipo de arquivo inválido: ${f.type}`);
      }
    }
      
     const res = await fetch(urlUploadImage, {
        method: "POST",
        // NÃO defina Content-Type aqui!
        headers: { Authorization: `Bearer ${this.token}` } ,
        body: fd
      });
      
      console.log('Resposta do upload:', res);  
      
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Upload falhou (${res.status}): ${txt}`);
      }

      // back retorna { urls: string[] }? ajuste conforme seu endpoint
      const json = await res.json().catch(() => ({}));
      
      const urls: string[] = json.urls ?? json ?? [];

      console.log('URLs recebidas:', urls);
      
      if (!Array.isArray(urls)) throw new Error("Resposta inesperada do servidor.");
      
      return urls;
  }

   async createVehicle(vehicle: Vehicle): Promise<Vehicle> {

    // Adicionar companyId automaticamente
    const [originalInterior, originalExterior, originalInstruments, treated, documents] = await Promise.all([
      this.uploadImages(vehicle.media.originalPhotosInterior || []),
      this.uploadImages(vehicle.media.originalPhotosExterior || []),
      this.uploadImages(vehicle.media.originalPhotosInstruments || []),
      this.uploadImages(vehicle.media.treatedPhotos),
      this.uploadImages(vehicle.media.documentPhotos),
    ]);

    console.log('Criando veículo para a empresa:', this.currentCompanyId);

    const uploaded: UploadedMediaUrls = {
      originalInterior,
      originalExterior,
      originalInstruments,
      treated,
      documents,
      // se o "video" veio como File, suba e vire URL; se já for string, mantenha
      video: null,//typeof ui.media.video === "string" ? ui.media.video : undefined
    };
    // 2) monta payload só com URLs
    const payload = toVehiclePayload(vehicle, uploaded);

    console.log('Payload do veículo:', JSON.stringify(payload));

    const response = await this.request<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log(response.Data);

    if (response.Error || !response.Data) {
        throw new Error(`Upload falhou (${response.Message})`);
    }
    return response.Data;
  }
  
  async updateVehicle(vehicleId: string, updateData: any): Promise<Vehicle> {
    console.log('Atualizando veículo:', vehicleId, updateData);

    const response = await this.request<Vehicle>(`/vehicles/${vehicleId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });

    if (response.Error || !response.Data) {
      throw new Error(response.Message || 'Erro ao atualizar veículo');
    }

    return response.Data;
  }

}

export const apiService = new VehicleService();
import { toVehiclePayload, UploadedMediaUrls, Vehicle } from '@/types/vehicle';

export default apiService;