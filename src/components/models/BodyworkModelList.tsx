import React, { useState, useEffect } from 'react';
import { useBodyworkSearch, useDeleteBodywork } from '../../hooks/useBodyworkModels';
import { BodyworkSearchParams } from '../../types/vehicleModels';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Pencil, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { MultiSelect, Option } from '../ui/multi-select';
import { BodyworkService } from '@/api/services/bodywork/bodywork.service';

interface BodyworkModelListProps {
  onEdit?: (id: string) => void;
  onCreate?: () => void;
}

export function BodyworkModelList({ onEdit, onCreate }: BodyworkModelListProps) {
  const [searchParams, setSearchParams] = useState<BodyworkSearchParams>({
    page: 1,
    pageSize: 20,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [manufacturerOptions, setManufacturerOptions] = useState<Option[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(false);

  useEffect(() => {
    const fetchManufacturers = async () => {
      setLoadingManufacturers(true);
      try {
        const response = await BodyworkService.getBodyworkManufacturers();
        if (response.Success) {
          setManufacturerOptions(
            [...new Set(response.Data)].sort().map(m => ({ label: m, value: m }))
          );
        }
      } catch (error) {
        console.error('Failed to load manufacturers', error);
      } finally {
        setLoadingManufacturers(false);
      }
    };
    fetchManufacturers();
  }, []);

  const handleManufacturerChange = (selected: string[]) => {
    setSelectedManufacturers(selected);
    handleSearch('bodyManufacturer', selected.join(','));
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const { data, isLoading, error } = useBodyworkSearch(searchParams);
  const deleteMutation = useDeleteBodywork();

  const handleSearch = (field: keyof BodyworkSearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value || undefined,
      page: 1,
    }));
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao carregar modelos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Modelos de Carroceria</span>
            {onCreate && (
              <Button onClick={onCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Modelo
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <MultiSelect
              options={manufacturerOptions}
              selected={selectedManufacturers}
              onChange={handleManufacturerChange}
              placeholder={loadingManufacturers ? "Carregando..." : "Selecione Fabricantes"}
            />
            <Input
              placeholder="Modelo"
              value={searchParams.model || ''}
              onChange={(e) => handleSearch('model', e.target.value)}
            />
            <Input
              placeholder="Ano"
              type="number"
              value={searchParams.manufactureYear || ''}
              onChange={(e) => handleSearch('manufactureYear', e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Ano Fab.</TableHead>
                  <TableHead>Ano Mod.</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Subcategoria</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum modelo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.items.map((bodywork) => (
                    <React.Fragment key={bodywork.id}>
                      <TableRow>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleRow(bodywork.id)}
                          >
                            {expandedRows.has(bodywork.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{bodywork.bodyManufacturer}</TableCell>
                        <TableCell>{bodywork.model}</TableCell>
                        <TableCell>{bodywork.manufactureYear}</TableCell>
                        <TableCell>{bodywork.modelYear}</TableCell>
                        <TableCell>{bodywork.category}</TableCell>
                        <TableCell>{bodywork.subcategory}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {onEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(bodywork.id)}
                                title="Editar modelo"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(bodywork.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(bodywork.id) && bodywork.yearEntries && bodywork.yearEntries.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/50">
                            <div className="p-4">
                              <h4 className="font-semibold mb-2">Anos de Fabricação:</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {bodywork.yearEntries.map((entry: any, idx: number) => (
                                  <div key={idx} className="text-sm bg-background p-2 rounded border">
                                    <span className="font-medium">Fab: {entry.manufactureYear}</span>
                                    <span className="text-muted-foreground"> / Mod: {entry.modelYear}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {data && data.total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Total: {data.total} modelos
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={searchParams.page === 1}
                  onClick={() =>
                    setSearchParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))
                  }
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    (searchParams.page || 1) * (searchParams.pageSize || 20) >= data.total
                  }
                  onClick={() =>
                    setSearchParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))
                  }
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este modelo de carroceria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
