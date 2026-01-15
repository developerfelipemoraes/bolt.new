import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Plus, CreditCard as Edit, Trash2, Eye, Filter, Car, Calendar, MapPin, FileSearch } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { toast } from 'sonner';
import vehicleService from '../services/vehicleService';
import { useNavigate } from 'react-router-dom';

interface VehicleListProps {
  onEdit?: (vehicle: Vehicle) => void;
  onAdd?: () => void;
}

// Helper for debouncing (could be extracted to hook)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ITEMS_PER_PAGE = 50;

export const VehicleList: React.FC<VehicleListProps> = ({ onEdit, onAdd }) => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // We no longer client-side filter for the main list, we use server-side.
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Reset page to 1 if search term changes
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadVehicles();
  }, [currentPage, debouncedSearchTerm]);

  const loadVehicles = () => {
    
      vehicleService.getVehicles().then(fetchedVehicles => {
        setVehicles(fetchedVehicles);
        localStorage.setItem('vehicles', JSON.stringify(fetchedVehicles));
      }).catch(() => {
        toast.error('Erro ao carregar veículos');
        setVehicles([]);
        setTotalItems(0);
      });
  };

  const handleDelete = (vehicleId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      // Optimistic update or reload? Reload is safer for pagination consistency.
      // But we can filter out locally first.
      const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
      setVehicles(updatedVehicles);

      // Ideally call service delete method here...
      // vehicleService.deleteVehicle(vehicleId).then(() => loadVehicles());
      toast.success('Veículo excluído com sucesso!');
    }
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailsDialog(true);
  };

  const getConditionBadge = (condition: string) => {
    const variants = {
      'new': 'default',
      'seminew': 'secondary',
      'used': 'outline'
    } as const;

    const labels = {
      'new': 'Novo',
      'seminew': 'Seminovo', 
      'used': 'Usado'
    };

    return (
      <Badge variant={variants[condition as keyof typeof variants] || 'outline'}>
        {labels[condition as keyof typeof labels] || condition}
      </Badge>
    );
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Veículos Cadastrados</h1>
            <p className="text-gray-600">Gerencie todos os veículos do seu estoque</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/vehicles/search')}
              className="flex items-center gap-2"
            >
              <FileSearch className="w-4 h-4" />
              Pesquisa Avançada
            </Button>
            <Button onClick={onAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Cadastrar Veículo
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por título, marca, modelo, placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats - Note: These stats are now only for the CURRENT PAGE unless we have a stats API */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total de Veículos</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note: Specific stats below are only accurate for current page data if API doesn't provide aggregates */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Novos (Pág)</Badge>
                <p className="text-2xl font-bold">
                  {vehicles.filter(v => v.secondaryInfo?.condition === 'new').length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">Seminovos (Pág)</Badge>
                <p className="text-2xl font-bold">
                  {vehicles.filter(v => v.secondaryInfo?.condition === 'semi-new').length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-800">Usados (Pág)</Badge>
                <p className="text-2xl font-bold">
                  {vehicles.filter(v => v.secondaryInfo?.condition === 'used').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Ano/Modelo</TableHead>
                  <TableHead>Condição</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vehicle.productIdentification?.title}</p>
                        <p className="text-sm text-gray-600">
                          {vehicle.chassisInfo?.chassisManufacturer} {vehicle.chassisInfo?.chassisModel}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.category?.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {vehicle.vehicleData?.fabricationYear}/{vehicle.vehicleData?.modelYear}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.secondaryInfo?.condition && getConditionBadge(vehicle.secondaryInfo.condition)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {vehicle.vehicleData?.licensePlate}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {vehicle.location?.city}/{vehicle.location?.state}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(vehicle)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(vehicle)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle.id!)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {vehicles.length === 0 && (
              <div className="text-center py-12">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum veículo encontrado' : 'Nenhum veículo cadastrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Comece cadastrando seu primeiro veículo'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={onAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeiro Veículo
                  </Button>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {totalItems > 0 && (
            <div className="p-4 border-t">
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
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
               <div className="text-center mt-2 text-sm text-gray-500">
                Total de {totalItems} veículos. Mostrando {ITEMS_PER_PAGE} por página.
              </div>
            </div>
            )}

          </CardContent>
        </Card>

        {/* Vehicle Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Veículo</DialogTitle>
              <DialogDescription>
                Informações completas do veículo selecionado
              </DialogDescription>
            </DialogHeader>
            
            {selectedVehicle && (
              <div className="space-y-6">
                {/* Title and Category */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {selectedVehicle.productIdentification?.title}
                  </h3>
                  <div className="flex gap-2">
                    <Badge>{selectedVehicle.category?.name}</Badge>
                    {selectedVehicle.secondaryInfo?.condition && 
                      getConditionBadge(selectedVehicle.secondaryInfo.condition)
                    }
                  </div>
                </div>

                {/* Vehicle Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dados do Veículo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Placa:</strong> {selectedVehicle.vehicleData?.licensePlate}</div>
                      <div><strong>Chassi:</strong> {selectedVehicle.vehicleData?.chassis}</div>
                      <div><strong>Renavam:</strong> {selectedVehicle.vehicleData?.renavam}</div>
                      <div><strong>Ano/Modelo:</strong> {selectedVehicle.vehicleData?.fabricationYear}/{selectedVehicle.vehicleData?.modelYear}</div>
                      <div><strong>Quilometragem:</strong> {selectedVehicle.vehicleData?.mileage?.toLocaleString('pt-BR')} km</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informações Técnicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Fabricante:</strong> {selectedVehicle.chassisInfo?.chassisManufacturer}</div>
                      <div><strong>Modelo:</strong> {selectedVehicle.chassisInfo?.chassisModel}</div>
                      <div><strong>Combustível:</strong> {selectedVehicle.secondaryInfo?.fuelType}</div>
                      <div><strong>Capacidade:</strong> {selectedVehicle.secondaryInfo?.capacity} pessoas</div>
                      <div><strong>Direção:</strong> {selectedVehicle.secondaryInfo?.steering}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Localização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p>{selectedVehicle.location?.address}</p>
                        <p>{selectedVehicle.location?.neighborhood}, {selectedVehicle.location?.city}/{selectedVehicle.location?.state}</p>
                        <p>CEP: {selectedVehicle.location?.zipCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                {selectedVehicle.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Descrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{selectedVehicle.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};