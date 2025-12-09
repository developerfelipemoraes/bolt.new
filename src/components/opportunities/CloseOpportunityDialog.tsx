import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OpportunityClosePayload, LossReason, LOSS_REASON_LABELS } from '@/types/opportunity';
import { toast } from 'sonner';
import { Trophy, X } from 'lucide-react';

interface CloseOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: (data: OpportunityClosePayload) => void;
}

export function CloseOpportunityDialog({
  open,
  onOpenChange,
  onClose
}: CloseOpportunityDialogProps) {
  const [activeTab, setActiveTab] = useState<'won' | 'lost'>('won');

  const [finalSaleValue, setFinalSaleValue] = useState('');
  const [commissionPaid, setCommissionPaid] = useState('');

  const [lossReason, setLossReason] = useState<LossReason>('PRECO');
  const [lossReasonNotes, setLossReasonNotes] = useState('');

  const handleCloseWon = () => {
    if (!finalSaleValue) {
      toast.error('Valor final da venda é obrigatório');
      return;
    }

    const data: OpportunityClosePayload = {
      status: 'WON',
      final_sale_value: parseFloat(finalSaleValue),
      commission_paid: commissionPaid ? parseFloat(commissionPaid) : undefined,
      win_date: new Date().toISOString()
    };

    onClose(data);
  };

  const handleCloseLost = () => {
    const data: OpportunityClosePayload = {
      status: 'LOST',
      loss_reason: lossReason,
      loss_reason_notes: lossReasonNotes,
      loss_date: new Date().toISOString()
    };

    onClose(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Fechar Oportunidade</DialogTitle>
          <DialogDescription>
            Registre o resultado final desta oportunidade
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'won' | 'lost')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="won">
              <Trophy className="h-4 w-4 mr-2" />
              Venda Realizada (WIN)
            </TabsTrigger>
            <TabsTrigger value="lost">
              <X className="h-4 w-4 mr-2" />
              Não Realizada (LOST)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="won" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="finalValue">Valor Final da Venda *</Label>
              <Input
                id="finalValue"
                type="number"
                placeholder="0.00"
                value={finalSaleValue}
                onChange={e => setFinalSaleValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">Comissão Paga</Label>
              <Input
                id="commission"
                type="number"
                placeholder="0.00"
                value={commissionPaid}
                onChange={e => setCommissionPaid(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCloseWon}>
                <Trophy className="h-4 w-4 mr-2" />
                Confirmar Venda
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="lost" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="lossReason">Motivo da Perda *</Label>
              <Select
                value={lossReason}
                onValueChange={(value) => setLossReason(value as LossReason)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LOSS_REASON_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lossNotes">Observações</Label>
              <Textarea
                id="lossNotes"
                placeholder="Detalhes sobre o motivo da perda..."
                value={lossReasonNotes}
                onChange={e => setLossReasonNotes(e.target.value)}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleCloseLost}>
                <X className="h-4 w-4 mr-2" />
                Confirmar Perda
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
