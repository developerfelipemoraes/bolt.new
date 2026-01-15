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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  CreditCard as Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
  X as XIcon,
  Filter,
  MoreHorizontal,
  Image as ImageIcon,
  Eye,
  MoreVertical
} from 'lucide-react';
import { NormalizedVehicle } from '../types';
import vehicleService from '@/services/vehicleService';
import { toast } from 'sonner';
import { TextFilter } from '@/components/ui/text-filter';
import { TextFilterState, applyTextFilter } from '@/features/vehicle-search-export/libs/text-filter';
import { GeradorAnuncioAurovel } from './GeradorAnuncioAurovel';
import { VehicleDetailModal } from './VehicleDetailModal';

interface ResultsGridProps {
  vehicles: NormalizedVehicle[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (vehicle: NormalizedVehicle) => void;
  onDelete: (id: string) => void;
}

interface EditingCell {
  id: string;
  field: 'price' | 'phone' | 'seats' | 'quantity';
  value: string;
}

interface ColumnFilters {
  [key: string]: TextFilterState | undefined;
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

  // States for Modals
  const [selectedVehicleForAd, setSelectedVehicleForAd] = useState<NormalizedVehicle | null>(null);
  const [selectedVehicleForView, setSelectedVehicleForView] = useState<NormalizedVehicle | null>(null);

  // Aplicar filtros de coluna
  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    Object.entries(columnFilters).forEach(([column, filterState]) => {
      if (!filterState) return;

      filtered = filtered.filter(vehicle => {
        let valueToCheck: string | number | undefined;

        switch (column) {
          case 'id':
            valueToCheck = vehicle.id;
            break;
          case 'sku':
            valueToCheck = vehicle.sku;
            break;
          case 'productCode':
            valueToCheck = vehicle.productCode;
            break;
          case 'title':
            valueToCheck = vehicle.title;
            break;
          case 'status':
            valueToCheck = vehicle.status;
            break;
          case 'price':
            valueToCheck = vehicle.priceFormatted;
            break;
          case 'city':
            valueToCheck = vehicle.city;
            break;
          case 'quantity':
            valueToCheck = vehicle.quantity.toString();
            break;
          case 'supplierContact':
            valueToCheck = vehicle.supplierContact;
            break;
          case 'supplierPhone':
            valueToCheck = vehicle.supplierPhone;
            break;
          case 'supplierCompany':
            valueToCheck = vehicle.supplierCompany;
            break;
          case 'category':
            valueToCheck = vehicle.category;
            break;
          case 'subcategory':
            valueToCheck = vehicle.subcategory;
            break;
          case 'seats':
            valueToCheck = vehicle.rawData.seatComposition?.totalCapacity?.toString();
            break;
          default:
            valueToCheck = '';
        }

        return applyTextFilter(valueToCheck?.toString(), filterState);
      });
    });

    return filtered;
  }, [vehicles, columnFilters]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const isAllSelected = currentVehicles.length > 0 && currentVehicles.every(v => selectedIds.includes(v.id));
  const isSomeSelected = currentVehicles.some(v => selectedIds.includes(v.id)) && !isAllSelected;

  const toggleAll = () => {
    if (isAllSelected) {
      const currentIds = currentVehicles.map(v => v.id);
      onSelectionChange(selectedIds.filter(id => !currentIds.includes(id)));
    } else {
      const currentIds = currentVehicles.map(v => v.id);
      const newSelected = [...new Set([...selectedIds, ...currentIds])];
      onSelectionChange(newSelected);
    }
  };

