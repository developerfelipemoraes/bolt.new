import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Opportunity } from '@/types/opportunity';
import { TimelineComponent } from './TimelineComponent';
import { VehicleMatchDialog } from './VehicleMatchDialog';
import { ContactAssignDialog } from './ContactAssignDialog';
import { SupplierAssignDialog } from './SupplierAssignDialog';
import { CloseOpportunityDialog } from './CloseOpportunityDialog';
import { opportunityService } from '@/services/opportunityService';
import { formatCurrency } from '@/utils/currency';
import { toast } from 'sonner';
import {
  User,
  Car,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Target,
  X
} from 'lucide-react';

interface OpportunityDetailDialogProps {
  opportunity: Opportunity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function OpportunityDetailDialog({
  opportunity,
  open,
  onOpenChange,
  onUpdate
}: OpportunityDetailDialogProps) {
  const [currentOpportunity, setCurrentOpportunity] = useState(opportunity);
  const [notes, setNotes] = useState(opportunity.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const [showVehicleMatch, setShowVehicleMatch] = useState(false);
  const [showContactAssign, setShowContactAssign] = useState(false);
  const [showSupplierAssign, setShowSupplierAssign] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  useEffect(() => {
    setCurrentOpportunity(opportunity);
    setNotes(opportunity.notes || '');
  }, [opportunity]);

  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      await opportunityService.update(currentOpportunity.id, { notes });

      if (notes && notes !== opportunity.notes) {
        await opportunityService.addTimelineEvent({
          opportunity_id: currentOpportunity.id,
          event_type: 'NOTE_ADDED',
          title: 'Nota adicionada',
          description: notes.substring(0, 100)
        });
      }

      toast.success('Notas salvas com sucesso');
      onUpdate();
    } catch (error) {
      toast.error('Erro ao salvar notas');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVehicleMatched = async (vehicleId: string, vehicleData: any) => {
    try {
      await opportunityService.update(currentOpportunity.id, {
        vehicle_id: vehicleId,
        estimated_value: vehicleData.price
      });

      await opportunityService.addTimelineEvent({
        opportunity_id: currentOpportunity.id,
        event_type: 'VEHICLE_MATCHED',
        title: 'Veículo vinculado',
        description: `${vehicleData.model} (${vehicleData.year})`,
        metadata: {
          vehicle_id: vehicleId,
          vehicle_model: vehicleData.model,
          vehicle_year: vehicleData.year,
          vehicle_price: vehicleData.price
        }
      });

      toast.success('Veículo vinculado com sucesso');
      onUpdate();
      setShowVehicleMatch(false);
    } catch (error) {
      toast.error('Erro ao vincular veículo');
    }
  };

  const handleContactAssigned = async (contactId: string, contactData: any) => {
    try {
      await opportunityService.update(currentOpportunity.id, {
        contact_id: contactId,
        contact_name: contactData.full_name,
        contact_phone: contactData.phone_number,
        contact_email: contactData.email
      });

      await opportunityService.addTimelineEvent({
        opportunity_id: currentOpportunity.id,
        event_type: 'CONTACT_ASSIGNED',
        title: 'Contato vinculado',
        description: contactData.full_name,
        metadata: {
          contact_id: contactId,
          contact_name: contactData.full_name
        }
      });

      toast.success('Contato vinculado com sucesso');
      onUpdate();
      setShowContactAssign(false);
    } catch (error) {
      toast.error('Erro ao vincular contato');
    }
  };

  const handleSupplierAssigned = async (supplierId: string, supplierName: string) => {
    try {
      await opportunityService.update(currentOpportunity.id, {
        supplier_id: supplierId,
        supplier_name: supplierName
      });

      await opportunityService.addTimelineEvent({
        opportunity_id: currentOpportunity.id,
        event_type: 'SUPPLIER_ASSIGNED',
        title: 'Fornecedor atribuído',
        description: supplierName,
        metadata: {
          supplier_id: supplierId,
          supplier_name: supplierName
        }
      });

      toast.success('Fornecedor atribuído com sucesso');
      onUpdate();
      setShowSupplierAssign(false);
    } catch (error) {
      toast.error('Erro ao atribuir fornecedor');
    }
  };

  const handleClose = async (closeData: any) => {
    try {
      await opportunityService.close(currentOpportunity.id, closeData);

      const eventType = closeData.status === 'WON' ? 'CLOSED_WON' : 'CLOSED_LOST';
      await opportunityService.addTimelineEvent({
        opportunity_id: currentOpportunity.id,
        event_type: eventType,
        title: closeData.status === 'WON' ? 'Venda realizada' : 'Oportunidade perdida',
        description: closeData.status === 'WON'
          ? `Valor final: ${formatCurrency(closeData.final_sale_value)}`
          : `Motivo: ${closeData.loss_reason}`,
        metadata: closeData
      });

      toast.success(
        closeData.status === 'WON'
          ? 'Venda finalizada com sucesso!'
          : 'Oportunidade marcada como perdida'
      );
      onUpdate();
      setShowCloseDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao finalizar oportunidade');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl">{currentOpportunity.title}</DialogTitle>
                <DialogDescription>ID: {currentOpportunity.id}</DialogDescription>
              </div>
              <Badge>{currentOpportunity.status}</Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contato
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowContactAssign(true)}
                    >
                      {currentOpportunity.contact_id ? 'Alterar' : 'Atribuir'}
                    </Button>
                  </div>
                  {currentOpportunity.contact_name && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{currentOpportunity.contact_name}</p>
                      {currentOpportunity.contact_phone && (
                        <p className="text-sm text-muted-foreground">
                          {currentOpportunity.contact_phone}
                        </p>
                      )}
                      {currentOpportunity.contact_email && (
                        <p className="text-sm text-muted-foreground">
                          {currentOpportunity.contact_email}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Veículo
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVehicleMatch(true)}
                    >
                      {currentOpportunity.vehicle_id ? 'Alterar' : 'Vincular'}
                    </Button>
                  </div>
                  {currentOpportunity.vehicle_model && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{currentOpportunity.vehicle_model}</p>
                      <div className="flex gap-4 mt-1">
                        {currentOpportunity.vehicle_year && (
                          <p className="text-sm text-muted-foreground">
                            Ano: {currentOpportunity.vehicle_year}
                          </p>
                        )}
                        {currentOpportunity.vehicle_price && (
                          <p className="text-sm text-muted-foreground">
                            Preço: {formatCurrency(currentOpportunity.vehicle_price)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Fornecedor Pagador
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSupplierAssign(true)}
                    >
                      {currentOpportunity.supplier_id ? 'Alterar' : 'Atribuir'}
                    </Button>
                  </div>
                  {currentOpportunity.supplier_name && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{currentOpportunity.supplier_name}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valor Estimado
                  </Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium text-lg">
                      {currentOpportunity.estimated_value
                        ? formatCurrency(currentOpportunity.estimated_value)
                        : 'Não definido'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="notes">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Notas e Observações
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Adicione notas sobre esta oportunidade..."
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveNotes}
                      disabled={isSaving}
                      size="sm"
                    >
                      {isSaving ? 'Salvando...' : 'Salvar Notas'}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => setShowCloseDialog(true)}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Fechar Oportunidade
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <TimelineComponent opportunityId={currentOpportunity.id} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <VehicleMatchDialog
        open={showVehicleMatch}
        onOpenChange={setShowVehicleMatch}
        onVehicleSelected={handleVehicleMatched}
      />

      <ContactAssignDialog
        open={showContactAssign}
        onOpenChange={setShowContactAssign}
        onContactSelected={handleContactAssigned}
      />

      <SupplierAssignDialog
        open={showSupplierAssign}
        onOpenChange={setShowSupplierAssign}
        onSupplierSelected={handleSupplierAssigned}
      />

      <CloseOpportunityDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        onClose={handleClose}
      />
    </>
  );
}
