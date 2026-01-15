export interface Vehicle {
  id?: string;
  _id?: string;
  make: string;
  model: string;
  year: number;
  version: string;
  color: string;
  plate: string;
  price: number;
  km: number;
  type: string;
  fuel: string;
  gearbox: string;
  status: string;
  companyId: string;
  description?: string;
  media: {
    originalPhotosInterior: any[]; // File[] usually, but string[] when from API
    originalPhotosExterior: any[];
    originalPhotosInstruments: any[];
    treatedPhotos: any[];
    documentPhotos: any[];
    video?: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PagedVehicles {
  items: Vehicle[];
  total: number;
  page: number;
  limit: number;
}

// Helper payload converter (simplified from original service)
export const toVehiclePayload = (vehicle: Vehicle, uploaded: any) => {
  return {
    ...vehicle,
    media: {
      ...vehicle.media,
      ...uploaded
    }
  };
};
