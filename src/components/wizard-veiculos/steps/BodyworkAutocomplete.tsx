import React, { useMemo, useState, useEffect } from 'react';
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete';
import { useBodyworkSearch } from '@/hooks/useBodyworkModels';
import { BodyworkSearchParams, BodyworkModel } from '@/api/services/bodywork/bodywork.types';
import { BodyworkService as bodyworkService } from '@/api/services/bodywork/bodywork.service';
import { Button } from '@/components/ui/button';
import { Plus, ListFilter } from 'lucide-react';
import { QuickBodyworkDialog } from './QuickBodyworkDialog';
import { BodyworkSelectionModal } from './BodyworkSelectionModal';
import { normalizeText, isYearValidForModel } from '@/utils/bodywork-mapping';
import { toast } from 'sonner';

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
  onModelSelect?: (model: BodyworkModel) => void; // New prop for full model selection
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
  onModelSelect,
  disabled,
}: BodyworkModelAutocompleteProps) {
  // We fetch ALL models for the manufacturer to allow client-side fallback logic
  const searchParams: BodyworkSearchParams = {
    bodyManufacturer: manufacturer,
    pageSize: 1000, // Fetch all for this manufacturer
  };

  const { data, isLoading } = useBodyworkSearch(
    searchParams,
    !!manufacturer
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fallbackReason, setFallbackReason] = useState<string | undefined>(undefined);
  const [availableModels, setAvailableModels] = useState<BodyworkModel[]>([]);

  // Filter logic
  const filteredModels = useMemo(() => {
    if (!data?.items) return [];

    // Base list (by manufacturer)
    const models = data.items;

    // We keep the raw list available for the modal fallback
    return models;
  }, [data]);

  // Derived options for the dropdown (simple strings)
  const options = useMemo(() => {
    // Apply strict filtering for the dropdown to show "Best Matches"
    const strictMatches = filteredModels.filter(m => {
      // Filter by Category if provided
      if (category && m.category) {
        if (normalizeText(m.category) !== normalizeText(category)) return false;
      }
      // Filter by Subcategory if provided
      if (subcategory && m.subcategory) {
        if (normalizeText(m.subcategory) !== normalizeText(subcategory)) return false;
      }
      // Filter by Year if provided
      // Check manufactureYear against yearRanges or productionStart/End
      if (manufactureYear) {
         if (!isYearValidForModel(manufactureYear, (m as any).yearRanges, (m as any).productionStart, (m as any).productionEnd)) {
             return false;
         }
      }

      return true;
    });

    return strictMatches
      .map((item) => ({
        value: item.model,
        label: item.model,
      }))
      .filter((item, index, self) =>
        index === self.findIndex((t) => t.value === item.value)
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredModels, category, subcategory, manufactureYear]);

  const handleManualSearch = () => {
    // Logic: Try strict match first. If 0, fallback.
    const strictMatches = filteredModels.filter(m => {
      if (category && m.category && normalizeText(m.category) !== normalizeText(category)) return false;
      if (subcategory && m.subcategory && normalizeText(m.subcategory) !== normalizeText(subcategory)) return false;
      if (manufactureYear && !isYearValidForModel(manufactureYear, (m as any).yearRanges, (m as any).productionStart, (m as any).productionEnd)) return false;
      return true;
    });

    if (strictMatches.length > 0) {
      setAvailableModels(strictMatches);
      setFallbackReason(undefined);
    } else {
      // Fallback: Try matching just Category (ignore Subcat)
      const categoryMatches = filteredModels.filter(m => {
        if (category && m.category && normalizeText(m.category) !== normalizeText(category)) return false;
        // Should we also enforce year here? Yes, year is hard constraint usually.
         if (manufactureYear && !isYearValidForModel(manufactureYear, (m as any).yearRanges, (m as any).productionStart, (m as any).productionEnd)) return false;
        return true;
      });

      if (categoryMatches.length > 0) {
        setAvailableModels(categoryMatches);
        setFallbackReason(`Não encontramos modelos exatos para a subcategoria "${subcategory}". Exibindo modelos da categoria "${category}" compatíveis com o ano ${manufactureYear}.`);
        toast.info(`Não encontramos modelos para "${subcategory}". Mostrando opções gerais.`);
      } else {
        // Fallback: Show All for Manufacturer (maybe specific year?)
        // Let's show all valid for year?
        const yearMatches = filteredModels.filter(m => {
             if (manufactureYear && !isYearValidForModel(manufactureYear, (m as any).yearRanges, (m as any).productionStart, (m as any).productionEnd)) return false;
             return true;
        });

        if (yearMatches.length > 0) {
             setAvailableModels(yearMatches);
             setFallbackReason(`Não encontramos modelos específicos para a categoria "${category}". Exibindo todos os modelos de ${manufacturer} compatíveis com o ano ${manufactureYear}.`);
             toast.info(`Nenhum filtro de categoria correspondido. Mostrando modelos por ano.`);
        } else {
            // Fallback: Show EVERYTHING
            setAvailableModels(filteredModels);
            setFallbackReason(`Não encontramos modelos compatíveis com o ano ${manufactureYear}. Exibindo todos os modelos de ${manufacturer}.`);
            toast.warning(`Nenhum modelo compatível com o ano ${manufactureYear}. Mostrando todos.`);
        }
      }
    }
    setIsModalOpen(true);
  };

  const handleModalSelect = (model: BodyworkModel) => {
    onValueChange(model.model);
    if (onModelSelect) {
      onModelSelect(model);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Autocomplete
          options={options}
          value={value}
          onValueChange={onValueChange}
          placeholder="Selecione o modelo"
          searchPlaceholder="Buscar modelo..."
          emptyText="Nenhum modelo compatível com os filtros (use a busca avançada)"
          isLoading={isLoading}
          disabled={disabled || !manufacturer}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleManualSearch}
        disabled={disabled || !manufacturer || isLoading}
        title="Ver todas as opções e filtros"
      >
        <ListFilter className="h-4 w-4" />
      </Button>

      <BodyworkSelectionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        models={availableModels}
        onSelect={handleModalSelect}
        fallbackReason={fallbackReason}
      />
    </div>
  );
}
