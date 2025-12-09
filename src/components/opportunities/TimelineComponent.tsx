import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TimelineEvent, TIMELINE_EVENT_ICONS } from '@/types/timeline';
import { opportunityServiceReal as opportunityService } from '@/services/opportunityService.real';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface TimelineComponentProps {
  opportunityId: string;
}

export function TimelineComponent({ opportunityId }: TimelineComponentProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, [opportunityId]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const data = await opportunityService.getTimeline(opportunityId);
      setEvents(data.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (error) {
      console.error('Erro ao carregar timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        Nenhum evento registrado
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="relative">
            {index < events.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-border" />
            )}

            <Card className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="text-lg">
                    {TIMELINE_EVENT_ICONS[event.event_type] || '📍'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(event.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}

                  {event.created_by_name && (
                    <p className="text-xs text-muted-foreground">
                      por {event.created_by_name}
                    </p>
                  )}

                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
