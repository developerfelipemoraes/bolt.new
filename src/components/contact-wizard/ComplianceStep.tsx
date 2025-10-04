import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { ContactData } from '../../types/contact';
import { formatCPF } from '../../utils/validators';

interface ComplianceStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
}

export default function ComplianceStep({ data, onDataChange }: ComplianceStepProps) {
  const handleInputChange = (field: string, value: string | boolean) => {
    const updatedCompliance = { ...data.compliance, [field]: value };
    onDataChange({ compliance: updatedCompliance });
  };

  const handlePepCpfChange = (value: string) => {
    const formattedCpf = formatCPF(value);
    handleInputChange('pepCpf', formattedCpf);
  };

  return (
    <div className="space-y-6">
      {/* PEP Declaration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Pessoa Exposta Politicamente (PEP)
          </CardTitle>
          <CardDescription>
            Declaração obrigatória sobre exposição política
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Você é uma Pessoa Exposta Politicamente (PEP)?</Label>
            <RadioGroup
              value={data.compliance?.isPep ? 'sim' : 'nao'}
              onValueChange={(value) => handleInputChange('isPep', value === 'sim')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="pep-nao" />
                <Label htmlFor="pep-nao">Não</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="pep-sim" />
                <Label htmlFor="pep-sim">Sim</Label>
              </div>
            </RadioGroup>
          </div>

          {data.compliance?.isPep && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Como PEP, você está sujeito a procedimentos adicionais de compliance e due diligence.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* PEP Relationship */}
      <Card>
        <CardHeader>
          <CardTitle>Relacionamento com PEP</CardTitle>
          <CardDescription>Parentesco ou relacionamento próximo com PEP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Possui relacionamento com PEP?</Label>
            <RadioGroup
              value={data.compliance?.hasPepRelationship ? 'sim' : 'nao'}
              onValueChange={(value) => handleInputChange('hasPepRelationship', value === 'sim')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="rel-pep-nao" />
                <Label htmlFor="rel-pep-nao">Não</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="rel-pep-sim" />
                <Label htmlFor="rel-pep-sim">Sim</Label>
              </div>
            </RadioGroup>
          </div>

          {data.compliance?.hasPepRelationship && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="space-y-2">
                <Label>Nome do PEP</Label>
                <Input
                  value={data.compliance?.pepName || ''}
                  onChange={(e) => handleInputChange('pepName', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label>CPF do PEP</Label>
                <Input
                  value={data.compliance?.pepCpf || ''}
                  onChange={(e) => handlePepCpfChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relationship Purpose */}
      <Card>
        <CardHeader>
          <CardTitle>Propósito do Relacionamento</CardTitle>
          <CardDescription>Finalidade da relação comercial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Propósito do relacionamento comercial</Label>
            <Input
              value={data.compliance?.relationshipPurpose || ''}
              onChange={(e) => handleInputChange('relationshipPurpose', e.target.value)}
              placeholder="Ex: compra de veículo, financiamento, etc."
            />
            <p className="text-xs text-gray-500">
              Descreva brevemente o motivo do relacionamento comercial
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Declarations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Declarações de Compliance
          </CardTitle>
          <CardDescription>
            Aceites obrigatórios para conclusão do cadastro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="authorize"
                checked={data.compliance?.authorizeConsultations || false}
                onCheckedChange={(checked) => handleInputChange('authorizeConsultations', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="authorize" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Autorização para Consultas
                </Label>
                <p className="text-xs text-muted-foreground">
                  Autorizo consultas aos órgãos de proteção ao crédito (SERASA, SPC, SCR-BACEN) para análise de risco.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="declare"
                checked={data.compliance?.declareAccuracy || false}
                onCheckedChange={(checked) => handleInputChange('declareAccuracy', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="declare" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Declaração de Veracidade
                </Label>
                <p className="text-xs text-muted-foreground">
                  Declaro que todas as informações fornecidas são verdadeiras e completas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="update"
                checked={data.compliance?.commitToUpdate || false}
                onCheckedChange={(checked) => handleInputChange('commitToUpdate', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="update" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Compromisso de Atualização
                </Label>
                <p className="text-xs text-muted-foreground">
                  Comprometo-me a comunicar mudanças nos dados em até 10 dias úteis.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="coaf"
                checked={data.compliance?.coafAwareness || false}
                onCheckedChange={(checked) => handleInputChange('coafAwareness', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="coaf" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Ciência sobre COAF
                </Label>
                <p className="text-xs text-muted-foreground">
                  Tenho ciência sobre as normas do Conselho de Controle de Atividades Financeiras (COAF).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Status de Compliance</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Status PEP:</span>
            <span className={`ml-2 font-medium ${data.compliance?.isPep ? 'text-red-600' : 'text-green-600'}`}>
              {data.compliance?.isPep ? 'PEP Declarado' : 'Não PEP'}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600">Relacionamento PEP:</span>
            <span className={`ml-2 font-medium ${data.compliance?.hasPepRelationship ? 'text-yellow-600' : 'text-green-600'}`}>
              {data.compliance?.hasPepRelationship ? 'Sim' : 'Não'}
            </span>
          </div>

          <div className="col-span-2">
            <span className="text-gray-600">Aceites:</span>
            <span className="ml-2 font-medium">
              {[
                data.compliance?.authorizeConsultations,
                data.compliance?.declareAccuracy,
                data.compliance?.commitToUpdate,
                data.compliance?.coafAwareness
              ].filter(Boolean).length} de 4 concluídos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}