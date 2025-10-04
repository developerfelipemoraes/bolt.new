import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChassisInfo as ChassisInfoType } from '../../../types/vehicle';

interface ChassisInfoProps {
  data: ChassisInfoType;
  onChange: (data: ChassisInfoType) => void;
}

export const ChassisInfo: React.FC<ChassisInfoProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof ChassisInfoType, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Informações de Montagem</h3>
        <p className="text-gray-600">Configure as informações do chassi e carroceria</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b pb-2">Chassi</h4>
          
          <div className="space-y-2">
            <Label htmlFor="chassisManufacturer">Fabricante do Chassi *</Label>
            <Input
              id="chassisManufacturer"
              value={data.chassisManufacturer}
              onChange={(e) => handleChange('chassisManufacturer', e.target.value)}
              placeholder="Ex: Mercedes-Benz, Volvo, Scania..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chassisModel">Modelo do Chassi *</Label>
            <Input
              id="chassisModel"
              value={data.chassisModel}
              onChange={(e) => handleChange('chassisModel', e.target.value)}
              placeholder="Ex: OF-1721, B270F, K270..."
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b pb-2">Carroceria</h4>
          
          <div className="space-y-2">
            <Label htmlFor="bodyManufacturer">Fabricante da Carroceria *</Label>
            <Input
              id="bodyManufacturer"
              value={data.bodyManufacturer}
              onChange={(e) => handleChange('bodyManufacturer', e.target.value)}
              placeholder="Ex: Marcopolo, Comil, Busscar..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bodyModel">Modelo da Carroceria *</Label>
            <Input
              id="bodyModel"
              value={data.bodyModel}
              onChange={(e) => handleChange('bodyModel', e.target.value)}
              placeholder="Ex: Paradiso G7, Campione, Elegance..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Use o recurso de AutoComplete para facilitar a busca por fabricantes e modelos. 
          Os campos marcados com * são obrigatórios.
        </p>
      </div>
    </div>
  );
};