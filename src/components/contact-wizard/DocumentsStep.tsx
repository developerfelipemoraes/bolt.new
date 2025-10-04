import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { ContactData, brazilianStates } from '../../types/contact';

interface DocumentsStepProps {
  data: Partial<ContactData>;
  onDataChange: (data: Partial<ContactData>) => void;
}

export default function DocumentsStep({ data, onDataChange }: DocumentsStepProps) {
  const handleInputChange = (field: string, value: string) => {
    const updatedDocuments = { ...data.documents, [field]: value };
    onDataChange({ documents: updatedDocuments });
  };

  const handleFileUpload = (fieldName: string) => {
    // Simulate file upload - in real implementation, this would handle actual file upload
    const fileName = `${fieldName}_${Date.now()}.pdf`;
    handleInputChange(fieldName, fileName);
  };

  const isDateValid = (issueDate: string, expirationDate: string): boolean => {
    if (!issueDate || !expirationDate) return true;
    return new Date(issueDate) <= new Date(expirationDate);
  };

  const isIssueDateValid = (issueDate: string): boolean => {
    if (!issueDate) return true;
    return new Date(issueDate) <= new Date();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentType">Tipo do Documento</Label>
          <Select
            value={data.documents?.type || ''}
            onValueChange={(value) => handleInputChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RG">RG - Registro Geral</SelectItem>
              <SelectItem value="CNH">CNH - Carteira de Habilitação</SelectItem>
              <SelectItem value="RNE">RNE - Registro Nacional de Estrangeiro</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentNumber">Número</Label>
          <Input
            id="documentNumber"
            value={data.documents?.number || ''}
            onChange={(e) => handleInputChange('number', e.target.value)}
            placeholder="Número do documento"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="issuer">Órgão Emissor</Label>
          <Input
            id="issuer"
            value={data.documents?.issuer || ''}
            onChange={(e) => handleInputChange('issuer', e.target.value)}
            placeholder="Ex: SSP, DETRAN, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="issuerState">UF Emissor</Label>
          <Select
            value={data.documents?.issuerState || ''}
            onValueChange={(value) => handleInputChange('issuerState', value)}
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
          <Label htmlFor="issueDate">Data de Emissão</Label>
          <Input
            id="issueDate"
            type="date"
            value={data.documents?.issueDate || ''}
            onChange={(e) => handleInputChange('issueDate', e.target.value)}
            className={!isIssueDateValid(data.documents?.issueDate || '') ? 'border-red-500' : ''}
          />
          {!isIssueDateValid(data.documents?.issueDate || '') && (
            <p className="text-sm text-red-500">Data de emissão não pode ser futura</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Data de Validade</Label>
          <Input
            id="expirationDate"
            type="date"
            value={data.documents?.expirationDate || ''}
            onChange={(e) => handleInputChange('expirationDate', e.target.value)}
            className={!isDateValid(data.documents?.issueDate || '', data.documents?.expirationDate || '') ? 'border-red-500' : ''}
          />
          {!isDateValid(data.documents?.issueDate || '', data.documents?.expirationDate || '') && (
            <p className="text-sm text-red-500">Data de validade deve ser posterior à emissão</p>
          )}
        </div>
      </div>

      {/* Document Upload */}
      <div className="border rounded-lg p-4">
        <Label className="font-medium mb-3 block">Anexo de Identidade</Label>
        
        {data.documents?.attachmentName ? (
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">{data.documents.attachmentName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleFileUpload('attachmentName')}
              >
                Substituir
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleInputChange('attachmentName', '')}
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
              Clique para fazer upload ou arraste o arquivo aqui
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleFileUpload('attachmentName')}
            >
              Selecionar Arquivo
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
        </p>
      </div>

      {/* Document Summary */}
      {data.documents?.type && data.documents?.number && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Resumo do Documento</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Tipo:</strong> {data.documents.type}</p>
            <p><strong>Número:</strong> {data.documents.number}</p>
            {data.documents.issuer && (
              <p><strong>Emissor:</strong> {data.documents.issuer}/{data.documents.issuerState}</p>
            )}
            {data.documents.issueDate && (
              <p><strong>Emissão:</strong> {new Date(data.documents.issueDate).toLocaleDateString('pt-BR')}</p>
            )}
            {data.documents.expirationDate && (
              <p><strong>Validade:</strong> {new Date(data.documents.expirationDate).toLocaleDateString('pt-BR')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}