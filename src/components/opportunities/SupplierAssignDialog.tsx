import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2 } from 'lucide-react';

interface SupplierAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierSelected: (supplierId: string, supplierName: string) => void;
}

const MOCK_SUPPLIERS = [
  { id: 'SUP-001', name: 'Scania Brasil', type: 'Fabricante' },
  { id: 'SUP-002', name: 'Mercedes-Benz do Brasil', type: 'Fabricante' },
  { id: 'SUP-003', name: 'Marcopolo S.A.', type: 'Encarroçadora' },
  { id: 'SUP-004', name: 'Iveco Latin America', type: 'Fabricante' },
  { id: 'SUP-005', name: 'Volkswagen Caminhões e Ônibus', type: 'Fabricante' },
  { id: 'SUP-006', name: 'Volare', type: 'Fabricante' },
  { id: 'SUP-007', name: 'Agrale', type: 'Fabricante' },
  { id: 'SUP-008', name: 'Caio Induscar', type: 'Encarroçadora' }
];

export function SupplierAssignDialog({
  open,
  onOpenChange,
  onSupplierSelected
}: SupplierAssignDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuppliers = MOCK_SUPPLIERS.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (supplierId: string, supplierName: string) => {
    onSupplierSelected(supplierId, supplierName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Selecionar Fornecedor Pagador</DialogTitle>
          <DialogDescription>
            Escolha o fornecedor que será responsável pelo pagamento da comissão
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Buscar fornecedor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <ScrollArea className="h-[400px]">
            {filteredSuppliers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhum fornecedor encontrado
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSuppliers.map(supplier => (
                  <Card
                    key={supplier.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleSelect(supplier.id, supplier.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{supplier.name}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {supplier.type}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
