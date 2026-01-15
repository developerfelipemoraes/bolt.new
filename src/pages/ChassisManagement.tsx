import { useState } from 'react';
import { ChassisModelList } from '../components/models/ChassisModelList';
import { ChassisModelCompleteForm } from '../components/models/ChassisModelCompleteForm';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ChassisService as chassisService } from '../api/services/chassis/chassis.service';
import { toast } from 'sonner';

type ViewMode = 'list' | 'create' | 'edit';

export default function ChassisManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setViewMode('edit');
  };

  const handleCreate = () => {
    setSelectedId(undefined);
    setViewMode('create');
  };

  const handleSave = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (viewMode === 'edit' && selectedId) {
        await chassisService.updateChassis(selectedId, data);
        toast.success('Modelo atualizado com sucesso!');
      } else {
        await chassisService.createChassis(data);
        toast.success('Modelo criado com sucesso!');
      }
      setViewMode('list');
      setSelectedId(undefined);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar modelo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedId(undefined);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {viewMode !== 'list' && (
        <Button variant="ghost" onClick={handleCancel} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista
        </Button>
      )}

      {viewMode === 'list' && (
        <ChassisModelList onEdit={handleEdit} onCreate={handleCreate} />
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <ChassisModelCompleteForm
          chassisId={viewMode === 'edit' ? selectedId : undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
