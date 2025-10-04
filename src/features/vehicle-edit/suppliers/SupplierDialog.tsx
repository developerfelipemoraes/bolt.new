import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Supplier, SupplierType } from '../types/supplier';
import { validateDocument, formatDocument } from '../lib/doc';
import { toast } from 'sonner';

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (supplier: Supplier) => void;
  supplier?: Supplier | null;
}

export function SupplierDialog({ open, onOpenChange, onSave, supplier }: SupplierDialogProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>(
    supplier || {
      type: 'company',
      name: '',
      document: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  );

  React.useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    }
  }, [supplier]);

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!formData.document?.trim()) {
      toast.error('Documento (CPF/CNPJ) é obrigatório');
      return;
    }

    if (!validateDocument(formData.document)) {
      toast.error('Documento inválido');
      return;
    }

    const supplierToSave: Supplier = {
      id: formData.id || `supplier-${Date.now()}`,
      type: formData.type || 'company',
      name: formData.name,
      document: formData.document,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      updatedAt: new Date().toISOString()
    };

    if (!formData.id) {
      supplierToSave.createdAt = new Date().toISOString();
    }

    onSave(supplierToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do fornecedor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: SupplierType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Empresa (PJ)</SelectItem>
                  <SelectItem value="individual">Pessoa Física (PF)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="document">
                {formData.type === 'company' ? 'CNPJ' : 'CPF'}
              </Label>
              <Input
                id="document"
                value={formData.document}
                onChange={(e) =>
                  setFormData({ ...formData, document: e.target.value })
                }
                onBlur={(e) =>
                  setFormData({ ...formData, document: formatDocument(e.target.value) })
                }
                placeholder={formData.type === 'company' ? '00.000.000/0000-00' : '000.000.000-00'}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nome / Razão Social</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                maxLength={2}
                placeholder="SP"
              />
            </div>

            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
