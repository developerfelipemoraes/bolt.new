import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeatConfiguration as SeatConfigurationType } from '../../../types/vehicle';

interface SeatConfigurationProps {
  data?: SeatConfigurationType;
  onChange: (data: SeatConfigurationType) => void;
  isBus: boolean;
}

const defaultSeatConfig: SeatConfigurationType = {
  conventional: 0,
  executive: 0,
  semiSleeper: 0,
  sleeper: 0,
  sleeperBed: 0,
  fixed: 0
};

export const SeatConfiguration: React.FC<SeatConfigurationProps> = ({ 
  data = defaultSeatConfig, 
  onChange, 
  isBus 
}) => {
  const handleChange = (field: keyof SeatConfigurationType, value: number) => {
    onChange({
      ...data,
      [field]: Math.max(0, value)
    });
  };

  if (!isBus) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold">Configuração de Poltronas</h3>
        <p className="text-gray-600">
          Esta etapa é específica para ônibus. Como você não selecionou esta categoria, 
          pode prosseguir para a próxima etapa.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">Prossiga para configurar os opcionais do veículo.</p>
        </div>
      </div>
    );
  }

  const seatTypes = [
    {
      key: 'conventional' as keyof SeatConfigurationType,
      title: 'Convencional',
      description: 'Poltronas básicas reclináveis',
      icon: '🪑'
    },
    {
      key: 'executive' as keyof SeatConfigurationType,
      title: 'Executivo',
      description: 'Poltronas confortáveis com mais recursos',
      icon: '💺'
    },
    {
      key: 'semiSleeper' as keyof SeatConfigurationType,
      title: 'Semi-leito',
      description: 'Poltronas com maior reclinação',
      icon: '🛋️'
    },
    {
      key: 'sleeper' as keyof SeatConfigurationType,
      title: 'Leito',
      description: 'Poltronas quase totalmente reclináveis',
      icon: '🛏️'
    },
    {
      key: 'sleeperBed' as keyof SeatConfigurationType,
      title: 'Leito-Cama',
      description: 'Poltronas que se transformam em camas',
      icon: '🛌'
    },
    {
      key: 'fixed' as keyof SeatConfigurationType,
      title: 'Fixa',
      description: 'Assentos fixos sem reclinação',
      icon: '🪑'
    }
  ];

  const totalSeats = Object.values(data).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2">Definição de Poltronas</h3>
        <p className="text-gray-600">Configure os tipos e quantidades de poltronas do ônibus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seatTypes.map((seatType) => (
          <Card key={seatType.key} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">{seatType.icon}</span>
                {seatType.title}
              </CardTitle>
              <p className="text-sm text-gray-600">{seatType.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor={seatType.key}>Quantidade</Label>
                <Input
                  id={seatType.key}
                  type="number"
                  value={data[seatType.key]}
                  onChange={(e) => handleChange(seatType.key, parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  className="text-center text-lg font-semibold"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Resumo da Configuração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {seatTypes.map((seatType) => (
              data[seatType.key] > 0 && (
                <div key={seatType.key} className="text-center">
                  <div className="text-2xl mb-1">{seatType.icon}</div>
                  <div className="font-medium">{seatType.title}</div>
                  <div className="text-lg font-bold text-blue-600">{data[seatType.key]}</div>
                </div>
              )
            ))}
          </div>
          
          {totalSeats > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="text-center">
                <span className="text-lg font-semibold text-blue-800">
                  Total de Poltronas: {totalSeats}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Markup Visual das Poltronas */}
      {totalSeats > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Representação Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
                {Array.from({ length: totalSeats }).map((_, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Representação simplificada da distribuição de poltronas
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};