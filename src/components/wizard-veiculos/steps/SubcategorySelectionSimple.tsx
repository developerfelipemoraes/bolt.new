import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { VehicleCategory, VehicleSubcategory } from '@/types/vehicle';

interface SubcategorySelectionSimpleProps {
  category: VehicleCategory;
  selectedSubcategory?: VehicleSubcategory;
  onSubcategorySelect: (subcategory: VehicleSubcategory) => void;
}

export const SubcategorySelectionSimple: React.FC<SubcategorySelectionSimpleProps> = ({
  category,
  selectedSubcategory,
  onSubcategorySelect
}) => {
  const subcategories = category.subcategories || [];

  if (subcategories.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        A categoria <strong>{category.name}</strong> não possui subcategorias.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="subcategory">Subcategoria do Veículo</Label>
        <Select
          value={selectedSubcategory?.id || ''}
          onValueChange={(value) => {
            const subcategory = subcategories.find(s => s.id === value);
            if (subcategory) {
              onSubcategorySelect(subcategory);
            }
          }}
        >
          <SelectTrigger id="subcategory" className="w-full">
            <SelectValue placeholder="Selecione a subcategoria" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
                {subcategory.description && ` - ${subcategory.description}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSubcategory && (
        <div className="text-sm text-muted-foreground">
          <strong>{selectedSubcategory.name}</strong>
          {selectedSubcategory.description && (
            <p className="mt-1">{selectedSubcategory.description}</p>
          )}
        </div>
      )}
    </div>
  );
};
