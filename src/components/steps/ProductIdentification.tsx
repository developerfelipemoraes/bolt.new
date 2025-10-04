import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProductIdentification as ProductIdentificationType } from '../../../types/vehicle';

interface ProductIdentificationProps {
  data: ProductIdentificationType;
  onChange: (data: ProductIdentificationType) => void;
}

export const ProductIdentification: React.FC<ProductIdentificationProps> = ({ 
  data, 
  onChange 
}) => {
  const handleChange = (field: keyof ProductIdentificationType, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Identificação do Produto</h3>
        <p className="text-gray-600">Defina o título que identificará seu veículo</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Produto *</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ex: Ônibus Rodoviário Mercedes-Benz OF-1721 Paradiso G7 2020"
            maxLength={60}
            className="text-lg"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Máximo 60 caracteres</span>
            <span>{data.title.length}/60</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Dicas para um bom título:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Inclua a marca, modelo e ano do veículo</li>
            <li>• Mencione características importantes (estado, quilometragem baixa, etc.)</li>
            <li>• Use palavras-chave que os compradores procuram</li>
            <li>• Seja claro e objetivo</li>
          </ul>
        </div>

        {data.title && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Pré-visualização:</h4>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-semibold text-lg">{data.title}</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};