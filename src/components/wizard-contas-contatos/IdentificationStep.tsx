import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyData } from '../../types/company';

interface IdentificationStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

export default function IdentificationStep({ data, onDataChange }: IdentificationStepProps) {
  const handleInputChange = (field: keyof CompanyData, value: string) => {
    onDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="corporateName">Razão Social *</Label>
          <Input
            id="corporateName"
            value={data.corporateName || ''}
            onChange={(e) => handleInputChange('corporateName', e.target.value)}
            placeholder="Digite a razão social"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradeName">Nome Fantasia *</Label>
          <Input
            id="tradeName"
            value={data.tradeName || ''}
            onChange={(e) => handleInputChange('tradeName', e.target.value)}
            placeholder="Digite o nome fantasia"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ *</Label>
          <Input
            id="cnpj"
            value={data.cnpj || ''}
            onChange={(e) => handleInputChange('cnpj', e.target.value)}
            placeholder="XX.XXX.XXX/XXXX-XX"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nire">NIRE / Junta Comercial</Label>
          <Input
            id="nire"
            value={data.nire || ''}
            onChange={(e) => handleInputChange('nire', e.target.value)}
            placeholder="Digite o NIRE"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stateRegistration">Inscrição Estadual (IE)</Label>
          <Input
            id="stateRegistration"
            value={data.stateRegistration || ''}
            onChange={(e) => handleInputChange('stateRegistration', e.target.value)}
            placeholder="Digite a IE"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipalRegistration">Inscrição Municipal (IM)</Label>
          <Input
            id="municipalRegistration"
            value={data.municipalRegistration || ''}
            onChange={(e) => handleInputChange('municipalRegistration', e.target.value)}
            placeholder="Digite a IM"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryCnae">CNAE Principal</Label>
          <Input
            id="primaryCnae"
            value={data.primaryCnae || ''}
            onChange={(e) => handleInputChange('primaryCnae', e.target.value)}
            placeholder="Ex: 4930-2/02"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalNature">Natureza Jurídica</Label>
          <Input
            id="legalNature"
            value={data.legalNature || ''}
            onChange={(e) => handleInputChange('legalNature', e.target.value)}
            placeholder="Ex: Sociedade Empresária Limitada"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize">Porte</Label>
          <Select 
            value={data.companySize || ''} 
            onValueChange={(value) => handleInputChange('companySize', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o porte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEI">MEI</SelectItem>
              <SelectItem value="ME">ME - Microempresa</SelectItem>
              <SelectItem value="EPP">EPP - Empresa de Pequeno Porte</SelectItem>
              <SelectItem value="Others">Demais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxRegime">Regime Tributário</Label>
          <Select 
            value={data.taxRegime || ''} 
            onValueChange={(value) => handleInputChange('taxRegime', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o regime" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Simples">Simples Nacional</SelectItem>
              <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
              <SelectItem value="Lucro Real">Lucro Real</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="incorporationDate">Data de Constituição</Label>
          <Input
            id="incorporationDate"
            type="date"
            value={data.incorporationDate || ''}
            onChange={(e) => handleInputChange('incorporationDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}