import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyData } from '../../types/company';

interface OperationsStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

const vehicleCategories = [
  'ônibus',
  'caminhões',
  'vans',
  'carros',
  'máquinas',
  'motocicletas',
  'utilitários'
];

export default function OperationsStep({ data, onDataChange }: OperationsStepProps) {
  const handleInputChange = (field: keyof CompanyData, value: string) => {
    onDataChange({ [field]: value });
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    const currentCategories = data.interestCategories || [];
    let updatedCategories;
    
    if (checked) {
      updatedCategories = [...currentCategories, category];
    } else {
      updatedCategories = currentCategories.filter(cat => cat !== category);
    }
    
    onDataChange({ interestCategories: updatedCategories });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Operacionais</CardTitle>
          <CardDescription>Dados sobre a operação e frota da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessLine">Ramo de Atividade</Label>
              <Input
                id="businessLine"
                value={data.businessLine || ''}
                onChange={(e) => handleInputChange('businessLine', e.target.value)}
                placeholder="Transporte, Revenda, Fretamento, Locadora, Outros"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="intendedUse">Uso Previsto</Label>
              <Input
                id="intendedUse"
                value={data.intendedUse || ''}
                onChange={(e) => handleInputChange('intendedUse', e.target.value)}
                placeholder="fretamento, linha urbana, carga, turismo, etc."
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="preferredBrands">Marcas / Modelos Preferidos</Label>
              <Input
                id="preferredBrands"
                value={data.preferredBrands || ''}
                onChange={(e) => handleInputChange('preferredBrands', e.target.value)}
                placeholder="Mercedes-Benz, Volvo, Scania, Ford, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frota Atual</CardTitle>
          <CardDescription>Descrição da frota existente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="currentFleet">Descrição da Frota</Label>
            <Textarea
              id="currentFleet"
              value={data.currentFleet || ''}
              onChange={(e) => handleInputChange('currentFleet', e.target.value)}
              placeholder="Ex: 18 ônibus urbano, 4 caminhões 6x2, 3 vans"
              rows={3}
            />
            <p className="text-sm text-gray-500">
              Descreva quantos e quais tipos de veículos a empresa possui atualmente
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias de Interesse</CardTitle>
          <CardDescription>Tipos de veículos que a empresa tem interesse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicleCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={data.interestCategories?.includes(category) || false}
                  onCheckedChange={(checked) => handleCategoryToggle(category, checked as boolean)}
                />
                <Label htmlFor={category} className="capitalize">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}