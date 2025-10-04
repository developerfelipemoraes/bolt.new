import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Building, AtSign } from 'lucide-react';
import { ContactData } from '../../types/contact';

interface CorrespondenceStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
}

export default function CorrespondenceStep({ data, onDataChange }: CorrespondenceStepProps) {
  const handlePreferenceChange = (value: string) => {
    const updatedCorrespondence = { ...data.correspondence, type: value };
    onDataChange({ correspondence: updatedCorrespondence });
  };

  const getPreviewAddress = (type: string) => {
    switch (type) {
      case 'Residencial':
        if (data.address?.street && data.address?.city) {
          return `${data.address.street}${data.address.number ? `, ${data.address.number}` : ''}, ${data.address.city} - ${data.address.state}`;
        }
        return 'Endereço residencial não informado';
      
      case 'Comercial':
        if (data.professional?.companyStreet && data.professional?.companyCity) {
          return `${data.professional.companyStreet}${data.professional.companyNumber ? `, ${data.professional.companyNumber}` : ''}, ${data.professional.companyCity} - ${data.professional.companyState}`;
        }
        return 'Endereço comercial não informado';
      
      case 'E-mail':
        return data.address?.email || 'E-mail não informado';
      
      default:
        return 'Selecione uma opção';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Preferência para Correspondência</h3>
        <p className="text-sm text-gray-600">
          Escolha como você prefere receber correspondências e documentos
        </p>
      </div>

      <RadioGroup
        value={data.correspondence?.type || ''}
        onValueChange={handlePreferenceChange}
        className="space-y-4"
      >
        {/* Residential Option */}
        <Card className={`cursor-pointer transition-colors ${
          data.correspondence?.type === 'Residencial' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Residencial" id="residential" />
              <Mail className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <CardTitle className="text-base">Endereço Residencial</CardTitle>
                <CardDescription>Receber no endereço de residência</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="ml-8 text-sm text-gray-600">
              {getPreviewAddress('Residencial')}
            </div>
          </CardContent>
        </Card>

        {/* Commercial Option */}
        <Card className={`cursor-pointer transition-colors ${
          data.correspondence?.type === 'Comercial' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Comercial" id="commercial" />
              <Building className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <CardTitle className="text-base">Endereço Comercial</CardTitle>
                <CardDescription>Receber no endereço da empresa</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="ml-8 text-sm text-gray-600">
              {getPreviewAddress('Comercial')}
            </div>
          </CardContent>
        </Card>

        {/* Email Option */}
        <Card className={`cursor-pointer transition-colors ${
          data.correspondence?.type === 'E-mail' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="E-mail" id="email" />
              <AtSign className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <CardTitle className="text-base">E-mail</CardTitle>
                <CardDescription>Receber correspondências por e-mail</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="ml-8 text-sm text-gray-600">
              {getPreviewAddress('E-mail')}
            </div>
          </CardContent>
        </Card>
      </RadioGroup>

      {/* Current Selection Summary */}
      {data.correspondence?.type && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Preferência Selecionada</h4>
          <div className="text-sm text-green-800">
            <p><strong>Tipo:</strong> {data.correspondence.type}</p>
            <p><strong>Endereço:</strong> {getPreviewAddress(data.correspondence.type)}</p>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Informações Importantes</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Você pode alterar sua preferência a qualquer momento</li>
          <li>• Certifique-se de que o endereço escolhido está correto</li>
          <li>• Documentos importantes sempre serão enviados com aviso de recebimento</li>
          <li>• Para e-mail, verifique regularmente sua caixa de spam</li>
        </ul>
      </div>
    </div>
  );
}