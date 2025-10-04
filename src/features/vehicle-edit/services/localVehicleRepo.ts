import { Vehicle } from '@/types/vehicle';
import { ensureVehicleHasId, normalizeId } from '../lib/objectId';

const STORAGE_KEY = 'vehicles';

export function getAll(): Vehicle[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    const vehicles = Array.isArray(parsed) ? parsed : [];

    return vehicles.map(ensureVehicleHasId);
  } catch (error) {
    console.error('Error loading vehicles from localStorage:', error);
    return [];
  }
}

export function getById(id: string): Vehicle | null {
  if (!id) return null;

  const all = getAll();

  const found = all.find(v => {
    const vId = normalizeId(v);
    return vId === id || (v as any).id === id || (v as any)._id === id;
  });

  return found ? ensureVehicleHasId(found) : null;
}

export function upsertById(vehicle: Vehicle & { id?: string }): void {
  if (!vehicle.id) {
    console.error('Cannot upsert vehicle without id');
    return;
  }

  const all = getAll();
  const index = all.findIndex(v => {
    const vId = normalizeId(v);
    return vId === vehicle.id;
  });

  if (index >= 0) {
    all[index] = ensureVehicleHasId(vehicle);
  } else {
    all.push(ensureVehicleHasId(vehicle));
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteById(id: string): boolean {
  if (!id) return false;

  const all = getAll();
  const filtered = all.filter(v => {
    const vId = normalizeId(v);
    return vId !== id;
  });

  if (filtered.length < all.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  return false;
}

export function getBySku(sku: string): Vehicle | null {
  if (!sku) return null;

  const all = getAll();
  const found = all.find(v => (v as any).sku === sku);

  return found ? ensureVehicleHasId(found) : null;
}
