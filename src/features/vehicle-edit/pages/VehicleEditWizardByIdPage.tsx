import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CircleAlert as AlertCircle, Loader as Loader2, Save } from 'lucide-react';
import { getById, upsertById } from '../services/localVehicleRepo';
import { Vehicle } from '@/types/vehicle';
import { SupplierStep } from '../wizard/steps/SupplierStep';
import { SupplierLink } from '../types/supplier';
import { toast } from 'sonner';

export function VehicleEditWizardByIdPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<(Vehicle & { id?: string; supplier?: SupplierLink }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadVehicle(id);
    }
  }, [id]);

  const loadVehicle = (vehicleId: string) => {
    setIsLoading(true);
    try {
      const found = getById(vehicleId);

      if (!found) {
        toast.error('Veículo não encontrado');
        navigate('/vehicles/edit-id');
        return;
      }

      setVehicle({ ...found, id: vehicleId });
    } catch (error) {
      console.error('Error loading vehicle:', error);
      toast.error('Erro ao carregar veículo');
      navigate('/vehicles/edit-id');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierChange = (supplier: SupplierLink | null) => {
    if (vehicle) {
      setVehicle({
        ...vehicle,
        supplier: supplier || undefined
      });
    }
  };

  const handleSave = async () => {
    if (!vehicle || !vehicle.id) {
      toast.error('Dados do veículo inválidos');
      return;
    }

    setIsSaving(true);
    try {
      upsertById(vehicle as Vehicle & { id: string });
      toast.success('Veículo atualizado com sucesso!');

      setTimeout(() => {
        navigate('/vehicles/search');
      }, 1500);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Erro ao salvar veículo');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando veículo...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Veículo não encontrado
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={() => navigate('/vehicles/edit-id')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Busca
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/vehicles/edit-id')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Editar Veículo por ID</span>
                <Badge variant="outline" className="font-mono">
                  {vehicle.id}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  O ID e SKU são campos somente leitura e não podem ser alterados.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">ID (ObjectId)</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {vehicle.id}
                  </p>
                </div>
                {(vehicle as any).sku && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">SKU</p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                      {(vehicle as any).sku}
                    </p>
                  </div>
                )}
              </div>

              {vehicle.productIdentification?.title && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Título do Produto</p>
                  <p className="text-lg font-semibold">
                    {vehicle.productIdentification.title}
                  </p>
                </div>
              )}

              {vehicle.category && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Categoria</p>
                  <Badge>{vehicle.category.name}</Badge>
                  {vehicle.subcategory && (
                    <Badge variant="outline" className="ml-2">
                      {vehicle.subcategory.name}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <SupplierStep
            supplier={vehicle.supplier}
            onChange={handleSupplierChange}
            required={false}
            mode="edit"
          />

          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate('/vehicles/search')}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
