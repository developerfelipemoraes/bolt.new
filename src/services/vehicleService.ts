import { toVehiclePayload, UploadedMediaUrls, Vehicle, VehicleSearchParams } from '@/types/vehicle';
import { BaseService } from './baseService';

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

class VehicleService extends BaseService {
  protected baseUrl = import.meta.env.VITE_API_VEHICLE_URL || 'http://localhost:8084/api';

  updateCompanyContext(companyId: string): void {
    // This is handled by localStorage in BaseService usually,
    // but if we need dynamic runtime switching we might need to override currentCompanyId
    // or just rely on the stored value.
    // For now, let's persist it to storage if this method is called.
    const company = localStorage.getItem('company');
    if (company) {
        const parsed = JSON.parse(company);
        parsed.id = companyId;
        localStorage.setItem('company', JSON.stringify(parsed));
    }
  }

  // Company methods
  async getVehicles(page: number = 1, limit: number = 100, searchParams?: VehicleSearchParams): Promise<{ items: Vehicle[], total: number }> {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user) {
        console.log('Usuário para autenticação de veículos:', user.email);
        console.log('Usuário para autenticação de veículos:', user.tenatyId);
    }

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    // Sort mapping
    let sortBy = 'createdAt';
    let sortOrder = 'desc';

    if (searchParams?.sortBy) {
        switch (searchParams.sortBy) {
            case 'price-asc':
                sortBy = 'price';
                sortOrder = 'asc';
                break;
            case 'price-desc':
                sortBy = 'price';
                sortOrder = 'desc';
                break;
            case 'year-asc':
                sortBy = 'fabricationYear';
                sortOrder = 'asc';
                break;
            case 'year-desc':
                sortBy = 'fabricationYear';
                sortOrder = 'desc';
                break;
            case 'updated-desc':
                sortBy = 'updatedAt';
                sortOrder = 'desc';
                break;
            default: // relevance or default
                sortBy = 'createdAt';
                sortOrder = 'desc';
        }
    }

    queryParams.append('sortBy', sortBy);
    queryParams.append('sortOrder', sortOrder);

    // Filter mapping
    if (searchParams) {
        if (searchParams.query) {
            queryParams.append('searchTerm', searchParams.query);
        }

        const f = searchParams.filters;
        if (f) {
            if (f.categories && f.categories.length > 0) {
                // Assuming API accepts comma separated or multiple params. Using comma separated for now.
                queryParams.append('category', f.categories.join(','));
            }
            if (f.status && f.status.length > 0) {
                queryParams.append('status', f.status.join(','));
            }
            if (f.states && f.states.length > 0) {
                queryParams.append('state', f.states.join(','));
            }
             if (f.cities && f.cities.length > 0) {
                queryParams.append('city', f.cities.join(','));
            }
            // Map simple ranges if possible, though API support is unverified.
            // Best effort to propagate intent.
            if (f.yearRange) {
                 queryParams.append('minYear', f.yearRange[0].toString());
                 queryParams.append('maxYear', f.yearRange[1].toString());
            }
             if (f.priceRange) {
                 queryParams.append('minPrice', f.priceRange[0].toString());
                 queryParams.append('maxPrice', f.priceRange[1].toString());
            }
        }
    }

    const endpoint = `/vehicles?${queryParams.toString()}`;

    let finalEndpoint = endpoint;
    if (user && user.role !== 'super_admin' && this.currentCompanyId && !queryParams.has('companyId')) {
        finalEndpoint += `&companyId=${this.currentCompanyId}`;
    }

    const response = await this.request<Paged<Vehicle> | Vehicle[]>(finalEndpoint);

    const data = response.Data;

    let items: Vehicle[] = [];
    let total = 0;

    if (Array.isArray(data)) {
      items = data;
      total = data.length;
    } else if (data && typeof data === 'object') {
      const extractedItems = (data as any).items;
      items = Array.isArray(extractedItems) ? extractedItems : [];
      total = (data as any).total ?? items.length;
    }
    
    console.log(`Veiculos carregadas (Page ${page}):`, items.length);
  
    return { items, total };
  }

  async uploadImages (files: File[]) {
    const urlUploadImage = this.baseUrl + "/upload/images";

    console.log('Fazendo upload para:', urlUploadImage);

    if(files == null || files.length === 0) return [];

    const fd = new FormData();
      
    for (const f of files) {
        if (f instanceof File) {
          fd.append("files", f);
        }
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    for (const f of files) {
      if (!allowedTypes.includes(f.type)) {
        throw new Error(`Tipo de arquivo inválido: ${f.type}`);
      }
    }
      
     const res = await fetch(urlUploadImage, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.token}` }, // BaseService access to token
        body: fd
      });
      
      console.log('Resposta do upload:', res);  
      
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Upload falhou (${res.status}): ${txt}`);
      }

      const json = await res.json().catch(() => ({}));
      const urls: string[] = json.urls ?? json ?? [];

      console.log('URLs recebidas:', urls);
      
      if (!Array.isArray(urls)) throw new Error("Resposta inesperada do servidor.");
      
      return urls;
  }

   async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
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
      video: null,
    };

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

  async getVehicleBySku(sku: string): Promise<Vehicle> {
    console.log('Buscando veículo por SKU:', sku);

    const response = await this.request<Vehicle>(`/vehicles/${sku}`);

    if (response.Error || !response.Data) {
      throw new Error(response.Message || 'Veículo não encontrado');
    }

    return response.Data;
  }
}

export const apiService = new VehicleService();
export default apiService;
