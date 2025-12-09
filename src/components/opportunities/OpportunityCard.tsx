import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DollarSign, User, Calendar, Building2 } from 'lucide-react';
import { Opportunity } from '@/types/opportunity';
import { formatCurrency } from '@/utils/currency';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
}

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const timeInStage = formatDistanceToNow(new Date(opportunity.stage_entered_at), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <Card
      className="mb-3 cursor-pointer hover:shadow-lg transition-all border-l-4"
      style={{ borderLeftColor: '#6366f1' }}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-sm line-clamp-2">{opportunity.title}</h4>
          {opportunity.estimated_value && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {formatCurrency(opportunity.estimated_value)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-2">
        {opportunity.contact_name && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback className="text-xs">
                {getInitials(opportunity.contact_name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{opportunity.contact_name}</span>
          </div>
        )}

        {opportunity.vehicle_model && (
          <div className="flex items-center text-xs text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
            <span className="truncate">
              {opportunity.vehicle_model}
              {opportunity.vehicle_year && ` (${opportunity.vehicle_year})`}
            </span>
          </div>
        )}

        {opportunity.supplier_name && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            <span className="truncate">{opportunity.supplier_name}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{timeInStage}</span>
          </div>

          {opportunity.notes && (
            <Badge variant="outline" className="text-xs">
              {opportunity.notes.length > 20
                ? `${opportunity.notes.substring(0, 20)}...`
                : opportunity.notes}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
