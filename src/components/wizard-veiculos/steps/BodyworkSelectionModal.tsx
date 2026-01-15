import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BodyworkModel } from '@/api/services/bodywork/bodywork.types';

interface BodyworkSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  models: BodyworkModel[];
  onSelect: (model: BodyworkModel) => void;
  fallbackReason?: string;
}

export const BodyworkSelectionModal: React.FC<BodyworkSelectionModalProps> = ({
  open,
  onOpenChange,
  models,
  onSelect,
  fallbackReason,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecione o Modelo de Carroceria</DialogTitle>
          <DialogDescription>
            {fallbackReason ? (
              <span className="text-amber-600 font-medium">{fallbackReason}</span>
            ) : (
              'Escolha o modelo mais adequado para o veículo.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Subcategoria</TableHead>
                <TableHead>Anos</TableHead>
                <TableHead className="w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model, index) => (
                <TableRow key={model.id || index}>
                  <TableCell className="font-medium">{model.model}</TableCell>
                  <TableCell>{model.category || '-'}</TableCell>
                  <TableCell>{model.subcategory || '-'}</TableCell>
                  <TableCell>
                    {model.productionStart ? `${model.productionStart}` : '?'} -{' '}
                    {model.productionEnd ? `${model.productionEnd}` : '?'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => onSelect(model)}
                    >
                      Selecionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {models.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum modelo disponível.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
