import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, CircleAlert as AlertCircle, Loader as Loader2, Save } from 'lucide-react';
import { getById, upsertById } from '../services/localVehicleRepo';
import { Vehicle, ChassisInfo, VehicleData, ProductIdentification, SecondaryInfo, SeatConfiguration, VehicleOptionals, LocationInfo } from '@/types/vehicle';
import { SupplierLink } from '../types/supplier';
import { toast } from 'sonner';
import { ChassisInfo as ChassisInfoStep } from '@/components/wizard-veiculos/steps/ChassisInfo';
import { VehicleData as VehicleDataStep } from '@/components/wizard-veiculos/steps/VehicleData';
import { ProductIdentification as ProductIdentificationStep } from '@/components/wizard-veiculos/steps/ProductIdentification';
import { SecondaryInfo as SecondaryInfoStep } from '@/components/wizard-veiculos/steps/SecondaryInfo';
import { SeatConfiguration as SeatConfigurationStep } from '@/components/wizard-veiculos/steps/SeatConfiguration';
import { VehicleOptionals as VehicleOptionalsStep } from '@/components/wizard-veiculos/steps/VehicleOptionals';
import { ProductDescription } from '@/components/wizard-veiculos/steps/ProductDescription';
import { LocationInfo as LocationInfoStep } from '@/components/wizard-veiculos/steps/LocationInfo';
import { SupplierStep } from '../wizard/steps/SupplierStep';
import { MediaUpload } from '@/components/wizard-veiculos/steps/MediaUpload';
import { MediaUpload as MediaUploadType } from '@/types/vehicle';

const WIZARD_STEPS = [
  { id: 0, title: 'Informações Básicas', description: 'ID e dados principais' },
  { id: 1, title: 'Fornecedor', description: 'Vinculação com fornecedor' },
  { id: 2, title: 'Informações de Montagem', description: 'Chassi e carroceria' },
  { id: 3, title: 'Dados do Veículo', description: 'Placa, chassi, RENAVAM' },
  { id: 4, title: 'Identificação do Produto', description: 'Título do anúncio' },
  { id: 5, title: 'Upload de Mídia', description: 'Fotos e vídeos do veículo' },
  { id: 6, title: 'Informações Secundárias', description: 'Capacidade, condição, combustível' },
  { id: 7, title: 'Configuração de Assentos', description: 'Tipos de assentos' },
  { id: 8, title: 'Opcionais', description: 'Acessórios e equipamentos' },
  { id: 9, title: 'Descrição', description: 'Descrição completa do produto' },
  { id: 10, title: 'Localização', description: 'Endereço e coordenadas' }
];

export function VehicleEditWizardByIdPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<(Vehicle & { id?: string; supplier?: SupplierLink }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

      // Converter dados de mídia se necessário
      const vehicleData: any = { ...found, id: vehicleId };

      // Normalizar estrutura de mídia de diferentes formatos possíveis
      let originalPhotosUrls: string[] = [];
      let treatedPhotosUrls: string[] = [];
      let documentPhotosUrls: string[] = [];
      let videoUrl: string | undefined = undefined;

      // Formato 1: media.originalPhotosUrls (novo formato)
      if (vehicleData.media?.originalPhotosUrls) {
        originalPhotosUrls = vehicleData.media.originalPhotosUrls;
        treatedPhotosUrls = vehicleData.media.treatedPhotosUrls || [];
        documentPhotosUrls = vehicleData.media.documentPhotosUrls || [];
        videoUrl = vehicleData.media.videoUrl;
      }
      // Formato 2: mediaFiles.originalPhotos (VehiclePayload)
      else if (vehicleData.mediaFiles) {
        originalPhotosUrls = vehicleData.mediaFiles.originalPhotos || [];
        treatedPhotosUrls = vehicleData.mediaFiles.treatedPhotos || [];
        documentPhotosUrls = vehicleData.mediaFiles.documentPhotos || [];
        videoUrl = vehicleData.mediaFiles.video;
      }
      // Formato 3: Verificar se as "photos" são strings (URLs) ao invés de Files
      else if (vehicleData.media) {
        const checkIfUrls = (arr: any) => {
          if (!Array.isArray(arr) || arr.length === 0) return false;
          // Verificar se o primeiro elemento é uma string (URL)
          return typeof arr[0] === 'string';
        };

        // Copiar arrays de URLs se existirem
        if (vehicleData.media.originalPhotos && checkIfUrls(vehicleData.media.originalPhotos)) {
          originalPhotosUrls = [...vehicleData.media.originalPhotos];
        }
        if (vehicleData.media.treatedPhotos && checkIfUrls(vehicleData.media.treatedPhotos)) {
          treatedPhotosUrls = [...vehicleData.media.treatedPhotos];
        }
        if (vehicleData.media.documentPhotos && checkIfUrls(vehicleData.media.documentPhotos)) {
          documentPhotosUrls = [...vehicleData.media.documentPhotos];
        }

        // Verificar se video é uma URL string
        if (vehicleData.media.video && typeof vehicleData.media.video === 'string') {
          videoUrl = vehicleData.media.video;
        }
      }

      // Normalizar para o formato esperado
      vehicleData.media = {
        originalPhotos: [],
        treatedPhotos: [],
        documentPhotos: [],
        video: undefined,
        originalPhotosUrls,
        treatedPhotosUrls,
        documentPhotosUrls,
        videoUrl
      };

      console.log('Vehicle loaded with media URLs:', {
        originalPhotosUrls,
        treatedPhotosUrls,
        documentPhotosUrls,
        videoUrl
      });

      setVehicle(vehicleData);
    } catch (error) {
      console.error('Error loading vehicle:', error);
      toast.error('Erro ao carregar veículo');
      navigate('/vehicles/edit-id');
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehicleData = (updates: Partial<Vehicle & { supplier?: SupplierLink }>) => {
    if (vehicle) {
      setVehicle({ ...vehicle, ...updates });
    }
  };

  const handleSupplierChange = (supplier: SupplierLink | null) => {
    updateVehicleData({ supplier: supplier || undefined });
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Converter Files para base64 URLs antes de salvar
  const convertFilesToUrls = async (files: File[]): Promise<string[]> => {
    const promises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(promises);
  };

  const handleSave = async () => {
    if (!vehicle || !vehicle.id) {
      toast.error('Dados do veículo inválidos');
      return;
    }

    setIsSaving(true);
    try {
      // Converter novos Files para URLs antes de salvar
      const vehicleToSave = { ...vehicle };

      if (vehicleToSave.media) {
        const newOriginalUrls = await convertFilesToUrls(vehicleToSave.media.originalPhotos || []);
        const newTreatedUrls = await convertFilesToUrls(vehicleToSave.media.treatedPhotos || []);
        const newDocumentUrls = await convertFilesToUrls(vehicleToSave.media.documentPhotos || []);

        let videoUrl = vehicleToSave.media.videoUrl;
        if (vehicleToSave.media.video) {
          videoUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(vehicleToSave.media.video!);
          });
        }

        vehicleToSave.media = {
          originalPhotos: [],
          treatedPhotos: [],
          documentPhotos: [],
          video: undefined,
          originalPhotosUrls: [...(vehicleToSave.media.originalPhotosUrls || []), ...newOriginalUrls],
          treatedPhotosUrls: [...(vehicleToSave.media.treatedPhotosUrls || []), ...newTreatedUrls],
          documentPhotosUrls: [...(vehicleToSave.media.documentPhotosUrls || []), ...newDocumentUrls],
          videoUrl
        };
      }

      upsertById(vehicleToSave as Vehicle & { id: string });
      toast.success('Veículo atualizado com sucesso!');

      // Recarregar o veículo para mostrar as novas URLs
      loadVehicle(vehicle.id);

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

  const renderStepContent = () => {
    if (!vehicle) return null;

    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
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
                  <p className="text-sm font-medium text-gray-600 mb-2">Categoria e Subcategoria</p>
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                      <Badge variant="default" className="text-sm">
                        {vehicle.category.name || '—'}
                      </Badge>
                    </div>
                    {vehicle.subcategory && (
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                        <Badge variant="outline" className="text-sm">
                          {vehicle.subcategory.name || '—'}
                        </Badge>
                      </div>
                    )}
                    {!vehicle.subcategory && (
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                        <span className="text-sm text-gray-400">—</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <SupplierStep
            supplier={vehicle.supplier}
            onChange={handleSupplierChange}
            required={false}
            mode="edit"
          />
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Informações de Montagem</CardTitle>
            </CardHeader>
            <CardContent>
              <ChassisInfoStep
                data={vehicle.chassisInfo || { chassisManufacturer: '', bodyManufacturer: '', chassisModel: '', bodyModel: '' }}
                onChange={(data: ChassisInfo) => updateVehicleData({ chassisInfo: data })}
              />
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Dados do Veículo</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleDataStep
                data={vehicle.vehicleData || {
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
                }}
                onChange={(data: VehicleData) => updateVehicleData({ vehicleData: data })}
                showBusPrefix={vehicle.category?.id === 'buses'}
              />
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Identificação do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductIdentificationStep
                data={vehicle.productIdentification || { title: '' }}
                onChange={(data: ProductIdentification) => updateVehicleData({ productIdentification: data })}
              />
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upload de Mídia</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaUpload
                data={vehicle.media || {
                  originalPhotos: [],
                  treatedPhotos: [],
                  documentPhotos: [],
                  video: undefined
                }}
                onChange={(data: MediaUploadType) => updateVehicleData({ media: data })}
              />
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Informações Secundárias</CardTitle>
            </CardHeader>
            <CardContent>
              <SecondaryInfoStep
                data={vehicle.secondaryInfo || {
                  capacity: 0,
                  condition: 'used',
                  fuelType: '',
                  steering: 'hydraulic',
                  singleOwner: false,
                  description: ''
                }}
                onChange={(data: SecondaryInfo) => updateVehicleData({ secondaryInfo: data })}
              />
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Assentos</CardTitle>
            </CardHeader>
            <CardContent>
              <SeatConfigurationStep
                data={vehicle.seatConfiguration || {
                  conventional: 0,
                  executive: 0,
                  semiSleeper: 0,
                  sleeper: 0,
                  sleeperBed: 0,
                  fixed: 0
                }}
                onChange={(data: SeatConfiguration) => updateVehicleData({ seatConfiguration: data })}
                isBus={vehicle.category?.id === 'buses'}
              />
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Opcionais do Veículo</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleOptionalsStep
                data={vehicle.optionals || {
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
                }}
                onChange={(data: VehicleOptionals) => updateVehicleData({ optionals: data })}
              />
            </CardContent>
          </Card>
        );

      case 9:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Descrição do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductDescription
                description={vehicle.description || ''}
                onChange={(description: string) => updateVehicleData({ description })}
                vehicleData={vehicle}
              />
            </CardContent>
          </Card>
        );

      case 10:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Localização</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationInfoStep
                data={vehicle.location || {
                  address: '',
                  neighborhood: '',
                  state: '',
                  city: '',
                  zipCode: ''
                }}
                onChange={(data: LocationInfo) => updateVehicleData({ location: data })}
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
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
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/vehicles/edit-id')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Veículo</h1>
              <p className="text-sm text-gray-600 mt-1">
                Etapa {currentStep + 1} de {WIZARD_STEPS.length}
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              ID: {vehicle.id}
            </Badge>
          </div>

          <div className="relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300"
              />
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {WIZARD_STEPS[currentStep].title}
            </h2>
            <p className="text-sm text-gray-600">
              {WIZARD_STEPS[currentStep].description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {renderStepContent()}

          <div className="flex items-center justify-between pt-6 border-t bg-white rounded-lg p-6 shadow-sm">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/vehicles/search')}
              >
                Cancelar
              </Button>
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep < WIZARD_STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  Próxima
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
