import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      apiCall: () => Promise<{ success: boolean; data: T; message?: string }>,
      options?: {
        showSuccessToast?: boolean;
        showErrorToast?: boolean;
        successMessage?: string;
        onSuccess?: (data: T) => void;
        onError?: (error: string) => void;
      }
    ) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall();
        
        if (response.success) {
          setState({ data: response.data, loading: false, error: null });
          
          if (options?.showSuccessToast !== false) {
            toast.success(options?.successMessage || response.message || 'Operação realizada com sucesso');
          }
          
          options?.onSuccess?.(response.data);
          return response.data;
        } else {
          throw new Error(response.message || 'Erro desconhecido');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        
        if (options?.showErrorToast !== false) {
          toast.error(errorMessage);
        }
        
        options?.onError?.(errorMessage);
        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hooks for different entities
export function useVehicleApi() {
  return useApi<any>();
}

export function useAuthApi() {
  return useApi<any>();
}

export function useUploadApi() {
  return useApi<any>();
}