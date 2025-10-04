import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { ContactData, brazilianStates } from '../../types/contact';
import { validateEmail, validateCEP, formatCEP, formatPhone } from '../../utils/validators';

interface AddressStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
}

export default function AddressStep({ data, onDataChange }: AddressStepProps) {
  const handleInputChange = (field: string, value: string) => {
    const updatedAddress = { ...data.address, [field]: value };
    onDataChange({ address: updatedAddress });
  };

  const handleCepChange = (value: string) => {
    const formattedCep = formatCEP(value);
    handleInputChange('zipCode', formattedCep);
  };

  const handlePhoneChange = (field: string, value: string) => {
    const formattedPhone = formatPhone(value);
    handleInputChange(field, formattedPhone);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const fileName = `comprovante_residencia_${Date.now()}.pdf`;
    handleInputChange('proofAttachment', fileName);
  };

  const isEmailValid = data.address?.email ? validateEmail(data.address.email) : true;
  const isCepValid = data.address?.zipCode ? validateCEP(data.address.zipCode) : true;

  return (
    <div className="space-y-6">
      {/* Address Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="street">Logradouro *</Label>
          <Input
            id="street"
            value={data.address?.street || ''}
            onChange={(e) => handleInputChange('street', e.target.value)}
            placeholder="Rua, Avenida, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            value={data.address?.number || ''}
            onChange={(e) => handleInputChange('number', e.target.value)}
            placeholder="123"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            value={data.address?.complement || ''}
            onChange={(e) => handleInputChange('complement', e.target.value)}
            placeholder="Apto, Casa, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            value={data.address?.neighborhood || ''}
            onChange={(e) => handleInputChange('neighborhood', e.target.value)}
            placeholder="Nome do bairro"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            value={data.address?.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Nome da cidade"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">UF *</Label>
          <Select
            value={data.address?.state || ''}
            onValueChange={(value) => handleInputChange('state', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a UF" />
            </SelectTrigger>
            <SelectContent>
              {brazilianStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP *</Label>
          <Input
            id="zipCode"
            value={data.address?.zipCode || ''}
            onChange={(e) => handleCepChange(e.target.value)}
            placeholder="12345-678"
            maxLength={9}
            required
            className={!isCepValid ? 'border-red-500' : ''}
          />
          {!isCepValid && data.address?.zipCode && (
            <p className="text-sm text-red-500">CEP inválido</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="font-medium text-blue-900 mb-4">Informações de Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={data.address?.phone || ''}
              onChange={(e) => handlePhoneChange('phone', e.target.value)}
              placeholder="(11) 3456-7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Celular</Label>
            <Input
              id="mobile"
              value={data.address?.mobile || ''}
              onChange={(e) => handlePhoneChange('mobile', e.target.value)}
              placeholder="(11) 98765-4321"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fax">Fax</Label>
            <Input
              id="fax"
              value={data.address?.fax || ''}
              onChange={(e) => handlePhoneChange('fax', e.target.value)}
              placeholder="(11) 3456-7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={data.address?.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="exemplo@email.com"
              className={!isEmailValid ? 'border-red-500' : ''}
            />
            {!isEmailValid && data.address?.email && (
              <p className="text-sm text-red-500">E-mail inválido</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Proof Upload */}
      <div className="border rounded-lg p-4">
        <Label className="font-medium mb-3 block">Comprovante de Endereço</Label>
        
        {data.address?.proofAttachment ? (
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">{data.address.proofAttachment}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleFileUpload}
              >
                Substituir
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleInputChange('proofAttachment', '')}
                className="text-red-600"
              >
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              Anexe conta de luz, água, telefone, etc.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFileUpload}
            >
              Selecionar Arquivo
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
        </p>
      </div>

      {/* Address Summary */}
      {data.address?.street && data.address?.city && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Endereço Completo</h4>
          <div className="text-sm text-green-800">
            <p>
              {data.address.street}
              {data.address.number && `, ${data.address.number}`}
              {data.address.complement && `, ${data.address.complement}`}
            </p>
            {data.address.neighborhood && <p>{data.address.neighborhood}</p>}
            <p>
              {data.address.city} - {data.address.state}
              {data.address.zipCode && ` | CEP: ${data.address.zipCode}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}