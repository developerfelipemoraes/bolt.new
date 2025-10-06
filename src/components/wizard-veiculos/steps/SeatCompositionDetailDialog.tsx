import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, CircleAlert as AlertCircle } from 'lucide-react';
import { SeatCompositionDetail, SeatType, SeatLocation } from '@/types/vehicle';

interface SeatCompositionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialComposition?: SeatCompositionDetail[];
  onSave: (composition: SeatCompositionDetail[]) => void;
}

const seatTypeLabels: Record<SeatType, string> = {
  conventional: 'Convencional',
  executive: 'Executivo',
  semiSleeper: 'Semi-leito',
  sleeper: 'Leito',
  sleeperBed: 'Leito-Cama',
  fixed: 'Fixa'
};

const seatTypeIcons: Record<SeatType, string> = {
  conventional: '🪑',
  executive: '💺',
  semiSleeper: '🛋️',
  sleeper: '🛏️',
  sleeperBed: '🛌',
  fixed: '🪑'
};

const locationLabels: Record<SeatLocation, string> = {
  piso1: 'Piso 1 (Inferior)',
  piso2: 'Piso 2 (Superior)',
  frente: 'Frente',
  meio: 'Meio',
  fundo: 'Fundo'
};

export const SeatCompositionDetailDialog: React.FC<SeatCompositionDetailDialogProps> = ({
  open,
  onOpenChange,
  initialComposition = [],
  onSave
}) => {
  const [composition, setComposition] = useState<SeatCompositionDetail[]>(
    initialComposition.length > 0 ? initialComposition : []
  );

  const addGroup = () => {
    setComposition([
      ...composition,
      {
        type: 'executive',
        quantity: 0,
        location: undefined,
        notes: ''
      }
    ]);
  };

  const removeGroup = (index: number) => {
    setComposition(composition.filter((_, i) => i !== index));
  };

  const updateGroup = (index: number, field: keyof SeatCompositionDetail, value: string | number) => {
    const updated = [...composition];
    if (field === 'quantity') {
      updated[index] = { ...updated[index], [field]: Math.max(0, Number(value)) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setComposition(updated);
  };

  const handleSave = () => {
    const validComposition = composition.filter(c => c.quantity > 0);
    onSave(validComposition);
    onOpenChange(false);
  };

  const totalSeats = composition.reduce((sum, group) => sum + group.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhar Composição de Poltronas</DialogTitle>
          <DialogDescription>
            Configure grupos detalhados de poltronas com tipos, quantidades, localização e observações específicas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {composition.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">Nenhum grupo de poltronas configurado</p>
              <Button onClick={addGroup} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Grupo
              </Button>
            </div>
          ) : (
            <>
              {composition.map((group, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{seatTypeIcons[group.type]}</span>
                        <h4 className="font-semibold text-lg">Grupo {index + 1}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGroup(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de Poltrona</Label>
                        <Select
                          value={group.type}
                          onValueChange={(value) => updateGroup(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(seatTypeLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {seatTypeIcons[key as SeatType]} {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          value={group.quantity}
                          onChange={(e) => updateGroup(index, 'quantity', e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Localização (Opcional)</Label>
                        <Select
                          value={group.location || 'none'}
                          onValueChange={(value) => updateGroup(index, 'location', value === 'none' ? '' : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Não especificado</SelectItem>
                            {Object.entries(locationLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Observações (Opcional)</Label>
                        <Textarea
                          value={group.notes || ''}
                          onChange={(e) => updateGroup(index, 'notes', e.target.value)}
                          placeholder="Ex: Poltronas com massageador, USB duplo, reclinação 140°..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addGroup} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Grupo
              </Button>
            </>
          )}

          {totalSeats > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-blue-700 mb-2">Total de Poltronas Configuradas</p>
                  <p className="text-3xl font-bold text-blue-800">{totalSeats}</p>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {composition.map((group, index) => (
                        group.quantity > 0 && (
                          <span key={index} className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm">
                            {seatTypeIcons[group.type]} {group.quantity} {seatTypeLabels[group.type]}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Composição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
