import React, { useState } from 'react';
import { YearEntry, YearRange } from '@/types/vehicleModels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Edit, CalendarRange } from 'lucide-react';
import { toast } from 'sonner';
import { validateYearEntry, generateYearEntriesFromRange } from '@/utils/yearRangeCalculator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface YearEntriesEditorProps {
  yearEntries: YearEntry[];
  yearRanges: YearRange[];
  productionStart?: number | null;
  productionEnd?: number | null;
  onChange: (entries: YearEntry[]) => void;
}

interface YearEntryEditState {
  index: number | null;
  manufactureYear: string;
  modelYear: string;
}

export const YearEntriesEditor: React.FC<YearEntriesEditorProps> = ({
  yearEntries,
  yearRanges,
  productionStart,
  productionEnd,
  onChange
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRangeDialogOpen, setIsRangeDialogOpen] = useState(false);
  const [editState, setEditState] = useState<YearEntryEditState>({
    index: null,
    manufactureYear: '',
    modelYear: ''
  });
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  const openAddDialog = () => {
    setEditState({
      index: null,
      manufactureYear: '',
      modelYear: ''
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (index: number, entry: YearEntry) => {
    setEditState({
      index,
      manufactureYear: entry.manufactureYear.toString(),
      modelYear: entry.modelYear.toString()
    });
    setIsAddDialogOpen(true);
  };

  const handleSaveEntry = () => {
    const manufactureYear = parseInt(editState.manufactureYear);
    const modelYear = parseInt(editState.modelYear);

    if (isNaN(manufactureYear) || isNaN(modelYear)) {
      toast.error('Por favor, preencha ambos os anos com valores válidos');
      return;
    }

    const newEntry: YearEntry = { manufactureYear, modelYear };
    const validationError = validateYearEntry(newEntry, productionStart, productionEnd);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    let updatedEntries: YearEntry[];

    if (editState.index !== null) {
      updatedEntries = [...yearEntries];
      updatedEntries[editState.index] = newEntry;
    } else {
      updatedEntries = [...yearEntries, newEntry];
    }

    onChange(updatedEntries);
    setIsAddDialogOpen(false);
    toast.success(editState.index !== null ? 'Ano atualizado com sucesso' : 'Ano adicionado com sucesso');
  };

  const handleDeleteEntry = (index: number) => {
    const updatedEntries = yearEntries.filter((_, i) => i !== index);
    onChange(updatedEntries);
    toast.success('Ano removido com sucesso');
  };

  const handleAddRange = () => {
    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);

    if (isNaN(start) || isNaN(end)) {
      toast.error('Por favor, preencha ambos os anos da faixa');
      return;
    }

    if (start > end) {
      toast.error('O ano inicial não pode ser maior que o ano final');
      return;
    }

    const newEntries = generateYearEntriesFromRange(start, end);

    for (const entry of newEntries) {
      const validationError = validateYearEntry(entry, productionStart, productionEnd);
      if (validationError) {
        toast.error(`Erro ao validar ano ${entry.manufactureYear}: ${validationError}`);
        return;
      }
    }

    const updatedEntries = [...yearEntries, ...newEntries];
    onChange(updatedEntries);
    setIsRangeDialogOpen(false);
    setRangeStart('');
    setRangeEnd('');
    toast.success(`${newEntries.length} anos adicionados com sucesso`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Anos de Fabricação e Modelo</CardTitle>
              <CardDescription>
                Gerencie os anos de fabricação e modelo do chassi. As faixas de anos são calculadas automaticamente.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsRangeDialogOpen(true)} variant="outline" size="sm">
                <CalendarRange className="h-4 w-4 mr-2" />
                Adicionar Faixa
              </Button>
              <Button onClick={openAddDialog} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Ano
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {productionStart !== null && productionEnd !== null && (
            <Alert className="mb-4">
              <AlertDescription>
                <strong>Período de Produção:</strong> {productionStart} a {productionEnd}
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ano de Fabricação</TableHead>
                  <TableHead>Ano do Modelo</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhum ano cadastrado. Clique em "Adicionar Ano" para começar.
                    </TableCell>
                  </TableRow>
                ) : (
                  yearEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.manufactureYear}</TableCell>
                      <TableCell>{entry.modelYear}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(index, entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEntry(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {yearRanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Faixas de Anos (Calculadas Automaticamente)</CardTitle>
            <CardDescription>
              Faixas contíguas geradas a partir dos anos de fabricação e modelo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {yearRanges.map((range, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg"
                >
                  <span className="font-medium">
                    {range.start === range.end ? range.start : `${range.start} - ${range.end}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editState.index !== null ? 'Editar Ano' : 'Adicionar Ano'}
            </DialogTitle>
            <DialogDescription>
              Informe o ano de fabricação e o ano do modelo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manufactureYear">Ano de Fabricação</Label>
              <Input
                id="manufactureYear"
                type="number"
                value={editState.manufactureYear}
                onChange={(e) => setEditState({ ...editState, manufactureYear: e.target.value })}
                placeholder="Ex: 2023"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelYear">Ano do Modelo</Label>
              <Input
                id="modelYear"
                type="number"
                value={editState.modelYear}
                onChange={(e) => setEditState({ ...editState, modelYear: e.target.value })}
                placeholder="Ex: 2024"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEntry}>
              {editState.index !== null ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRangeDialogOpen} onOpenChange={setIsRangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Faixa de Anos</DialogTitle>
            <DialogDescription>
              Informe o ano inicial e final para gerar automaticamente todos os anos intermediários
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rangeStart">Ano Inicial</Label>
              <Input
                id="rangeStart"
                type="number"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                placeholder="Ex: 1991"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rangeEnd">Ano Final</Label>
              <Input
                id="rangeEnd"
                type="number"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                placeholder="Ex: 1996"
              />
            </div>
            {rangeStart && rangeEnd && parseInt(rangeStart) <= parseInt(rangeEnd) && (
              <Alert>
                <AlertDescription>
                  Serão adicionados {parseInt(rangeEnd) - parseInt(rangeStart) + 1} anos
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRangeDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddRange}>
              Adicionar Faixa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
