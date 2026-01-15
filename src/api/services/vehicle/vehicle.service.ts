import { ApiFactory, handleRequest, ApiResponse } from '@/api/factory/apiFactory';
import { API_CONFIG } from '@/api/config/api.config';
import { Vehicle, PagedVehicles, toVehiclePayload } from './vehicle.types';

const api = ApiFactory.getInstance(API_CONFIG.vehicle.baseURL);

export const VehicleService = {
  getVehicles: async (companyId?: string): Promise<ApiResponse<PagedVehicles | Vehicle[]>> => {
    let endpoint = '/vehicles?page=1&limit=10&sortBy=createdAt&sortOrder=desc';
    if (companyId) {
        endpoint += `&companyId=${companyId}`;
    }
    return handleRequest(api.get<PagedVehicles | Vehicle[]>(endpoint));
  },

  createVehicle: async (vehicle: Vehicle): Promise<ApiResponse<Vehicle>> => {
    // Note: Upload logic usually handles file uploads separately and gets URLs.
    // The existing service uploads files first. This architecture assumes the calling component
    // or a dedicated UploadService handles the file -> URL conversion,
    // OR we implement upload logic here.
    // For this refactor, we assume the vehicle object passed here already has valid media URLs
    // or we'd migrate the uploadImages logic here.

    // To keep it simple and architecturally clean, we'll assume `vehicle` payload is ready.
    // If files need uploading, that should be a separate step or method `uploadImages`.

    return handleRequest(api.post<Vehicle>('/vehicles', vehicle));
  },

  updateVehicle: async (vehicleId: string, updateData: any): Promise<ApiResponse<Vehicle>> => {
    return handleRequest(api.patch<Vehicle>(`/vehicles/${vehicleId}`, updateData));
  },

  deleteVehicle: async (vehicleId: string): Promise<ApiResponse<void>> => {
    return handleRequest(api.delete(`/vehicles/${vehicleId}`));
  },

  uploadImages: async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    const fd = new FormData();
    files.forEach(f => fd.append("files", f));

    // We can't easily use handleRequest for raw responses that might not match ApiResponse
    // if the upload endpoint returns different structure (e.g. { urls: [] }).
    // But let's try standard axios call.
    // Note: Do NOT set Content-Type manually for FormData, let the browser/axios set it with boundary
    const response = await api.post('/upload/images', fd);

    // Adapted from original logic
    const data = response.data;
    return (data as any).urls || data || [];
  }
};
