import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert as AlertCircle,
  Loader as Loader2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

import apiService from '@/services/vehicleService';
import {
  Vehicle,
  ChassisInfo,
  VehicleData,
  ProductIdentification,
  SecondaryInfo,
  SeatConfiguration,
  VehicleOptionals,
  LocationInfo,
  MediaUpload as MediaUploadType
} from '@/types/vehicle';

import { ChassisInfo as ChassisInfoStep } from '@/components/wizard-veiculos/steps/ChassisInfo';
import { VehicleData as VehicleDataStep } from '@/components/wizard-veiculos/steps/VehicleData';
import { ProductIdentification as ProductIdentificationStep } from '@/components/wizard-veiculos/steps/ProductIdentification';
import { SecondaryInfo as SecondaryInfoStep } from '@/components/wizard-veiculos/steps/SecondaryInfo';
import { SeatConfiguration as SeatConfigurationStep } from '@/components/wizard-veiculos/steps/SeatConfiguration';
import { VehicleOptionals as VehicleOptionalsStep } from '@/components/wizard-veiculos/steps/VehicleOptionals';
import { ProductDescription } from '@/components/wizard-veiculos/steps/ProductDescription';
import { LocationInfo as LocationInfoStep } from '@/components/wizard-veiculos/steps/LocationInfo';
import { MediaUpload } from '@/components/wizard-veiculos/steps/MediaUpload';
import { CategorySelectionSimple } from '@/components/wizard-veiculos/steps/CategorySelectionSimple';
import { SubcategorySelectionSimple } from '@/components/wizard-veiculos/steps/SubcategorySelectionSimple';
import PricingMarginStep from '@/components/wizard-veiculos/steps/PricingMarginStep';

import { getAllCategories } from '@/data/vehicleCategories';
import { CommissionConfig, Supplier } from '@/types/commission';

const WIZARD_STEPS = [
  { id: 0, title: 'Categoria e Subcategoria', description: 'Classificação do veículo' },
  { id: 1, title: 'Montagem', description: 'Chassi e carroceria' },
  { id: 2, title: 'Dados do Veículo', description: 'Informações principais' },
  { id: 3, title: 'Identificação', description: 'Título do anúncio' },
  { id: 4, title: 'Mídia', description: 'Fotos e vídeos' },
  { id: 5, title: 'Secundárias', description: 'Combustível e condição' },
  { id: 6, title: 'Assentos', description: 'Configuração' },
  { id: 7, title: 'Opcionais', description: 'Acessórios' },
  { id: 8, title: 'Descrição', description: 'Descrição completa' },
  { id: 9, title: 'Localização', description: 'Endereço' }
];

export function VehicleEditWizardByIdPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<
    (Vehicle & { supplier?: Supplier; commission?: CommissionConfig }) | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (id) loadVehicle(id);
  }, [id]);

  const loadVehicle = async (vehicleId: string) => {
    setIsLoading(true);

    try {
      const apiVehicle = await apiService.getVehicleBySku(vehicleId);
      const allCategories = getAllCategories();

      const category = allCategories.find(c => c.id === apiVehicle.category?.id);
      const subcategory = category?.subcategories?.find(
        s => s.id === apiVehicle.subcategory?.id
      );

      const vehicleData: any = {
        ...apiVehicle,
        category,
        subcategory
      };

      /* ===== NORMALIZAÇÃO DE MÍDIA ===== */
      let originalPhotosInteriorUrls: string[] = [];
      let originalPhotosExteriorUrls: string[] = [];
      let originalPhotosInstrumentsUrls: string[] = [];
      let treatedPhotosUrls: string[] = [];
      let documentPhotosUrls: string[] = [];
      let videoUrl: string | undefined;

      if (vehicleData.media) {
        originalPhotosInteriorUrls = vehicleData.media.originalPhotosInteriorUrls || [];
        originalPhotosExteriorUrls = vehicleData.media.originalPhotosExteriorUrls || [];
        originalPhotosInstrumentsUrls =
          vehicleData.media.originalPhotosInstrumentsUrls || [];
        treatedPhotosUrls = vehicleData.media.treatedPhotosUrls || [];
        documentPhotosUrls = vehicleData.media.documentPhotosUrls || [];
        videoUrl = vehicleData.media.videoUrl;
      }

      vehicleData.media = {
        originalPhotosInterior: [],
        originalPhotosExterior: [],
        originalPhotosInstruments: [],
        treatedPhotos: [],
        documentPhotos: [],
        video: undefined,
        originalPhotosInteriorUrls,
        originalPhotosExteriorUrls,
        originalPhotosInstrumentsUrls,
        treatedPhotosUrls,
        documentPhotosUrls,
        videoUrl
      };

      setVehicle(vehicleData);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar veículo');
      navigate('/vehicles/edit-id');
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicleData = (data: Partial<any>) => {
    if (vehicle) setVehicle({ ...vehicle, ...data });
  };

  const convertFilesToUrls = async (files: File[]) =>
    Promise.all(
      files.map(
        file =>
          new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    );

  const handleSave = async () => {
    if (!vehicle?.id) return;

    setIsSaving(true);

    try {
      const vehicleToSave: any = { ...vehicle };

      if (vehicleToSave.media?.originalPhotosInterior?.length > 0 ||
          vehicleToSave.media?.originalPhotosExterior?.length > 0) {
        const newInteriorUrls = await convertFilesToUrls(
          vehicleToSave.media.originalPhotosInterior || []
        );
        const newExteriorUrls = await convertFilesToUrls(
          vehicleToSave.media.originalPhotosExterior || []
        );

        if (newInteriorUrls.length > 0 || newExteriorUrls.length > 0) {
          vehicleToSave.media = {
            ...vehicleToSave.media,
            originalPhotosInteriorUrls: [
              ...(vehicleToSave.media.originalPhotosInteriorUrls || []),
              ...newInteriorUrls
            ],
            originalPhotosExteriorUrls: [
              ...(vehicleToSave.media.originalPhotosExteriorUrls || []),
              ...newExteriorUrls
            ]
          };
        }
      }

      await apiService.updateVehicle(vehicle.id, vehicleToSave);
      toast.success('Veículo salvo com sucesso');

      navigate('/vehicles/search');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar veículo');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-5xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/vehicles/search')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{WIZARD_STEPS[currentStep].title}</CardTitle>
          <p className="text-sm text-muted-foreground">{WIZARD_STEPS[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className="space-y-6">
              <CategorySelectionSimple
                categories={getAllCategories()}
                selectedCategory={vehicle.category}
                onCategorySelect={(category) =>
                  updateVehicleData({ category, subcategory: undefined })
                }
              />
              {vehicle.category && (
                <SubcategorySelectionSimple
                  category={vehicle.category}
                  selectedSubcategory={vehicle.subcategory}
                  onSubcategorySelect={(subcategory) =>
                    updateVehicleData({ subcategory })
                  }
                />
              )}
            </div>
          )}

          {currentStep === 1 && (
            <ChassisInfoStep
              data={vehicle}
              onChange={(data) => updateVehicleData(data)}
            />
          )}

          {currentStep === 2 && (
            <VehicleDataStep
              data={vehicle}
              onChange={(data) => updateVehicleData(data)}
            />
          )}

          {currentStep === 3 && (
            <ProductIdentificationStep
              data={vehicle.productIdentification || { title: '' }}
              onChange={(data) => updateVehicleData({ productIdentification: data })}
            />
          )}

          {currentStep === 4 && (
            <MediaUpload
              data={vehicle.media}
              onChange={(data) => updateVehicleData({ media: data })}
            />
          )}

          {currentStep === 5 && (
            <SecondaryInfoStep
              data={vehicle}
              onChange={(data) => updateVehicleData(data)}
            />
          )}

          {currentStep === 6 && (
            <SeatConfigurationStep
              data={vehicle.seatComposition || { totals: {}, composition: [], totalCapacity: 0 }}
              onChange={(data) => updateVehicleData({ seatComposition: data })}
            />
          )}

          {currentStep === 7 && (
            <VehicleOptionalsStep
              data={vehicle.optionals || {}}
              onChange={(data) => updateVehicleData({ optionals: data })}
            />
          )}

          {currentStep === 8 && (
            <ProductDescription
              data={{ description: vehicle.description || '' }}
              onChange={(data) => updateVehicleData(data)}
            />
          )}

          {currentStep === 9 && (
            <LocationInfoStep
              data={vehicle.location || {}}
              onChange={(data) => updateVehicleData({ location: data })}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {currentStep < WIZARD_STEPS.length - 1 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
