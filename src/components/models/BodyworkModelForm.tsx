import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBodywork, useUpdateBodywork, useBodyworkDetail } from '../../hooks/useBodyworkModels';
import { CreateBodyworkMinimal, createBodyworkMinimalSchema, YearEntry } from '../../types/vehicleModels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YearEntriesEditor } from './YearEntriesEditor';
import { generateYearEntriesFromRange, calculateYearRangesFromEntries } from '@/utils/yearRangeCalculator';
import { getAllCategories, vehicleTypes } from '@/data/vehicleCategories';

interface BodyworkModelFormProps {
  bodyworkId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BodyworkModelForm({ bodyworkId, onSuccess, onCancel }: BodyworkModelFormProps) {
  const isEditMode = !!bodyworkId;

  const { data: bodyworkData, isLoading: isLoadingBodywork } = useBodyworkDetail(
    bodyworkId || '',
    isEditMode
  );

  const createMutation = useCreateBodywork();
  const updateMutation = useUpdateBodywork();
  const [isAutoYearMode, setIsAutoYearMode] = useState(true);

  // Prepare category options
  const allCategories = getAllCategories();
  const categoryOptions: Option[] = allCategories.map(c => ({ label: c.name, value: c.name })); // Using name as value as per legacy string type

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBodyworkMinimal>({
    resolver: zodResolver(createBodyworkMinimalSchema),
    defaultValues: {
       categories: [],
       yearEntries: [],
       yearRanges: [],
       productionStart: new Date().getFullYear(),
       productionEnd: new Date().getFullYear(),
       manufactureYear: null,
       modelYear: null,
       application: null,
       engine: null,
       bodyType: null
    },
    values: bodyworkData ? {
      bodyManufacturer: bodyworkData.bodyManufacturer,
      model: bodyworkData.model,
      manufactureYear: bodyworkData.manufactureYear || null,
      modelYear: bodyworkData.modelYear || null,
      category: bodyworkData.category,
      subcategory: bodyworkData.subcategory,
      categories: bodyworkData.categories || (bodyworkData.category ? [bodyworkData.category] : []),
      productionStart: bodyworkData.productionStart || new Date().getFullYear(),
      productionEnd: bodyworkData.productionEnd || new Date().getFullYear(),
      application: bodyworkData.application || null,
      engine: bodyworkData.engine || null,
      bodyType: bodyworkData.bodyType || null,
      yearEntries: bodyworkData.yearEntries || [],
      yearRanges: bodyworkData.yearRanges || [],
      yearRules_logic: bodyworkData.yearRules_logic,
      yearRules_sources: bodyworkData.yearRules_sources,
    } : undefined,
  });

  const selectedCategories = watch('categories');
  const productionStart = watch('productionStart');
  const productionEnd = watch('productionEnd');
  const yearEntries = watch('yearEntries');
  const yearRanges = watch('yearRanges');

  // Filter subcategories based on selected categories
  const filteredSubcategories = allCategories
    .filter(cat => selectedCategories?.includes(cat.name))
    .flatMap(cat => cat.subcategories || [])
    // Deduplicate by name if needed, but ID is better. Assuming simple mapping for now.
    // If multiple categories share subcategories, we just show them.
    // However, the interface expects strings. We use subcategory names.
    .map(sub => sub.name);

  // Sync Categories -> Category (Legacy)
  useEffect(() => {
    if (selectedCategories && selectedCategories.length > 0) {
      setValue('category', selectedCategories[0]);
    } else {
       // Only reset if empty? Or keep?
       // Requirement: "If multiple categories are selected, set 'category' as the first selected value."
       // If empty, validation will catch it.
    }
  }, [selectedCategories, setValue]);

  // Auto Generate Years Logic
  useEffect(() => {
    if (isAutoYearMode) {
      const start = Number(productionStart);
      const end = Number(productionEnd);

      if (!isNaN(start) && !isNaN(end) && start <= end) {
        const generatedEntries = generateYearEntriesFromRange(start, end);
        const { yearRanges: calculatedRanges } = calculateYearRangesFromEntries(generatedEntries);

        // Only update if different to avoid infinite loops or unnecessary renders
        // Doing a simple length check or JSON stringify check might be expensive but safe
        if (JSON.stringify(generatedEntries) !== JSON.stringify(yearEntries)) {
             setValue('yearEntries', generatedEntries);
        }
        if (JSON.stringify(calculatedRanges) !== JSON.stringify(yearRanges)) {
            setValue('yearRanges', calculatedRanges);
        }

        // Also update legacy manufactureYear/modelYear if needed?
        // Payload says "manufactureYear: number | null".
        // Maybe take the last year or null? Prompt doesn't specify legacy behavior for these two fields in auto mode.
        // Assuming user input manually or just first/last?
        // Let's leave them as null or whatever user set, unless we want to force them.
        // Usually these represent a specific year if it's a specific single-year model, but here we have ranges.
      }
    }
  }, [isAutoYearMode, productionStart, productionEnd, setValue, yearEntries, yearRanges]);

  const onSubmit = async (data: CreateBodyworkMinimal) => {
    // Ensure nulls are handled
    const payload = {
        ...data,
        categories: data.categories ?? [],
        yearEntries: data.yearEntries ?? [],
        yearRanges: data.yearRanges ?? [],
    };

    if (isEditMode && bodyworkId) {
      updateMutation.mutate(
        { id: bodyworkId, dto: payload },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoadingBodywork) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Editar Modelo de Carroceria' : 'Novo Modelo de Carroceria'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="basic" className="w-full">
            <CardContent>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                    <TabsTrigger value="production">Período de Produção</TabsTrigger>
                    <TabsTrigger value="years">Gestão de Anos</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bodyManufacturer">
                                Fabricante <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="bodyManufacturer"
                                {...register('bodyManufacturer')}
                                placeholder="Ex: Marcopolo"
                            />
                            {errors.bodyManufacturer && (
                                <p className="text-sm text-destructive">{errors.bodyManufacturer.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">
                                Modelo <span className="text-destructive">*</span>
                            </Label>
                            <Input id="model" {...register('model')} placeholder="Ex: Paradiso" />
                            {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categories">
                                Categorias <span className="text-destructive">*</span>
                            </Label>
                            <MultiSelect
                                options={categoryOptions}
                                selected={selectedCategories || []}
                                onChange={(val) => setValue('categories', val)}
                                placeholder="Selecione as categorias..."
                            />
                            {/* Hidden input for legacy category field validation if needed, though handled by effect */}
                             <Input type="hidden" {...register('category')} />
                            {errors.categories && (
                                <p className="text-sm text-destructive">{errors.categories.message}</p>
                            )}
                             {errors.category && (
                                <p className="text-sm text-destructive">{errors.category.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subcategory">
                                Subcategoria <span className="text-destructive">*</span>
                            </Label>
                            {/* Filtered Subcategories Select */}
                             <Select onValueChange={(val) => setValue('subcategory', val)} value={watch('subcategory')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma subcategoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredSubcategories.length === 0 ? (
                                        <SelectItem value="none" disabled>Nenhuma subcategoria disponível</SelectItem>
                                    ) : (
                                        filteredSubcategories.map((sub, idx) => (
                                            <SelectItem key={`${sub}-${idx}`} value={sub}>{sub}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {/* Fallback Input if Select feels restrictive or data incomplete? Keeping strictly Select per plan */}
                            {errors.subcategory && (
                                <p className="text-sm text-destructive">{errors.subcategory.message}</p>
                            )}
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="application">Aplicação</Label>
                            <Input id="application" {...register('application')} placeholder="Ex: Turismo" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="engine">Motorização (Ref.)</Label>
                            <Input id="engine" {...register('engine')} placeholder="Ex: O-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bodyType">Tipo de Carroceria</Label>
                            <Input id="bodyType" {...register('bodyType')} placeholder="Ex: Rodoviário" />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="production" className="space-y-4 pt-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productionStart">
                                Início de Produção <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="productionStart"
                                type="number"
                                {...register('productionStart')}
                                placeholder="Ano inicial"
                            />
                            {errors.productionStart && (
                                <p className="text-sm text-destructive">{errors.productionStart.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="productionEnd">
                                Fim de Produção <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="productionEnd"
                                type="number"
                                {...register('productionEnd')}
                                placeholder="Ano final"
                            />
                             {errors.productionEnd && (
                                <p className="text-sm text-destructive">{errors.productionEnd.message}</p>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="years" className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Switch
                            id="auto-year-mode"
                            checked={isAutoYearMode}
                            onCheckedChange={setIsAutoYearMode}
                        />
                        <Label htmlFor="auto-year-mode">Gerar anos automaticamente a partir do período de produção</Label>
                    </div>

                    {isAutoYearMode ? (
                        <div className="space-y-4">
                             <div className="p-4 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground">
                                    Modo Automático: Os anos de fabricação e modelo serão gerados sequencialmente de {productionStart} a {productionEnd}.
                                </p>
                             </div>
                             {/* Read-only view of ranges */}
                             {yearRanges && yearRanges.length > 0 && (
                                <div>
                                    <Label>Faixas Geradas:</Label>
                                    <div className="flex gap-2 mt-2">
                                        {yearRanges.map((r, i) => (
                                            <span key={i} className="px-2 py-1 bg-secondary rounded text-sm">
                                                {r.start} - {r.end}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                             )}
                        </div>
                    ) : (
                        <YearEntriesEditor
                            yearEntries={yearEntries}
                            yearRanges={yearRanges}
                            productionStart={productionStart}
                            productionEnd={productionEnd}
                            onChange={(entries) => {
                                setValue('yearEntries', entries);
                                const { yearRanges: newRanges } = calculateYearRangesFromEntries(entries);
                                setValue('yearRanges', newRanges);
                            }}
                        />
                    )}
                </TabsContent>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
            {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancelar
                </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Atualizar' : 'Criar'}
            </Button>
            </CardFooter>
        </Tabs>
      </form>
    </Card>
  );
}
