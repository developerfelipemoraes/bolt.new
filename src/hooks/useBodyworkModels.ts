import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BodyworkService as bodyworkService } from '../api/services/bodywork/bodywork.service';
import {
  BodyworkModel,
  BodyworkSearchParams,
  CreateBodyworkMinimal,
  PagedResponse,
} from '../api/services/bodywork/bodywork.types';
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
      console.log("result modelo carrroceria=>" + response);
      console.log(response.Data);
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as PagedResponse<BodyworkModel>;
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
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as BodyworkModel;
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
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as BodyworkModel;
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
      if (response.Error) {
        throw new Error(response.Message || response.Error);
      }
      return response.Data as BodyworkModel;
    },
    onSuccess: (_, variables) => {
      console.log(`[useUpdateBodywork] Success - ID: ${variables.id}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bodywork });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bodyworkDetail(variables.id) });
      toast.success('Modelo de carroceria atualizado com sucesso!');
    },
    onError: (error, variables) => {
      console.error(`[useUpdateBodywork] Error - ID: ${variables.id}`, error);
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
      if (response.Error) {
        throw new Error(response.Message || response.Error);
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
