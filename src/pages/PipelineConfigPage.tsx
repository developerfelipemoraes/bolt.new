import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pipeline } from '@/types/pipeline';
import { pipelineService } from '@/services/pipelineService';
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export default function PipelineConfigPage() {
  const navigate = useNavigate();

  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pipelineToDelete, setPipelineToDelete] = useState<Pipeline | null>(null);

  useEffect(() => {
    loadPipelines();
  }, []);

  const loadPipelines = async () => {
    try {
      setLoading(true);
      const data = await pipelineService.getAll();
      setPipelines(data);
    } catch (error) {
      toast.error('Erro ao carregar pipelines');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pipelineToDelete) return;

    try {
      await pipelineService.delete(pipelineToDelete.id);
      toast.success('Pipeline excluído com sucesso');
      await loadPipelines();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir pipeline');
    } finally {
      setDeleteDialogOpen(false);
      setPipelineToDelete(null);
    }
  };

  const confirmDelete = (pipeline: Pipeline) => {
    setPipelineToDelete(pipeline);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/opportunities')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Configuração de Pipelines</h1>
          <p className="text-muted-foreground">
            Gerencie seus funis de vendas e estágios personalizados
          </p>
        </div>

        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pipeline
        </Button>
      </div>

      <div className="grid gap-4">
        {pipelines.map(pipeline => (
          <Card key={pipeline.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{pipeline.name}</CardTitle>
                    {pipeline.is_default && (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3 mr-1" />
                        Padrão
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{pipeline.description}</CardDescription>
                </div>

                {!pipeline.is_default && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(pipeline)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Estágios do Pipeline:</h4>
                <div className="flex flex-wrap gap-2">
                  {pipeline.stages
                    .sort((a, b) => a.order - b.order)
                    .map((stage, index) => (
                      <div key={stage.id} className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          style={{ borderColor: stage.color, color: stage.color }}
                          className="px-3 py-1"
                        >
                          {stage.name}
                        </Badge>
                        {index < pipeline.stages.length - 1 && (
                          <span className="text-muted-foreground">→</span>
                        )}
                      </div>
                    ))}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total de Estágios:</span>
                    <span className="ml-2 font-medium">{pipeline.stages.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Criado em:</span>
                    <span className="ml-2 font-medium">
                      {new Date(pipeline.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pipelines.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Nenhum pipeline configurado</p>
              <p className="text-sm">Crie um novo pipeline para começar</p>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o pipeline "{pipelineToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
