import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { CompanyData } from '../../types/company';

interface DocumentsStepProps {
  data: Partial<CompanyData>;
  onDataChange: (data: Partial<CompanyData>) => void;
}

const documentTypes = [
  { key: 'cnpjCard', label: 'Cartão CNPJ', required: true },
  { key: 'socialContract', label: 'Contrato Social', required: true },
  { key: 'registrations', label: 'IE / IM', required: false },
  { key: 'addressProof', label: 'Comprovante de Endereço', required: true },
  { key: 'clearances', label: 'CNDs (Certidões Negativas)', required: false },
  { key: 'powerOfAttorney', label: 'Procuração', required: false },
  { key: 'digitalCertificate', label: 'Certificado Digital', required: false },
  { key: 'licenses', label: 'RNTRC / Licenças', required: false }
];

export default function DocumentsStep({ data, onDataChange }: DocumentsStepProps) {
  const handleFileChange = (documentKey: string, fileName: string) => {
    const updatedDocuments = {
      ...data.documents,
      [documentKey]: fileName
    };
    onDataChange({ documents: updatedDocuments });
  };

  const handleFileUpload = (documentKey: string) => {
    // Simulate file upload - in real implementation, this would handle actual file upload
    const fileName = `${documentKey}_${Date.now()}.pdf`;
    handleFileChange(documentKey, fileName);
  };

  const removeDocument = (documentKey: string) => {
    const updatedDocuments = { ...data.documents };
    delete updatedDocuments[documentKey as keyof typeof updatedDocuments];
    onDataChange({ documents: updatedDocuments });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documentos da Empresa</CardTitle>
          <CardDescription>
            Faça o upload dos documentos necessários. Arquivos aceitos: PDF, JPG, PNG (máx. 5MB cada)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {documentTypes.map((docType) => {
            const hasFile = data.documents?.[docType.key as keyof typeof data.documents];
            
            return (
              <div key={docType.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">
                      {docType.label}
                      {docType.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {hasFile && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>

                {hasFile ? (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">{hasFile}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFileUpload(docType.key)}
                      >
                        Substituir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeDocument(docType.key)}
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
                      onClick={() => handleFileUpload(docType.key)}
                    >
                      Selecionar Arquivo
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informações Importantes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Documentos obrigatórios são necessários para completar o cadastro</li>
              <li>• Certifique-se de que os documentos estão legíveis e atualizados</li>
              <li>• Formatos aceitos: PDF, JPG, PNG</li>
              <li>• Tamanho máximo por arquivo: 5MB</li>
              <li>• Os documentos serão verificados pela nossa equipe</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}