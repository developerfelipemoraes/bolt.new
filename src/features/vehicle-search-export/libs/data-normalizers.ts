import { VehicleSearchData, NormalizedVehicle } from '../types';

export function normalizePrice(price: any): number {
  if (typeof price === 'number') return price;
  if (price?.$numberDecimal) {
    return parseFloat(price.$numberDecimal);
  }
  return 0;
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function extractPrimaryImage(photos?: string[]): string {
  if (!photos || photos.length === 0) return '';

  const validPhoto = photos.find(photo => {
    const lower = photo.toLowerCase();
    return !lower.endsWith('.psd');
  });

  return validPhoto || photos[0] || '';
}

export function extractAnnouncementLink(description?: string): string {
  if (!description) return '';

  const match = description.match(/Página\s+Aurovel:\s*(https?:\/\/\S+)/i);
  return match ? match[1] : '';
}

export function extractDriveSystem(chassisModel?: string): string {
  if (!chassisModel) return '—';

  const match = chassisModel.match(/\b([246]x[24])\b/i);
  return match ? match[1] : '—';
}

export function hasReclinableSeats(description?: string): boolean {
  if (!description) return false;
  return /bancos\s+reclináveis/i.test(description);
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
  if (opts.glasType === 1) optionals.push('Vidro Basculante');
  if (opts.glasType === 0) optionals.push('Vidro Colado');
  if (opts.curtain) optionals.push('Cortina');
  if (opts.accessibility) optionals.push('Acessibilidade');

  return optionals.join(', ') || '—';
}

export function getAllImages(vehicle: VehicleSearchData): string[] {
  const images: string[] = [];

  if (vehicle.media.treatedPhotos) {
    images.push(...vehicle.media.treatedPhotos.filter(p => !p.toLowerCase().endsWith('.psd')));
  }

  if (vehicle.media.originalPhotos) {
    images.push(...vehicle.media.originalPhotos.filter(p => !p.toLowerCase().endsWith('.psd')));
  }

  return Array.from(new Set(images));
}

export function normalizeVehicle(vehicle: VehicleSearchData): NormalizedVehicle {
  const sku = vehicle.sku || vehicle.productCode || '';
  const price = normalizePrice(vehicle.productIdentification.price);
  const primaryImage = extractPrimaryImage(vehicle.media.treatedPhotos || vehicle.media.originalPhotos);
  const announcementLink = extractAnnouncementLink(vehicle.secondaryInfo?.description);
  const allImages = getAllImages(vehicle);
  const reclinableSeats = hasReclinableSeats(vehicle.secondaryInfo?.description);

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
    category: vehicle.category.name || '—',
    subcategory: vehicle.subcategory?.name || '—',
    driveSystem: extractDriveSystem(vehicle.chassisInfo.chassisModel),
    enginePosition: '—',
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
    hasTiltingGlass: vehicle.optionals?.glasType === 1,
    hasGluedGlass: vehicle.optionals?.glasType === 0,
    hasCurtain: vehicle.optionals?.curtain || false,
    hasAccessibility: vehicle.optionals?.accessibility || false,
    description: vehicle.secondaryInfo?.description || '',
    allImages,
    rawData: vehicle
  };
}

export function normalizeVehicleArray(vehicles: VehicleSearchData[]): NormalizedVehicle[] {
  return vehicles.map(normalizeVehicle);
}
