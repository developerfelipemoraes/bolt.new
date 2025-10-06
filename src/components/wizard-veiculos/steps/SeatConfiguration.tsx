import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings2, Info } from 'lucide-react';
import { SeatConfiguration as SeatConfigurationType, SeatComposition, SeatCompositionDetail } from '../../../types/vehicle';
import { SeatCompositionDetailDialog } from './SeatCompositionDetailDialog';

interface SeatConfigurationProps {
  data?: SeatConfigurationType;
  onChange: (data: SeatConfigurationType) => void;
  onCompositionChange?: (composition: SeatComposition) => void;
  existingComposition?: SeatComposition;
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
  onCompositionChange,
  existingComposition,
  isBus
}) => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [composition, setComposition] = useState<SeatComposition | undefined>(existingComposition);
  const handleChange = (field: keyof SeatConfigurationType, value: number) => {
    const updated = {
      ...data,
      [field]: Math.max(0, value)
    };
    onChange(updated);

    if (onCompositionChange) {
      const totalCapacity = Object.values(updated).reduce((sum, count) => sum + count, 0);
      const compositionText = generateCompositionText(updated);

      const updatedComposition: SeatComposition = {
        totals: updated,
        composition: composition?.composition,
        totalCapacity,
        compositionText
      };

      setComposition(updatedComposition);
      onCompositionChange(updatedComposition);
    }
  };

  const handleDetailedCompositionSave = (details: SeatCompositionDetail[]) => {
    const totalCapacity = details.reduce((sum, group) => sum + group.quantity, 0);
    const compositionText = generateDetailedCompositionText(details);

    const newTotals: SeatConfigurationType = {
      conventional: 0,
      executive: 0,
      semiSleeper: 0,
      sleeper: 0,
      sleeperBed: 0,
      fixed: 0
    };

    details.forEach(detail => {
      newTotals[detail.type] += detail.quantity;
    });

    onChange(newTotals);

    const updatedComposition: SeatComposition = {
      totals: newTotals,
      composition: details,
      totalCapacity,
      compositionText
    };

    setComposition(updatedComposition);

    if (onCompositionChange) {
      onCompositionChange(updatedComposition);
    }
  };

  const generateCompositionText = (config: SeatConfigurationType): string => {
    const parts: string[] = [];
    const labels = {
      conventional: 'Conv',
      executive: 'Exec',
      semiSleeper: 'Semi-leito',
      sleeper: 'Leito',
      sleeperBed: 'Leito-Cama',
      fixed: 'Fixa'
    };

    Object.entries(config).forEach(([key, value]) => {
      if (value > 0) {
        parts.push(`${value} ${labels[key as keyof SeatConfigurationType]}`);
      }
    });

    return parts.join(' + ') || 'Não configurado';
  };

  const generateDetailedCompositionText = (details: SeatCompositionDetail[]): string => {
    const labels = {
      conventional: 'Conv',
      executive: 'Exec',
      semiSleeper: 'Semi-leito',
      sleeper: 'Leito',
      sleeperBed: 'Leito-Cama',
      fixed: 'Fixa'
    };

    return details
      .map(d => `${d.quantity} ${labels[d.type]}`)
      .join(' + ');
  };

  useEffect(() => {
    if (existingComposition) {
      setComposition(existingComposition);
    }
  }, [existingComposition]);

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

      {/* Botão para Detalhamento */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Composição Detalhada (Opcional)</h4>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                Configure grupos específicos de poltronas com localização e observações.
                Ideal para ônibus com múltiplos tipos de poltronas.
              </p>
              {composition?.composition && composition.composition.length > 0 && (
                <div className="flex items-start gap-2 bg-white/50 p-3 rounded-lg mb-4">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">
                      {composition.composition.length} grupo(s) configurado(s)
                    </p>
                    <p className="text-blue-700">{composition.compositionText}</p>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowDetailDialog(true)}
              variant="default"
              className="ml-4"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Detalhar
            </Button>
          </div>
        </CardContent>
      </Card>

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

      {/* Dialog de Composição Detalhada */}
      <SeatCompositionDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        initialComposition={composition?.composition}
        onSave={handleDetailedCompositionSave}
      />

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
              {composition?.compositionText && (
                <p className="text-center text-xs text-blue-600 mt-1 font-medium">
                  {composition.compositionText}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};