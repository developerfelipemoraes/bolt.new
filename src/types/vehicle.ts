export interface VehicleCategory {
  id: string;
  name: string;
  subcategories?: VehicleSubcategory[];
}

export interface VehicleSubcategory {
  id: string;
  name: string;
  description?: string;
}

export interface ChassisInfo {
  chassisManufacturer: string;
  bodyManufacturer: string;
  chassisModel: string;
  bodyModel: string;
}

export interface VehicleData {
  fabricationYear: number;
  modelYear: number;
  mileage: number;
  price: number;
  priceCost: number;
  licensePlate: string;
  renavam: string;
  chassis: string;
  busPrefix?: string;
  availableQuantity: number;
  internalNotes: string;
}

export interface ProductIdentification {
  title: string;
  price?: number;
  priceCost?: number;
}

export interface MediaUpload {
  originalPhotos: File[];
  treatedPhotos: File[];
  documentPhotos: File[];
  video?: File;
}

export interface SecondaryInfo {
  capacity: number;
  condition: 'new' | 'used' | 'semi-new';
  fuelType: string;
  steering: 'assisted' | 'hydraulic' | 'mechanical';
  singleOwner: boolean;
  description: string;
}

export type SeatType = 'conventional' | 'executive' | 'semiSleeper' | 'sleeper' | 'sleeperBed' | 'fixed';

export type SeatLocation = 'piso1' | 'piso2' | 'frente' | 'meio' | 'fundo';

export interface SeatCompositionDetail {
  type: SeatType;
  quantity: number;
  location?: SeatLocation;
  notes?: string;
}

export interface SeatConfiguration {
  conventional: number;
  executive: number;
  semiSleeper: number;
  sleeper: number;
  sleeperBed: number;
  fixed: number;
}

export interface SeatComposition {
  totals: SeatConfiguration;
  composition?: SeatCompositionDetail[];
  totalCapacity: number;
  compositionText?: string;
}

export interface VehicleOptionals {
  airConditioning: boolean;
  usb: boolean;
  packageHolder: boolean;
  soundSystem: boolean;
  monitor: boolean;
  wifi: boolean;
  bathroom: boolean;
  glasType: 'glued' | 'tilting';
  curtain: boolean;
  cabin: boolean;
  accessibility: boolean;
  factoryRetarder: boolean;
  optionalRetarder: boolean;
  legSupport: boolean;
  coffeeMaker: boolean;
}

export interface LocationInfo {
  address: string;
  neighborhood: string;
  state: string;
  city: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface MediaUploadUrls {
  originalPhotos: string[];
  treatedPhotos: string[];
  documentPhotos: string[];
  video?: string | null;
}

export interface Vehicle {
  id?: string;
  category: VehicleCategory;
  subcategory?: VehicleSubcategory;
  chassisInfo: ChassisInfo;
  vehicleData: VehicleData;
  productIdentification: ProductIdentification;
  media: MediaUpload;
  secondaryInfo: SecondaryInfo;
  seatConfiguration?: SeatConfiguration;
  seatComposition?: SeatComposition;
  optionals: VehicleOptionals;
  description: string;
  location: LocationInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export type VehiclePayload = Omit<Vehicle, "media" | "createdAt" | "updatedAt"> & {
  
  mediaFiles: MediaUploadUrls;
  // Datas como string (ISO) se quiser enviar:
  createdAt?: string;
  updatedAt?: string;
};

export interface WizardStep {
  id: number;
  title: string;
  component: React.ComponentType<unknown>;
  isValid: boolean;
  isCompleted: boolean;
}


export interface UploadedMediaUrls {
  original: string[];
  treated: string[];
  documents: string[];
  video?: string | null;
}

export function toVehiclePayload(vehicle: Vehicle, uploaded: UploadedMediaUrls): VehiclePayload {
  
  console.log('Convertendo veículo para payload:', vehicle, uploaded);

  const { media, ...restOfVehicle } = vehicle; 
  
  console.log('Veiculo sem a propriedade midia:', restOfVehicle);
  
  return {
    ...restOfVehicle,
    mediaFiles: {
      originalPhotos: uploaded.original,
      treatedPhotos: uploaded.treated,
      documentPhotos: uploaded.documents,
      video: uploaded.video ?? null
    },
    createdAt: vehicle.createdAt ? vehicle.createdAt.toISOString() : undefined,
    updatedAt: vehicle.updatedAt ? vehicle.updatedAt.toISOString() : undefined
  };
}