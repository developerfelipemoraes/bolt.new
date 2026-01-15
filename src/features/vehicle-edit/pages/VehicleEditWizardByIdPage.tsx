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

import { upsertById } from '../services/localVehicleRepo';
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
import { CategorySelection } from '@/components/wizard-veiculos/steps/CategorySelection';
import { SubcategorySelection } from '@/components/wizard-veiculos/steps/SubcategorySelection';
import PricingMarginStep from '@/components/wizard-veiculos/steps/PricingMarginStep';

import { getAllCategories } from '@/data/vehicleCategories';
import { CommissionConfig, Supplier } from '@/types/commission';

const WIZARD_STEPS = [
  { id: 0, title: 'Informações Básicas', description: 'ID e dados principais' },
  { id: 1, title: 'Categoria', description: 'Selecione a categoria' },
  { id: 2, title: 'Subcategoria', description: 'Selecione a subcategoria' },
  { id: 3, title: 'Montagem', description: 'Chassi e carroceria' },
  { id: 4, title: 'Comissão', description: 'Fornecedor e margem' },
  { id: 5, title: 'Dados do Veículo', description: 'Placa, chassi, preço' },
  { id: 6, title: 'Identificação', description: 'Título do anúncio' },
  { id: 7, title: 'Mídia', description: 'Fotos e vídeos' },
  { id: 8, title: 'Secundárias', description: 'Combustível, condição' },
  { id: 9, title: 'Assentos', description: 'Configuração' },
  { id: 10, title: 'Opcionais', description: 'Acessórios' },
  { id: 11, title: 'Descrição', description: 'Descrição completa' },
  { id: 12, title: 'Localização', description: 'Endereço' }
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
      const response = await fetch(
        `https://vehicle-api-prod.kindstone-8d4454d6.eastus2.azurecontainerapps.io/api/vehicles/${vehicleId}`
      );

      if (!response.ok) {
        toast.error('Veículo não encontrado');
        navigate('/vehicles/edit-id');
        return;
      }

      const apiVehicle = await response.json();
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

      if (vehicleToSave.media) {
        vehicleToSave.media = {
          ...vehicleToSave.media,
          originalPhotosInteriorUrls: [
            ...(vehicleToSave.media.originalPhotosInteriorUrls || []),
            ...(await convertFilesToUrls(
              vehicleToSave.media.originalPhotosInterior || []
            ))
          ],
          originalPhotosExteriorUrls: [
            ...(vehicleToSave.media.originalPhotosExteriorUrls || []),
            ...(await convertFilesToUrls(
              vehicleToSave.media.originalPhotosExterior || []
            ))
          ]
        };
      }

      upsertById(vehicleToSave);
      toast.success('Veículo salvo com sucesso');

      navigate('/vehicles/search');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar');
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

      <div className="mt-6">{/* steps renderizados aqui */}</div>

      <div className="flex justify-end mt-6">
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
      </div>
    </div>
  );
}
