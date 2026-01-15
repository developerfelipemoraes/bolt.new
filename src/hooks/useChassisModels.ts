import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChassisService as chassisService } from '../api/services/chassis/chassis.service';
import {
  ChassisModel,
  ChassisModelComplete,
  ChassisModelSummary,
  ChassisSearchParams,
  CreateChassisMinimal,
  PagedResponse,
} from '../api/services/chassis/chassis.types';
import { toast } from 'sonner';

const QUERY_KEYS = {
  chassis: ['chassis'] as const,
  chassisList: (params: ChassisSearchParams) => ['chassis', 'list', params] as const,
  chassisSummary: (params: ChassisSearchParams) => ['chassis', 'summary', params] as const,
  chassisDetail: (id: string) => ['chassis', 'detail', id] as const,
  chassisComplete: (id: string) => ['chassis', 'complete', id] as const,
};

export function useChassisSearch(params: ChassisSearchParams, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.chassisList(params),
    queryFn: async () => {
      const response = await chassisService.searchChassis(params);
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as PagedResponse<ChassisModel>;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChassisCompleteDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.chassisComplete(id),
    queryFn: async () => {
      const response = await chassisService.getChassisComplete(id);
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as ChassisModelComplete;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChassisSummarySearch(params: ChassisSearchParams, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.chassisSummary(params),
    queryFn: async () => {
      const response = await chassisService.searchChassisSummary(params);
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as PagedResponse<ChassisModelSummary>;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChassisDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.chassisDetail(id),
    queryFn: async () => {
      const response = await chassisService.getChassis(id);
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as ChassisModel;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateChassis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateChassisMinimal) => {
      const response = await chassisService.createChassis(dto);
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as ChassisModel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chassis });
      toast.success('Modelo de chassi criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar modelo: ${error.message}`);
    },
  });
}

export function useUpdateChassis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Partial<CreateChassisMinimal> }) => {
      const response = await chassisService.updateChassis(id, dto);
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as ChassisModel;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chassis });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chassisDetail(variables.id) });
      toast.success('Modelo de chassi atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar modelo: ${error.message}`);
    },
  });
}

export function useDeleteChassis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await chassisService.deleteChassis(id);
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chassis });
      toast.success('Modelo de chassi excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir modelo: ${error.message}`);
    },
  });
}
