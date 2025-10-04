import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { CompanyData, Insurance } from '../../types/company';

interface LicensesStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

export default function LicensesStep({ data, onDataChange }: LicensesStepProps) {
  const handleInputChange = (field: keyof CompanyData, value: string) => {
    onDataChange({ [field]: value });
  };

  const handleInsuranceChange = (index: number, field: keyof Insurance, value: string) => {
    const insurances = [...(data.insurances || [])];
    insurances[index] = { ...insurances[index], [field]: value };
    onDataChange({ insurances });
  };

  const addInsurance = () => {
    const newInsurance: Insurance = {
      type: '',
      number: '',
      validity: '',
      insurer: ''
    };
    onDataChange({ insurances: [...(data.insurances || []), newInsurance] });
  };

  const removeInsurance = (index: number) => {
    const insurances = [...(data.insurances || [])];
    insurances.splice(index, 1);
    onDataChange({ insurances });
  };

  return (
    <div className="space-y-6">
      {/* RNTRC / ANTT */}
      <Card>
        <CardHeader>
          <CardTitle>RNTRC / ANTT</CardTitle>
          <CardDescription>Registro Nacional de Transportadores Rodoviários de Cargas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rntrc">Número RNTRC</Label>
              <Input
                id="rntrc"
                value={data.rntrc || ''}
                onChange={(e) => handleInputChange('rntrc', e.target.value)}
                placeholder="123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rntrcValidity">Validade RNTRC</Label>
              <Input
                id="rntrcValidity"
                type="date"
                value={data.rntrcValidity || ''}
                onChange={(e) => handleInputChange('rntrcValidity', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Licenses */}
      <Card>
        <CardHeader>
          <CardTitle>Outras Licenças</CardTitle>
          <CardDescription>Alvarás e licenças adicionais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operatingLicense">Alvará de Funcionamento</Label>
              <Input
                id="operatingLicense"
                value={data.operatingLicense || ''}
                onChange={(e) => handleInputChange('operatingLicense', e.target.value)}
                placeholder="Número do alvará"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="environmentalLicenses">Licenças Ambientais</Label>
              <Input
                id="environmentalLicenses"
                value={data.environmentalLicenses || ''}
                onChange={(e) => handleInputChange('environmentalLicenses', e.target.value)}
                placeholder="Números das licenças ambientais"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Apólices de Seguro</span>
            <Button onClick={addInsurance} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>RCTR-C, RCF-DC e outros seguros</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.insurances?.map((insurance, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Apólice {index + 1}</h4>
                <Button
                  onClick={() => removeInsurance(index)}
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Seguro</Label>
                  <Input
                    value={insurance.type}
                    onChange={(e) => handleInsuranceChange(index, 'type', e.target.value)}
                    placeholder="RCTR-C, RCF-DC, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Número da Apólice</Label>
                  <Input
                    value={insurance.number}
                    onChange={(e) => handleInsuranceChange(index, 'number', e.target.value)}
                    placeholder="Número da apólice"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vigência</Label>
                  <Input
                    type="date"
                    value={insurance.validity}
                    onChange={(e) => handleInsuranceChange(index, 'validity', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Seguradora</Label>
                  <Input
                    value={insurance.insurer}
                    onChange={(e) => handleInsuranceChange(index, 'insurer', e.target.value)}
                    placeholder="Nome da seguradora"
                  />
                </div>
              </div>
            </div>
          )) || <p className="text-gray-500 text-center py-4">Nenhuma apólice adicionada</p>}
        </CardContent>
      </Card>
    </div>
  );
}