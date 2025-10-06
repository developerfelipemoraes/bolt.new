import Fuse from 'fuse.js';
import { NormalizedVehicle, SearchFilters, SortOption } from '../types';

interface InternalQuerySignals {
  tracaoSystem?: string;
  axlesVehicles?: number;
  minPowerHp?: number;
  powerUnit?: 'hp' | 'cv' | 'kW';
  engineLocation?: string;
  engineBrakeType?: string;
  retarderType?: string;
  intermediateSuspensionType?: string;
  engineName?: string;
}

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

function parseQuerySignals(query: string): InternalQuerySignals {
  const signals: InternalQuerySignals = {};
  const lowerQuery = query.toLowerCase();

  const tracaoMatch = lowerQuery.match(/\b([468])x([24])\b/);
  if (tracaoMatch) {
    signals.tracaoSystem = `${tracaoMatch[1]}x${tracaoMatch[2]}`;
  }

  const eixosMatch = lowerQuery.match(/\b(\d)\s*eixos?\b/);
  if (eixosMatch) {
    signals.axlesVehicles = Number(eixosMatch[1]);
  }

  const powerMatch = lowerQuery.match(/(\d{2,4})\s*(cv|hp|kw)/i);
  if (powerMatch) {
    const value = Number(powerMatch[1]);
    const unit = powerMatch[2].toLowerCase() as 'cv' | 'hp' | 'kw';
    signals.powerUnit = unit;

    if (unit === 'kw') {
      signals.minPowerHp = value * 1.341;
    } else {
      signals.minPowerHp = value;
    }
  }

  if (lowerQuery.includes('traseiro') || lowerQuery.includes('rear')) {
    signals.engineLocation = 'traseiro';
  } else if (lowerQuery.includes('dianteiro') || lowerQuery.includes('frontal') || lowerQuery.includes('front')) {
    signals.engineLocation = 'dianteiro';
  } else if (lowerQuery.includes('central') || lowerQuery.includes('médio') || lowerQuery.includes('mid')) {
    signals.engineLocation = 'central';
  }

  if (lowerQuery.includes('freio-motor') || lowerQuery.includes('freio motor') ||
      lowerQuery.includes('engine brake') || lowerQuery.includes('jake brake')) {
    signals.engineBrakeType = 'freio-motor';
  }

  if (lowerQuery.includes('retarder') || lowerQuery.includes('intarder') ||
      lowerQuery.includes('telma') || lowerQuery.includes('voith') || lowerQuery.includes('zf')) {
    if (lowerQuery.includes('telma')) signals.retarderType = 'telma';
    else if (lowerQuery.includes('voith')) signals.retarderType = 'voith';
    else if (lowerQuery.includes('zf')) signals.retarderType = 'zf';
    else signals.retarderType = 'retarder';
  }

  if (lowerQuery.includes('pneumática') || lowerQuery.includes('a ar') ||
      lowerQuery.includes('molas') || lowerQuery.includes('feixe')) {
    if (lowerQuery.includes('pneumática') || lowerQuery.includes('a ar')) {
      signals.intermediateSuspensionType = 'pneumática';
    } else {
      signals.intermediateSuspensionType = 'metálica';
    }
  }

  const enginePatterns = [
    /\b(om\s*\d{3})\b/i,
    /\b(dc\s*\d{2})\b/i,
    /\b(d\s*\d{2})\b/i,
    /\b(isl|isx)\b/i,
    /\b(scania\s+dc\d{2})\b/i,
    /\b(mercedes\s+om\d{3})\b/i,
    /\b(volvo\s+d\d{2})\b/i
  ];

  for (const pattern of enginePatterns) {
    const match = lowerQuery.match(pattern);
    if (match) {
      signals.engineName = match[1];
      break;
    }
  }

  return signals;
}

function extractPowerValue(maxPower?: string): number | null {
  if (!maxPower) return null;

  const match = maxPower.match(/(\d{2,4})\s*(cv|hp|kw)/i);
  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === 'kw') {
    return value * 1.341;
  }
  return value;
}

function matchesSignal(vehicle: NormalizedVehicle, signals: InternalQuerySignals): boolean {
  const chassis = vehicle.rawData.chassisInfo;

  if (signals.tracaoSystem && chassis.tracaoSystem) {
    const normalize = (s: string) => s.toLowerCase().replace(/\s/g, '');
    if (normalize(chassis.tracaoSystem) !== normalize(signals.tracaoSystem)) {
      return false;
    }
  }

  if (signals.axlesVehicles !== undefined && chassis.axlesVehicles !== undefined) {
    if (chassis.axlesVehicles !== signals.axlesVehicles) {
      return false;
    }
  }

  if (signals.minPowerHp !== undefined) {
    const vehiclePower = extractPowerValue(chassis.maxPower);
    if (vehiclePower === null || vehiclePower < signals.minPowerHp) {
      return false;
    }
  }

  if (signals.engineLocation && chassis.engineLocation) {
    const vehicleLocation = chassis.engineLocation.toLowerCase();
    const signalLocation = signals.engineLocation.toLowerCase();

    const matches =
      vehicleLocation.includes(signalLocation) ||
      (signalLocation === 'traseiro' && vehicleLocation.includes('rear')) ||
      (signalLocation === 'dianteiro' && vehicleLocation.includes('front')) ||
      (signalLocation === 'central' && vehicleLocation.includes('mid'));

    if (!matches) return false;
  }

  if (signals.engineBrakeType && chassis.engineBrakeType) {
    if (!chassis.engineBrakeType.toLowerCase().includes('freio') &&
        !chassis.engineBrakeType.toLowerCase().includes('brake')) {
      return false;
    }
  }

  if (signals.retarderType && chassis.retarderType) {
    const vehicleRetarder = chassis.retarderType.toLowerCase();
    const signalRetarder = signals.retarderType.toLowerCase();
    if (!vehicleRetarder.includes(signalRetarder)) {
      return false;
    }
  }

  if (signals.intermediateSuspensionType && chassis.intermediateSuspensionType) {
    const vehicleSusp = chassis.intermediateSuspensionType.toLowerCase();
    const signalSusp = signals.intermediateSuspensionType.toLowerCase();

    const matches =
      (signalSusp === 'pneumática' && (vehicleSusp.includes('pneumática') || vehicleSusp.includes('a ar'))) ||
      (signalSusp === 'metálica' && (vehicleSusp.includes('metálica') || vehicleSusp.includes('molas') || vehicleSusp.includes('feixe')));

    if (!matches) return false;
  }

  if (signals.engineName && chassis.engineName) {
    const vehicleEngine = chassis.engineName.toLowerCase().replace(/\s/g, '');
    const signalEngine = signals.engineName.toLowerCase().replace(/\s/g, '');
    if (!vehicleEngine.includes(signalEngine)) {
      return false;
    }
  }

  return true;
}

