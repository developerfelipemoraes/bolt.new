import React, { useMemo } from 'react';
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete';
import { useBodyworkSearch } from '@/hooks/useBodyworkModels';
import { BodyworkSearchParams } from '@/types/vehicleModels';

interface BodyworkManufacturerAutocompleteProps {
  category?: string;
  subcategory?: string;
  manufactureYear?: number;
  modelYear?: number;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function BodyworkManufacturerAutocomplete({
  category,
  subcategory,
  manufactureYear,
  modelYear,
  value,
  onValueChange,
  disabled,
}: BodyworkManufacturerAutocompleteProps) {
  const searchParams: BodyworkSearchParams = {
    category,
    subcategory,
    manufactureYear,
    modelYear,
    pageSize: 100,
  };

  const { data, isLoading } = useBodyworkSearch(
    searchParams,
    !!(category && subcategory && manufactureYear && modelYear)
  );

  const manufacturers = useMemo(() => {
    if (!data?.items) return [];

    const uniqueManufacturers = new Set<string>();
    data.items.forEach((item) => {
      uniqueManufacturers.add(item.bodyManufacturer);
    });

    return Array.from(uniqueManufacturers)
      .sort()
      .map((name) => ({
        value: name,
        label: name,
      }));
  }, [data]);

  return (
    <Autocomplete
      options={manufacturers}
      value={value}
      onValueChange={onValueChange}
      placeholder="Selecione o fabricante"
      searchPlaceholder="Buscar fabricante..."
      emptyText="Nenhum fabricante encontrado"
      isLoading={isLoading}
      disabled={disabled || !category || !subcategory || !manufactureYear || !modelYear}
    />
  );
}

interface BodyworkModelAutocompleteProps {
  manufacturer?: string;
  category?: string;
  subcategory?: string;
  manufactureYear?: number;
  modelYear?: number;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function BodyworkModelAutocomplete({
  manufacturer,
  category,
  subcategory,
  manufactureYear,
  modelYear,
  value,
  onValueChange,
  disabled,
}: BodyworkModelAutocompleteProps) {
  const searchParams: BodyworkSearchParams = {
    bodyManufacturer: manufacturer,
    category,
    subcategory,
    manufactureYear,
    modelYear,
    pageSize: 100,
  };

  const { data, isLoading } = useBodyworkSearch(
    searchParams,
    !!(manufacturer && category && subcategory && manufactureYear && modelYear)
  );

  const models = useMemo(() => {
    if (!data?.items) return [];

    return data.items
      .map((item) => ({
        value: item.model,
        label: item.model,
      }))
      .filter((item, index, self) =>
        index === self.findIndex((t) => t.value === item.value)
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  return (
    <Autocomplete
      options={models}
      value={value}
      onValueChange={onValueChange}
      placeholder="Selecione o modelo"
      searchPlaceholder="Buscar modelo..."
      emptyText="Nenhum modelo encontrado"
      isLoading={isLoading}
      disabled={disabled || !manufacturer}
    />
  );
}
