import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ArrowLeft, Filter, X, Plus } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsGrid } from '../components/ResultsGrid';
import { ExportBar } from '../components/ExportBar';
import { FilterSummary } from '../components/FilterSummary';
import { NormalizedVehicle, SearchFilters, SortOption, VehicleSearchData } from
'../types';
import { normalizeVehicleArray } from '../libs/data-normalizers';
import {
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
  extractUniqueBodyManufacturers,
  extractUniqueBodyModels,
  applyFilters,
  searchVehicles,
  sortVehicles,
  getHierarchicalFacets
} from '../libs/search';
import vehicleService from '@/services/vehicleService';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Debounce hook implementation within the file to avoid extra dependencies
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function VehicleSearchPage() {
  const navigate = useNavigate();
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
      bodyManufacturers: [],
      bodyModels: []
    },
    powerFilter: {
      minPower: 0,
      maxPower: 0
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

  // Pagination State - Fixed to 50
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [totalItems, setTotalItems] = useState(0);

  // Debounced values to avoid excessive recalculation
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedFilters = useDebounce(filters, 300);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, debouncedFilters, sortBy]);

  // Load all vehicles once on mount
  useEffect(() => {
    loadVehicles();
  }, []);

  // Cascading Reset Logic removed/minimized because now handled by hierarchy component state/props if needed?
  // Actually, keeping the cleanup is good for data consistency.
  useEffect(() => {
    // 1. Category -> Subcategories
    if (filters.categories.length > 0) {
      const validSubcategories = extractUniqueValues(
        allVehicles.filter(v => filters.categories.includes(v.category)),
        'subcategory'
      );
      const cleaned = filters.subcategories.filter(sub => validSubcategories.includes(sub));
      if (cleaned.length !== filters.subcategories.length) {
        setFilters(prev => ({ ...prev, subcategories: cleaned }));
      }
    } else if (filters.subcategories.length > 0) {
      setFilters(prev => ({ ...prev, subcategories: [] }));
    }

    // 2. Chassis Manufacturer -> Chassis Models
    if (filters.chassisFilters.chassisManufacturers.length > 0) {
      const validModels = extractUniqueChassisModels(
        allVehicles.filter(v => filters.chassisFilters.chassisManufacturers.includes(v.chassisManufacturer))
      );
      const cleaned = filters.chassisFilters.chassisModels.filter(m => validModels.includes(m));
      if (cleaned.length !== filters.chassisFilters.chassisModels.length) {
        setFilters(prev => ({
          ...prev,
          chassisFilters: { ...prev.chassisFilters, chassisModels: cleaned }
        }));
      }
    } else if (filters.chassisFilters.chassisModels.length > 0) {
      setFilters(prev => ({
        ...prev,
        chassisFilters: { ...prev.chassisFilters, chassisModels: [] }
      }));
    }

    // 3. Bodywork Manufacturer -> Bodywork Models
    if (filters.chassisFilters.bodyManufacturers.length > 0) {
       const validModels = extractUniqueBodyModels(
        allVehicles.filter(v => filters.chassisFilters.bodyManufacturers.includes(v.bodyManufacturer))
      );
      const currentModels = filters.chassisFilters.bodyModels || [];
      const cleaned = currentModels.filter(m => validModels.includes(m));

      if (cleaned.length !== currentModels.length) {
        setFilters(prev => ({
          ...prev,
          chassisFilters: { ...prev.chassisFilters, bodyModels: cleaned }
        }));
      }
    } else if (filters.chassisFilters.bodyModels && filters.chassisFilters.bodyModels.length > 0) {
      setFilters(prev => ({
        ...prev,
        chassisFilters: { ...prev.chassisFilters, bodyModels: [] }
      }));
    }

  }, [
    filters.categories,
    filters.chassisFilters.chassisManufacturers,
    filters.chassisFilters.bodyManufacturers,
    allVehicles
  ]);


  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      // Fetch all vehicles in one go
      const { items: vehicles } = await vehicleService.getVehicles(1, 1500);

      // Debug: log raw media payload from API to inspect shape (treatedPhotos/originalPhotos)
      try {
        console.log('raw-vehicles-sample', vehicles.slice(0, 5).map(v => ({ id: v.id, media: v.media, mediaFiles: v.mediaFiles })));
      } catch (err) {
        console.warn('Erro ao logar raw vehicles', err);
      }

      const searchData: VehicleSearchData[] = vehicles.map((v: any) => ({
        id: v.id,
        sku: v.sku || '',
        productCode: v.productCode,
        productIdentification: {
          title: v.productIdentification?.title || v.title || '',
          price: v.productIdentification?.price || v.vehicleData?.price || 0
        },
        media: {
          treatedPhotos: v.media?.treatedPhotos || v.mediaFiles?.treatedPhotos || [],
          originalPhotos: [
            ...(v.media?.originalPhotosInteriorUrls || v.mediaFiles?.originalPhotosInterior || []),
            ...(v.media?.originalPhotosExteriorUrls || v.mediaFiles?.originalPhotosExterior || []),
            ...(v.media?.originalPhotosInstrumentsUrls || v.mediaFiles?.originalPhotosInstruments || []),
            ...(v.media?.originalPhotos || v.media?.originalPhotosUrls || v.mediaFiles?.originalPhotos || [])
          ],
          documentPhotos: v.media?.documentPhotos || v.mediaFiles?.documentPhotos || []
        },
        location: {
          city: v.location?.city || '',
          state: v.location?.state || '',
          address: v.location?.address || '',
          neighborhood: v.location?.neighborhood || '',
          zipCode: v.location?.zipCode || ''
        },
        supplier: {
          companyName: v.supplier?.companyName || '',
          contactName: v.supplier?.contactName || '',
          phone: v.supplier?.phone || ''
        },
        category: {
          name: v.category?.name || ''
        },
        subcategory: v.subcategory ? {
          name: v.subcategory.name
        } : undefined,
        chassisInfo: {
          chassisManufacturer: v.chassisInfo?.chassisManufacturer || '',
          chassisModel: v.chassisInfo?.chassisModel || '',
          bodyManufacturer: v.chassisInfo?.bodyManufacturer || '',
          bodyModel: v.chassisInfo?.bodyModel || '',
          tracaoSystem: v.chassisInfo?.tracaoSystem,
          axlesVehicles: v.chassisInfo?.axlesVehicles,
          maxPower: v.chassisInfo?.maxPower,
          engineLocation: v.chassisInfo?.engineLocation,
          intermediateSuspensionType: v.chassisInfo?.intermediateSuspensionType,
          engineBrakeType: v.chassisInfo?.engineBrakeType,
          retarderType: v.chassisInfo?.retarderType,
          engineName: v.chassisInfo?.engineName
        },
        vehicleData: {
          fabricationYear: v.vehicleData?.fabricationYear || 0,
          modelYear: v.vehicleData?.modelYear || 0,
          availableQuantity: v.vehicleData?.availableQuantity || 1,
          doorCount: v.vehicleData?.doorCount
        },
        secondaryInfo: {
          description: v.secondaryInfo?.description || v.description || '',
          capacity: v.secondaryInfo?.capacity
        },
        seatComposition: v.seatComposition ? {
          totals: v.seatComposition.totals,
          composition: v.seatComposition.composition,
          totalCapacity: v.seatComposition.totalCapacity,
          compositionText: v.seatComposition.compositionText
        } : undefined,
        optionals: {
          airConditioning: v.optionals?.airConditioning || false,
          bathroom: v.optionals?.bathroom || false,
          usb: v.optionals?.usb || false,
          packageHolder: v.optionals?.packageHolder || false,
          soundSystem: v.optionals?.soundSystem || false,
          monitor: v.optionals?.monitor || false,
          wifi: v.optionals?.wifi || false,
          glasType: v.optionals?.glasType,
          curtain: v.optionals?.curtain || false,
          accessibility: v.optionals?.accessibility || false
        },
        statusVeiculo: v.statusVeiculo || v.status || 'Disponível',
        updatedAt: v.updatedAt
      }));

      const normalized = normalizeVehicleArray(searchData);
      // Debug: log primary image and primeiras imagens tratadas para verificação
      try {
        normalized.slice(0, 10).forEach(v =>
          console.log('vehicle-images', v.id, v.primaryImage, v.allImages && v.allImages.slice(0, 3))
        );
      } catch (err) {
        console.warn('Erro ao logar imagens do veículo', err);
      }

      setAllVehicles(normalized);

    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filtering and sorting
  const filteredAndSortedVehicles = useMemo(() => {
    let results = allVehicles;

    // 1. Search
    results = searchVehicles(results, debouncedSearchQuery);

    // 2. Filter
    results = applyFilters(results, debouncedFilters);

    // 3. Sort
    results = sortVehicles(results, sortBy, debouncedSearchQuery);

    return results;
  }, [allVehicles, debouncedSearchQuery, debouncedFilters, sortBy]);

  // Update total items for pagination
  useEffect(() => {
    setTotalItems(filteredAndSortedVehicles.length);
  }, [filteredAndSortedVehicles.length]);

  // Paginate results
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedVehicles.slice(start, start + itemsPerPage);
  }, [filteredAndSortedVehicles, currentPage, itemsPerPage]);

  const selectedVehicles = useMemo(() => {
    return filteredAndSortedVehicles.filter(v => selectedIds.includes(v.id));
  }, [filteredAndSortedVehicles, selectedIds]);


  // HIERARCHICAL FACETS GENERATION

  // 1. Chassis Facets
  // Context: Filter by everything EXCEPT chassis manufacturer/model
  const chassisContextVehicles = useMemo(() => {
    const contextFilters = { ...debouncedFilters };
    contextFilters.chassisFilters = {
       ...contextFilters.chassisFilters,
       chassisManufacturers: [],
       chassisModels: []
    };
    // Also include search query impact? The prompt says "filtered dataset".
    // If I search "Mercedes", I expect counts to reflect that.
    let results = searchVehicles(allVehicles, debouncedSearchQuery);
    return applyFilters(results, contextFilters);
  }, [allVehicles, debouncedFilters, debouncedSearchQuery]);

  const chassisFacets = useMemo(() => {
    return getHierarchicalFacets(
      chassisContextVehicles,
      'chassisManufacturer',
      'chassisModel',
      debouncedFilters.chassisFilters.chassisManufacturers,
      debouncedFilters.chassisFilters.chassisModels
    );
  }, [chassisContextVehicles, debouncedFilters.chassisFilters.chassisManufacturers, debouncedFilters.chassisFilters.chassisModels]);

  // 2. Body Facets
  // Context: Filter by everything EXCEPT body manufacturer/model
  const bodyContextVehicles = useMemo(() => {
    const contextFilters = { ...debouncedFilters };
    contextFilters.chassisFilters = {
       ...contextFilters.chassisFilters,
       bodyManufacturers: [],
       bodyModels: []
    };
    let results = searchVehicles(allVehicles, debouncedSearchQuery);
    return applyFilters(results, contextFilters);
  }, [allVehicles, debouncedFilters, debouncedSearchQuery]);

  const bodyFacets = useMemo(() => {
    return getHierarchicalFacets(
      bodyContextVehicles,
      'bodyManufacturer',
      'bodyModel',
      debouncedFilters.chassisFilters.bodyManufacturers,
      debouncedFilters.chassisFilters.bodyModels || []
    );
  }, [bodyContextVehicles, debouncedFilters.chassisFilters.bodyManufacturers, debouncedFilters.chassisFilters.bodyModels]);

  // Static Facets (using allVehicles or filtered? Using filteredAndSortedVehicles makes them disappear if 0)
  // Let's use filteredAndSortedVehicles for other lists to show valid options, or allVehicles for full list.
  // Prompt says "Counts must reflect...". Usually lists should narrow.
  // But for simple lists, we can stick to what we had or upgrade.
  // Let's keep other facets simple for now, using allVehicles to avoid empty lists, but maybe filtered is better?
  // Let's stick to allVehicles for "Available Options" to stay consistent with previous behavior for non-hierarchical filters,
  // unless specifically requested. The request focused on the 3 new groups.

  const facetSource = allVehicles;

  const availableCategories = useMemo(() => extractUniqueValues(facetSource, 'category'), [facetSource]);

  // Category facets (parent -> subcategories) with counts
  const categoryContextVehicles = useMemo(() => {
    const contextFilters = { ...debouncedFilters };
    contextFilters.categories = [];
    contextFilters.subcategories = [];
    let results = searchVehicles(allVehicles, debouncedSearchQuery);
    return applyFilters(results, contextFilters);
  }, [allVehicles, debouncedFilters, debouncedSearchQuery]);

  const categoryFacets = useMemo(() => {
    return getHierarchicalFacets(
      categoryContextVehicles,
      'category',
      'subcategory',
      debouncedFilters.categories,
      debouncedFilters.subcategories
    );
  }, [categoryContextVehicles, debouncedFilters.categories, debouncedFilters.subcategories]);

  // Dependent Facets
  const availableSubcategories = useMemo(() => {
    if (filters.categories.length === 0) return [];
    const filtered = facetSource.filter(v => filters.categories.includes(v.category));
    return extractUniqueValues(filtered, 'subcategory');
  }, [facetSource, filters.categories]);

  const availableCities = useMemo(() => extractUniqueValues(facetSource, 'city'), [facetSource]);
  const availableStates = useMemo(() => extractUniqueValues(facetSource, 'state'), [facetSource]);
  const availableStatuses = useMemo(() => extractUniqueValues(facetSource, 'status'), [facetSource]);

  // Helper: count occurrences of a field on a dataset
  const countBy = useCallback((vehicles: NormalizedVehicle[], fn: (v: NormalizedVehicle) => string | number | undefined) => {
    const map = new Map<string | number, number>();
    vehicles.forEach(v => {
      const key = fn(v);
      if (key === undefined || key === null || key === '') return;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, []);

  // Compute context-aware counts for simple facets (exclude the group's own filters so counts update when user toggles)
  const computeContextVehiclesExcluding = useCallback((excludeKey: keyof SearchFilters) => {
    const contextFilters = { ...debouncedFilters } as SearchFilters;
    // clear specific group
    if (excludeKey === 'categories') { contextFilters.categories = []; contextFilters.subcategories = []; }
    else if (excludeKey === 'subcategories') { contextFilters.subcategories = []; }
    else if (excludeKey === 'cities') { contextFilters.cities = []; }
    else if (excludeKey === 'states') { contextFilters.states = []; }
    else if (excludeKey === 'status') { contextFilters.status = []; }
    // For chassis-related groups other logic is already implemented separately

    let results = searchVehicles(allVehicles, debouncedSearchQuery);
    return applyFilters(results, contextFilters);
  }, [allVehicles, debouncedFilters, debouncedSearchQuery]);

  const cityCounts = useMemo(() => {
    const ctx = computeContextVehiclesExcluding('cities');
    const m = countBy(ctx, v => v.city);
    const obj: Record<string, number> = {};
    Array.from(m.entries()).forEach(([k, c]) => { obj[String(k)] = c; });
    return obj;
  }, [computeContextVehiclesExcluding, countBy]);

  const stateCounts = useMemo(() => {
    const ctx = computeContextVehiclesExcluding('states');
    const m = countBy(ctx, v => v.state);
    const obj: Record<string, number> = {};
    Array.from(m.entries()).forEach(([k, c]) => { obj[String(k)] = c; });
    return obj;
  }, [computeContextVehiclesExcluding, countBy]);

  const statusCounts = useMemo(() => {
    const ctx = computeContextVehiclesExcluding('status');
    const m = countBy(ctx, v => v.status);
    const obj: Record<string, number> = {};
    Array.from(m.entries()).forEach(([k, c]) => { obj[String(k)] = c; });
    return obj;
  }, [computeContextVehiclesExcluding, countBy]);

  const tracaoCounts = useMemo(() => {
    const ctx = computeContextVehiclesExcluding('states'); // reuse context without changing chassis-specifics
    const m = countBy(ctx, v => v.rawData.chassisInfo.tracaoSystem || '');
    const obj: Record<string, number> = {};
    Array.from(m.entries()).forEach(([k, c]) => { if (k) obj[String(k)] = c; });
    return obj;
  }, [computeContextVehiclesExcluding, countBy]);

  const axlesCounts = useMemo(() => {
    const ctx = computeContextVehiclesExcluding('states');
    const m = new Map<number, number>();
    ctx.forEach(v => {
      const k = v.rawData.chassisInfo.axlesVehicles;
      if (k === undefined || k === null) return;
      m.set(k, (m.get(k) || 0) + 1);
    });
    const obj: Record<string, number> = {};
    Array.from(m.entries()).forEach(([k, c]) => { obj[String(k)] = c; });
    return obj;
  }, [computeContextVehiclesExcluding]);

  const engineLocationCounts = useMemo(() => {
    const ctx = computeContextVehiclesExcluding('states');
    const m = countBy(ctx, v => v.rawData.chassisInfo.engineLocation || '');
    const obj: Record<string, number> = {};
    Array.from(m.entries()).forEach(([k, c]) => { if (k) obj[String(k)] = c; });
    return obj;
  }, [computeContextVehiclesExcluding, countBy]);

  const availableTracaoSystems = useMemo(() => extractUniqueTracaoSystems(facetSource), [facetSource]);
  const availableAxlesVehicles = useMemo(() => extractUniqueAxlesVehicles(facetSource), [facetSource]);
  const availableEngineLocations = useMemo(() => extractUniqueEngineLocations(facetSource), [facetSource]);
  const powerRange = useMemo(() => extractUniquePowerRange(facetSource), [facetSource]);
  const availableEngineBrakeTypes = useMemo(() => extractUniqueEngineBrakeTypes(facetSource), [facetSource]);
  const availableRetarderTypes = useMemo(() => extractUniqueRetarderTypes(facetSource), [facetSource]);
  const availableSuspensionTypes = useMemo(() => extractUniqueSuspensionTypes(facetSource), [facetSource]);
  const availableEngineNames = useMemo(() => extractUniqueEngineNames(facetSource), [facetSource]);
  const availableSeatTypes = useMemo(() => extractUniqueSeatTypes(facetSource), [facetSource]);

  // Note: These are legacy flat lists, now replaced by hierarchical props in FilterPanel, but kept for interface compatibility if needed.
  // Actually we will update FilterPanel interface.
  const availableChassisManufacturers = useMemo(() => extractUniqueChassisManufacturers(facetSource), [facetSource]);
  const availableChassisModels = useMemo(() => extractUniqueChassisModels(facetSource), [facetSource]);
  const availableBodyManufacturers = useMemo(() => extractUniqueBodyManufacturers(facetSource), [facetSource]);
  const availableBodyModels = useMemo(() => extractUniqueBodyModels(facetSource), [facetSource]);

  const capacityRange = useMemo(() => extractCapacityRange(facetSource), [facetSource]);
  const modelYearRange = useMemo(() => extractModelYearRange(facetSource), [facetSource]);
  const quantityRange = useMemo(() => extractQuantityRange(facetSource), [facetSource]);
  const doorCountRange = useMemo(() => extractDoorCountRange(facetSource), [facetSource]);
  const totalSeatsRange = useMemo(() => extractTotalSeatsRange(facetSource), [facetSource]);

  const yearRange: [number, number] = useMemo(() => {
    const years = allVehicles.map(v => v.fabricationYear).filter(y => y > 0);
    return [Math.min(...years) || 2000, Math.max(...years) || 2025];
  }, [allVehicles]);

  const priceRange: [number, number] = useMemo(() => {
    const prices = allVehicles.map(v => v.price).filter(p => p > 0);
    return [Math.min(...prices) || 0, Math.max(...prices) || 1000000];
  }, [allVehicles]);

  const handleEdit = (vehicle: NormalizedVehicle) => {
    const productCode = vehicle.productCode || vehicle.rawData.productCode;
    if (productCode) {
      navigate(`/vehicles/edit/by-id/${productCode}`);
    } else {
      toast.error('ProductCode não encontrado para este veículo');
    }
  };

  const handleDelete = (id: string) => {
    setAllVehicles(prev => prev.filter(v => v.id !== id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    toast.success('Veículo excluído com sucesso!');
  };

  const handleRemoveFilter = (key: keyof SearchFilters, value: any, subKey?: string) => {
    setFilters(prev => {
      const next = { ...prev };
      if (key === 'categories' || key === 'subcategories' || key === 'cities' || key === 'states' || key === 'status') {
        next[key] = (next[key] as string[]).filter(v => v !== value);
      } else if (key === 'chassisFilters' && subKey) {
        const sub = { ...next.chassisFilters };
        (sub as any)[subKey] = ((sub as any)[subKey] as string[]).filter((v: string) => v !== value);
        next.chassisFilters = sub;
      } else if (key === 'motorFilter' && subKey === 'engineNames') {
        next.motorFilter = {
          ...next.motorFilter,
          engineNames: next.motorFilter.engineNames.filter(v => v !== value)
        };
      }
      return next;
    });
  };

  const handleClearAllFilters = () => {
    setFilters({
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
        bodyManufacturers: [],
        bodyModels: []
      },
      powerFilter: {
        minPower: 0,
        maxPower: 0
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
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pesquisa Avançada de Veículos</h1>
                <p className="text-sm text-gray-600">Busque, filtre e exporte dados de veículos</p>
              </div>
            </div>
            <Button onClick={() => navigate('/vehicles/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Veículo
            </Button>
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
            availableBodyModels={availableBodyModels}
            capacityRange={capacityRange}
            modelYearRange={modelYearRange}
            quantityRange={quantityRange}
            doorCountRange={doorCountRange}
            totalSeatsRange={totalSeatsRange}
            chassisFacets={chassisFacets}
            bodyFacets={bodyFacets}
            categoryFacets={categoryFacets}
            availableCitiesCounts={cityCounts}
            availableStatesCounts={stateCounts}
            availableStatusesCounts={statusCounts}
            availableTracaoCounts={tracaoCounts}
            availableAxlesCounts={axlesCounts}
            availableEngineLocationCounts={engineLocationCounts}
          />
        )}

        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-white border-b">
            <FilterSummary
              filters={filters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
            <ExportBar
              totalResults={filteredAndSortedVehicles.length}
              selectedVehicles={selectedVehicles}
              allVehicles={filteredAndSortedVehicles}
              filters={debouncedFilters}
            />
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <ResultsGrid
              vehicles={currentItems}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination Control */}
            <div className="mt-8 mb-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      return (
                        <React.Fragment key={page}>
                          {prevPage && page - prevPage > 1 && (
                             <PaginationItem>
                               <PaginationEllipsis />
                             </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      );
                    })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                      className={currentPage === totalPages ? 'pointer-events-no ne opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-center mt-2 text-sm text-gray-500">
                Total de {totalItems} veículos. Mostrando {itemsPerPage} por página.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
