import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VehicleData as VehicleDataType } from '../../../types/vehicle';

interface VehicleDataProps {
  data: VehicleDataType;
  onChange: (data: VehicleDataType) => void;
  showBusPrefix?: boolean;
}

export const VehicleData: React.FC<VehicleDataProps> = ({ 
  data, 
  onChange, 
  showBusPrefix = false 
}) => {
  const handleChange = (field: keyof VehicleDataType, value: string | number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Dados do Veículo</h3>
        <p className="text-gray-600">Informe os dados técnicos e de identificação do veículo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fabricationYear">Ano de Fabricação *</Label>
          <select
            id="fabricationYear"
            value={data.fabricationYear}
            onChange={(e) => handleChange('fabricationYear', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelYear">Ano do Modelo *</Label>
          <select
            id="modelYear"
            value={data.modelYear}
            onChange={(e) => handleChange('modelYear', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Quilometragem *</Label>
          <Input
            id="mileage"
            type="number"
            value={data.mileage}
            onChange={(e) => handleChange('mileage', parseInt(e.target.value) || 0)}
            placeholder="Ex: 150000"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">Número da Placa *</Label>
          <Input
            id="licensePlate"
            value={data.licensePlate}
            onChange={(e) => handleChange('licensePlate', e.target.value.toUpperCase())}
            placeholder="Ex: ABC-1234"
            maxLength={8}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="renavam">Número do Renavam *</Label>
          <Input
            id="renavam"
            value={data.renavam}
            onChange={(e) => handleChange('renavam', e.target.value)}
            placeholder="Ex: 12345678901"
            maxLength={11}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chassis">Número do Chassi *</Label>
          <Input
            id="chassis"
            value={data.chassis}
            onChange={(e) => handleChange('chassis', e.target.value.toUpperCase())}
            placeholder="Ex: 9BW123456789012345"
            maxLength={17}
          />
        </div>

        {showBusPrefix && (
          <div className="space-y-2">
            <Label htmlFor="busPrefix">Prefixo da Linha do Ônibus</Label>
            <Input
              id="busPrefix"
              value={data.busPrefix || ''}
              onChange={(e) => handleChange('busPrefix', e.target.value)}
              placeholder="Ex: 001, A123"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="availableQuantity">Quantidade Disponível para Venda *</Label>
          <Input
            id="availableQuantity"
            type="number"
            value={data.availableQuantity}
            onChange={(e) => handleChange('availableQuantity', parseInt(e.target.value) || 1)}
            placeholder="1"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="internalNotes">Notas para Controle Interno</Label>
        <Textarea
          id="internalNotes"
          value={data.internalNotes}
          onChange={(e) => handleChange('internalNotes', e.target.value)}
          placeholder="Observações internas sobre o veículo, negociação, estado, etc."
          rows={4}
          maxLength={1000}
        />
        <p className="text-sm text-gray-500">
          {data.internalNotes.length}/1000 caracteres
        </p>
      </div>
    </div>
  );
};