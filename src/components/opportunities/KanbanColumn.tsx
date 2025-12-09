import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PipelineStage } from '@/types/pipeline';
import { Opportunity } from '@/types/opportunity';
import { OpportunityCard } from './OpportunityCard';

interface KanbanColumnProps {
  stage: PipelineStage;
  opportunities: Opportunity[];
  onOpportunityClick: (opportunity: Opportunity) => void;
  onDrop: (opportunityId: string, newStatus: string) => void;
  isFlexible?: boolean;
}

export function KanbanColumn({
  stage,
  opportunities,
  onOpportunityClick,
  onDrop,
  isFlexible = false
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-accent');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-accent');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-accent');

    const opportunityId = e.dataTransfer.getData('opportunityId');
    if (opportunityId) {
      onDrop(opportunityId, stage.status_key);
    }
  };

  const handleDragStart = (e: React.DragEvent, opportunityId: string) => {
    e.dataTransfer.setData('opportunityId', opportunityId);
  };

  return (
    <div className={isFlexible ? "flex-1 min-w-[320px]" : "flex-shrink-0 w-80"}>
      <Card className="h-full flex flex-col shadow-md">
        <div
          className="p-4 border-b"
          style={{ borderTopColor: stage.color, borderTopWidth: '3px' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{stage.name}</h3>
            <Badge
              variant="secondary"
              className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
            >
              {opportunities.length}
            </Badge>
          </div>
        </div>

        <ScrollArea
          className="flex-1 p-3"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-3 min-h-[200px]">
            {opportunities.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                Nenhuma oportunidade neste estágio
              </div>
            ) : (
              opportunities.map(opportunity => (
                <div
                  key={opportunity.id}
                  draggable
                  onDragStart={e => handleDragStart(e, opportunity.id)}
                >
                  <OpportunityCard
                    opportunity={opportunity}
                    onClick={() => onOpportunityClick(opportunity)}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
