import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building2 } from 'lucide-react';

interface ContactResult {
  id: string;
  name: string;
  type: 'company' | 'contact';
  document: string;
  phone?: string;
  email?: string;
}

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contact: ContactResult) => void;
}

export function ContactDialog({ open, onOpenChange, onSave }: ContactDialogProps) {
  const [contactType, setContactType] = useState<'company' | 'contact'>('contact');
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateDocument = (doc: string, type: 'company' | 'contact'): boolean => {
    const cleaned = doc.replace(/\D/g, '');
    if (type === 'company') {
      return cleaned.length === 14;
    }
    return cleaned.length === 11;
  };

  const formatCNPJ = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
  };

  const formatCPF = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  };

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.document.trim()) {
      newErrors.document = contactType === 'company' ? 'CNPJ é obrigatório' : 'CPF é obrigatório';
    } else if (!validateDocument(formData.document, contactType)) {
      newErrors.document = contactType === 'company'
        ? 'CNPJ inválido (deve ter 14 dígitos)'
        : 'CPF inválido (deve ter 11 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newContact: ContactResult = {
      id: `${contactType}_${Date.now()}`,
      name: formData.name,
      type: contactType,
      document: formData.document,
      email: formData.email || undefined,
      phone: formData.phone || undefined
    };

    onSave(newContact);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      document: '',
      email: '',
      phone: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Cadastrar Novo Participante
          </DialogTitle>
          <DialogDescription>
            Cadastre uma nova Conta ou Contato para participar da comissão
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <RadioGroup
              value={contactType}
              onValueChange={(v) => {
                setContactType(v as 'company' | 'contact');
                setFormData(prev => ({ ...prev, document: '' }));
                setErrors({});
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="type_company" />
                <Label htmlFor="type_company" className="cursor-pointer">
                  <Building2 className="inline h-4 w-4 mr-1" />
                  Empresa (Conta)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contact" id="type_contact" />
                <Label htmlFor="type_contact" className="cursor-pointer">
                  <User className="inline h-4 w-4 mr-1" />
                  Pessoa (Contato)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              {contactType === 'company' ? 'Razão Social' : 'Nome Completo'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={contactType === 'company' ? 'Ex: Empresa XYZ Ltda' : 'Ex: Maria Silva'}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">
              {contactType === 'company' ? 'CNPJ' : 'CPF'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="document"
              value={formData.document}
              onChange={(e) => handleChange('document', contactType === 'company' ? formatCNPJ(e.target.value) : formatCPF(e.target.value))}
              placeholder={contactType === 'company' ? '00.000.000/0000-00' : '000.000.000-00'}
              maxLength={contactType === 'company' ? 18 : 14}
            />
            {errors.document && (
              <p className="text-sm text-red-500">{errors.document}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
