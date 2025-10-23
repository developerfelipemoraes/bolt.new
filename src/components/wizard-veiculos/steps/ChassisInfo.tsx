import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChassisInfo as ChassisInfoType, VehicleCategory, VehicleSubcategory } from '../../../types/vehicle';
import { ChassisManufacturerAutocomplete, ChassisModelAutocomplete } from './ChassisAutocomplete';
import { BodyworkManufacturerAutocomplete, BodyworkModelAutocomplete } from './BodyworkAutocomplete';

interface ChassisInfoProps {
  data: ChassisInfoType;
  onChange: (data: ChassisInfoType) => void;
  category?: VehicleCategory;
  subcategory?: VehicleSubcategory;
  onSubcategoryChange?: (subcategory: VehicleSubcategory | undefined) => void;
  fabricationYear?: number;
  modelYear?: number;
  onFabricationYearChange?: (year: number) => void;
  onModelYearChange?: (year: number) => void;
}

export const ChassisInfo: React.FC<ChassisInfoProps> = ({
  data,
  onChange,
  category,
  subcategory,
  onSubcategoryChange,
  fabricationYear,
  modelYear,
  onFabricationYearChange,
  onModelYearChange,
}) => {
  const [selectedChassisManufacturer, setSelectedChassisManufacturer] = useState<string>(data.chassisManufacturer || '');
  const [selectedBodyManufacturer, setSelectedBodyManufacturer] = useState<string>(data.bodyManufacturer || '');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i + 1);

  const handleChange = (field: keyof ChassisInfoType, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleChassisManufacturerChange = (value: string) => {
    setSelectedChassisManufacturer(value);
    handleChange('chassisManufacturer', value);
    handleChange('chassisModel', '');
  };

  const handleBodyManufacturerChange = (value: string) => {
    setSelectedBodyManufacturer(value);
    handleChange('bodyManufacturer', value);
    handleChange('bodyModel', '');
  };

  const canShowChassis = category && subcategory && fabricationYear && modelYear;
  const canShowChassisModel = canShowChassis && selectedChassisManufacturer;
  const canShowBodywork = category && subcategory && fabricationYear && modelYear;
  const canShowBodyworkModel = canShowBodywork && selectedBodyManufacturer;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Informações de Montagem</h3>
        <p className="text-gray-600">Configure as informações do chassi e carroceria</p>
      </div>

      {/* Categoria e Subcategoria */}
      <div className="bg-blue-50 p-4 rounded-lg space-y-4">
        <div className="space-y-2">
          <Label>Categoria Selecionada</Label>
          <Input
            value={category?.name || 'Nenhuma categoria selecionada'}
            disabled
            className="bg-white"
          />
        </div>

        {category?.subcategories && category.subcategories.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategoria *</Label>
            <Select
              value={subcategory?.id}
              onValueChange={(value) => {
                const selected = category.subcategories?.find(s => s.id === value);
                onSubcategoryChange?.(selected);
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione a subcategoria" />
              </SelectTrigger>
              <SelectContent>
                {category.subcategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Anos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fabricationYear">Ano de Fabricação *</Label>
          <Select
            value={fabricationYear?.toString()}
            onValueChange={(value) => onFabricationYearChange?.(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelYear">Ano do Modelo *</Label>
          <Select
            value={modelYear?.toString()}
            onValueChange={(value) => onModelYearChange?.(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chassi e Carroceria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b pb-2">Chassi</h4>

          <div className="space-y-2">
            <Label htmlFor="chassisManufacturer">Fabricante do Chassi *</Label>
            <ChassisManufacturerAutocomplete
              category={category?.name}
              subcategory={subcategory?.name}
              manufactureYear={fabricationYear}
              modelYear={modelYear}
              value={selectedChassisManufacturer}
              onValueChange={handleChassisManufacturerChange}
              disabled={!canShowChassis}
            />
            {!canShowChassis && (
              <p className="text-xs text-muted-foreground">
                Selecione categoria, subcategoria e anos primeiro
              </p>
            )}
          </div>

          {canShowChassisModel && (
            <div className="space-y-2">
              <Label htmlFor="chassisModel">Modelo do Chassi *</Label>
              <ChassisModelAutocomplete
                manufacturer={selectedChassisManufacturer}
                category={category?.name}
                subcategory={subcategory?.name}
                manufactureYear={fabricationYear}
                modelYear={modelYear}
                value={data.chassisModel}
                onValueChange={(value) => handleChange('chassisModel', value)}
                disabled={!selectedChassisManufacturer}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b pb-2">Carroceria</h4>

          <div className="space-y-2">
            <Label htmlFor="bodyManufacturer">Fabricante da Carroceria *</Label>
            <BodyworkManufacturerAutocomplete
              category={category?.name}
              subcategory={subcategory?.name}
              manufactureYear={fabricationYear}
              modelYear={modelYear}
              value={selectedBodyManufacturer}
              onValueChange={handleBodyManufacturerChange}
              disabled={!canShowBodywork}
            />
            {!canShowBodywork && (
              <p className="text-xs text-muted-foreground">
                Selecione categoria, subcategoria e anos primeiro
              </p>
            )}
          </div>

          {canShowBodyworkModel && (
            <div className="space-y-2">
              <Label htmlFor="bodyModel">Modelo da Carroceria *</Label>
              <BodyworkModelAutocomplete
                manufacturer={selectedBodyManufacturer}
                category={category?.name}
                subcategory={subcategory?.name}
                manufactureYear={fabricationYear}
                modelYear={modelYear}
                value={data.bodyModel}
                onValueChange={(value) => handleChange('bodyModel', value)}
                disabled={!selectedBodyManufacturer}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Os autocompletes são filtrados automaticamente por categoria, subcategoria e anos.
          Selecione o fabricante primeiro para ver os modelos disponíveis. Os campos marcados com * são obrigatórios.
        </p>
      </div>
    </div>
  );
};
