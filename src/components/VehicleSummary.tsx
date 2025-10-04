import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  Calendar, 
  MapPin, 
  Fuel, 
  Users, 
  Settings,
  Image,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Vehicle } from '../types/vehicle';

interface VehicleSummaryProps {
  vehicleData: Partial<Vehicle>;
}

export const VehicleSummary: React.FC<VehicleSummaryProps> = ({ vehicleData }) => {
  const renderField = (label: string, value: string | number | null | undefined, icon?: React.ReactNode) => {
    if (!value) return null;
    
    return (
      <div className="flex items-center gap-2 py-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-sm font-medium text-gray-600">{label}:</span>
        <span className="text-sm">{value}</span>
      </div>
    );
  };

  const renderSection = (title: string, children: React.ReactNode, icon?: React.ReactNode) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-semibold text-gray-800">{title}</h4>
        </div>
        <div className="ml-6 space-y-1">
          {children}
        </div>
      </div>
    );
  };

  const getConditionLabel = (condition: string) => {
    const labels = {
      'new': 'Novo',
      'semi-new': 'Seminovo',
      'used': 'Usado'
    };
    return labels[condition as keyof typeof labels] || condition;
  };

  const countActiveOptionals = () => {
    if (!vehicleData.optionals) return 0;
    return Object.values(vehicleData.optionals).filter(value => value === true).length;
  };

  const getOptionalsList = () => {
    if (!vehicleData.optionals) return [];
    
    const optionalLabels = {
      airConditioning: 'Ar-condicionado',
      usb: 'USB',
      packageHolder: 'Porta-pacote',
      soundSystem: 'Sistema de som',
      monitor: 'Monitor',
      wifi: 'Wi-Fi',
      bathroom: 'Banheiro',
      curtain: 'Cortina',
      cabin: 'Cabine',
      accessibility: 'Acessibilidade',
      factoryRetarder: 'Freio Retarder de Fábrica',
      optionalRetarder: 'Freio Retarder Opcional',
      legSupport: 'Apoio de perna',
      coffeeMaker: 'Cafeteira'
    };

    return Object.entries(vehicleData.optionals)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => optionalLabels[key as keyof typeof optionalLabels] || key);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Resumo do Cadastro</h3>
        <p className="text-gray-600">Confira todos os dados preenchidos antes de finalizar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderSection(
              "Identificação",
              <>
                {renderField("Título", vehicleData.productIdentification?.title)}
                {renderField("Categoria", vehicleData.category?.name)}
                {renderField("Subcategoria", vehicleData.subcategory?.name)}
                {vehicleData.secondaryInfo?.condition && (
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-sm font-medium text-gray-600">Condição:</span>
                    <Badge variant="outline">{getConditionLabel(vehicleData.secondaryInfo.condition)}</Badge>
                  </div>
                )}
              </>
            )}

            <Separator />

            {renderSection(
              "Montagem",
              <>
                {renderField("Fab. Chassi", vehicleData.chassisInfo?.chassisManufacturer)}
                {renderField("Modelo Chassi", vehicleData.chassisInfo?.chassisModel)}
                {renderField("Fab. Carroceria", vehicleData.chassisInfo?.bodyManufacturer)}
                {renderField("Modelo Carroceria", vehicleData.chassisInfo?.bodyModel)}
              </>
            )}
          </CardContent>
        </Card>

        {/* Dados Técnicos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Dados Técnicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderSection(
              "Documentação",
              <>
                {renderField("Placa", vehicleData.vehicleData?.licensePlate)}
                {renderField("Renavam", vehicleData.vehicleData?.renavam)}
                {renderField("Chassi", vehicleData.vehicleData?.chassis)}
              </>
            )}

            <Separator />

            {renderSection(
              "Especificações",
              <>
                {renderField(
                  "Ano/Modelo", 
                  vehicleData.vehicleData?.fabricationYear && vehicleData.vehicleData?.modelYear
                    ? `${vehicleData.vehicleData.fabricationYear}/${vehicleData.vehicleData.modelYear}`
                    : null,
                  <Calendar className="w-4 h-4" />
                )}
                {renderField(
                  "Quilometragem", 
                  vehicleData.vehicleData?.mileage ? `${vehicleData.vehicleData.mileage.toLocaleString('pt-BR')} km` : null
                )}
                {renderField(
                  "Combustível", 
                  vehicleData.secondaryInfo?.fuelType,
                  <Fuel className="w-4 h-4" />
                )}
                {renderField(
                  "Capacidade", 
                  vehicleData.secondaryInfo?.capacity ? `${vehicleData.secondaryInfo.capacity} pessoas` : null,
                  <Users className="w-4 h-4" />
                )}
                {renderField("Direção", vehicleData.secondaryInfo?.steering)}
                {vehicleData.secondaryInfo?.singleOwner && (
                  <div className="flex items-center gap-2 py-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Único dono</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Localização
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehicleData.location?.address && (
              <div className="space-y-1">
                <p className="font-medium">{vehicleData.location.address}</p>
                <p className="text-sm text-gray-600">
                  {vehicleData.location.neighborhood}, {vehicleData.location.city}/{vehicleData.location.state}
                </p>
                {vehicleData.location.zipCode && (
                  <p className="text-sm text-gray-600">CEP: {vehicleData.location.zipCode}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mídia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Mídia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {renderField(
              "Fotos Originais", 
              vehicleData.media?.originalPhotos?.length ? `${vehicleData.media.originalPhotos.length} arquivos` : null
            )}
            {renderField(
              "Fotos Tratadas", 
              vehicleData.media?.treatedPhotos?.length ? `${vehicleData.media.treatedPhotos.length} arquivos` : null
            )}
            {renderField(
              "Fotos de Documentos", 
              vehicleData.media?.documentPhotos?.length ? `${vehicleData.media.documentPhotos.length} arquivos` : null
            )}
            {renderField(
              "Vídeo", 
              vehicleData.media?.video ? "1 arquivo" : null
            )}
          </CardContent>
        </Card>

        {/* Opcionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Opcionais ({countActiveOptionals()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {countActiveOptionals() > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {getOptionalsList().map((optional, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-sm">{optional}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum opcional selecionado</p>
            )}
          </CardContent>
        </Card>

        {/* Configuração de Poltronas (se for ônibus) */}
        {vehicleData.category?.id === 'buses' && vehicleData.seatConfiguration && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Configuração de Poltronas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(vehicleData.seatConfiguration).map(([type, count]) => {
                  if (count > 0) {
                    const labels = {
                      conventional: 'Convencional',
                      executive: 'Executivo',
                      semiSleeper: 'Semi-leito',
                      sleeper: 'Leito',
                      sleeperBed: 'Leito-Cama',
                      fixed: 'Fixa'
                    };
                    return (
                      <div key={type} className="flex justify-between">
                        <span className="text-sm">{labels[type as keyof typeof labels]}:</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Descrição */}
      {vehicleData.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Descrição do Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap text-sm">{vehicleData.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notas Internas */}
      {vehicleData.vehicleData?.internalNotes && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <FileText className="w-5 h-5" />
              Notas Internas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">{vehicleData.vehicleData.internalNotes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};