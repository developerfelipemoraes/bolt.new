import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CompanyData, Address } from '../../types/company';

interface AddressesStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

export default function AddressesStep({ data, onDataChange }: AddressesStepProps) {
  const [useSameAddress, setUseSameAddress] = React.useState(false);

  const handleAddressChange = (addressType: 'commercialAddress' | 'billingAddress' | 'deliveryAddress', field: keyof Address, value: string) => {
    const currentAddress = data[addressType] || {} as Address;
    const updatedAddress = { ...currentAddress, [field]: value };
    onDataChange({ [addressType]: updatedAddress });
  };

  const handleSameAddressToggle = (checked: boolean) => {
    setUseSameAddress(checked);
    if (checked && data.commercialAddress) {
      onDataChange({ billingAddress: { ...data.commercialAddress } });
    }
  };

  const renderAddressFields = (
    addressType: 'commercialAddress' | 'billingAddress' | 'deliveryAddress',
    address: Address | undefined,
    required: boolean = false
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 space-y-2">
        <Label>Logradouro {required && '*'}</Label>
        <Input
          value={address?.street || ''}
          onChange={(e) => handleAddressChange(addressType, 'street', e.target.value)}
          placeholder="Rua, Avenida, etc."
          required={required}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Número</Label>
        <Input
          value={address?.number || ''}
          onChange={(e) => handleAddressChange(addressType, 'number', e.target.value)}
          placeholder="123"
        />
      </div>

      <div className="space-y-2">
        <Label>Complemento</Label>
        <Input
          value={address?.complement || ''}
          onChange={(e) => handleAddressChange(addressType, 'complement', e.target.value)}
          placeholder="Sala, Andar, etc."
        />
      </div>

      <div className="space-y-2">
        <Label>Bairro</Label>
        <Input
          value={address?.neighborhood || ''}
          onChange={(e) => handleAddressChange(addressType, 'neighborhood', e.target.value)}
          placeholder="Nome do bairro"
        />
      </div>

      <div className="space-y-2">
        <Label>Cidade {required && '*'}</Label>
        <Input
          value={address?.city || ''}
          onChange={(e) => handleAddressChange(addressType, 'city', e.target.value)}
          placeholder="Nome da cidade"
          required={required}
        />
      </div>

      <div className="space-y-2">
        <Label>UF {required && '*'}</Label>
        <Input
          value={address?.state || ''}
          onChange={(e) => handleAddressChange(addressType, 'state', e.target.value)}
          placeholder="SP"
          maxLength={2}
          required={required}
        />
      </div>

      <div className="space-y-2">
        <Label>CEP {required && '*'}</Label>
        <Input
          value={address?.zipCode || ''}
          onChange={(e) => handleAddressChange(addressType, 'zipCode', e.target.value)}
          placeholder="12345-678"
          required={required}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Commercial Address */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço Comercial</CardTitle>
          <CardDescription>Endereço principal da empresa (obrigatório)</CardDescription>
        </CardHeader>
        <CardContent>
          {renderAddressFields('commercialAddress', data.commercialAddress, true)}
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Cobrança</CardTitle>
          <CardDescription>Endereço para correspondência e cobrança (opcional)</CardDescription>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAddress"
              checked={useSameAddress}
              onCheckedChange={handleSameAddressToggle}
            />
            <Label htmlFor="sameAddress">Mesmo endereço comercial</Label>
          </div>
        </CardHeader>
        <CardContent>
          {!useSameAddress && renderAddressFields('billingAddress', data.billingAddress)}
          {useSameAddress && (
            <p className="text-sm text-gray-500">Usando o mesmo endereço comercial</p>
          )}
        </CardContent>
      </Card>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Entrega / Logística</CardTitle>
          <CardDescription>Endereço para entregas e operações logísticas (opcional)</CardDescription>
        </CardHeader>
        <CardContent>
          {renderAddressFields('deliveryAddress', data.deliveryAddress)}
        </CardContent>
      </Card>
    </div>
  );
}