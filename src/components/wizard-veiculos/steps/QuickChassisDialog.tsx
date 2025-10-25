import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChassisModelForm } from '@/components/models/ChassisModelForm';

interface QuickChassisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  category?: string;
  subcategory?: string;
  manufactureYear?: number;
  modelYear?: number;
}

export function QuickChassisDialog({
  open,
  onOpenChange,
  onSuccess,
  category,
  subcategory,
  manufactureYear,
  modelYear,
}: QuickChassisDialogProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro Rápido de Chassi</DialogTitle>
        </DialogHeader>
        <ChassisModelForm
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
