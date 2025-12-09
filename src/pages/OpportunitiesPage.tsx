import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { KanbanBoard } from '@/components/opportunities/KanbanBoard';
import { CreateOpportunityDialog } from '@/components/opportunities/CreateOpportunityDialog';
import { Pipeline } from '@/types/pipeline';
import { Opportunity, OpportunityCreatePayload } from '@/types/opportunity';
import { pipelineService } from '@/services/pipelineService';
import { opportunityService } from '@/services/opportunityService';
import { Plus, Settings, Loader2, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function OpportunitiesPage() {
  const navigate = useNavigate();

  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    loadPipelines();
  }, []);

  useEffect(() => {
    if (selectedPipeline) {
      loadOpportunities();
    }
  }, [selectedPipeline]);

  const loadPipelines = async () => {
    try {
      setLoading(true);
      const data = await pipelineService.getAll();
      setPipelines(data);

      const defaultPipeline = data.find(p => p.is_default);
      if (defaultPipeline) {
        setSelectedPipeline(defaultPipeline);
      } else if (data.length > 0) {
        setSelectedPipeline(data[0]);
      }
    } catch (error) {
      toast.error('Erro ao carregar pipelines');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadOpportunities = async () => {
    if (!selectedPipeline) return;

    try {
      const data = await opportunityService.getAll(selectedPipeline.id);
      setOpportunities(data);
    } catch (error) {
      toast.error('Erro ao carregar oportunidades');
      console.error(error);
    }
  };

  const handleCreateOpportunity = async (payload: OpportunityCreatePayload) => {
    await opportunityService.create(payload);
    await loadOpportunities();
  };

  const getTotalValue = () => {
    return opportunities.reduce((sum, opp) => sum + (opp.estimated_value || 0), 0);
  };

  const getWonCount = () => {
    return opportunities.filter(opp => opp.status === 'WON').length;
  };

  const getActiveCount = () => {
    return opportunities.filter(opp => opp.status !== 'WON' && opp.status !== 'LOST').length;
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
          <h1 className="text-3xl font-bold">Oportunidades de Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie seu funil de vendas de forma visual e eficiente
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/opportunities/pipelines')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar Pipelines
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Oportunidade
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Oportunidades Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveCount()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vendas Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getWonCount()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Valor Total em Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(getTotalValue())}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pipeline de Vendas</CardTitle>
              <CardDescription>
                Arraste os cards entre as colunas para atualizar o estágio
              </CardDescription>
            </div>

            {pipelines.length > 1 && (
              <Select
                value={selectedPipeline?.id}
                onValueChange={(value) => {
                  const pipeline = pipelines.find(p => p.id === value);
                  setSelectedPipeline(pipeline || null);
                }}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Selecione um pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelines.map(pipeline => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {selectedPipeline ? (
            <KanbanBoard
              pipeline={selectedPipeline}
              opportunities={opportunities}
              onOpportunitiesChange={loadOpportunities}
            />
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Nenhum pipeline disponível
            </div>
          )}
        </CardContent>
      </Card>

      <CreateOpportunityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreate={handleCreateOpportunity}
        pipelineId={selectedPipeline?.id || ''}
      />
    </div>
  );
}
