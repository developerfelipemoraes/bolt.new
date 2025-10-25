import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BodyworkModelForm } from '@/components/models/BodyworkModelForm';

interface QuickBodyworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  category?: string;
  subcategory?: string;
  manufactureYear?: number;
  modelYear?: number;
}

export function QuickBodyworkDialog({
  open,
  onOpenChange,
  onSuccess,
  category,
  subcategory,
  manufactureYear,
  modelYear,
}: QuickBodyworkDialogProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro Rápido de Carroceria</DialogTitle>
        </DialogHeader>
        <BodyworkModelForm
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
