import React, { useMemo, useState, useEffect } from 'react';
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete';
import { useBodyworkSearch } from '@/hooks/useBodyworkModels';
import { BodyworkSearchParams } from '@/types/vehicleModels';
import { bodyworkService } from '@/services/bodyworkService';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { QuickBodyworkDialog } from './QuickBodyworkDialog';

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
  const [manufacturers, setManufacturers] = useState<AutocompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const loadManufacturers = async () => {
    setIsLoading(true);
    try {
      const response = await bodyworkService.getBodyworkManufacturers();
      if (response.Data) {
        const options = response.Data
          .sort()
          .map((name) => ({
            value: name,
            label: name,
          }));
        setManufacturers(options);
      }
    } catch (error) {
      console.error('Erro ao carregar fabricantes de carroceria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadManufacturers();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Autocomplete
            options={manufacturers}
            value={value}
            onValueChange={onValueChange}
            placeholder="Selecione o fabricante"
            searchPlaceholder="Buscar fabricante..."
            emptyText="Nenhum fabricante encontrado"
            isLoading={isLoading}
            disabled={disabled}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowQuickAdd(true)}
          disabled={disabled}
          title="Cadastro rápido de carroceria"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <QuickBodyworkDialog
        open={showQuickAdd}
        onOpenChange={setShowQuickAdd}
        onSuccess={loadManufacturers}
        category={category}
        subcategory={subcategory}
        manufactureYear={manufactureYear}
        modelYear={modelYear}
      />
    </div>
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
