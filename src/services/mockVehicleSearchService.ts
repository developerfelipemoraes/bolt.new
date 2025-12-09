export interface VehicleSearchResult {
  vehicle_id: string;
  model: string;
  brand: string;
  year: number;
  price: number;
  status: string;
  category?: string;
  subcategory?: string;
  mileage?: number;
  location?: string;
  image_url?: string;
}

export interface VehicleSearchResponse {
  status: string;
  total_results: number;
  vehicles: VehicleSearchResult[];
}

const MOCK_VEHICLES: VehicleSearchResult[] = [
  {
    vehicle_id: 'VCL-00123',
    model: 'Paradiso G7 1800 DD',
    brand: 'Marcopolo',
    year: 2023,
    price: 850000,
    status: 'Available in Stock',
    category: 'Rodoviário',
    subcategory: 'Leito',
    mileage: 45000,
    location: 'São Paulo, SP'
  },
  {
    vehicle_id: 'VCL-00124',
    model: 'SUV Xtreme',
    brand: 'Motora',
    year: 2024,
    price: 185000,
    status: 'Available in Stock',
    category: 'SUV',
    subcategory: 'Executivo',
    mileage: 12000,
    location: 'Rio de Janeiro, RJ'
  },
  {
    vehicle_id: 'VCL-00125',
    model: 'Van Sprinter 515',
    brand: 'Mercedes-Benz',
    year: 2023,
    price: 120000,
    status: 'Available in Stock',
    category: 'Van',
    subcategory: 'Executiva',
    mileage: 30000,
    location: 'Belo Horizonte, MG'
  },
  {
    vehicle_id: 'VCL-00126',
    model: 'Micro-ônibus Volare V8L',
    brand: 'Volare',
    year: 2022,
    price: 180000,
    status: 'Available in Stock',
    category: 'Micro-ônibus',
    subcategory: 'Urbano',
    mileage: 60000,
    location: 'Curitiba, PR'
  },
  {
    vehicle_id: 'VCL-00127',
    model: 'Iveco Daily Minibus',
    brand: 'Iveco',
    year: 2024,
    price: 165000,
    status: 'Available in Stock',
    category: 'Van',
    subcategory: 'Escolar',
    mileage: 8000,
    location: 'Porto Alegre, RS'
  },
  {
    vehicle_id: 'VCL-00128',
    model: 'O 500 RS BlueTec 5',
    brand: 'Mercedes-Benz',
    year: 2023,
    price: 920000,
    status: 'Available in Stock',
    category: 'Rodoviário',
    subcategory: 'DD Leito',
    mileage: 35000,
    location: 'São Paulo, SP'
  }
];

export const mockVehicleSearchService = {
  async search(query: string): Promise<VehicleSearchResponse> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return {
        status: 'success',
        total_results: MOCK_VEHICLES.length,
        vehicles: [...MOCK_VEHICLES]
      };
    }

    const filteredVehicles = MOCK_VEHICLES.filter(vehicle => {
      const searchText = `${vehicle.model} ${vehicle.brand} ${vehicle.category} ${vehicle.subcategory} ${vehicle.year}`.toLowerCase();
      return searchText.includes(lowerQuery);
    });

    return {
      status: 'success',
      total_results: filteredVehicles.length,
      vehicles: filteredVehicles
    };
  },

  async getById(vehicleId: string): Promise<VehicleSearchResult | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const vehicle = MOCK_VEHICLES.find(v => v.vehicle_id === vehicleId);
    return vehicle ? { ...vehicle } : null;
  }
};
