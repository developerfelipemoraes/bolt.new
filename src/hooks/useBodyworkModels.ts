import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bodyworkService } from '../services/bodyworkService';
import {
  BodyworkModel,
  BodyworkSearchParams,
  CreateBodyworkMinimal,
  PagedResponse,
} from '../types/vehicleModels';
import { toast } from 'sonner';

const QUERY_KEYS = {
  bodywork: ['bodywork'] as const,
  bodyworkList: (params: BodyworkSearchParams) => ['bodywork', 'list', params] as const,
  bodyworkDetail: (id: string) => ['bodywork', 'detail', id] as const,
};

export function useBodyworkSearch(params: BodyworkSearchParams, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.bodyworkList(params),
    queryFn: async () => {
      const response = await bodyworkService.searchBodywork(params);
      if (response.error) {
        throw new Error(response.message || response.error);
      }
      return response.data as PagedResponse<BodyworkModel>;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBodyworkDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.bodyworkDetail(id),
    queryFn: async () => {
      const response = await bodyworkService.getBodywork(id);
      if (response.error) {
        throw new Error(response.message || response.error);
      }
      return response.data as BodyworkModel;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBodywork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateBodyworkMinimal) => {
      const response = await bodyworkService.createBodywork(dto);
      if (response.error) {
        throw new Error(response.message || response.error);
      }
      return response.data as BodyworkModel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bodywork });
      toast.success('Modelo de carroceria criado com sucesso!');
    },
    onError: (error) => {
      const err = error as Error;
      toast.error(`Erro ao criar modelo: ${err.message}`);
    },
  });
}

export function useUpdateBodywork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Partial<CreateBodyworkMinimal> }) => {
      const response = await bodyworkService.updateBodywork(id, dto);
      if (response.error) {
        throw new Error(response.message || response.error);
      }
      return response.data as BodyworkModel;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bodywork });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bodyworkDetail(variables.id) });
      toast.success('Modelo de carroceria atualizado com sucesso!');
    },
    onError: (error) => {
      const err = error as Error;
      toast.error(`Erro ao atualizar modelo: ${err.message}`);
    },
  });
}

export function useDeleteBodywork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await bodyworkService.deleteBodywork(id);
      if (response.error) {
        throw new Error(response.message || response.error);
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bodywork });
      toast.success('Modelo de carroceria excluído com sucesso!');
    },
    onError: (error) => {
      const err = error as Error;
      toast.error(`Erro ao excluir modelo: ${err.message}`);
    },
  });
}
