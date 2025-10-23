import { useState } from 'react';
import { BodyworkModelList } from '../components/models/BodyworkModelList';
import { BodyworkModelForm } from '../components/models/BodyworkModelForm';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ViewMode = 'list' | 'create' | 'edit';

export default function BodyworkManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setViewMode('edit');
  };

  const handleCreate = () => {
    setSelectedId(undefined);
    setViewMode('create');
  };

  const handleSuccess = () => {
    setViewMode('list');
    setSelectedId(undefined);
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
        <BodyworkModelList onEdit={handleEdit} onCreate={handleCreate} />
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <BodyworkModelForm
          bodyworkId={selectedId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
