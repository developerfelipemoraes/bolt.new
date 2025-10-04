import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Save, Loader2 } from 'lucide-react';
import { SupplierStep } from '../wizard/steps/SupplierStep';
import { SupplierLink } from '../types/supplier';
import { upsertById } from '../services/localVehicleRepo';
import { Vehicle } from '@/types/vehicle';
import { toast } from 'sonner';

export function VehicleCreateWithSupplierPage() {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<SupplierLink | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = () => {
    if (!supplier) {
      toast.error('Selecione um fornecedor antes de continuar');
      return;
    }

    toast.success('Fornecedor vinculado! Prosseguindo para cadastro do veículo...');

    const newVehicleId = `vehicle-${Date.now()}`;
    const partialVehicle: Partial<Vehicle> & { id: string; supplier: SupplierLink } = {
      id: newVehicleId,
      supplier,
      category: { id: '', name: '' },
      chassisInfo: {
        chassisManufacturer: '',
        chassisModel: '',
        bodyManufacturer: '',
        bodyModel: ''
      },
      vehicleData: {
        fabricationYear: new Date().getFullYear(),
        modelYear: new Date().getFullYear(),
        mileage: 0,
        price: 0,
        priceCost: 0,
        licensePlate: '',
        renavam: '',
        chassis: '',
        availableQuantity: 1,
        internalNotes: ''
      },
      productIdentification: {
        title: ''
      },
      media: {
        originalPhotos: [],
        treatedPhotos: [],
        documentPhotos: []
      },
      secondaryInfo: {
        capacity: 0,
        condition: 'new',
        fuelType: '',
        steering: 'assisted',
        singleOwner: false,
        description: ''
      },
      optionals: {
        airConditioning: false,
        usb: false,
        packageHolder: false,
        soundSystem: false,
        monitor: false,
        wifi: false,
        bathroom: false,
        glasType: 'glued',
        curtain: false,
        cabin: false,
        accessibility: false,
        factoryRetarder: false,
        optionalRetarder: false,
        legSupport: false,
        coffeeMaker: false
      },
      description: '',
      location: {
        address: '',
        neighborhood: '',
        state: '',
        city: '',
        zipCode: ''
      }
    };

    navigate('/vehicles/new', { state: { vehicleData: partialVehicle } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/vehicles')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Novo Veículo com Fornecedor</CardTitle>
              <CardDescription>
                Fluxo alternativo de criação que exige vinculação de fornecedor antes de prosseguir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Neste fluxo, é obrigatório selecionar ou cadastrar um fornecedor antes de
                  prosseguir com o cadastro do veículo.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <SupplierStep
            supplier={supplier}
            onChange={setSupplier}
            required={true}
            mode="create"
          />

          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate('/vehicles')}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!supplier || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Continuar para Cadastro
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
