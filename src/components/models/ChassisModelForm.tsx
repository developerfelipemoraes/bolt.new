import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateChassis, useUpdateChassis, useChassisDetail } from '../../hooks/useChassisModels';
import { CreateChassisMinimal, createChassisMinimalSchema } from '../../types/vehicleModels';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';

interface ChassisModelFormProps {
  chassisId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChassisModelForm({ chassisId, onSuccess, onCancel }: ChassisModelFormProps) {
  const isEditMode = !!chassisId;

  const { data: chassisData, isLoading: isLoadingChassis } = useChassisDetail(
    chassisId || '',
    isEditMode
  );

  const createMutation = useCreateChassis();
  const updateMutation = useUpdateChassis();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChassisMinimal>({
    resolver: zodResolver(createChassisMinimalSchema),
  });

  useEffect(() => {
    if (chassisData) {
      reset({
        chassisManufacturer: chassisData.chassisManufacturer,
        model: chassisData.model,
        manufactureYear: chassisData.manufactureYear,
        modelYear: chassisData.modelYear,
        drivetrain: chassisData.drivetrain || '',
        enginePosition: chassisData.enginePosition || '',
        category: chassisData.category || '',
        subcategory: chassisData.subcategory || '',
        axleCount: chassisData.axleCount || undefined,
      });
    }
  }, [chassisData, reset]);

  const onSubmit = async (data: CreateChassisMinimal) => {
    if (isEditMode && chassisId) {
      updateMutation.mutate(
        { id: chassisId, dto: data },
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

  if (isEditMode && isLoadingChassis) {
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
        <CardTitle>{isEditMode ? 'Editar Modelo de Chassi' : 'Novo Modelo de Chassi'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chassisManufacturer">
                Fabricante <span className="text-destructive">*</span>
              </Label>
              <Input
                id="chassisManufacturer"
                {...register('chassisManufacturer')}
                placeholder="Ex: Mercedes-Benz"
              />
              {errors.chassisManufacturer && (
                <p className="text-sm text-destructive">{errors.chassisManufacturer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">
                Modelo <span className="text-destructive">*</span>
              </Label>
              <Input id="model" {...register('model')} placeholder="Ex: O-500" />
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
              <Label htmlFor="drivetrain">Tração</Label>
              <Input
                id="drivetrain"
                {...register('drivetrain')}
                placeholder="Ex: 6x2"
              />
              {errors.drivetrain && (
                <p className="text-sm text-destructive">{errors.drivetrain.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enginePosition">Posição do Motor</Label>
              <Input
                id="enginePosition"
                {...register('enginePosition')}
                placeholder="Ex: Traseira"
              />
              {errors.enginePosition && (
                <p className="text-sm text-destructive">{errors.enginePosition.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="axleCount">Número de Eixos</Label>
              <Input
                id="axleCount"
                type="number"
                {...register('axleCount')}
                placeholder="Ex: 3"
              />
              {errors.axleCount && (
                <p className="text-sm text-destructive">{errors.axleCount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
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
              <Label htmlFor="subcategory">Subcategoria</Label>
              <Input
                id="subcategory"
                {...register('subcategory')}
                placeholder="Ex: DD"
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