function calculateRelevanceScore(vehicle: NormalizedVehicle, query: string, signals: InternalQuerySignals): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();
  const tokens = lowerQuery.split(/\s+/).filter(t => t.length > 2);

  for (const token of tokens) {
    if (vehicle.title.toLowerCase().includes(token)) score += 6;
    if (vehicle.category.toLowerCase().includes(token)) score += 3;
    if (vehicle.subcategory.toLowerCase().includes(token)) score += 3;
  }

  const chassis = vehicle.rawData.chassisInfo;

  if (signals.tracaoSystem && chassis.tracaoSystem) {
    const normalize = (s: string) => s.toLowerCase().replace(/\s/g, '');
    if (normalize(chassis.tracaoSystem) === normalize(signals.tracaoSystem)) {
      score += 8;
    }
  }

  if (signals.axlesVehicles !== undefined && chassis.axlesVehicles === signals.axlesVehicles) {
    score += 5;
  }

  if (signals.engineLocation && chassis.engineLocation) {
    const vehicleLocation = chassis.engineLocation.toLowerCase();
    const signalLocation = signals.engineLocation.toLowerCase();

    if (vehicleLocation.includes(signalLocation) ||
        (signalLocation === 'traseiro' && vehicleLocation.includes('rear')) ||
        (signalLocation === 'dianteiro' && vehicleLocation.includes('front')) ||
        (signalLocation === 'central' && vehicleLocation.includes('mid'))) {
      score += 6;
    }
  }

  if (signals.engineName && chassis.engineName) {
    const vehicleEngine = chassis.engineName.toLowerCase();
    const signalEngine = signals.engineName.toLowerCase();
    if (vehicleEngine.includes(signalEngine)) {
      score += 5;
    }
  }

  if (signals.engineBrakeType && chassis.engineBrakeType) {
    if (chassis.engineBrakeType.toLowerCase().includes('freio') ||
        chassis.engineBrakeType.toLowerCase().includes('brake')) {
      score += 4;
    }
  }

  if (signals.retarderType && chassis.retarderType) {
    const vehicleRetarder = chassis.retarderType.toLowerCase();
    const signalRetarder = signals.retarderType.toLowerCase();
    if (vehicleRetarder.includes(signalRetarder)) {
      score += 4;
    }
  }

  if (signals.intermediateSuspensionType && chassis.intermediateSuspensionType) {
    const vehicleSusp = chassis.intermediateSuspensionType.toLowerCase();
    const signalSusp = signals.intermediateSuspensionType.toLowerCase();

    if ((signalSusp === 'pneumática' && (vehicleSusp.includes('pneumática') || vehicleSusp.includes('a ar'))) ||
        (signalSusp === 'metálica' && (vehicleSusp.includes('metálica') || vehicleSusp.includes('molas')))) {
      score += 3;
    }
  }

  if (signals.minPowerHp !== undefined) {
    const vehiclePower = extractPowerValue(chassis.maxPower);
    if (vehiclePower !== null && vehiclePower >= signals.minPowerHp) {
      score += 6;
    }
  }

  return score;
}

export function searchVehicles(
  vehicles: NormalizedVehicle[],
  query: string,
  searchIndex?: Fuse<NormalizedVehicle>
): NormalizedVehicle[] {
  if (!query.trim()) return vehicles;

  const signals = parseQuerySignals(query);

  if (searchIndex) {
    const results = searchIndex.search(query);
    let filtered = results.map(r => r.item);

    filtered = filtered.filter(v => matchesSignal(v, signals));

    return filtered;
  }

  const lowerQuery = query.toLowerCase();
  let filtered = vehicles.filter(vehicle => {
    const basicMatch = (
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

    return basicMatch && matchesSignal(vehicle, signals);
  });

  return filtered;
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
  sortBy: SortOption,
  query?: string
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
      if (query && query.trim()) {
        const signals = parseQuerySignals(query);
        return sorted.sort((a, b) => {
          const scoreA = calculateRelevanceScore(a, query, signals);
          const scoreB = calculateRelevanceScore(b, query, signals);

          if (scoreB !== scoreA) return scoreB - scoreA;

          const dateA = a.rawData.updatedAt ? new Date(a.rawData.updatedAt).getTime() : 0;
          const dateB = b.rawData.updatedAt ? new Date(b.rawData.updatedAt).getTime() : 0;
          if (dateB !== dateA) return dateB - dateA;

          return a.price - b.price;
        });
      }
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
