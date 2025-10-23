import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VehicleCategory, VehicleSubcategory } from '@/types/vehicle';
import { Check } from 'lucide-react';

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
  const subcategories = category.subcategories || [];

  if (subcategories.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold">Categoria Confirmada</h3>
        <p className="text-muted-foreground">
          A categoria <strong>{category.name}</strong> não possui subcategorias específicas.
        </p>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800">Prossiga para a próxima etapa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Subcategoria de {category.name}</h3>
        <p className="text-muted-foreground">
          Selecione a subcategoria específica do veículo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subcategories.map((subcategory) => (
          <Card
            key={subcategory.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedSubcategory?.id === subcategory.id
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSubcategorySelect(subcategory)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{subcategory.name}</CardTitle>
                {selectedSubcategory?.id === subcategory.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </CardHeader>
            {subcategory.description && (
              <CardContent className="pt-0">
                <CardDescription className="text-xs">
                  {subcategory.description}
                </CardDescription>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {selectedSubcategory && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">{selectedSubcategory.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSubcategory.description && (
              <p className="text-sm text-muted-foreground">
                {selectedSubcategory.description}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
