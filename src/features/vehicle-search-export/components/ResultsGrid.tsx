import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { CreditCard as Edit, Trash2, ExternalLink, ChevronLeft, ChevronRight, Check, X as XIcon, Filter } from 'lucide-react';
import { NormalizedVehicle } from '../types';
import vehicleService from '@/services/vehicleService';
import { toast } from 'sonner';

interface ResultsGridProps {
  vehicles: NormalizedVehicle[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (vehicle: NormalizedVehicle) => void;
  onDelete: (sku: string) => void;
}

interface EditingCell {
  sku: string;
  field: 'price' | 'phone' | 'seats' | 'quantity';
  value: string;
}

interface ColumnFilters {
  [key: string]: string;
}

const ITEMS_PER_PAGE = 20;

export function ResultsGrid({
  vehicles,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete
}: ResultsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});

  // Aplicar filtros de coluna
  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (!filterValue.trim()) return;

      const lowerFilter = filterValue.toLowerCase();

      filtered = filtered.filter(vehicle => {
        switch (column) {
          case 'sku':
            return vehicle.sku.toLowerCase().includes(lowerFilter);
          case 'title':
            return vehicle.title.toLowerCase().includes(lowerFilter);
          case 'status':
            return vehicle.status.toLowerCase().includes(lowerFilter);
          case 'price':
            return vehicle.priceFormatted.toLowerCase().includes(lowerFilter);
          case 'city':
            return vehicle.city.toLowerCase().includes(lowerFilter);
          case 'quantity':
            return vehicle.quantity.toString().includes(lowerFilter);
          case 'supplierContact':
            return vehicle.supplierContact.toLowerCase().includes(lowerFilter);
          case 'supplierPhone':
            return vehicle.supplierPhone.toLowerCase().includes(lowerFilter);
          case 'supplierCompany':
            return vehicle.supplierCompany.toLowerCase().includes(lowerFilter);
          case 'category':
            return vehicle.category.toLowerCase().includes(lowerFilter);
          case 'subcategory':
            return vehicle.subcategory.toLowerCase().includes(lowerFilter);
          case 'seats':
            return vehicle.rawData.seatComposition?.totalCapacity?.toString().includes(lowerFilter);
          default:
            return true;
        }
      });
    });

    return filtered;
  }, [vehicles, columnFilters]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const isAllSelected = currentVehicles.length > 0 && currentVehicles.every(v => selectedIds.includes(v.sku));
  const isSomeSelected = currentVehicles.some(v => selectedIds.includes(v.sku)) && !isAllSelected;

  const toggleAll = () => {
    if (isAllSelected) {
      const currentSkus = currentVehicles.map(v => v.sku);
      onSelectionChange(selectedIds.filter(id => !currentSkus.includes(id)));
    } else {
      const currentSkus = currentVehicles.map(v => v.sku);
      const newSelected = [...new Set([...selectedIds, ...currentSkus])];
      onSelectionChange(newSelected);
    }
  };

  const toggleRow = (sku: string) => {
    if (selectedIds.includes(sku)) {
      onSelectionChange(selectedIds.filter(id => id !== sku));
    } else {
      onSelectionChange([...selectedIds, sku]);
    }
  };

  const handleDelete = (sku: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      onDelete(sku);
    }
  };

  const startEditing = (sku: string, field: EditingCell['field'], currentValue: string | number) => {
    setEditingCell({ sku, field, value: currentValue.toString() });
  };

  const cancelEditing = () => {
    setEditingCell(null);
  };

  const saveEdit = async () => {
    if (!editingCell) return;

    const vehicle = vehicles.find(v => v.sku === editingCell.sku);
    if (!vehicle) return;

    const vehicleId = (vehicle.rawData as any).id || vehicle.sku;

    try {
      const updateData: any = {};

      switch (editingCell.field) {
        case 'price':
          const price = parseFloat(editingCell.value.replace(/[^\d,.-]/g, '').replace(',', '.'));
          if (isNaN(price)) {
            toast.error('Preço inválido');
            return;
          }
          updateData['productIdentification.price'] = price;
          break;

        case 'phone':
          updateData['supplier.phone'] = editingCell.value;
          break;

        case 'seats':
          const seats = parseInt(editingCell.value);
          if (isNaN(seats) || seats < 0) {
            toast.error('Quantidade de lugares inválida');
            return;
          }
          updateData['seatComposition.totalCapacity'] = seats;
          break;

        case 'quantity':
          const quantity = parseInt(editingCell.value);
          if (isNaN(quantity) || quantity < 0) {
            toast.error('Quantidade disponível inválida');
            return;
          }
          updateData['vehicleData.availableQuantity'] = quantity;
          break;
      }

      await vehicleService.updateVehicle(vehicleId, updateData);

      toast.success('Alteração salva com sucesso!');
      setEditingCell(null);

      // Atualizar o veículo localmente
      window.location.reload();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Erro ao salvar alteração');
    }
  };

  const renderBoolean = (value: boolean) => (
    <Badge variant={value ? 'default' : 'outline'} className="text-xs">
      {value ? 'Sim' : 'Não'}
    </Badge>
  );

  const renderEditableCell = (
    vehicle: NormalizedVehicle,
    field: EditingCell['field'],
    displayValue: string,
    actualValue: string | number
  ) => {
    const isEditing = editingCell?.sku === vehicle.sku && editingCell?.field === field;

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editingCell.value}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEditing();
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-600"
            onClick={saveEdit}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600"
            onClick={cancelEditing}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
        onClick={() => startEditing(vehicle.sku, field, actualValue)}
        title="Clique para editar"
      >
        {displayValue}
      </div>
    );
  };

  const renderColumnFilter = (column: string, placeholder: string) => {
    return (
      <div className="flex items-center gap-1 mt-1">
        <Input
          value={columnFilters[column] || ''}
          onChange={(e) => setColumnFilters({ ...columnFilters, [column]: e.target.value })}
          placeholder={placeholder}
          className="h-7 text-xs"
        />
        {columnFilters[column] && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => {
              const newFilters = { ...columnFilters };
              delete newFilters[column];
              setColumnFilters(newFilters);
            }}
          >
            <XIcon className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="border rounded-lg bg-white">
        <div className="bg-gray-50 border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) {
                  el.indeterminate = isSomeSelected;
                }
              }}
              onCheckedChange={toggleAll}
            />
            <span className="text-sm font-medium text-gray-700">
              Veículos ({filteredVehicles.length}) - Página {currentPage} de {totalPages || 1}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <span className="text-sm text-gray-600 px-2">
              {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} de {filteredVehicles.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="border rounded-lg bg-white mx-auto overflow-x-auto" style={{ width: 1020 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 sticky left-0 bg-white z-10">
                  <span className="sr-only">Seleção</span>
                </TableHead>
                <TableHead className="min-w-[100px] sticky left-12 bg-white z-10">Ações</TableHead>
                <TableHead className="min-w-[80px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Img Anúncio</TooltipTrigger>
                      <TooltipContent>Imagem do Anúncio</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[80px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Img Principal</TooltipTrigger>
                      <TooltipContent>Imagem Principal</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div>SKU</div>
                  {renderColumnFilter('sku', 'Filtrar SKU')}
                </TableHead>
                <TableHead className="min-w-[250px]">
                  <div>Nome do Produto</div>
                  {renderColumnFilter('title', 'Filtrar nome')}
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div>Status</div>
                  {renderColumnFilter('status', 'Filtrar status')}
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div>Preço <span className="text-xs text-blue-600">(editável)</span></div>
                  {renderColumnFilter('price', 'Filtrar preço')}
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <div>Cidade</div>
                  {renderColumnFilter('city', 'Filtrar cidade')}
                </TableHead>
                <TableHead className="min-w-[80px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div>Qtd Disp. <span className="text-xs text-blue-600">(edit)</span></div>
                      </TooltipTrigger>
                      <TooltipContent>Quantidade Disponível (editável)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {renderColumnFilter('quantity', 'Filtrar qtd')}
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <div>Fornecedor</div>
                  {renderColumnFilter('supplierContact', 'Filtrar')}
                </TableHead>
                <TableHead className="min-w-[140px]">
                  <div>Telefone <span className="text-xs text-blue-600">(editável)</span></div>
                  {renderColumnFilter('supplierPhone', 'Filtrar tel')}
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <div>Empresa Fornecedor</div>
                  {renderColumnFilter('supplierCompany', 'Filtrar')}
                </TableHead>
                <TableHead className="min-w-[100px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Ano Fab.</TooltipTrigger>
                      <TooltipContent>Ano Fabricação</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[100px]">Ano Modelo</TableHead>
                <TableHead className="min-w-[150px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Fab. Chassi</TooltipTrigger>
                      <TooltipContent>Fabricante Chassi</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[180px]">Modelo Chassi</TableHead>
                <TableHead className="min-w-[150px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Fab. Carroceria</TooltipTrigger>
                      <TooltipContent>Fabricante Carroceria</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[180px]">Modelo Carroceria</TableHead>
                <TableHead className="min-w-[150px]">
                  <div>Categoria</div>
                  {renderColumnFilter('category', 'Filtrar')}
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <div>Sub-Categoria</div>
                  {renderColumnFilter('subcategory', 'Filtrar')}
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Sist. Tração</TooltipTrigger>
                      <TooltipContent>Sistema de Tração</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Pos. Motor</TooltipTrigger>
                      <TooltipContent>Posição de Motor</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[200px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div>Composição <span className="text-xs text-blue-600">(edit)</span></div>
                      </TooltipTrigger>
                      <TooltipContent>Composição de Poltronas (lugares editável)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {renderColumnFilter('seats', 'Filtrar lugares')}
                </TableHead>
                <TableHead className="min-w-[250px]">Opcionais</TableHead>
                <TableHead className="min-w-[120px]">Ar-Condicionado</TableHead>
                <TableHead className="min-w-[100px]">Banheiro</TableHead>
                <TableHead className="min-w-[150px]">Bancos Reclináveis</TableHead>
                <TableHead className="min-w-[80px]">USB</TableHead>
                <TableHead className="min-w-[120px]">Porta Pacote</TableHead>
                <TableHead className="min-w-[120px]">Sistema de Som</TableHead>
                <TableHead className="min-w-[80px]">TV</TableHead>
                <TableHead className="min-w-[80px]">Wi-Fi</TableHead>
                <TableHead className="min-w-[140px]">Vidro Basculante</TableHead>
                <TableHead className="min-w-[120px]">Vidro Colado</TableHead>
                <TableHead className="min-w-[100px]">Cortina</TableHead>
                <TableHead className="min-w-[130px]">Acessibilidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={38} className="text-center py-12 text-gray-500">
                    Nenhum veículo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                currentVehicles.map((vehicle) => (
                  <TableRow key={vehicle.sku}>
                    <TableCell className="sticky left-0 bg-white z-10">
                      <Checkbox
                        checked={selectedIds.includes(vehicle.sku)}
                        onCheckedChange={() => toggleRow(vehicle.sku)}
                      />
                    </TableCell>
                    <TableCell className="sticky left-12 bg-white z-10">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(vehicle)}
                          title="Alterar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle.sku)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.announcementLink ? (
                        <a
                          href={vehicle.announcementLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          {vehicle.announcementImage ? (
                            <img
                              src={vehicle.announcementImage}
                              alt="Anúncio"
                              className="w-16 h-12 object-cover rounded cursor-pointer hover:opacity-75"
                              loading="lazy"
                            />
                          ) : (
                            <ExternalLink className="w-6 h-6 text-blue-600" />
                          )}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vehicle.primaryImage ? (
                        <img
                          src={vehicle.primaryImage}
                          alt="Principal"
                          className="w-16 h-12 object-cover rounded"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                          Sem foto
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{vehicle.sku}</TableCell>
                    <TableCell className="font-medium">{vehicle.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.status}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {renderEditableCell(vehicle, 'price', vehicle.priceFormatted, vehicle.price)}
                    </TableCell>
                    <TableCell>{vehicle.city}</TableCell>
                    <TableCell className="text-center">
                      {renderEditableCell(vehicle, 'quantity', vehicle.quantity.toString(), vehicle.quantity)}
                    </TableCell>
                    <TableCell>{vehicle.supplierContact}</TableCell>
                    <TableCell>
                      {renderEditableCell(vehicle, 'phone', vehicle.supplierPhone, vehicle.supplierPhone)}
                    </TableCell>
                    <TableCell>{vehicle.supplierCompany}</TableCell>
                    <TableCell>{vehicle.fabricationYear}</TableCell>
                    <TableCell>{vehicle.modelYear}</TableCell>
                    <TableCell>{vehicle.chassisManufacturer}</TableCell>
                    <TableCell>{vehicle.chassisModel}</TableCell>
                    <TableCell>{vehicle.bodyManufacturer}</TableCell>
                    <TableCell>{vehicle.bodyModel}</TableCell>
                    <TableCell>{vehicle.category}</TableCell>
                    <TableCell>{vehicle.subcategory}</TableCell>
                    <TableCell>{vehicle.driveSystem}</TableCell>
                    <TableCell>{vehicle.enginePosition}</TableCell>
                    <TableCell>
                      {vehicle.rawData.seatComposition?.compositionText ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs cursor-help">
                                <div className="font-medium text-blue-600">
                                  {renderEditableCell(
                                    vehicle,
                                    'seats',
                                    `🪑 ${vehicle.rawData.seatComposition.totalCapacity} lugares`,
                                    vehicle.rawData.seatComposition.totalCapacity || 0
                                  )}
                                </div>
                                <div className="text-gray-600 truncate max-w-[180px]">
                                  {vehicle.rawData.seatComposition.compositionText}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-1">
                                <p className="font-semibold">Composição Detalhada:</p>
                                <p>{vehicle.rawData.seatComposition.compositionText}</p>
                                {vehicle.rawData.seatComposition.composition && vehicle.rawData.seatComposition.composition.length > 0 && (
                                  <div className="mt-2 pt-2 border-t">
                                    {vehicle.rawData.seatComposition.composition.map((comp, idx) => (
                                      <div key={idx} className="text-xs">
                                        • {comp.quantity}x {comp.type}
                                        {comp.location && ` (${comp.location})`}
                                        {comp.notes && ` - ${comp.notes}`}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">{vehicle.optionalsList}</span>
                    </TableCell>
                    <TableCell>{renderBoolean(vehicle.hasAirConditioning)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasBathroom)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasReclinableSeats)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasUsb)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasPackageHolder)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasSoundSystem)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasTv)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasWifi)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasTiltingGlass)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasGluedGlass)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasCurtain)}</TableCell>
                    <TableCell>{renderBoolean(vehicle.hasAccessibility)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
