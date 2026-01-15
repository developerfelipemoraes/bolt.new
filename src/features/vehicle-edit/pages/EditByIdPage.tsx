import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Search, CircleAlert as AlertCircle } from 'lucide-react';
import { isLikelyObjectId } from '../lib/objectId';
import apiService from '@/services/vehicleService';
import { toast } from 'sonner';

export function EditByIdPage() {
  const navigate = useNavigate();
  const [vehicleId, setVehicleId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const trimmedId = vehicleId.trim();

    if (!trimmedId) {
      toast.error('Por favor, informe um ID ou SKU');
      return;
    }

    setIsSearching(true);

    try {
      const vehicle = await apiService.getVehicleBySku(trimmedId);

      if (!vehicle) {
        toast.error('Veículo não encontrado');
        setIsSearching(false);
        return;
      }

      toast.success('Veículo encontrado! Redirecionando...');
      navigate(`/vehicles/edit/by-id/${trimmedId}`);
    } catch (error) {
      console.error('Error searching vehicle:', error);
      toast.error('Erro ao buscar veículo');
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/vehicles')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Veículo por SKU</CardTitle>
            <CardDescription>
              Informe o SKU do veículo para editar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Digite o SKU do veículo que deseja editar.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">SKU do Veículo</Label>
              <Input
                id="vehicleId"
                placeholder="Digite o SKU do veículo"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-mono"
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={!vehicleId || isSearching}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? 'Buscando...' : 'Buscar e Editar'}
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Dica</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p>
              Você pode encontrar o SKU do veículo na pesquisa avançada ou nas listagens.
              O SKU é único e identifica o veículo de forma permanente no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