  const toggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      onDelete(id);
    }
  };

  const startEditing = (id: string, field: EditingCell['field'], currentValue: string | number) => {
    setEditingCell({ id, field, value: currentValue.toString() });
  };

  const cancelEditing = () => {
    setEditingCell(null);
  };

  const saveEdit = async () => {
    if (!editingCell) return;

    const vehicle = vehicles.find(v => v.id === editingCell.id);
    if (!vehicle) return;

    const vehicleId = vehicle.id;

    try {
      const updateData: any = {};

      switch (editingCell.field) {
        case 'price': {
          const price = parseFloat(editingCell.value.replace(/[^\d,.-]/g, '').replace(',', '.'));
          if (isNaN(price)) {
            toast.error('Preço inválido');
            return;
          }
          updateData['productIdentification.price'] = price;
          break;
        }

        case 'phone':
          updateData['supplier.phone'] = editingCell.value;
          break;

        case 'seats': {
          const seats = parseInt(editingCell.value);
          if (isNaN(seats) || seats < 0) {
            toast.error('Quantidade de lugares inválida');
            return;
          }
          updateData['seatComposition.totalCapacity'] = seats;
          break;
        }

        case 'quantity': {
          const quantity = parseInt(editingCell.value);
          if (isNaN(quantity) || quantity < 0) {
            toast.error('Quantidade disponível inválida');
            return;
          }
          updateData['vehicleData.availableQuantity'] = quantity;
          break;
        }
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
    const isEditing = editingCell?.id === vehicle.id && editingCell?.field === field;

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
        onClick={() => startEditing(vehicle.id, field, actualValue)}
        title="Clique para editar"
      >
        {displayValue}
      </div>
    );
  };

  const renderColumnFilter = (column: string, placeholder: string, label: string) => {
    return (
      <div className="flex items-center gap-1 mt-1">
        <TextFilter
          columnName={label}
          filter={columnFilters[column]}
          onFilterChange={(filter) => {
            const newFilters = { ...columnFilters };
            if (filter) {
              newFilters[column] = filter;
            } else {
              delete newFilters[column];
            }
            setColumnFilters(newFilters);
            setCurrentPage(1);
          }}
          placeholder={placeholder}
        />
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

        <div className="border rounded-lg bg-white mx-auto overflow-x-auto w-full max-w-full block">
          <Table className="min-w-[2200px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 sticky left-0 bg-white z-10">
                  <span className="sr-only">Seleção</span>
                </TableHead>
                <TableHead className="min-w-[100px] sticky left-12 bg-white z-10">Ações</TableHead>
                <TableHead className="min-w-[80px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Img Principal</TooltipTrigger>
                      <TooltipContent>Imagem Principal</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[200px]">
                  <div>ID</div>
                  {renderColumnFilter('id', 'Filtrar ID', 'ID')}
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div>Cód. Produto</div>
                  {renderColumnFilter('productCode', 'Filtrar Cód.', 'Código Produto')}
                </TableHead>
                <TableHead className="min-w-[250px]">
                  <div>Nome do Produto</div>
                  {renderColumnFilter('title', 'Filtrar nome', 'Nome do Produto')}
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div>Status</div>
                  {renderColumnFilter('status', 'Filtrar status', 'Status')}
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div>Preço <span className="text-xs text-blue-600">(editável)</span></div>
                  {renderColumnFilter('price', 'Filtrar preço', 'Preço')}
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <div>Cidade</div>
                  {renderColumnFilter('city', 'Filtrar cidade', 'Cidade')}
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
                  {renderColumnFilter('quantity', 'Filtrar qtd', 'Quantidade')}
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <div>Fornecedor</div>
                  {renderColumnFilter('supplierContact', 'Filtrar', 'Fornecedor')}
                </TableHead>
                <TableHead className="min-w-[140px]">
                  <div>Telefone <span className="text-xs text-blue-600">(editável)</span></div>
                  {renderColumnFilter('supplierPhone', 'Filtrar tel', 'Telefone')}
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <div>Empresa Fornecedor</div>
                  {renderColumnFilter('supplierCompany', 'Filtrar', 'Empresa')}
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
                  {renderColumnFilter('category', 'Filtrar', 'Categoria')}
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <div>Sub-Categoria</div>
                  {renderColumnFilter('subcategory', 'Filtrar', 'Sub-Categoria')}
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
                  {renderColumnFilter('seats', 'Filtrar lugares', 'Lugares')}
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
                  <TableRow key={vehicle.id}>
                    <TableCell className="sticky left-0 bg-white z-10">
                      <Checkbox
                        checked={selectedIds.includes(vehicle.id)}
                        onCheckedChange={() => toggleRow(vehicle.id)}
                      />
                    </TableCell>
                    <TableCell className="sticky left-12 bg-white z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedVehicleForAd(vehicle)}>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Gerar Anúncio
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedVehicleForView(vehicle)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(vehicle.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                    <TableCell className="font-mono text-sm">{vehicle.id}</TableCell>
                    <TableCell className="font-mono text-sm">{vehicle.productCode || '-'}</TableCell>
                    <TableCell className="font-medium">
                      <div className="whitespace-nowrap">{vehicle.title}</div>
                    </TableCell>
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
                    <TableCell>
                      <div className="whitespace-nowrap">{vehicle.supplierContact}</div>
                    </TableCell>
                    <TableCell>
                      {renderEditableCell(vehicle, 'phone', vehicle.supplierPhone, vehicle.supplierPhone)}
                    </TableCell>
                    <TableCell>
                      <div className="whitespace-nowrap">{vehicle.supplierCompany}</div>
                    </TableCell>
                    <TableCell>{vehicle.fabricationYear}</TableCell>
                    <TableCell>{vehicle.modelYear}</TableCell>
                    <TableCell>{vehicle.chassisManufacturer}</TableCell>
                    <TableCell>{vehicle.chassisModel}</TableCell>
                    <TableCell>{vehicle.bodyManufacturer}</TableCell>
                    <TableCell>{vehicle.bodyModel}</TableCell>
                    <TableCell>
                      {vehicle.category.length > 20 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help truncate max-w-[140px] block">
                                {vehicle.category}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {vehicle.category}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        vehicle.category
                      )}
                    </TableCell>
                    <TableCell>
                      {vehicle.subcategory.length > 20 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help truncate max-w-[140px] block">
                                {vehicle.subcategory}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {vehicle.subcategory}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        vehicle.subcategory
                      )}
                    </TableCell>
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
                      <span className="text-xs block whitespace-nowrap">{vehicle.optionalsList}</span>
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

      {/* Generator Modal */}
      <Dialog open={!!selectedVehicleForAd} onOpenChange={(open) => !open && setSelectedVehicleForAd(null)}>
        <DialogContent className="max-w-[1200px] w-full max-h-[95vh] overflow-y-auto bg-gray-100/50 backdrop-blur-sm border-none shadow-none flex justify-center items-center p-4">
          {selectedVehicleForAd && (
            <GeradorAnuncioAurovel
              imagem_onibus={selectedVehicleForAd.primaryImage}
              chassi_marca_modelo={`${selectedVehicleForAd.chassisManufacturer} ${selectedVehicleForAd.chassisModel}`}
              carroceria_marca_modelo={`${selectedVehicleForAd.bodyManufacturer} ${selectedVehicleForAd.bodyModel}`}
              ano_veiculo={selectedVehicleForAd.modelYear.toString()}
              preco={selectedVehicleForAd.priceFormatted}
              qtd_disponivel={selectedVehicleForAd.quantity}
              qtd_lugares={selectedVehicleForAd.rawData.seatComposition?.totalCapacity || 0}
              opcionais={selectedVehicleForAd.optionalsList ? selectedVehicleForAd.optionalsList.split(',').map(s => s.trim()).filter(Boolean) : []}
              onClose={() => setSelectedVehicleForAd(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicleForView}
        isOpen={!!selectedVehicleForView}
        onClose={() => setSelectedVehicleForView(null)}
      />

    </div>
  );
}
