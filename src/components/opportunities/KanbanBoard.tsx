import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pipeline } from '@/types/pipeline';
import { Opportunity, OpportunityStatus } from '@/types/opportunity';
import { KanbanColumn } from './KanbanColumn';
import { OpportunityDetailDialog } from './OpportunityDetailDialog';
import { opportunityService } from '@/services/opportunityService';
import { toast } from 'sonner';

interface KanbanBoardProps {
  pipeline: Pipeline;
  opportunities: Opportunity[];
  onOpportunitiesChange: () => void;
}

export function KanbanBoard({
  pipeline,
  opportunities,
  onOpportunitiesChange
}: KanbanBoardProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpportunityClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDetailOpen(true);
  };

  const handleDrop = async (opportunityId: string, newStatus: string) => {
    try {
      await opportunityService.moveToStage(opportunityId, newStatus as OpportunityStatus);

      const fromOpportunity = opportunities.find(opp => opp.id === opportunityId);
      const toStage = pipeline.stages.find(stage => stage.status_key === newStatus);

      if (fromOpportunity && toStage) {
        await opportunityService.addTimelineEvent({
          opportunity_id: opportunityId,
          event_type: 'STAGE_CHANGED',
          title: 'Mudança de estágio',
          description: `Movido para ${toStage.name}`,
          metadata: {
            from_stage: fromOpportunity.status,
            to_stage: newStatus,
            to_stage_name: toStage.name
          }
        });
      }

      toast.success('Oportunidade movida com sucesso');
      onOpportunitiesChange();
    } catch (error) {
      toast.error('Erro ao mover oportunidade');
      console.error(error);
    }
  };

  const getOpportunitiesByStage = (statusKey: string) => {
    return opportunities.filter(opp => opp.status === statusKey);
  };

  return (
    <>
      <ScrollArea className="w-full">
        <div className="flex gap-4 p-6 min-w-max">
          {pipeline.stages.map(stage => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              opportunities={getOpportunitiesByStage(stage.status_key)}
              onOpportunityClick={handleOpportunityClick}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </ScrollArea>

      {selectedOpportunity && (
        <OpportunityDetailDialog
          opportunity={selectedOpportunity}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          onUpdate={onOpportunitiesChange}
        />
      )}
    </>
  );
}
