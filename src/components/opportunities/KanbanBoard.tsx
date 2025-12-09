import { useState, useEffect, useRef } from 'react';
import { Pipeline } from '@/types/pipeline';
import { Opportunity, OpportunityStatus } from '@/types/opportunity';
import { KanbanColumn } from './KanbanColumn';
import { OpportunityDetailDialog } from './OpportunityDetailDialog';
import { opportunityServiceReal as opportunityService } from '@/services/opportunityService.real';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const stageCount = pipeline.stages.length;
  const minColumnWidth = 320;
  const gap = 16;
  const padding = 24;

  const totalMinWidth = (stageCount * minColumnWidth) + ((stageCount - 1) * gap) + (padding * 2);

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="h-full overflow-x-auto overflow-y-hidden"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
        }}
      >
        <div
          className="h-full flex gap-4 p-6"
          style={{
            minWidth: `${totalMinWidth}px`,
            width: stageCount <= 4 ? '100%' : 'auto'
          }}
        >
          {pipeline.stages.map((stage, index) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              opportunities={getOpportunitiesByStage(stage.status_key)}
              onOpportunityClick={handleOpportunityClick}
              onDrop={handleDrop}
              isFlexible={stageCount <= 4}
            />
          ))}
        </div>
      </div>

      <style>{`
        /* Estilo moderno para scrollbar horizontal */
        .h-full.overflow-x-auto::-webkit-scrollbar {
          height: 10px;
        }

        .h-full.overflow-x-auto::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
          margin: 0 24px;
        }

        .h-full.overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgba(155, 155, 155, 0.5);
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .h-full.overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(155, 155, 155, 0.7);
        }

        .h-full.overflow-x-auto::-webkit-scrollbar-thumb:active {
          background: rgba(155, 155, 155, 0.9);
        }
      `}</style>

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
