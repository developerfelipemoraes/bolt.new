import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
import { CreditCard as Edit, Trash2, ExternalLink } from 'lucide-react';
import { NormalizedVehicle } from '../types';
import { ReportSelector } from './ReportSelector';

interface ResultsGridProps {
  vehicles: NormalizedVehicle[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (vehicle: NormalizedVehicle) => void;
  onDelete: (sku: string) => void;
}

export function ResultsGrid({
  vehicles,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete
}: ResultsGridProps) {
  const isAllSelected = vehicles.length > 0 && selectedIds.length === vehicles.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < vehicles.length;
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const reportScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tableScroll = tableScrollRef.current;
    const reportScroll = reportScrollRef.current;

    if (!tableScroll || !reportScroll) return;

    const handleTableScroll = () => {
      if (reportScroll) {
        reportScroll.scrollTop = tableScroll.scrollTop;
      }
    };

    const handleReportScroll = () => {
      if (tableScroll) {
        tableScroll.scrollTop = reportScroll.scrollTop;
      }
    };

    tableScroll.addEventListener('scroll', handleTableScroll);
    reportScroll.addEventListener('scroll', handleReportScroll);

    return () => {
      tableScroll.removeEventListener('scroll', handleTableScroll);
      reportScroll.removeEventListener('scroll', handleReportScroll);
    };
  }, []);

  const toggleAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(vehicles.map(v => v.sku));
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

  const renderBoolean = (value: boolean) => (
    <Badge variant={value ? 'default' : 'outline'} className="text-xs">
      {value ? 'Sim' : 'Não'}
    </Badge>
  );

  return (
    <div className="grid grid-cols-[1fr_220px] gap-0 border rounded-lg bg-white h-[calc(100vh-280px)] overflow-hidden">
      <div className="flex flex-col border-r overflow-hidden">
        <div className="bg-gray-50 border-b px-4 py-3 flex items-center gap-4">
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
            Veículos ({vehicles.length})
          </span>
        </div>

        <div className="flex-1 overflow-auto" ref={tableScrollRef}>
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
                <TableHead className="min-w-[120px]">SKU</TableHead>
                <TableHead className="min-w-[250px]">Nome do Produto</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[120px]">Preço</TableHead>
                <TableHead className="min-w-[150px]">Cidade</TableHead>
                <TableHead className="min-w-[80px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Qtd Disp.</TooltipTrigger>
                      <TooltipContent>Quantidade Disponível</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="min-w-[180px]">Fornecedor</TableHead>
                <TableHead className="min-w-[140px]">Telefone Fornecedor</TableHead>
                <TableHead className="min-w-[180px]">Empresa Fornecedor</TableHead>
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
                <TableHead className="min-w-[150px]">Categoria</TableHead>
                <TableHead className="min-w-[150px]">Sub-Categoria</TableHead>
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
                      <TooltipTrigger>Composição</TooltipTrigger>
                      <TooltipContent>Composição de Poltronas</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
              {vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={38} className="text-center py-12 text-gray-500">
                    Nenhum veículo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle) => (
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
                    <TableCell className="font-semibold">{vehicle.priceFormatted}</TableCell>
                    <TableCell>{vehicle.city}</TableCell>
                    <TableCell className="text-center">{vehicle.quantity}</TableCell>
                    <TableCell>{vehicle.supplierContact}</TableCell>
                    <TableCell>{vehicle.supplierPhone}</TableCell>
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
                                  🪑 {vehicle.rawData.seatComposition.totalCapacity} lugares
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

      <div className="flex flex-col bg-gray-50 overflow-hidden">
        <div className="border-b px-4 py-3 text-center">
          <h3 className="text-sm font-medium text-gray-700">Relatórios</h3>
        </div>

        <div className="flex-1 overflow-y-auto" ref={reportScrollRef}>
          <div className="flex flex-col">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.sku}
                className="h-[73px] flex items-center justify-center border-b px-3"
                style={{ minHeight: '73px' }}
              >
                <ReportSelector
                  selectedVehicles={[vehicle]}
                  allVehicles={[vehicle]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
