import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockVehicleSearchService, VehicleSearchResult } from '@/services/mockVehicleSearchService';
import { formatCurrency } from '@/utils/currency';
import { Search, Loader2, Car } from 'lucide-react';

interface VehicleMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleSelected: (vehicleId: string, vehicleData: VehicleSearchResult) => void;
}

export function VehicleMatchDialog({
  open,
  onOpenChange,
  onVehicleSelected
}: VehicleMatchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<VehicleSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setSearched(true);
      const response = await mockVehicleSearchService.search(searchQuery);
      setResults(response.vehicles);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (vehicle: VehicleSearchResult) => {
    onVehicleSelected(vehicle.vehicle_id, vehicle);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Buscar e Vincular Veículo</DialogTitle>
          <DialogDescription>
            Pesquise no estoque disponível e selecione o veículo para vincular a esta oportunidade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite modelo, marca, categoria..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searched
                  ? 'Nenhum veículo encontrado'
                  : 'Digite algo e clique em buscar para ver os resultados'}
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(vehicle => (
                  <Card
                    key={vehicle.vehicle_id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleSelect(vehicle)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold">
                              {vehicle.brand} {vehicle.model}
                            </h4>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">Ano: {vehicle.year}</Badge>
                            {vehicle.category && (
                              <Badge variant="outline">{vehicle.category}</Badge>
                            )}
                            {vehicle.mileage && (
                              <Badge variant="outline">{vehicle.mileage.toLocaleString()} km</Badge>
                            )}
                          </div>

                          {vehicle.location && (
                            <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <Badge className="text-base">
                              {formatCurrency(vehicle.price)}
                            </Badge>
                            <Badge variant="outline">{vehicle.status}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
