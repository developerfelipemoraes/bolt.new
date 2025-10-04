import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Car, Truck, Bus, Ship, Wrench } from 'lucide-react';
import { vehicleCategories } from '../../../data/vehicleCategories';
import { VehicleCategory } from '../../../types/vehicle';

interface CategorySelectionProps {
  selectedCategory?: VehicleCategory;
  onCategorySelect: (category: VehicleCategory) => void;
  onConfirm: () => void;
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'cars-trucks':
    case 'vans':
    case 'classic-cars':
    case 'motorhomes':
      return <Car className="w-8 h-8" />;
    case 'trucks':
    case 'heavy-vehicles':
      return <Truck className="w-8 h-8" />;
    case 'buses':
      return <Bus className="w-8 h-8" />;
    case 'nautical':
      return <Ship className="w-8 h-8" />;
    case 'agricultural':
      return <Wrench className="w-8 h-8" />;
    default:
      return <Car className="w-8 h-8" />;
  }
};

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategory,
  onCategorySelect,
  onConfirm
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCategoryClick = (category: VehicleCategory) => {
    onCategorySelect(category);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleChangeCategory = () => {
    setShowConfirmation(false);
  };

  if (showConfirmation && selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Categoria Selecionada</h3>
          <p className="text-lg text-gray-600">
            Você selecionou: <span className="font-semibold">{selectedCategory.name}</span>
          </p>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-green-600">
                {getCategoryIcon(selectedCategory.id)}
              </div>
              <div>
                <h4 className="font-semibold text-lg">{selectedCategory.name}</h4>
                {selectedCategory.subcategories && (
                  <p className="text-sm text-gray-600">
                    {selectedCategory.subcategories.length} subcategorias disponíveis
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={handleChangeCategory}>
            Alterar Categoria
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Selecione a Categoria do Veículo</h3>
        <p className="text-gray-600">Escolha o tipo de veículo que você deseja cadastrar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicleCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
              selectedCategory?.id === category.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className={`${
                  selectedCategory?.id === category.id 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}>
                  {getCategoryIcon(category.id)}
                </div>
                <h4 className="font-semibold">{category.name}</h4>
                {category.subcategories && (
                  <Badge variant="secondary" className="text-xs">
                    {category.subcategories.length} subcategorias
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};