import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SearchFilters } from '../types';

interface FilterSummaryProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters, value: any, subKey?: string) => void;
  onClearAll: () => void;
}

export function FilterSummary({ filters, onRemove, onClearAll }: FilterSummaryProps) {
  const activeFilters: Array<{
    label: string;
    value: string;
    onRemove: () => void;
  }> = [];

  // Categories
  filters.categories.forEach(cat => {
    activeFilters.push({
      label: 'Categoria',
      value: cat,
      onRemove: () => onRemove('categories', cat)
    });
  });

  // Subcategories
  filters.subcategories.forEach(sub => {
    activeFilters.push({
      label: 'Subcategoria',
      value: sub,
      onRemove: () => onRemove('subcategories', sub)
    });
  });

  // Cities
  filters.cities.forEach(city => {
    activeFilters.push({
      label: 'Cidade',
      value: city,
      onRemove: () => onRemove('cities', city)
    });
  });

  // States
  filters.states.forEach(state => {
    activeFilters.push({
      label: 'Estado',
      value: state,
      onRemove: () => onRemove('states', state)
    });
  });

  // Status
  filters.status.forEach(st => {
    activeFilters.push({
      label: 'Status',
      value: st,
      onRemove: () => onRemove('status', st)
    });
  });

  // Chassis Manufacturers
  filters.chassisFilters.chassisManufacturers.forEach(mfr => {
    activeFilters.push({
      label: 'Fabricante Chassis',
      value: mfr,
      onRemove: () => onRemove('chassisFilters', mfr, 'chassisManufacturers')
    });
  });

  // Chassis Models
  filters.chassisFilters.chassisModels.forEach(model => {
    activeFilters.push({
      label: 'Modelo Chassis',
      value: model,
      onRemove: () => onRemove('chassisFilters', model, 'chassisModels')
    });
  });

  // Body Manufacturers
  filters.chassisFilters.bodyManufacturers.forEach(mfr => {
    activeFilters.push({
      label: 'Fabricante Carroceria',
      value: mfr,
      onRemove: () => onRemove('chassisFilters', mfr, 'bodyManufacturers')
    });
  });

  // Body Models
  if (filters.chassisFilters.bodyModels) {
    filters.chassisFilters.bodyModels.forEach(model => {
      activeFilters.push({
        label: 'Modelo Carroceria',
        value: model,
        onRemove: () => onRemove('chassisFilters', model, 'bodyModels')
      });
    });
  }

  // Engine Names
  filters.motorFilter.engineNames.forEach(engine => {
    activeFilters.push({
      label: 'Motor',
      value: engine,
      onRemove: () => onRemove('motorFilter', engine, 'engineNames')
    });
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-4 bg-white border rounded-lg">
      <span className="text-sm font-medium text-gray-500 mr-2">Filtros ativos:</span>
      {activeFilters.map((filter, idx) => (
        <Badge key={`${filter.label}-${filter.value}-${idx}`} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
          <span className="font-normal text-gray-500 mr-1">{filter.label}:</span>
          {filter.value}
          <button
            onClick={filter.onRemove}
            className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-blue-600 hover:text-blue-800 ml-auto font-medium"
      >
        Limpar todos
      </button>
    </div>
  );
}
