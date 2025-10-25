import { useState } from 'react';
import { ChassisModelList } from '../components/models/ChassisModelList';
import { ChassisModelCompleteForm } from '../components/models/ChassisModelCompleteForm';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useChassisDetail } from '../hooks/useChassisModels';
import { chassisService } from '../services/chassisService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type ViewMode = 'list' | 'create' | 'edit';

export default function ChassisManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: chassisData, isLoading } = useChassisDetail(
    selectedId || '',
    !!selectedId && viewMode === 'edit'
  );

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
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ChassisModelCompleteForm
              initialData={viewMode === 'edit' ? chassisData : undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      )}
    </div>
  );
}
