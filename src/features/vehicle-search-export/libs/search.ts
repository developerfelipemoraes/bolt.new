import Fuse from 'fuse.js';
import { NormalizedVehicle, SearchFilters, SortOption } from '../types';

export function createSearchIndex(vehicles: NormalizedVehicle[]) {
  return new Fuse(vehicles, {
    keys: [
      { name: 'sku', weight: 2 },
      { name: 'title', weight: 2 },
      { name: 'city', weight: 1 },
      { name: 'state', weight: 1 },
      { name: 'category', weight: 1 },
      { name: 'subcategory', weight: 1 },
      { name: 'chassisManufacturer', weight: 1 },
      { name: 'chassisModel', weight: 1 },
      { name: 'supplierCompany', weight: 1 },
      { name: 'supplierContact', weight: 1 },
      { name: 'supplierPhone', weight: 1 }
    ],
    threshold: 0.3,
    includeScore: true
  });
}

export function searchVehicles(
  vehicles: NormalizedVehicle[],
  query: string,
  searchIndex?: Fuse<NormalizedVehicle>
): NormalizedVehicle[] {
  if (!query.trim()) return vehicles;

  if (searchIndex) {
    const results = searchIndex.search(query);
    return results.map(r => r.item);
  }

  const lowerQuery = query.toLowerCase();
  return vehicles.filter(vehicle => {
    return (
      vehicle.sku.toLowerCase().includes(lowerQuery) ||
      vehicle.title.toLowerCase().includes(lowerQuery) ||
      vehicle.city.toLowerCase().includes(lowerQuery) ||
      vehicle.state.toLowerCase().includes(lowerQuery) ||
      vehicle.category.toLowerCase().includes(lowerQuery) ||
      vehicle.subcategory.toLowerCase().includes(lowerQuery) ||
      vehicle.chassisManufacturer.toLowerCase().includes(lowerQuery) ||
      vehicle.chassisModel.toLowerCase().includes(lowerQuery) ||
      vehicle.supplierCompany.toLowerCase().includes(lowerQuery) ||
      vehicle.supplierContact.toLowerCase().includes(lowerQuery) ||
      vehicle.supplierPhone.toLowerCase().includes(lowerQuery)
    );
  });
}

export function applyFilters(
  vehicles: NormalizedVehicle[],
  filters: SearchFilters
): NormalizedVehicle[] {
  let filtered = vehicles;

  if (filters.categories.length > 0) {
    filtered = filtered.filter(v => filters.categories.includes(v.category));
  }

  if (filters.subcategories.length > 0) {
    filtered = filtered.filter(v => filters.subcategories.includes(v.subcategory));
  }

  if (filters.yearRange[0] > 0 || filters.yearRange[1] < 9999) {
    filtered = filtered.filter(v =>
      v.fabricationYear >= filters.yearRange[0] &&
      v.fabricationYear <= filters.yearRange[1]
    );
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < Infinity) {
    filtered = filtered.filter(v =>
      v.price >= filters.priceRange[0] &&
      v.price <= filters.priceRange[1]
    );
  }

  if (filters.cities.length > 0) {
    filtered = filtered.filter(v => filters.cities.includes(v.city));
  }

  if (filters.states.length > 0) {
    filtered = filtered.filter(v => filters.states.includes(v.state));
  }

  if (filters.status.length > 0) {
    filtered = filtered.filter(v => filters.status.includes(v.status));
  }

  const opts = filters.optionals;
  if (opts.airConditioning !== undefined) {
    filtered = filtered.filter(v => v.hasAirConditioning === opts.airConditioning);
  }
  if (opts.bathroom !== undefined) {
    filtered = filtered.filter(v => v.hasBathroom === opts.bathroom);
  }
  if (opts.reclinableSeats !== undefined) {
    filtered = filtered.filter(v => v.hasReclinableSeats === opts.reclinableSeats);
  }
  if (opts.usb !== undefined) {
    filtered = filtered.filter(v => v.hasUsb === opts.usb);
  }
  if (opts.packageHolder !== undefined) {
    filtered = filtered.filter(v => v.hasPackageHolder === opts.packageHolder);
  }
  if (opts.soundSystem !== undefined) {
    filtered = filtered.filter(v => v.hasSoundSystem === opts.soundSystem);
  }
  if (opts.tv !== undefined) {
    filtered = filtered.filter(v => v.hasTv === opts.tv);
  }
  if (opts.wifi !== undefined) {
    filtered = filtered.filter(v => v.hasWifi === opts.wifi);
  }
  if (opts.tiltingGlass !== undefined) {
    filtered = filtered.filter(v => v.hasTiltingGlass === opts.tiltingGlass);
  }
  if (opts.gluedGlass !== undefined) {
    filtered = filtered.filter(v => v.hasGluedGlass === opts.gluedGlass);
  }
  if (opts.curtain !== undefined) {
    filtered = filtered.filter(v => v.hasCurtain === opts.curtain);
  }
  if (opts.accessibility !== undefined) {
    filtered = filtered.filter(v => v.hasAccessibility === opts.accessibility);
  }

  return filtered;
}

export function sortVehicles(
  vehicles: NormalizedVehicle[],
  sortBy: SortOption
): NormalizedVehicle[] {
  const sorted = [...vehicles];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'year-asc':
      return sorted.sort((a, b) => a.modelYear - b.modelYear);
    case 'year-desc':
      return sorted.sort((a, b) => b.modelYear - a.modelYear);
    case 'updated-desc':
      return sorted.sort((a, b) => {
        const dateA = a.rawData.updatedAt ? new Date(a.rawData.updatedAt).getTime() : 0;
        const dateB = b.rawData.updatedAt ? new Date(b.rawData.updatedAt).getTime() : 0;
        return dateB - dateA;
      });
    case 'relevance':
    default:
      return sorted;
  }
}

export function extractUniqueValues<T extends keyof NormalizedVehicle>(
  vehicles: NormalizedVehicle[],
  field: T
): string[] {
  const values = vehicles
    .map(v => v[field])
    .filter((v): v is string => typeof v === 'string' && v !== '—');
  return Array.from(new Set(values)).sort();
}
