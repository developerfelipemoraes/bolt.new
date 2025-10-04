import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { ContactData, brazilianStates } from '../../types/contact';
import { formatCEP, formatPhone } from '../../utils/validators';

interface ProfessionalStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
}

export default function ProfessionalStep({ data, onDataChange }: ProfessionalStepProps) {
  const handleInputChange = (field: string, value: string) => {
    const updatedProfessional = { ...data.professional, [field]: value };
    onDataChange({ professional: updatedProfessional });
  };

  const handleCepChange = (value: string) => {
    const formattedCep = formatCEP(value);
    handleInputChange('companyZipCode', formattedCep);
  };

  const handlePhoneChange = (field: string, value: string) => {
    const formattedPhone = formatPhone(value);
    handleInputChange(field, formattedPhone);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const fileName = `comprovante_renda_${Date.now()}.pdf`;
    handleInputChange('incomeProof', fileName);
  };

  return (
    <div className="space-y-6">
      {/* Professional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="education">Formação/Profissão</Label>
          <Input
            id="education"
            value={data.professional?.education || ''}
            onChange={(e) => handleInputChange('education', e.target.value)}
            placeholder="Ex: Engenharia Civil, Administração, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Ocupação/Ramo de Atuação</Label>
          <Input
            id="occupation"
            value={data.professional?.occupation || ''}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            placeholder="Ex: Engenheiro, Gerente, Autônomo, etc."
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            value={data.professional?.company || ''}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Nome da empresa onde trabalha"
          />
        </div>
      </div>

      {/* Company Address */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-4">Endereço da Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="companyStreet">Logradouro</Label>
            <Input
              id="companyStreet"
              value={data.professional?.companyStreet || ''}
              onChange={(e) => handleInputChange('companyStreet', e.target.value)}
              placeholder="Rua, Avenida, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyNumber">Número</Label>
            <Input
              id="companyNumber"
              value={data.professional?.companyNumber || ''}
              onChange={(e) => handleInputChange('companyNumber', e.target.value)}
              placeholder="123"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyNeighborhood">Bairro</Label>
            <Input
              id="companyNeighborhood"
              value={data.professional?.companyNeighborhood || ''}
              onChange={(e) => handleInputChange('companyNeighborhood', e.target.value)}
              placeholder="Nome do bairro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyCity">Cidade</Label>
            <Input
              id="companyCity"
              value={data.professional?.companyCity || ''}
              onChange={(e) => handleInputChange('companyCity', e.target.value)}
              placeholder="Nome da cidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyState">UF</Label>
            <Select
              value={data.professional?.companyState || ''}
              onValueChange={(value) => handleInputChange('companyState', value)}
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
            <Label htmlFor="companyZipCode">CEP</Label>
            <Input
              id="companyZipCode"
              value={data.professional?.companyZipCode || ''}
              onChange={(e) => handleCepChange(e.target.value)}
              placeholder="12345-678"
              maxLength={9}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPhone">Telefone</Label>
            <Input
              id="companyPhone"
              value={data.professional?.companyPhone || ''}
              onChange={(e) => handlePhoneChange('companyPhone', e.target.value)}
              placeholder="(11) 3456-7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyMobile">Celular</Label>
            <Input
              id="companyMobile"
              value={data.professional?.companyMobile || ''}
              onChange={(e) => handlePhoneChange('companyMobile', e.target.value)}
              placeholder="(11) 98765-4321"
            />
          </div>
        </div>
      </div>

      {/* Income Proof Upload */}
      <div className="border rounded-lg p-4">
        <Label className="font-medium mb-3 block">Comprovante de Renda</Label>
        
        {data.professional?.incomeProof ? (
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">{data.professional.incomeProof}</span>
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
                onClick={() => handleInputChange('incomeProof', '')}
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
              Anexe holerite, declaração de renda, etc.
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

      {/* Professional Summary */}
      {data.professional?.occupation && data.professional?.company && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Resumo Profissional</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Ocupação:</strong> {data.professional.occupation}</p>
            <p><strong>Empresa:</strong> {data.professional.company}</p>
            {data.professional.education && (
              <p><strong>Formação:</strong> {data.professional.education}</p>
            )}
            {data.professional.companyCity && data.professional.companyState && (
              <p><strong>Local:</strong> {data.professional.companyCity} - {data.professional.companyState}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}