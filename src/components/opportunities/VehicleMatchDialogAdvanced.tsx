import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SearchBar } from '@/features/vehicle-search-export/components/SearchBar';
import { FilterPanel } from '@/features/vehicle-search-export/components/FilterPanel';
import { NormalizedVehicle, SearchFilters, SortOption, VehicleSearchData } from '@/features/vehicle-search-export/types';
import { normalizeVehicleArray } from '@/features/vehicle-search-export/libs/data-normalizers';
import {
  createSearchIndex,
  searchVehicles,
  applyFilters,
  sortVehicles,
  extractUniqueValues,
  extractUniqueTracaoSystems,
  extractUniqueAxlesVehicles,
  extractUniqueEngineLocations,
  extractUniquePowerRange,
  extractUniqueEngineBrakeTypes,
  extractUniqueRetarderTypes,
  extractUniqueSuspensionTypes,
  extractUniqueEngineNames,
  extractUniqueSeatTypes,
  extractCapacityRange,
  extractModelYearRange,
  extractQuantityRange,
  extractDoorCountRange,
  extractTotalSeatsRange,
  extractUniqueChassisManufacturers,
  extractUniqueChassisModels,
  extractUniqueBodyManufacturers
} from '@/features/vehicle-search-export/libs/search';
import { vehicleServiceReal as vehicleService } from '@/services/vehicleService.real';
import { formatCurrency } from '@/utils/currency';
import { Filter, X, Car, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VehicleMatchDialogAdvancedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleSelected: (vehicleId: string, vehicleData: any) => void;
}

