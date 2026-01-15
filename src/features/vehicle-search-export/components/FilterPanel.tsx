import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { SearchFilters, FacetManufacturer } from '../types';
import { RangeInput } from './RangeInput';
import { AccordionFilter } from './AccordionFilter';

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  availableCategories: string[];
  availableSubcategories: string[];
  availableCities: string[];
  availableStates: string[];
  availableStatuses: string[];
  availableCitiesCounts?: Record<string, number>;
  availableStatesCounts?: Record<string, number>;
  availableStatusesCounts?: Record<string, number>;
  availableTracaoCounts?: Record<string, number>;
  availableAxlesCounts?: Record<string, number>;
  availableEngineLocationCounts?: Record<string, number>;
  yearRange: [number, number];
  priceRange: [number, number];
  availableTracaoSystems: string[];
  availableAxlesVehicles: number[];
  availableEngineLocations: string[];
  availableChassisManufacturers: string[];
  availableChassisModels: string[];
  availableBodyManufacturers: string[];
  availableBodyModels: string[];
  powerRange: [number, number];
  availableEngineBrakeTypes: string[];
  availableRetarderTypes: string[];
  availableSuspensionTypes: string[];
  availableEngineNames: string[];
  availableSeatTypes: string[];
  capacityRange: [number, number];
  modelYearRange: [number, number];
  quantityRange: [number, number];
  doorCountRange: [number, number];
  totalSeatsRange: [number, number];
  onClose?: () => void;
  chassisFacets?: FacetManufacturer[];
  bodyFacets?: FacetManufacturer[];
  categoryFacets?: FacetManufacturer[];
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
  availableTracaoSystems,
  availableAxlesVehicles,
  availableEngineLocations,
  availableChassisManufacturers,
  availableChassisModels,
  availableBodyManufacturers,
  availableBodyModels,
  powerRange,
  availableEngineBrakeTypes,
  availableRetarderTypes,
  availableSuspensionTypes,
  availableEngineNames,
  availableSeatTypes,
  capacityRange,
  modelYearRange,
  quantityRange,
  doorCountRange,
  totalSeatsRange,
  onClose,
  chassisFacets,
  bodyFacets
  , categoryFacets,
  availableCitiesCounts,
  availableStatesCounts,
  availableStatusesCounts,
  availableTracaoCounts,
  availableAxlesCounts,
  availableEngineLocationCounts
}: FilterPanelProps) {
  const [expandedChassis, setExpandedChassis] = useState<string | null>(null);
  const [expandedBody, setExpandedBody] = useState<string | null>(null);

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

  const toggleTracaoSystem = (value: string) => {
    const current = filters.chassisFilters.tracaoSystems;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('chassisFilters', { ...filters.chassisFilters, tracaoSystems: updated });
  };

  const toggleAxles = (value: number) => {
    const current = filters.chassisFilters.axlesVehicles;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('chassisFilters', { ...filters.chassisFilters, axlesVehicles: updated });
  };

  const toggleEngineLocation = (value: string) => {
    const current = filters.chassisFilters.engineLocations;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('chassisFilters', { ...filters.chassisFilters, engineLocations: updated });
  };

  const toggleEngineBrakeType = (value: string) => {
    const current = filters.equipmentFilters.engineBrakeTypes;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('equipmentFilters', { ...filters.equipmentFilters, engineBrakeTypes: updated });
  };

  const toggleRetarderType = (value: string) => {
    const current = filters.equipmentFilters.retarderTypes;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('equipmentFilters', { ...filters.equipmentFilters, retarderTypes: updated });
  };

  const toggleSuspensionType = (value: string) => {
    const current = filters.equipmentFilters.suspensionTypes;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('equipmentFilters', { ...filters.equipmentFilters, suspensionTypes: updated });
  };

  const toggleEngineName = (value: string) => {
    const current = filters.motorFilter.engineNames;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('motorFilter', { ...filters.motorFilter, engineNames: updated });
  };

  const toggleSeatType = (value: string) => {
    const current = filters.seatFilters.requiredTypes;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('seatFilters', { ...filters.seatFilters, requiredTypes: updated });
  };

  const toggleChassisManufacturer = (value: string) => {
    const current = filters.chassisFilters.chassisManufacturers;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('chassisFilters', { ...filters.chassisFilters, chassisManufacturers: updated });
  };

  const toggleChassisModel = (value: string) => {
    const current = filters.chassisFilters.chassisModels;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('chassisFilters', { ...filters.chassisFilters, chassisModels: updated });
  };

  const toggleChassisModelWithParent = (model: string, manufacturer: string) => {
      // 1. Toggle Model
      const currentModels = filters.chassisFilters.chassisModels;
      const newModels = currentModels.includes(model)
        ? currentModels.filter(m => m !== model)
        : [...currentModels, model];

      // 2. Ensure Parent is Selected (if adding child)
      const currentMfrs = filters.chassisFilters.chassisManufacturers;
      let newMfrs = currentMfrs;
      if (!currentModels.includes(model)) { // If we are adding
          if (!currentMfrs.includes(manufacturer)) {
              newMfrs = [...currentMfrs, manufacturer];
          }
      }

      onChange({
          ...filters,
          chassisFilters: {
              ...filters.chassisFilters,
              chassisModels: newModels,
              chassisManufacturers: newMfrs
          }
      });
  };

  const toggleBodyManufacturer = (value: string) => {
    const current = filters.chassisFilters.bodyManufacturers;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('chassisFilters', { ...filters.chassisFilters, bodyManufacturers: updated });
  };

  const toggleBodyModel = (value: string) => {
    const current = filters.chassisFilters.bodyModels || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter('chassisFilters', { ...filters.chassisFilters, bodyModels: updated });
  };

  const toggleBodyModelWithParent = (model: string, manufacturer: string) => {
      // 1. Toggle Model
      const currentModels = filters.chassisFilters.bodyModels || [];
      const newModels = currentModels.includes(model)
        ? currentModels.filter(m => m !== model)
        : [...currentModels, model];

      // 2. Ensure Parent is Selected (if adding child)
      const currentMfrs = filters.chassisFilters.bodyManufacturers;
      let newMfrs = currentMfrs;
      if (!currentModels.includes(model)) { // If we are adding
          if (!currentMfrs.includes(manufacturer)) {
              newMfrs = [...currentMfrs, manufacturer];
          }
      }

      onChange({
          ...filters,
          chassisFilters: {
              ...filters.chassisFilters,
              bodyModels: newModels,
              bodyManufacturers: newMfrs
          }
      });
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
    Object.keys(filters.optionals).length > 0 ||
    filters.chassisFilters.tracaoSystems.length > 0 ||
    filters.chassisFilters.axlesVehicles.length > 0 ||
    filters.chassisFilters.engineLocations.length > 0 ||
    filters.chassisFilters.chassisManufacturers.length > 0 ||
    filters.chassisFilters.chassisModels.length > 0 ||
    filters.chassisFilters.bodyManufacturers.length > 0 ||
    (filters.chassisFilters.bodyModels && filters.chassisFilters.bodyModels.length > 0) ||
    filters.powerFilter.minPower > 0 ||
    filters.powerFilter.maxPower > 0 ||
    filters.equipmentFilters.engineBrakeTypes.length > 0 ||
    filters.equipmentFilters.retarderTypes.length > 0 ||
    filters.equipmentFilters.suspensionTypes.length > 0 ||
    filters.motorFilter.engineNames.length > 0 ||
    filters.seatFilters.requiredTypes.length > 0 ||
    filters.seatFilters.minCapacity > 0 ||
    filters.seatFilters.maxCapacity < 999 ||
    filters.modelYearRange[0] > 0 ||
    filters.modelYearRange[1] < 9999 ||
    filters.quantityRange[0] > 0 ||
    filters.quantityRange[1] < 999 ||
    filters.doorCountRange[0] > 0 ||
    filters.doorCountRange[1] < 99 ||
    filters.totalSeatsRange[0] > 0 ||
    filters.totalSeatsRange[1] < 999;

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
                {(categoryFacets && categoryFacets.length > 0 ? categoryFacets : availableCategories.map(name => ({ name, value: name, count: 0, selected: false, models: [] }))).map(facet => (
                  <div key={facet.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${facet.name}`}
                      checked={filters.categories.includes(facet.name)}
                      onCheckedChange={() => toggleArrayFilter('categories', facet.name)}
                    />
                    <label htmlFor={`cat-${facet.name}`} className="text-sm cursor-pointer">
                      {facet.name} {facet.count !== undefined ? <span className="text-gray-500">({facet.count})</span> : null}
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
                    {availableSubcategories.map(sub => {
                      // compute subcategory count from categoryFacets
                      let count = 0;
                      if (categoryFacets) {
                        categoryFacets.forEach(f => {
                          f.models.forEach(m => { if (m.name === sub) count += m.count; });
                        });
                      }
                      return (
                        <div key={sub} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sub-${sub}`}
                            checked={filters.subcategories.includes(sub)}
                            onCheckedChange={() => toggleArrayFilter('subcategories', sub)}
                          />
                          <label htmlFor={`sub-${sub}`} className="text-sm cursor-pointer">
                            {sub} {count ? <span className="text-gray-500">({count})</span> : null}
                          </label>
                        </div>
                      );
                    })}
                  </div>
              </div>
            </>
          )}

          <Separator />
          <div>
            <RangeInput
              label="Ano Fabricação"
              min={filters.yearRange[0]}
              max={filters.yearRange[1]}
              datasetMin={yearRange[0]}
              datasetMax={yearRange[1]}
              onChange={(min, max) => updateFilter('yearRange', [min, max])}
            />
          </div>

          <Separator />
          <div>
            <RangeInput
              label="Ano Modelo"
              min={filters.modelYearRange[0]}
              max={filters.modelYearRange[1]}
              datasetMin={modelYearRange[0]}
              datasetMax={modelYearRange[1]}
              onChange={(min, max) => updateFilter('modelYearRange', [min, max])}
            />
          </div>

          <Separator />
          <div>
            <RangeInput
              label="Preço"
              min={filters.priceRange[0]}
              max={filters.priceRange[1]}
              datasetMin={priceRange[0]}
              datasetMax={priceRange[1]}
              onChange={(min, max) => updateFilter('priceRange', [min, max])}
              formatter={(val) => `R$ ${val.toLocaleString('pt-BR')}`}
              parser={(val) => {
                const clean = val.replace(/[^\d]/g, '');
                return clean ? parseInt(clean, 10) : 0;
              }}
              placeholderMin="R$ Min"
              placeholderMax="R$ Max"
            />
          </div>

          {(availableTracaoSystems.length > 0 || availableAxlesVehicles.length > 0 || availableEngineLocations.length > 0 || availableChassisManufacturers.length > 0 || availableChassisModels.length > 0 || availableBodyManufacturers.length > 0) && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Características do Veículo</Label>

                {/* Body Manufacturer Hierarchical Filter */}
                {bodyFacets && bodyFacets.length > 0 ? (
                  <AccordionFilter
                    title="Fabricante Carroceria"
                    items={bodyFacets}
                    onParentChange={toggleBodyManufacturer}
                    onChildChange={toggleBodyModelWithParent}
                    expandedItem={expandedBody}
                    onExpand={setExpandedBody}
                  />
                ) : (
                  /* Fallback to legacy flat list if no facets provided (should not happen if props passed correctly) */
                  availableBodyManufacturers.length > 0 && (
                    <div className="mb-4">
                      <Label className="text-xs text-gray-600 mb-2 block">Fabricante Carroceria ({availableBodyManufacturers.length})</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableBodyManufacturers.map(manufacturer => (
                          <div key={manufacturer} className="flex items-center space-x-2">
                            <Checkbox
                              id={`body-mfr-${manufacturer}`}
                              checked={filters.chassisFilters.bodyManufacturers.includes(manufacturer)}
                              onCheckedChange={() => toggleBodyManufacturer(manufacturer)}
                            />
                            <label htmlFor={`body-mfr-${manufacturer}`} className="text-sm cursor-pointer">
                              {manufacturer}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Chassis Manufacturer Hierarchical Filter */}
                {chassisFacets && chassisFacets.length > 0 ? (
                  <AccordionFilter
                    title="Fabricante Chassi"
                    items={chassisFacets}
                    onParentChange={toggleChassisManufacturer}
                    onChildChange={toggleChassisModelWithParent}
                    expandedItem={expandedChassis}
                    onExpand={setExpandedChassis}
                  />
                ) : (
                   /* Fallback */
                   availableChassisManufacturers.length > 0 && (
                    <div className="mb-4">
                      <Label className="text-xs text-gray-600 mb-2 block">Fabricante Chassi ({availableChassisManufacturers.length})</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableChassisManufacturers.map(manufacturer => (
                          <div key={manufacturer} className="flex items-center space-x-2">
                            <Checkbox
                              id={`chassis-mfr-${manufacturer}`}
                              checked={filters.chassisFilters.chassisManufacturers.includes(manufacturer)}
                              onCheckedChange={() => toggleChassisManufacturer(manufacturer)}
                            />
                            <label htmlFor={`chassis-mfr-${manufacturer}`} className="text-sm cursor-pointer">
                              {manufacturer}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {availableTracaoSystems.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-xs text-gray-600 mb-2 block">Sistema de Tração</Label>
                    <div className="space-y-2">
                      {availableTracaoSystems.map(tracao => (
                        <div key={tracao} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tracao-${tracao}`}
                            checked={filters.chassisFilters.tracaoSystems.includes(tracao)}
                            onCheckedChange={() => toggleTracaoSystem(tracao)}
                          />
                          <label htmlFor={`tracao-${tracao}`} className="text-sm cursor-pointer">
                                  {tracao} {availableTracaoCounts && availableTracaoCounts[tracao] ? <span className="text-gray-500">({availableTracaoCounts[tracao]})</span> : null}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableAxlesVehicles.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-xs text-gray-600 mb-2 block">Número de Eixos</Label>
                    <div className="space-y-2">
                      {availableAxlesVehicles.map(axles => (
                        <div key={axles} className="flex items-center space-x-2">
                          <Checkbox
                            id={`axles-${axles}`}
                            checked={filters.chassisFilters.axlesVehicles.includes(axles)}
                            onCheckedChange={() => toggleAxles(axles)}
                          />
                          <label htmlFor={`axles-${axles}`} className="text-sm cursor-pointer">
                                {axles} {axles === 1 ? 'Eixo' : 'Eixos'} {availableAxlesCounts && availableAxlesCounts[String(axles)] ? <span className="text-gray-500">({availableAxlesCounts[String(axles)]})</span> : null}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableEngineLocations.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Posição do Motor</Label>
                    <div className="space-y-2">
                      {availableEngineLocations.map(location => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${location}`}
                            checked={filters.chassisFilters.engineLocations.includes(location)}
                            onCheckedChange={() => toggleEngineLocation(location)}
                          />
                          <label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                            {location} {availableEngineLocationCounts && availableEngineLocationCounts[location] ? <span className="text-gray-500">({availableEngineLocationCounts[location]})</span> : null}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ... Other filters ... */}

          <Separator />
          <div>
            <RangeInput
              label="Quantidade Disponível"
              min={filters.quantityRange[0]}
              max={filters.quantityRange[1]}
              datasetMin={quantityRange[0]}
              datasetMax={quantityRange[1]}
              onChange={(min, max) => updateFilter('quantityRange', [min, max])}
            />
          </div>

          {doorCountRange[1] > 0 && (
            <>
              <Separator />
              <div>
                <RangeInput
                  label="Quantidade de Portas"
                  min={filters.doorCountRange[0]}
                  max={filters.doorCountRange[1]}
                  datasetMin={doorCountRange[0]}
                  datasetMax={doorCountRange[1]}
                  onChange={(min, max) => updateFilter('doorCountRange', [min, max])}
                />
              </div>
            </>
          )}

          {totalSeatsRange[1] > 0 && (
            <>
              <Separator />
              <div>
                <RangeInput
                  label="Total de Lugares"
                  min={filters.totalSeatsRange[0]}
                  max={filters.totalSeatsRange[1]}
                  datasetMin={totalSeatsRange[0]}
                  datasetMax={totalSeatsRange[1]}
                  onChange={(min, max) => updateFilter('totalSeatsRange', [min, max])}
                />
              </div>
            </>
          )}

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
                        {state} {availableStatesCounts && availableStatesCounts[state] ? <span className="text-gray-500">({availableStatesCounts[state]})</span> : null}
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
                        {city} {availableCitiesCounts && availableCitiesCounts[city] ? <span className="text-gray-500">({availableCitiesCounts[city]})</span> : null}
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
                        {status} {availableStatusesCounts && availableStatusesCounts[status] ? <span className="text-gray-500">({availableStatusesCounts[status]})</span> : null}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {powerRange[1] > 0 && (
            <>
              <Separator />
              <div>
                <RangeInput
                  label="Potência"
                  min={filters.powerFilter.minPower}
                  max={filters.powerFilter.maxPower}
                  datasetMin={powerRange[0]}
                  datasetMax={powerRange[1]}
                  onChange={(min, max) => updateFilter('powerFilter', { minPower: min, maxPower: max })}
                  unit="cv"
                />
              </div>
            </>
          )}

          {(availableEngineBrakeTypes.length > 0 || availableRetarderTypes.length > 0 || availableSuspensionTypes.length > 0) && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Equipamentos</Label>

                {availableEngineBrakeTypes.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-xs text-gray-600 mb-2 block">Tipo de Freio Motor</Label>
                    <div className="space-y-2">
                      {availableEngineBrakeTypes.map(brake => (
                        <div key={brake} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brake-${brake}`}
                            checked={filters.equipmentFilters.engineBrakeTypes.includes(brake)}
                            onCheckedChange={() => toggleEngineBrakeType(brake)}
                          />
                          <label htmlFor={`brake-${brake}`} className="text-sm cursor-pointer">
                            {brake}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableRetarderTypes.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-xs text-gray-600 mb-2 block">Tipo de Retarder</Label>
                    <div className="space-y-2">
                      {availableRetarderTypes.map(retarder => (
                        <div key={retarder} className="flex items-center space-x-2">
                          <Checkbox
                            id={`retarder-${retarder}`}
                            checked={filters.equipmentFilters.retarderTypes.includes(retarder)}
                            onCheckedChange={() => toggleRetarderType(retarder)}
                          />
                          <label htmlFor={`retarder-${retarder}`} className="text-sm cursor-pointer">
                            {retarder}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableSuspensionTypes.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 block">Suspensão Intermediária</Label>
                    <div className="space-y-2">
                      {availableSuspensionTypes.map(suspension => (
                        <div key={suspension} className="flex items-center space-x-2">
                          <Checkbox
                            id={`suspension-${suspension}`}
                            checked={filters.equipmentFilters.suspensionTypes.includes(suspension)}
                            onCheckedChange={() => toggleSuspensionType(suspension)}
                          />
                          <label htmlFor={`suspension-${suspension}`} className="text-sm cursor-pointer">
                            {suspension}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {availableEngineNames.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Motor</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableEngineNames.map(engine => (
                    <div key={engine} className="flex items-center space-x-2">
                      <Checkbox
                        id={`engine-${engine}`}
                        checked={filters.motorFilter.engineNames.includes(engine)}
                        onCheckedChange={() => toggleEngineName(engine)}
                      />
                      <label htmlFor={`engine-${engine}`} className="text-sm cursor-pointer">
                        {engine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {(availableSeatTypes.length > 0 || capacityRange[1] > 0) && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Configuração de Poltronas</Label>

                {availableSeatTypes.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-xs text-gray-600 mb-2 block">Tipos de Poltronas</Label>
                    <div className="space-y-2">
                      {availableSeatTypes.map(seatType => (
                        <div key={seatType} className="flex items-center space-x-2">
                          <Checkbox
                            id={`seat-${seatType}`}
                            checked={filters.seatFilters.requiredTypes.includes(seatType)}
                            onCheckedChange={() => toggleSeatType(seatType)}
                          />
                          <label htmlFor={`seat-${seatType}`} className="text-sm cursor-pointer">
                            {getSeatTypeLabel(seatType)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {capacityRange[1] > 0 && (
                  <div>
                    <RangeInput
                      label="Capacidade (Lugares)"
                      min={filters.seatFilters.minCapacity}
                      max={filters.seatFilters.maxCapacity}
                      datasetMin={capacityRange[0]}
                      datasetMax={capacityRange[1]}
                      onChange={(min, max) => updateFilter('seatFilters', {
                        ...filters.seatFilters,
                        minCapacity: min,
                        maxCapacity: max
                      })}
                    />
                  </div>
                )}
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
                { key: 'tv', label: 'TV' },
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
};

function getSeatTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    conventional: '🪑 Convencional',
    executive: '💺 Executivo',
    semiSleeper: '🛋️ Semi-leito',
    sleeper: '🛏️ Leito',
    sleeperBed: '🛌 Leito-Cama',
    fixed: '🪑 Fixa'
  };
  return labels[type] || type;
}
