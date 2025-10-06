export interface VehicleSearchData {
  sku: string;
  productCode?: string;
  productIdentification: {
    title: string;
    price?: {
      $numberDecimal?: string;
    } | number;
  };
  media: {
    treatedPhotos?: string[];
    originalPhotos?: string[];
    documentPhotos?: string[];
  };
  location: {
    city: string;
    state: string;
    address?: string;
    neighborhood?: string;
    zipCode?: string;
  };
  supplier: {
    companyName?: string;
    contactName?: string;
    phone?: string;
  };
  category: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
  chassisInfo: {
    chassisManufacturer: string;
    chassisModel: string;
    bodyManufacturer: string;
    bodyModel: string;
    tracaoSystem?: string;
    axlesVehicles?: number;
    maxPower?: string;
    engineLocation?: string;
    intermediateSuspensionType?: string;
    engineBrakeType?: string;
    retarderType?: string;
    engineName?: string;
  };
  vehicleData: {
    fabricationYear: number;
    modelYear: number;
    availableQuantity: number;
  };
  secondaryInfo: {
    description?: string;
  };
  optionals?: {
    airConditioning?: boolean;
    bathroom?: boolean;
    usb?: boolean;
    packageHolder?: boolean;
    soundSystem?: boolean;
    monitor?: boolean;
    wifi?: boolean;
    glasType?: number;
    curtain?: boolean;
    accessibility?: boolean;
  };
  statusVeiculo?: string;
  updatedAt?: string | Date;
}

export interface NormalizedVehicle {
  sku: string;
  title: string;
  status: string;
  price: number;
  priceFormatted: string;
  city: string;
  state: string;
  quantity: number;
  supplierContact: string;
  supplierPhone: string;
  supplierCompany: string;
  fabricationYear: number;
  modelYear: number;
  chassisManufacturer: string;
  chassisModel: string;
  bodyManufacturer: string;
  bodyModel: string;
  category: string;
  subcategory: string;
  driveSystem: string;
  enginePosition: string;
  optionalsList: string;
  primaryImage: string;
  announcementImage: string;
  announcementLink: string;
  hasAirConditioning: boolean;
  hasBathroom: boolean;
  hasReclinableSeats: boolean;
  hasUsb: boolean;
  hasPackageHolder: boolean;
  hasSoundSystem: boolean;
  hasTv: boolean;
  hasWifi: boolean;
  hasTiltingGlass: boolean;
  hasGluedGlass: boolean;
  hasCurtain: boolean;
  hasAccessibility: boolean;
  description: string;
  allImages: string[];
  rawData: VehicleSearchData;
}

export interface SearchFilters {
  categories: string[];
  subcategories: string[];
  yearRange: [number, number];
  priceRange: [number, number];
  cities: string[];
  states: string[];
  status: string[];
  optionals: {
    airConditioning?: boolean;
    bathroom?: boolean;
    reclinableSeats?: boolean;
    usb?: boolean;
    packageHolder?: boolean;
    soundSystem?: boolean;
    tv?: boolean;
    wifi?: boolean;
    tiltingGlass?: boolean;
    gluedGlass?: boolean;
    curtain?: boolean;
    accessibility?: boolean;
  };
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc' | 'updated-desc';

export interface SearchState {
  query: string;
  filters: SearchFilters;
  sortBy: SortOption;
  results: NormalizedVehicle[];
  selectedIds: string[];
  isLoading: boolean;
}