export function VehicleMatchDialogAdvanced({
  open,
  onOpenChange,
  onVehicleSelected
}: VehicleMatchDialogAdvancedProps) {
  const [allVehicles, setAllVehicles] = useState<NormalizedVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    subcategories: [],
    yearRange: [0, 9999],
    priceRange: [0, Infinity],
    cities: [],
    states: [],
    status: [],
    optionals: {},
    chassisFilters: {
      tracaoSystems: [],
      axlesVehicles: [],
      engineLocations: [],
      chassisManufacturers: [],
      chassisModels: [],
      bodyManufacturers: []
    },
    powerFilter: {
      minPower: 0
    },
    equipmentFilters: {
      engineBrakeTypes: [],
      retarderTypes: [],
      suspensionTypes: []
    },
    motorFilter: {
      engineNames: []
    },
    seatFilters: {
      requiredTypes: [],
      minCapacity: 0,
      maxCapacity: 999
    },
    modelYearRange: [0, 9999],
    quantityRange: [0, 999],
    doorCountRange: [0, 99],
    totalSeatsRange: [0, 999]
  });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const searchIndex = useMemo(() => {
    if (allVehicles.length > 0) {
      return createSearchIndex(allVehicles);
    }
    return undefined;
  }, [allVehicles]);

  useEffect(() => {
    if (open) {
      loadVehicles();
    }
  }, [open]);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await vehicleService.getVehicles(1, 100);
      const vehicles = response.items;

      const searchData: VehicleSearchData[] = vehicles.map((v: any) => ({
        sku: v.id || '',
        productCode: v.id,
        productIdentification: {
          title: v.title || '',
          price: parseFloat(v.sale_value) || 0
        },
        media: {
          treatedPhotos: v.media_treated_photos || [],
          originalPhotos: [
            ...(v.media_original_interior || []),
            ...(v.media_original_exterior || []),
            ...(v.media_original_instruments || [])
          ],
          documentPhotos: v.media_document_photos || []
        },
        location: {
          city: v.location_city || '',
          state: v.location_state || '',
          address: v.location_address || '',
          neighborhood: v.location_neighborhood || '',
          zipCode: v.location_zip_code || ''
        },
        supplier: {
          companyName: v.companies?.trade_name || v.companies?.legal_name || v.supplier_name || '',
          contactName: '',
          phone: ''
        },
        category: {
          name: v.category_name || ''
        },
        subcategory: v.subcategory_name ? {
          name: v.subcategory_name
        } : undefined,
        chassisInfo: {
          chassisManufacturer: v.chassis_manufacturer || '',
          chassisModel: v.chassis_model || '',
          bodyManufacturer: v.body_manufacturer || '',
          bodyModel: v.body_model || '',
          tracaoSystem: undefined,
          axlesVehicles: undefined,
          maxPower: undefined,
          engineLocation: undefined,
          intermediateSuspensionType: undefined,
          engineBrakeType: undefined,
          retarderType: undefined,
          engineName: undefined
        },
        vehicleData: {
          fabricationYear: v.fabrication_year || 0,
          modelYear: v.model_year || 0,
          availableQuantity: v.available_quantity || 1,
          doorCount: undefined
        },
        secondaryInfo: {
          description: v.description || '',
          capacity: v.capacity
        },
        seatComposition: v.seat_composition_details ? {
          totals: {},
          composition: v.seat_composition_details,
          totalCapacity: v.seat_total_capacity || 0,
          compositionText: v.seat_composition_text || ''
        } : undefined,
        optionals: {
          airConditioning: v.optional_air_conditioning || false,
          bathroom: v.optional_bathroom || false,
          usb: v.optional_usb || false,
          packageHolder: v.optional_package_holder || false,
          soundSystem: v.optional_sound_system || false,
          monitor: v.optional_monitor || false,
          wifi: v.optional_wifi || false,
          glasType: v.optional_glass_type,
          curtain: v.optional_curtain || false,
          accessibility: v.optional_accessibility || false
        },
        statusVeiculo: v.status || 'Disponível',
        updatedAt: v.updated_at
      }));

      const normalized = normalizeVehicleArray(searchData);
      setAllVehicles(normalized);

      const minYear = Math.min(...normalized.map(v => v.fabricationYear).filter(y => y > 0));
      const maxYear = Math.max(...normalized.map(v => v.fabricationYear).filter(y => y > 0));
      const minPrice = Math.min(...normalized.map(v => v.price).filter(p => p > 0));
      const maxPrice = Math.max(...normalized.map(v => v.price).filter(p => p > 0));

      const modelYears = normalized.map(v => v.modelYear).filter(y => y > 0);
      const minModelYear = modelYears.length > 0 ? Math.min(...modelYears) : 0;
      const maxModelYear = modelYears.length > 0 ? Math.max(...modelYears) : 9999;

      const quantities = normalized.map(v => v.quantity).filter(q => q > 0);
      const minQuantity = quantities.length > 0 ? Math.min(...quantities) : 0;
      const maxQuantity = quantities.length > 0 ? Math.max(...quantities) : 999;

      setFilters(prev => ({
        ...prev,
        yearRange: [minYear || 2000, maxYear || 2025],
        priceRange: [minPrice || 0, maxPrice || 1000000],
        modelYearRange: [minModelYear, maxModelYear],
        quantityRange: [minQuantity, maxQuantity]
      }));

      toast.success(`${normalized.length} veículos disponíveis para vincular`);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    let results = allVehicles;

    if (searchQuery) {
      results = searchVehicles(results, searchQuery, searchIndex);
    }

    results = applyFilters(results, filters);

    results = sortVehicles(results, sortBy, searchQuery);

    return results;
  }, [allVehicles, searchQuery, filters, sortBy, searchIndex]);

  const availableCategories = useMemo(() => extractUniqueValues(allVehicles, 'category'), [allVehicles]);
  const availableSubcategories = useMemo(() => extractUniqueValues(allVehicles, 'subcategory'), [allVehicles]);
  const availableCities = useMemo(() => extractUniqueValues(allVehicles, 'city'), [allVehicles]);
  const availableStates = useMemo(() => extractUniqueValues(allVehicles, 'state'), [allVehicles]);
  const availableStatuses = useMemo(() => extractUniqueValues(allVehicles, 'status'), [allVehicles]);

  const availableTracaoSystems = useMemo(() => extractUniqueTracaoSystems(filteredResults), [filteredResults]);
  const availableAxlesVehicles = useMemo(() => extractUniqueAxlesVehicles(filteredResults), [filteredResults]);
  const availableEngineLocations = useMemo(() => extractUniqueEngineLocations(filteredResults), [filteredResults]);
  const powerRange = useMemo(() => extractUniquePowerRange(filteredResults), [filteredResults]);
  const availableEngineBrakeTypes = useMemo(() => extractUniqueEngineBrakeTypes(filteredResults), [filteredResults]);
  const availableRetarderTypes = useMemo(() => extractUniqueRetarderTypes(filteredResults), [filteredResults]);
  const availableSuspensionTypes = useMemo(() => extractUniqueSuspensionTypes(filteredResults), [filteredResults]);
  const availableEngineNames = useMemo(() => extractUniqueEngineNames(filteredResults), [filteredResults]);
  const availableSeatTypes = useMemo(() => extractUniqueSeatTypes(filteredResults), [filteredResults]);
  const availableChassisManufacturers = useMemo(() => extractUniqueChassisManufacturers(filteredResults), [filteredResults]);
  const availableChassisModels = useMemo(() => extractUniqueChassisModels(filteredResults), [filteredResults]);
  const availableBodyManufacturers = useMemo(() => extractUniqueBodyManufacturers(filteredResults), [filteredResults]);
  const capacityRange = useMemo(() => extractCapacityRange(filteredResults), [filteredResults]);
  const modelYearRange = useMemo(() => extractModelYearRange(filteredResults), [filteredResults]);
  const quantityRange = useMemo(() => extractQuantityRange(filteredResults), [filteredResults]);
  const doorCountRange = useMemo(() => extractDoorCountRange(filteredResults), [filteredResults]);
  const totalSeatsRange = useMemo(() => extractTotalSeatsRange(filteredResults), [filteredResults]);

  const yearRange: [number, number] = useMemo(() => {
    const years = allVehicles.map(v => v.fabricationYear).filter(y => y > 0);
    return [Math.min(...years) || 2000, Math.max(...years) || 2025];
  }, [allVehicles]);

  const priceRange: [number, number] = useMemo(() => {
    const prices = allVehicles.map(v => v.price).filter(p => p > 0);
    return [Math.min(...prices) || 0, Math.max(...prices) || 1000000];
  }, [allVehicles]);

  const handleSelectVehicle = (vehicle: NormalizedVehicle) => {
    const vehicleId = (vehicle.rawData as any).id || vehicle.sku;
    onVehicleSelected(vehicleId, vehicle.rawData);
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[1400px] h-[90vh]">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Carregando veículos disponíveis...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1400px] h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Buscar e Vincular Veículo</DialogTitle>
              <DialogDescription>
                Use os filtros para encontrar o veículo ideal para esta oportunidade
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredResults.length} {filteredResults.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-4 px-6 py-3 bg-muted/30 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevância</SelectItem>
              <SelectItem value="price-asc">Preço (menor)</SelectItem>
              <SelectItem value="price-desc">Preço (maior)</SelectItem>
              <SelectItem value="year-asc">Ano (mais antigo)</SelectItem>
              <SelectItem value="year-desc">Ano (mais recente)</SelectItem>
              <SelectItem value="updated-desc">Atualizado recentemente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {showFilters && (
            <div className="w-80 border-r flex-shrink-0 overflow-hidden">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                availableCategories={availableCategories}
                availableSubcategories={availableSubcategories}
                availableCities={availableCities}
                availableStates={availableStates}
                availableStatuses={availableStatuses}
                yearRange={yearRange}
                priceRange={priceRange}
                availableTracaoSystems={availableTracaoSystems}
                availableAxlesVehicles={availableAxlesVehicles}
                availableEngineLocations={availableEngineLocations}
                powerRange={powerRange}
                availableEngineBrakeTypes={availableEngineBrakeTypes}
                availableRetarderTypes={availableRetarderTypes}
                availableSuspensionTypes={availableSuspensionTypes}
                availableEngineNames={availableEngineNames}
                availableSeatTypes={availableSeatTypes}
                availableChassisManufacturers={availableChassisManufacturers}
                availableChassisModels={availableChassisModels}
                availableBodyManufacturers={availableBodyManufacturers}
                capacityRange={capacityRange}
                modelYearRange={modelYearRange}
                quantityRange={quantityRange}
                doorCountRange={doorCountRange}
                totalSeatsRange={totalSeatsRange}
              />
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {filteredResults.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Car className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Nenhum veículo encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros ou a busca</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredResults.map(vehicle => (
                      <Card
                        key={vehicle.sku}
                        className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                          selectedVehicleId === vehicle.sku ? 'border-blue-500 bg-blue-50/50' : 'border-transparent'
                        }`}
                        onClick={() => handleSelectVehicle(vehicle)}
                      >
                        <CardContent className="p-4">
                          {vehicle.primaryImage && (
                            <div className="relative mb-3 rounded-lg overflow-hidden">
                              <img
                                src={vehicle.primaryImage}
                                alt={vehicle.title}
                                className="w-full h-40 object-cover"
                              />
                              {vehicle.status && (
                                <Badge className="absolute top-2 right-2" variant="secondary">
                                  {vehicle.status}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-sm line-clamp-2">
                                {vehicle.title}
                              </h4>
                            </div>

                            {(vehicle.chassisManufacturer || vehicle.chassisModel) && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Car className="h-3 w-3" />
                                <span>
                                  {vehicle.chassisManufacturer} {vehicle.chassisModel}
                                </span>
                              </div>
                            )}

                            {(vehicle.bodyManufacturer || vehicle.bodyModel) && (
                              <div className="text-xs text-muted-foreground">
                                Carroceria: {vehicle.bodyManufacturer} {vehicle.bodyModel}
                              </div>
                            )}

                            <div className="flex gap-2 flex-wrap">
                              {vehicle.fabricationYear > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  Ano: {vehicle.fabricationYear}
                                </Badge>
                              )}
                              {vehicle.category && (
                                <Badge variant="outline" className="text-xs">
                                  {vehicle.category}
                                </Badge>
                              )}
                            </div>

                            {vehicle.city && (
                              <p className="text-xs text-muted-foreground">
                                {vehicle.city} - {vehicle.state}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t">
                              <Badge className="text-base font-bold">
                                {formatCurrency(vehicle.price)}
                              </Badge>
                              {selectedVehicleId === vehicle.sku && (
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
