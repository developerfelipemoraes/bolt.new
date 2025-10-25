import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleType, VehicleCategory } from '@/types/vehicle';
import { Check } from 'lucide-react';

interface CategorySelectionProps {
  vehicleType?: VehicleType;
  categories?: VehicleCategory[];
  selectedCategory?: VehicleCategory;
  onCategorySelect: (category: VehicleCategory) => void;
  onConfirm?: () => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  vehicleType,
  categories: categoriesProp,
  selectedCategory,
  onCategorySelect
}) => {
  const categories = categoriesProp || vehicleType?.categories || [];

  console.log('CategorySelection - selectedCategory:', selectedCategory);
  console.log('CategorySelection - categories:', categories);

  return (
    <div className="space-y-6">
      {vehicleType && (
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">
            <span className="text-3xl mr-2">{vehicleType.icon}</span>
            Categoria de {vehicleType.name}
          </h3>
          <p className="text-muted-foreground">
            Selecione a categoria específica do veículo
          </p>
        </div>
      )}
      {!vehicleType && (
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">
            Selecione a Categoria
          </h3>
          <p className="text-muted-foreground">
            Escolha a categoria do veículo
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCategory?.id === category.id
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => {
              console.log('Clicking category:', category);
              onCategorySelect(category);
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                {selectedCategory?.id === category.id && (
                  <Check className="h-6 w-6 text-primary" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {category.subcategories?.length || 0} {category.subcategories?.length === 1 ? 'subcategoria' : 'subcategorias'}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategory && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">{selectedCategory.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Subcategorias disponíveis:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.subcategories?.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="px-3 py-1 bg-white rounded-full text-sm border"
                >
                  {subcategory.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
