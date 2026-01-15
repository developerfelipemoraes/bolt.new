import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { VehicleCategory } from '@/types/vehicle';

interface CategorySelectionSimpleProps {
  categories: VehicleCategory[];
  selectedCategory?: VehicleCategory;
  onCategorySelect: (category: VehicleCategory) => void;
}

export const CategorySelectionSimple: React.FC<CategorySelectionSimpleProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">Categoria do Veículo</Label>
        <Select
          value={selectedCategory?.id || ''}
          onValueChange={(value) => {
            const category = categories.find(c => c.id === value);
            if (category) {
              onCategorySelect(category);
            }
          }}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && (
        <div className="text-sm text-muted-foreground">
          <strong>{selectedCategory.name}</strong>
          {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
            <span> - {selectedCategory.subcategories.length} subcategorias disponíveis</span>
          )}
        </div>
      )}
    </div>
  );
};
