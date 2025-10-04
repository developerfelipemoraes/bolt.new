import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { CompanyData, Shareholder, Administrator, Attorney, RelatedCompany } from '../../types/company';

interface CorporateStructureStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

export default function CorporateStructureStep({ data, onDataChange }: CorporateStructureStepProps) {
  const handleInputChange = (field: keyof CompanyData, value: string) => {
    onDataChange({ [field]: value });
  };

  // Shareholders management
  const handleShareholderChange = (index: number, field: keyof Shareholder, value: string | number) => {
    const shareholders = [...(data.finalBeneficiaries || [])];
    shareholders[index] = { ...shareholders[index], [field]: value };
    onDataChange({ finalBeneficiaries: shareholders });
  };

  const addShareholder = () => {
    const newShareholder: Shareholder = { name: '', cpf: '', percentage: 0 };
    onDataChange({ finalBeneficiaries: [...(data.finalBeneficiaries || []), newShareholder] });
  };

  const removeShareholder = (index: number) => {
    const shareholders = [...(data.finalBeneficiaries || [])];
    shareholders.splice(index, 1);
    onDataChange({ finalBeneficiaries: shareholders });
  };

  // Administrators management
  const handleAdministratorChange = (index: number, field: keyof Administrator, value: string) => {
    const administrators = [...(data.administrators || [])];
    administrators[index] = { ...administrators[index], [field]: value };
    onDataChange({ administrators });
  };

  const addAdministrator = () => {
    const newAdmin: Administrator = { name: '', cpf: '', instrument: '', date: '' };
    onDataChange({ administrators: [...(data.administrators || []), newAdmin] });
  };

  const removeAdministrator = (index: number) => {
    const administrators = [...(data.administrators || [])];
    administrators.splice(index, 1);
    onDataChange({ administrators });
  };

  // Attorneys management
  const handleAttorneyChange = (index: number, field: keyof Attorney, value: string) => {
    const attorneys = [...(data.attorneys || [])];
    attorneys[index] = { ...attorneys[index], [field]: value };
    onDataChange({ attorneys });
  };

  const addAttorney = () => {
    const newAttorney: Attorney = { name: '', cpf: '', powers: '', expirationDate: '' };
    onDataChange({ attorneys: [...(data.attorneys || []), newAttorney] });
  };

  const removeAttorney = (index: number) => {
    const attorneys = [...(data.attorneys || [])];
    attorneys.splice(index, 1);
    onDataChange({ attorneys });
  };

  // Related companies management
  const handleRelatedCompanyChange = (index: number, field: keyof RelatedCompany, value: string | number) => {
    const companies = [...(data.relatedCompanies || [])];
    companies[index] = { ...companies[index], [field]: value };
    onDataChange({ relatedCompanies: companies });
  };

  const addRelatedCompany = () => {
    const newCompany: RelatedCompany = { companyName: '', cnpj: '', participationPercentage: 0 };
    onDataChange({ relatedCompanies: [...(data.relatedCompanies || []), newCompany] });
  };

  const removeRelatedCompany = (index: number) => {
    const companies = [...(data.relatedCompanies || [])];
    companies.splice(index, 1);
    onDataChange({ relatedCompanies: companies });
  };

  return (
    <div className="space-y-6">
      {/* Control */}
      <Card>
        <CardHeader>
          <CardTitle>Controle Societário</CardTitle>
          <CardDescription>Informações sobre o controle da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Controle</Label>
              <Select
                value={data.control || ''}
                onValueChange={(value: 'national' | 'foreign') => handleInputChange('control', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">Nacional</SelectItem>
                  <SelectItem value="foreign">Estrangeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {data.control === 'foreign' && (
              <div className="space-y-2">
                <Label>País</Label>
                <Input
                  value={data.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="País de origem"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Beneficiários Finais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Beneficiários Finais (+25%)</span>
            <Button onClick={addShareholder} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>Pessoas com participação superior a 25%</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.finalBeneficiaries?.map((shareholder, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Sócio {index + 1}</h4>
                <Button
                  onClick={() => removeShareholder(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={shareholder.name}
                    onChange={(e) => handleShareholderChange(index, 'name', e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input
                    value={shareholder.cpf}
                    onChange={(e) => handleShareholderChange(index, 'cpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Participação (%)</Label>
                  <Input
                    type="number"
                    value={shareholder.percentage}
                    onChange={(e) => handleShareholderChange(index, 'percentage', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )) || <p className="text-gray-500 text-center py-4">Nenhum beneficiário adicionado</p>}
        </CardContent>
      </Card>

      {/* Administradores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Administradores</span>
            <Button onClick={addAdministrator} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>Pessoas com poderes de administração</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.administrators?.map((admin, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Administrador {index + 1}</h4>
                <Button
                  onClick={() => removeAdministrator(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={admin.name}
                    onChange={(e) => handleAdministratorChange(index, 'name', e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input
                    value={admin.cpf}
                    onChange={(e) => handleAdministratorChange(index, 'cpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Instrumento</Label>
                  <Input
                    value={admin.instrument}
                    onChange={(e) => handleAdministratorChange(index, 'instrument', e.target.value)}
                    placeholder="Contrato Social, Procuração, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={admin.date}
                    onChange={(e) => handleAdministratorChange(index, 'date', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )) || <p className="text-gray-500 text-center py-4">Nenhum administrador adicionado</p>}
        </CardContent>
      </Card>

      {/* Procuradores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Procuradores</span>
            <Button onClick={addAttorney} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>Pessoas com procuração</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.attorneys?.map((attorney, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Procurador {index + 1}</h4>
                <Button
                  onClick={() => removeAttorney(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={attorney.name}
                    onChange={(e) => handleAttorneyChange(index, 'name', e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input
                    value={attorney.cpf}
                    onChange={(e) => handleAttorneyChange(index, 'cpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Poderes</Label>
                  <Input
                    value={attorney.powers}
                    onChange={(e) => handleAttorneyChange(index, 'powers', e.target.value)}
                    placeholder="Descrição dos poderes"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vencimento</Label>
                  <Input
                    type="date"
                    value={attorney.expirationDate}
                    onChange={(e) => handleAttorneyChange(index, 'expirationDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )) || <p className="text-gray-500 text-center py-4">Nenhum procurador adicionado</p>}
        </CardContent>
      </Card>

      {/* Empresas Relacionadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Controladoras / Coligadas</span>
            <Button onClick={addRelatedCompany} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>Empresas relacionadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.relatedCompanies?.map((company, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Empresa {index + 1}</h4>
                <Button
                  onClick={() => removeRelatedCompany(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Razão Social</Label>
                  <Input
                    value={company.companyName}
                    onChange={(e) => handleRelatedCompanyChange(index, 'companyName', e.target.value)}
                    placeholder="Nome da empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input
                    value={company.cnpj}
                    onChange={(e) => handleRelatedCompanyChange(index, 'cnpj', e.target.value)}
                    placeholder="XX.XXX.XXX/XXXX-XX"
                  />
                </div>

                <div className="space-y-2">
                  <Label>% Participação</Label>
                  <Input
                    type="number"
                    value={company.participationPercentage}
                    onChange={(e) => handleRelatedCompanyChange(index, 'participationPercentage', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )) || <p className="text-gray-500 text-center py-4">Nenhuma empresa relacionada adicionada</p>}
        </CardContent>
      </Card>
    </div>
  );
}