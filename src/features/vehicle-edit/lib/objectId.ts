export function isLikelyObjectId(s: string): boolean {
  if (!s) return false;
  return /^[a-f0-9]{24}$/i.test(s.trim());
}

export function normalizeId(vehicle: any): string | undefined {
  if (vehicle.id && typeof vehicle.id === 'string') {
    return vehicle.id;
  }

  if (vehicle._id) {
    if (typeof vehicle._id === 'string') {
      return vehicle._id;
    }
    if (vehicle._id.$oid) {
      return vehicle._id.$oid;
    }
  }

  return undefined;
}

export function ensureVehicleHasId(vehicle: any): any {
  const id = normalizeId(vehicle);

  return {
    ...vehicle,
    id: id || vehicle.id
  };
}
