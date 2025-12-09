import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ArrowLeft, Filter, X } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsGrid } from '../components/ResultsGrid';
import { ExportBar } from '../components/ExportBar';
import { NormalizedVehicle, SearchFilters, SortOption, VehicleSearchData } from '../types';
import { normalizeVehicleArray } from '../libs/data-normalizers';
import { createSearchIndex, searchVehicles, applyFilters, sortVehicles, extractUniqueValues, extractUniqueTracaoSystems, extractUniqueAxlesVehicles, extractUniqueEngineLocations, extractUniquePowerRange, extractUniqueEngineBrakeTypes, extractUniqueRetarderTypes, extractUniqueSuspensionTypes, extractUniqueEngineNames, extractUniqueSeatTypes, extractCapacityRange, extractModelYearRange, extractQuantityRange, extractDoorCountRange, extractTotalSeatsRange, extractUniqueChassisManufacturers, extractUniqueChassisModels, extractUniqueBodyManufacturers } from '../libs/search';
import { vehicleServiceReal as vehicleService } from '@/services/vehicleService.real';
import { toast } from 'sonner';

export function VehicleSearchPage() {
  const navigate = useNavigate();
  const [allVehicles, setAllVehicles] = useState<NormalizedVehicle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [itemsPerPage] = useState(20);
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const searchIndex = useMemo(() => {
    if (allVehicles.length > 0) {
      return createSearchIndex(allVehicles);
    }
    return undefined;
  }, [allVehicles]);

  useEffect(() => {
    loadVehicles(currentPage);
  }, [currentPage]);

  const loadVehicles = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await vehicleService.getVehicles(page, itemsPerPage);
      const vehicles = response.items;
      setTotalVehicles(response.total);

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

      toast.success(`${normalized.length} veículos carregados (página ${page} de ${Math.ceil(response.total / itemsPerPage)})`);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const selectedVehicles = useMemo(() => {
    return filteredResults.filter(v => selectedIds.includes(v.sku));
  }, [filteredResults, selectedIds]);

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

  const handleEdit = (vehicle: NormalizedVehicle) => {
    const vehicleId = (vehicle.rawData as any).id || vehicle.sku;
    if (vehicleId && vehicleId.length === 24 && /^[a-f0-9]{24}$/i.test(vehicleId)) {
      navigate(`/vehicles/edit/by-id/${vehicleId}`);
    } else {
      navigate('/vehicles/edit', { state: { vehicle: vehicle.rawData } });
    }
  };

  const handleDelete = (sku: string) => {
    setAllVehicles(prev => prev.filter(v => v.sku !== sku));
    setSelectedIds(prev => prev.filter(id => id !== sku));
    toast.success('Veículo excluído com sucesso!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-[1920px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/vehicles')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pesquisa Avançada de Veículos</h1>
                <p className="text-sm text-gray-600">Busque, filtre e exporte dados de veículos</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
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
        </div>
      </div>

      <div className="flex max-w-[1920px] mx-auto">
        {showFilters && (
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
        )}

        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-white border-b">
            <ExportBar
              totalResults={filteredResults.length}
              selectedVehicles={selectedVehicles}
              allVehicles={filteredResults}
            />
          </div>

          <div className="flex-1 p-4 overflow-auto">
            <ResultsGrid
              vehicles={filteredResults}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              totalPages={Math.ceil(totalVehicles / itemsPerPage)}
              onPageChange={handlePageChange}
              totalVehicles={totalVehicles}
              isServerPaginated={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
