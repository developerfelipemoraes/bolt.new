import { VehicleSearchData, NormalizedVehicle } from '../types';

export function normalizePrice(price: any): number {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const cleaned = price.replace(/[^\d,.-]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (price?.$numberDecimal) {
    return parseFloat(price.$numberDecimal);
  }
  return 0;
}

export function formatBRL(value: number | string): string {
  const numValue = typeof value === 'string' ? normalizePrice(value) : value;

  if (!numValue || numValue <= 0 || isNaN(numValue)) {
    return 'Sob consulta';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}

export function extractPrimaryImage(photos?: any[]): string {
  if (!photos || photos.length === 0) return '';

  const toUrl = (p: any): string => {
    if (!p) return '';
    if (typeof p === 'string') return p;
    if (typeof p === 'object') {
      return (
        p.url || p.src || p.path || p.fileUrl || p.uri || p.downloadUrl || p.preview || p.thumbnail || p.publicUrl || ''
      );
    }
    return '';
  };

  const normalized = photos.map(toUrl).filter(Boolean);
  const valid = normalized.find((u) => !u.toLowerCase().endsWith('.psd'));
  return valid || normalized[0] || '';
}

export function extractAnnouncementLink(description?: string): string {
  if (!description) return '';

  const match = description.match(/Página\s+Aurovel:\s*(https?:\/\/\S+)/i);
  return match ? match[1] : '';
}

export function extractDriveSystem(chassisModel?: string, tracaoSystem?: string): string {
  if (tracaoSystem) return tracaoSystem;
  if (!chassisModel) return '—';

  const match = chassisModel.match(/\b([246]x[24])\b/i);
  return match ? match[1] : '—';
}

export function extractEnginePosition(engineLocation?: string): string {
  if (!engineLocation) return '—';

  const lower = engineLocation.toLowerCase();
  if (lower.includes('traseiro') || lower.includes('rear')) return 'Traseiro';
  if (lower.includes('dianteiro') || lower.includes('front')) return 'Dianteiro';
  if (lower.includes('central') || lower.includes('médio') || lower.includes('mid')) return 'Central';

  return engineLocation;
}

export function hasReclinableSeats(vehicle: VehicleSearchData): boolean {
  // 1. Check if explicitly set in optionals (if added in future)
  if (vehicle.optionals?.reclinableSeats === true) return true;

  // 2. Check seat composition types that imply reclinable seats
  const totals = vehicle.seatComposition?.totals;
  if (totals) {
    if ((totals.semiSleeper || 0) > 0) return true;
    if ((totals.sleeper || 0) > 0) return true;
    if ((totals.sleeperBed || 0) > 0) return true;
    if ((totals.executive || 0) > 0) return true; // Executive usually recline
  }

  // 3. Check description with regex
  const description = vehicle.secondaryInfo?.description;
  if (description) {
    return /(banco|poltrona|assento).*reclin|semi(-|\s)?leito|leito/i.test(description);
  }

  return false;
}

export function checkGlasType(vehicle: VehicleSearchData, type: 'tilting' | 'glued'): boolean {
  const gType = vehicle.optionals?.glasType;

  if (gType === undefined || gType === null) return false;

  const normalizedGType = String(gType).toLowerCase();

  if (type === 'tilting') {
    return normalizedGType === '1' || normalizedGType === 'tilting' || normalizedGType.includes('basculante');
  }

  if (type === 'glued') {
    return normalizedGType === '0' || normalizedGType === 'glued' || normalizedGType.includes('colado');
  }

  return false;
}

export function buildOptionalsList(vehicle: VehicleSearchData): string {
  const optionals: string[] = [];
  const opts = vehicle.optionals || {};

  if (opts.airConditioning) optionals.push('Ar-Condicionado');
  if (opts.bathroom) optionals.push('Banheiro');
  if (opts.usb) optionals.push('USB');
  if (opts.packageHolder) optionals.push('Porta Pacote');
  if (opts.soundSystem) optionals.push('Som');
  if (opts.monitor) optionals.push('TV');
  if (opts.wifi) optionals.push('Wi-Fi');

  if (checkGlasType(vehicle, 'tilting')) optionals.push('Vidro Basculante');
  if (checkGlasType(vehicle, 'glued')) optionals.push('Vidro Colado');

  if (opts.curtain) optionals.push('Cortina');
  if (opts.accessibility) optionals.push('Acessibilidade');

  const safeOptionals = optionals
    .filter(opt => opt && opt.trim())
    .map(opt => opt.trim())
    .filter((opt, index, self) => self.indexOf(opt) === index);

  return safeOptionals.length > 0 ? safeOptionals.join(', ') : 'Sem opcionais informados';
}

export function getAllImages(vehicle: VehicleSearchData): string[] {
  const images: string[] = [];

  const toUrl = (p: any): string => {
    if (!p) return '';
    if (typeof p === 'string') return p;
    if (typeof p === 'object') {
      return (
        p.url || p.src || p.path || p.fileUrl || p.uri || p.downloadUrl || p.preview || p.thumbnail || p.publicUrl || ''
      );
    }
    return '';
  };

  if (vehicle.media.treatedPhotos) {
    images.push(...vehicle.media.treatedPhotos.map(toUrl).filter(u => u && !u.toLowerCase().endsWith('.psd')));
  }

  if (vehicle.media.originalPhotos) {
    images.push(...vehicle.media.originalPhotos.map(toUrl).filter(u => u && !u.toLowerCase().endsWith('.psd')));
  }

  return Array.from(new Set(images));
}

export function normalizeVehicle(vehicle: VehicleSearchData): NormalizedVehicle {
  const sku = vehicle.sku || vehicle.productCode || '';
  const id = vehicle.id || sku;
  const price = normalizePrice(vehicle.productIdentification.price);
  const primaryImage = extractPrimaryImage(vehicle.media.treatedPhotos || vehicle.media.originalPhotos);
  const announcementLink = extractAnnouncementLink(vehicle.secondaryInfo?.description);
  const allImages = getAllImages(vehicle);

  // Use the robust check function
  const reclinableSeats = hasReclinableSeats(vehicle);

  const categoryName = vehicle.category?.name?.trim() || '—';
  const subcategoryName = vehicle.subcategory?.name?.trim() || '—';

  return {
    sku,
    title: vehicle.productIdentification.title || '—',
    status: vehicle.statusVeiculo || '—',
    price,
    priceFormatted: formatBRL(price),
    city: vehicle.location.city || '—',
    state: vehicle.location.state || '—',
    quantity: vehicle.vehicleData.availableQuantity || 0,
    supplierContact: vehicle.supplier.contactName || vehicle.supplier.companyName || '—',
    supplierPhone: vehicle.supplier.phone || '—',
    supplierCompany: vehicle.supplier.companyName || '—',
    fabricationYear: vehicle.vehicleData.fabricationYear || 0,
    modelYear: vehicle.vehicleData.modelYear || 0,
    chassisManufacturer: vehicle.chassisInfo.chassisManufacturer || '—',
    chassisModel: vehicle.chassisInfo.chassisModel || '—',
    bodyManufacturer: vehicle.chassisInfo.bodyManufacturer || '—',
    bodyModel: vehicle.chassisInfo.bodyModel || '—',
    category: categoryName,
    subcategory: subcategoryName,
    driveSystem: extractDriveSystem(vehicle.chassisInfo.chassisModel, vehicle.chassisInfo.tracaoSystem),
    enginePosition: extractEnginePosition(vehicle.chassisInfo.engineLocation),
    optionalsList: buildOptionalsList(vehicle),
    primaryImage,
    announcementImage: primaryImage,
    announcementLink,
    hasAirConditioning: vehicle.optionals?.airConditioning || false,
    hasBathroom: vehicle.optionals?.bathroom || false,
    hasReclinableSeats: reclinableSeats,
    hasUsb: vehicle.optionals?.usb || false,
    hasPackageHolder: vehicle.optionals?.packageHolder || false,
    hasSoundSystem: vehicle.optionals?.soundSystem || false,
    hasTv: vehicle.optionals?.monitor || false,
    hasWifi: vehicle.optionals?.wifi || false,
    hasTiltingGlass: checkGlasType(vehicle, 'tilting'),
    hasGluedGlass: checkGlasType(vehicle, 'glued'),
    hasCurtain: vehicle.optionals?.curtain || false,
    hasAccessibility: vehicle.optionals?.accessibility || false,
    id,
    description: vehicle.secondaryInfo?.description || '',
    allImages,
    productCode: vehicle.productCode,
    rawData: vehicle
  };
}

export function normalizeVehicleArray(vehicles: VehicleSearchData[]): NormalizedVehicle[] {
  return vehicles.map(normalizeVehicle);
}
