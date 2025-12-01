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
      apiCall: () => Promise<any>,
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
        
        // This might need adjustment if apiCall returns ApiResponse directly or the object structure from earlier
        // Since services now return ApiResponse which has Success, Data, Message, Error (PascalCase)
        // We need to check what apiCall actually returns.
        // If apiCall is a function that calls a service method, it returns ApiResponse<T>.
        // So we should check for Success (PascalCase).

        // Casting to any to handle potentially both if not strictly typed in apiCall definition
        const res = response as any;

        if (res.Success) {
          setState({ data: res.Data, loading: false, error: null });
          
          if (options?.showSuccessToast !== false) {
            toast.success(options?.successMessage || res.Message || 'Operação realizada com sucesso');
          }
          
          options?.onSuccess?.(res.Data);
          return res.Data;
        } else {
          throw new Error(res.Message || res.Error || 'Erro desconhecido');
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