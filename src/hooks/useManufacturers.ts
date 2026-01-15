import { useQuery } from '@tanstack/react-query';
import { ChassisService } from '../api/services/chassis/chassis.service';
import { BodyworkService } from '../api/services/bodywork/bodywork.service';
import { ApiResponse } from '../api/factory/apiFactory';

const QUERY_KEYS = {
  chassisManufacturers: ['manufacturers', 'chassis'] as const,
  bodyworkManufacturers: ['manufacturers', 'bodywork'] as const,
};

export function useChassisManufacturers(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.chassisManufacturers,
    queryFn: async () => {
      const response = await ChassisService.getChassisManufacturers();
      if (!response.Success) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data || [];
    },
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour cache
  });
}

export function useBodyworkManufacturers(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.bodyworkManufacturers,
    queryFn: async () => {
      const response = await BodyworkService.getBodyworkManufacturers();
      if (!response.Success) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data || [];
    },
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour cache
  });
}
