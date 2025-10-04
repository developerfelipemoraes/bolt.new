import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { SearchFilters } from '../types';

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  availableCategories: string[];
  availableSubcategories: string[];
  availableCities: string[];
  availableStates: string[];
  availableStatuses: string[];
  yearRange: [number, number];
  priceRange: [number, number];
  onClose?: () => void;
}

export function FilterPanel({
  filters,
  onChange,
  availableCategories,
  availableSubcategories,
  availableCities,
  availableStates,
  availableStatuses,
  yearRange,
  priceRange,
  onClose
}: FilterPanelProps) {
  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'categories' | 'subcategories' | 'cities' | 'states' | 'status', value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const toggleOptional = (key: keyof SearchFilters['optionals']) => {
    const current = filters.optionals[key];
    const updated = current === true ? undefined : true;
    updateFilter('optionals', { ...filters.optionals, [key]: updated });
  };

  const clearFilters = () => {
    onChange({
      categories: [],
      subcategories: [],
      yearRange: [0, 9999],
      priceRange: [0, Infinity],
      cities: [],
      states: [],
      status: [],
      optionals: {}
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.cities.length > 0 ||
    filters.states.length > 0 ||
    filters.status.length > 0 ||
    filters.yearRange[0] > 0 ||
    filters.yearRange[1] < 9999 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < Infinity ||
    Object.keys(filters.optionals).length > 0;

  return (
    <div className="w-80 border-r bg-white h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filtros</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {availableCategories.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-3 block">Categoria</Label>
              <div className="space-y-2">
                {availableCategories.map(cat => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat}`}
                      checked={filters.categories.includes(cat)}
                      onCheckedChange={() => toggleArrayFilter('categories', cat)}
                    />
                    <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {availableSubcategories.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Subcategoria</Label>
                <div className="space-y-2">
                  {availableSubcategories.map(sub => (
                    <div key={sub} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sub-${sub}`}
                        checked={filters.subcategories.includes(sub)}
                        onCheckedChange={() => toggleArrayFilter('subcategories', sub)}
                      />
                      <label htmlFor={`sub-${sub}`} className="text-sm cursor-pointer">
                        {sub}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Ano Fabricação: {filters.yearRange[0]} - {filters.yearRange[1]}
            </Label>
            <Slider
              min={yearRange[0]}
              max={yearRange[1]}
              step={1}
              value={filters.yearRange}
              onValueChange={(value) => updateFilter('yearRange', value as [number, number])}
              className="mb-2"
            />
          </div>

          <Separator />
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Preço: R$ {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1] === Infinity ? '∞' : `R$ ${filters.priceRange[1].toLocaleString()}`}
            </Label>
            <Slider
              min={priceRange[0]}
              max={priceRange[1] === Infinity ? 1000000 : priceRange[1]}
              step={1000}
              value={[
                filters.priceRange[0],
                filters.priceRange[1] === Infinity ? 1000000 : filters.priceRange[1]
              ]}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              className="mb-2"
            />
          </div>

          {availableStates.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Estado</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableStates.map(state => (
                    <div key={state} className="flex items-center space-x-2">
                      <Checkbox
                        id={`state-${state}`}
                        checked={filters.states.includes(state)}
                        onCheckedChange={() => toggleArrayFilter('states', state)}
                      />
                      <label htmlFor={`state-${state}`} className="text-sm cursor-pointer">
                        {state}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {availableCities.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Cidade</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableCities.map(city => (
                    <div key={city} className="flex items-center space-x-2">
                      <Checkbox
                        id={`city-${city}`}
                        checked={filters.cities.includes(city)}
                        onCheckedChange={() => toggleArrayFilter('cities', city)}
                      />
                      <label htmlFor={`city-${city}`} className="text-sm cursor-pointer">
                        {city}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {availableStatuses.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Status</Label>
                <div className="space-y-2">
                  {availableStatuses.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => toggleArrayFilter('status', status)}
                      />
                      <label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />
          <div>
            <Label className="text-sm font-medium mb-3 block">Opcionais</Label>
            <div className="space-y-2">
              {[
                { key: 'airConditioning', label: 'Ar-Condicionado' },
                { key: 'bathroom', label: 'Banheiro' },
                { key: 'reclinableSeats', label: 'Bancos Reclináveis' },
                { key: 'usb', label: 'USB' },
                { key: 'packageHolder', label: 'Porta Pacote' },
                { key: 'soundSystem', label: 'Sistema de Som' },
                { key: 'tv', label: 'TV/Monitor' },
                { key: 'wifi', label: 'Wi-Fi' },
                { key: 'tiltingGlass', label: 'Vidro Basculante' },
                { key: 'gluedGlass', label: 'Vidro Colado' },
                { key: 'curtain', label: 'Cortina' },
                { key: 'accessibility', label: 'Acessibilidade' }
              ].map(opt => (
                <div key={opt.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`opt-${opt.key}`}
                    checked={filters.optionals[opt.key as keyof SearchFilters['optionals']] === true}
                    onCheckedChange={() => toggleOptional(opt.key as keyof SearchFilters['optionals'])}
                  />
                  <label htmlFor={`opt-${opt.key}`} className="text-sm cursor-pointer">
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
