import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { isLikelyObjectId } from '../lib/objectId';
import { getById } from '../services/localVehicleRepo';
import { toast } from 'sonner';

export function EditByIdPage() {
  const navigate = useNavigate();
  const [vehicleId, setVehicleId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    const trimmedId = vehicleId.trim();

    if (!trimmedId) {
      toast.error('Por favor, informe um ID');
      return;
    }

    if (!isLikelyObjectId(trimmedId)) {
      toast.error('ID inválido (esperado ObjectId de 24 caracteres hexadecimais)');
      return;
    }

    setIsSearching(true);

    try {
      const vehicle = getById(trimmedId);

      if (!vehicle) {
        toast.error('Veículo não encontrado com este ID');
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
            <CardTitle>Buscar Veículo por ID</CardTitle>
            <CardDescription>
              Informe o ID do veículo (ObjectId de 24 caracteres) para editar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O ID deve ser um ObjectId válido de 24 caracteres hexadecimais.
                Exemplo: 507f1f77bcf86cd799439011
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="vehicleId">ID do Veículo</Label>
              <Input
                id="vehicleId"
                placeholder="Digite o ID (24 caracteres hex)"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={24}
                className="font-mono"
              />
              {vehicleId && !isLikelyObjectId(vehicleId) && (
                <p className="text-sm text-red-600">
                  ID inválido: deve conter exatamente 24 caracteres hexadecimais
                </p>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={!vehicleId || !isLikelyObjectId(vehicleId) || isSearching}
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
              Você pode encontrar o ID do veículo na pesquisa avançada ou nas listagens.
              O ID é único e identifica o veículo de forma permanente no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
