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
  availableTracaoSystems: string[];
  availableAxlesVehicles: number[];
  availableEngineLocations: string[];
  powerRange: [number, number];
  availableEngineBrakeTypes: string[];
  availableRetarderTypes: string[];
  availableSuspensionTypes: string[];
  availableEngineNames: string[];
  availableSeatTypes: string[];
  capacityRange: [number, number];
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
  availableTracaoSystems,
  availableAxlesVehicles,
  availableEngineLocations,
  powerRange,
  availableEngineBrakeTypes,
  availableRetarderTypes,
  availableSuspensionTypes,
  availableEngineNames,
  availableSeatTypes,
  capacityRange,
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
        engineLocations: []
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
      }
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
    filters.powerFilter.minPower > 0 ||
    filters.equipmentFilters.engineBrakeTypes.length > 0 ||
    filters.equipmentFilters.retarderTypes.length > 0 ||
    filters.equipmentFilters.suspensionTypes.length > 0 ||
    filters.motorFilter.engineNames.length > 0 ||
    filters.seatFilters.requiredTypes.length > 0 ||
    filters.seatFilters.minCapacity > 0 ||
    filters.seatFilters.maxCapacity < 999;

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

          {(availableTracaoSystems.length > 0 || availableAxlesVehicles.length > 0 || availableEngineLocations.length > 0) && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">Características do Chassis</Label>

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
                            {tracao}
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
                            {axles} {axles === 1 ? 'Eixo' : 'Eixos'}
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
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {powerRange[1] > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Potência Mínima: {filters.powerFilter.minPower > 0 ? `${Math.round(filters.powerFilter.minPower)} cv` : 'Qualquer'}
                </Label>
                <Slider
                  min={powerRange[0]}
                  max={powerRange[1]}
                  step={10}
                  value={[filters.powerFilter.minPower]}
                  onValueChange={(value) => updateFilter('powerFilter', { minPower: value[0] })}
                  className="mb-2"
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
                    <Label className="text-xs text-gray-600 mb-2 block">
                      Capacidade: {filters.seatFilters.minCapacity} - {filters.seatFilters.maxCapacity} lugares
                    </Label>
                    <Slider
                      min={capacityRange[0]}
                      max={capacityRange[1]}
                      step={1}
                      value={[filters.seatFilters.minCapacity, filters.seatFilters.maxCapacity]}
                      onValueChange={(value) => updateFilter('seatFilters', {
                        ...filters.seatFilters,
                        minCapacity: value[0],
                        maxCapacity: value[1]
                      })}
                      className="mb-2"
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
