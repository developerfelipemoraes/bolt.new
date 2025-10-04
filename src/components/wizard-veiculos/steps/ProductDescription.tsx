import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Vehicle } from '../../../types/vehicle';

interface ProductDescriptionProps {
  description: string;
  onChange: (description: string) => void;
  vehicleData: Partial<Vehicle>;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  onChange,
  vehicleData
}) => {
  const [autoDescription, setAutoDescription] = useState('');

  const generateAutoDescription = () => {
    const parts: string[] = [];

    // Categoria e marca
    if (vehicleData.category) {
      parts.push(`${vehicleData.category.name}`);
    }

    if (vehicleData.chassisInfo?.chassisManufacturer) {
      parts.push(`${vehicleData.chassisInfo.chassisManufacturer}`);
    }

    // Modelo e ano
    if (vehicleData.chassisInfo?.chassisModel && vehicleData.vehicleData?.modelYear) {
      parts.push(`${vehicleData.chassisInfo.chassisModel} ${vehicleData.vehicleData.modelYear}`);
    }

    // Condição
    if (vehicleData.secondaryInfo?.condition) {
      const conditionMap = {
        'new': 'Novo',
        'semi-new': 'Seminovo',
        'used': 'Usado'
      };
      parts.push(`em estado ${conditionMap[vehicleData.secondaryInfo.condition]}`);
    }

    // Quilometragem
    if (vehicleData.vehicleData?.mileage) {
      parts.push(`com ${vehicleData.vehicleData.mileage.toLocaleString('pt-BR')} km`);
    }

    // Capacidade
    if (vehicleData.secondaryInfo?.capacity && vehicleData.secondaryInfo.capacity > 1) {
      parts.push(`para ${vehicleData.secondaryInfo.capacity} passageiros`);
    }

    // Combustível
    if (vehicleData.secondaryInfo?.fuelType) {
      parts.push(`movido a ${vehicleData.secondaryInfo.fuelType.toLowerCase()}`);
    }

    // Opcionais principais
    const optionals: string[] = [];
    if (vehicleData.optionals?.airConditioning) optionals.push('ar-condicionado');
    if (vehicleData.optionals?.bathroom) optionals.push('banheiro');
    if (vehicleData.optionals?.wifi) optionals.push('Wi-Fi');
    if (vehicleData.optionals?.soundSystem) optionals.push('sistema de som');

    if (optionals.length > 0) {
      parts.push(`equipado com ${optionals.join(', ')}`);
    }

    // Único dono
    if (vehicleData.secondaryInfo?.singleOwner) {
      parts.push('de único dono');
    }

    // Localização
    if (vehicleData.location?.city && vehicleData.location?.state) {
      parts.push(`localizado em ${vehicleData.location.city}/${vehicleData.location.state}`);
    }

    const generatedDescription = parts.join(', ') + '.';
    setAutoDescription(generatedDescription);
  };

  useEffect(() => {
    generateAutoDescription();
  }, [vehicleData]);

  const useAutoDescription = () => {
    onChange(autoDescription);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Descrição do Produto</h3>
        <p className="text-gray-600">Crie uma descrição completa e atrativa para o veículo</p>
      </div>

      {/* Descrição Automática */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-blue-800">Descrição Automática</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={generateAutoDescription}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">{autoDescription}</p>
          <Button
            variant="outline"
            onClick={useAutoDescription}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Usar Esta Descrição
          </Button>
        </CardContent>
      </Card>

      {/* Campo de Descrição Personalizada */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição Personalizada</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escreva uma descrição personalizada do veículo, destacando suas características únicas, história, estado de conservação e outros detalhes relevantes..."
          rows={12}
          maxLength={50000}
          className="min-h-[300px]"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Use linguagem clara e atrativa para despertar o interesse dos compradores</span>
          <span>{description.length}/50.000</span>
        </div>
      </div>

      {/* Dicas para uma boa descrição */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas para uma Descrição Eficaz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-700">✅ Faça:</h4>
              <ul className="text-sm space-y-1 text-green-600">
                <li>• Use palavras-chave relevantes</li>
                <li>• Destaque diferenciais únicos</li>
                <li>• Mencione histórico de manutenção</li>
                <li>• Inclua informações sobre documentação</li>
                <li>• Descreva o estado de conservação</li>
                <li>• Adicione informações sobre garantia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-red-700">❌ Evite:</h4>
              <ul className="text-sm space-y-1 text-red-600">
                <li>• Informações imprecisas ou falsas</li>
                <li>• Linguagem muito técnica</li>
                <li>• Textos muito longos e cansativos</li>
                <li>• Omitir defeitos importantes</li>
                <li>• Usar apenas maiúsculas</li>
                <li>• Repetir informações desnecessariamente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview da Descrição */}
      {description && (
        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="whitespace-pre-wrap text-gray-700">{description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};