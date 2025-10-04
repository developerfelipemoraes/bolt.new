import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyData } from '../../types/company';

interface ComplianceStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

export default function ComplianceStep({ data, onDataChange }: ComplianceStepProps) {
  const handleInputChange = (field: keyof CompanyData, value: string | boolean) => {
    onDataChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* PEP Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações PEP</CardTitle>
          <CardDescription>Pessoa Exposta Politicamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPep"
                checked={data.isPep || false}
                onCheckedChange={(checked) => handleInputChange('isPep', checked as boolean)}
              />
              <Label htmlFor="isPep">A empresa é considerada PEP?</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pepRelationship"
                checked={data.pepRelationship || false}
                onCheckedChange={(checked) => handleInputChange('pepRelationship', checked as boolean)}
              />
              <Label htmlFor="pepRelationship">Possui relacionamento com PEP?</Label>
            </div>

            {(data.isPep || data.pepRelationship) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="pepName">Nome do PEP</Label>
                  <Input
                    id="pepName"
                    value={data.pepName || ''}
                    onChange={(e) => handleInputChange('pepName', e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pepCpf">CPF do PEP</Label>
                  <Input
                    id="pepCpf"
                    value={data.pepCpf || ''}
                    onChange={(e) => handleInputChange('pepCpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* LGPD */}
      <Card>
        <CardHeader>
          <CardTitle>LGPD - Lei Geral de Proteção de Dados</CardTitle>
          <CardDescription>Informações sobre proteção de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dpoName">Encarregado / DPO - Nome</Label>
              <Input
                id="dpoName"
                value={data.dpoName || ''}
                onChange={(e) => handleInputChange('dpoName', e.target.value)}
                placeholder="Nome do Data Protection Officer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dpoEmail">Encarregado / DPO - E-mail</Label>
              <Input
                id="dpoEmail"
                type="email"
                value={data.dpoEmail || ''}
                onChange={(e) => handleInputChange('dpoEmail', e.target.value)}
                placeholder="dpo@empresa.com.br"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="legalBasis">Base Legal</Label>
              <Input
                id="legalBasis"
                value={data.legalBasis || ''}
                onChange={(e) => handleInputChange('legalBasis', e.target.value)}
                placeholder="Ex: execução de contrato, interesse legítimo, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consents */}
      <Card>
        <CardHeader>
          <CardTitle>Consentimentos</CardTitle>
          <CardDescription>Autorizações para tratamento de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="communicationConsent"
                checked={data.communicationConsent || false}
                onCheckedChange={(checked) => handleInputChange('communicationConsent', checked as boolean)}
              />
              <Label htmlFor="communicationConsent">
                Autorizo o recebimento de comunicações comerciais
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sharingConsent"
                checked={data.sharingConsent || false}
                onCheckedChange={(checked) => handleInputChange('sharingConsent', checked as boolean)}
              />
              <Label htmlFor="sharingConsent">
                Autorizo o compartilhamento de dados com parceiros comerciais
              </Label>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Os consentimentos podem ser revogados a qualquer momento 
              através do canal oficial da empresa. O tratamento de dados seguirá as diretrizes 
              da LGPD e nossa política de privacidade.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}