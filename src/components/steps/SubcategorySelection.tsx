import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VehicleCategory, VehicleSubcategory } from '../../../types/vehicle';
import { busHighwaySubcategories, busUrbanSubcategories, comfortCategories } from '../../../data/vehicleCategories';

interface SubcategorySelectionProps {
  category: VehicleCategory;
  selectedSubcategory?: VehicleSubcategory;
  onSubcategorySelect: (subcategory: VehicleSubcategory) => void;
}

export const SubcategorySelection: React.FC<SubcategorySelectionProps> = ({
  category,
  selectedSubcategory,
  onSubcategorySelect
}) => {
  // Se não é ônibus, pula esta etapa
  if (category.id !== 'buses') {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold">Categoria Confirmada</h3>
        <p className="text-gray-600">
          A categoria <strong>{category.name}</strong> não possui subcategorias específicas.
        </p>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-800">Prossiga para a próxima etapa.</p>
        </div>
      </div>
    );
  }

  const renderSubcategories = (subcategories: VehicleSubcategory[], title: string) => (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subcategories.map((subcategory) => (
          <Card
            key={subcategory.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSubcategory?.id === subcategory.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSubcategorySelect(subcategory)}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">{subcategory.name}</h5>
                  {selectedSubcategory?.id === subcategory.id && (
                    <Badge className="bg-blue-500">Selecionado</Badge>
                  )}
                </div>
                {subcategory.description && (
                  <p className="text-sm text-gray-600">{subcategory.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Categoria e Subcategoria do Veículo</h3>
        <p className="text-gray-600">Selecione a subcategoria específica para {category.name}</p>
      </div>

      {/* Subcategorias Rodoviárias */}
      {renderSubcategories(busHighwaySubcategories, 'Rodoviária')}

      {/* Subcategorias Urbanas */}
      {renderSubcategories(busUrbanSubcategories, 'Urbano')}

      {/* Categorias de Conforto */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-4">Categorias de Conforto (Informativo)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comfortCategories.map((comfort) => (
            <div key={comfort.id} className="bg-white p-4 rounded-lg border">
              <h5 className="font-medium mb-2">{comfort.name}</h5>
              <p className="text-sm text-gray-600">{comfort.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};