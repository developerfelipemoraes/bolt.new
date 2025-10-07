import { NormalizedVehicle } from '../types';

export function getVehicleUrl(vehicle: NormalizedVehicle): string {
  const baseUrl = import.meta.env.VITE_VEHICLE_URL || 'https://aurovel.com.br';

  if (vehicle.rawData.productDescription?.externalUrl) {
    return vehicle.rawData.productDescription.externalUrl;
  }
  if (vehicle.rawData.productDescription?.websiteUrl) {
    return vehicle.rawData.productDescription.websiteUrl;
  }
  if (vehicle.rawData.productDescription?.detailsUrl) {
    return vehicle.rawData.productDescription.detailsUrl;
  }

  return `${baseUrl}/veiculo/${vehicle.sku}`;
}

export function formatDate(date?: Date): string {
  const d = date || new Date();
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}
