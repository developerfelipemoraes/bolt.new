import { Supplier } from '../types/supplier';

const STORAGE_KEY = 'suppliers';

export function getAllSuppliers(): Supplier[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading suppliers from localStorage:', error);
    return [];
  }
}

export function getSupplierById(id: string): Supplier | null {
  if (!id) return null;

  const all = getAllSuppliers();
  return all.find(s => s.id === id) || null;
}

export function saveSupplier(supplier: Supplier): void {
  const all = getAllSuppliers();
  const index = all.findIndex(s => s.id === supplier.id);

  if (index >= 0) {
    all[index] = supplier;
  } else {
    all.push(supplier);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteSupplier(id: string): boolean {
  if (!id) return false;

  const all = getAllSuppliers();
  const filtered = all.filter(s => s.id !== id);

  if (filtered.length < all.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  return false;
}

export function searchSuppliers(query: string): Supplier[] {
  if (!query) return getAllSuppliers();

  const all = getAllSuppliers();
  const lowerQuery = query.toLowerCase();

  return all.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.document.includes(query) ||
    s.email?.toLowerCase().includes(lowerQuery) ||
    s.phone?.includes(query)
  );
}
