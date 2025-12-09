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
import { OpportunityCreatePayload } from '@/types/opportunity';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface CreateOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: OpportunityCreatePayload) => Promise<void>;
  pipelineId: string;
}

export function CreateOpportunityDialog({
  open,
  onOpenChange,
  onCreate,
  pipelineId
}: CreateOpportunityDialogProps) {
  const [title, setTitle] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [notes, setNotes] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    try {
      setCreating(true);

      const payload: OpportunityCreatePayload = {
        title: title.trim(),
        pipeline_id: pipelineId,
        contact_name: contactName.trim() || undefined,
        contact_phone: contactPhone.trim() || undefined,
        contact_email: contactEmail.trim() || undefined,
        estimated_value: estimatedValue ? parseFloat(estimatedValue) : undefined,
        notes: notes.trim() || undefined
      };

      await onCreate(payload);

      setTitle('');
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setEstimatedValue('');
      setNotes('');
      onOpenChange(false);

      toast.success('Oportunidade criada com sucesso');
    } catch (error) {
      toast.error('Erro ao criar oportunidade');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nova Oportunidade</DialogTitle>
          <DialogDescription>
            Crie uma nova oportunidade de venda de veículo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: SUV Executivo para cliente corporativo"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Nome do Cliente</Label>
            <Input
              id="contactName"
              placeholder="Nome do cliente"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone</Label>
              <Input
                id="contactPhone"
                placeholder="+55 (11) 98765-4321"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="cliente@email.com"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedValue">Valor Estimado</Label>
            <Input
              id="estimatedValue"
              type="number"
              placeholder="0.00"
              value={estimatedValue}
              onChange={e => setEstimatedValue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Notas sobre esta oportunidade..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            <Plus className="h-4 w-4 mr-2" />
            {creating ? 'Criando...' : 'Criar Oportunidade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
