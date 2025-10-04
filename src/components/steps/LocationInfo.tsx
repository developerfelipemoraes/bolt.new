import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { LocationInfo as LocationInfoType } from '../../../types/vehicle';

interface LocationInfoProps {
  data: LocationInfoType;
  onChange: (data: LocationInfoType) => void;
}

export const LocationInfo: React.FC<LocationInfoProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof LocationInfoType, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    handleChange('zipCode', formatted);
  };

  // Estados brasileiros
  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Localização do Produto</h3>
        <p className="text-gray-600">Informe onde o veículo está localizado</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Endereço Completo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                value={data.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Rua, Avenida, número..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={data.neighborhood}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
                placeholder="Nome do bairro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                value={data.zipCode}
                onChange={(e) => handleCEPChange(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Nome da cidade"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <select
                id="state"
                value={data.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o estado</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Localização no Mapa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Integração com Mapa</p>
              <p className="text-sm text-gray-500">
                {data.address && data.city && data.state 
                  ? `${data.address}, ${data.neighborhood}, ${data.city}/${data.state}`
                  : 'Preencha o endereço para visualizar no mapa'
                }
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            A localização exata será marcada automaticamente com base no endereço informado.
          </p>
        </CardContent>
      </Card>

      {/* Resumo do Endereço */}
      {data.address && data.city && data.state && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Endereço Completo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <p className="font-medium text-green-800">
                  {data.address}
                </p>
                <p className="text-green-700">
                  {data.neighborhood}, {data.city}/{data.state}
                </p>
                {data.zipCode && (
                  <p className="text-green-600">
                    CEP: {data.zipCode}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Importante:</strong> O endereço será usado para localizar o veículo no mapa 
          e ajudar compradores interessados a encontrá-lo. Certifique-se de que as informações 
          estão corretas e completas.
        </p>
      </div>
    </div>
  );
};