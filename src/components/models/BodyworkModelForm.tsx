import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBodywork, useUpdateBodywork, useBodyworkDetail } from '../../hooks/useBodyworkModels';
import { CreateBodyworkMinimal, createBodyworkMinimalSchema } from '../../types/vehicleModels';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';

interface BodyworkModelFormProps {
  bodyworkId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BodyworkModelForm({ bodyworkId, onSuccess, onCancel }: BodyworkModelFormProps) {
  const isEditMode = !!bodyworkId;

  const { data: bodyworkData, isLoading: isLoadingBodywork } = useBodyworkDetail(
    bodyworkId || '',
    isEditMode
  );

  const createMutation = useCreateBodywork();
  const updateMutation = useUpdateBodywork();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBodyworkMinimal>({
    resolver: zodResolver(createBodyworkMinimalSchema),
  });

  useEffect(() => {
    if (bodyworkData) {
      reset({
        bodyManufacturer: bodyworkData.bodyManufacturer,
        model: bodyworkData.model,
        manufactureYear: bodyworkData.manufactureYear,
        modelYear: bodyworkData.modelYear,
        category: bodyworkData.category,
        subcategory: bodyworkData.subcategory,
      });
    }
  }, [bodyworkData, reset]);

  const onSubmit = async (data: CreateBodyworkMinimal) => {
    if (isEditMode && bodyworkId) {
      updateMutation.mutate(
        { id: bodyworkId, dto: data },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoadingBodywork) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Editar Modelo de Carroceria' : 'Novo Modelo de Carroceria'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bodyManufacturer">
                Fabricante <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bodyManufacturer"
                {...register('bodyManufacturer')}
                placeholder="Ex: Marcopolo"
              />
              {errors.bodyManufacturer && (
                <p className="text-sm text-destructive">{errors.bodyManufacturer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">
                Modelo <span className="text-destructive">*</span>
              </Label>
              <Input id="model" {...register('model')} placeholder="Ex: Paradiso" />
              {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufactureYear">
                Ano de Fabricação <span className="text-destructive">*</span>
              </Label>
              <Input
                id="manufactureYear"
                type="number"
                {...register('manufactureYear')}
                placeholder="2024"
              />
              {errors.manufactureYear && (
                <p className="text-sm text-destructive">{errors.manufactureYear.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelYear">
                Ano do Modelo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="modelYear"
                type="number"
                {...register('modelYear')}
                placeholder="2024"
              />
              {errors.modelYear && (
                <p className="text-sm text-destructive">{errors.modelYear.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Categoria <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="Ex: Rodoviário"
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">
                Subcategoria <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subcategory"
                {...register('subcategory')}
                placeholder="Ex: LD"
              />
              {errors.subcategory && (
                <p className="text-sm text-destructive">{errors.subcategory.message}</p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Atualizar' : 'Criar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
