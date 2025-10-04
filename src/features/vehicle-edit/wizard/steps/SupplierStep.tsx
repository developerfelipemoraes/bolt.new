import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleAlert as AlertCircle } from 'lucide-react';
import { SupplierSelector } from '../../suppliers/SupplierSelector';
import { SupplierLink } from '../../types/supplier';

interface SupplierStepProps {
  supplier?: SupplierLink | null;
  onChange: (supplier: SupplierLink | null) => void;
  required?: boolean;
  mode?: 'create' | 'edit';
}

export function SupplierStep({ supplier, onChange, required = false, mode = 'create' }: SupplierStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fornecedor do Veículo</CardTitle>
          <CardDescription>
            {mode === 'create'
              ? 'Selecione ou cadastre um fornecedor para este veículo'
              : 'Atualize o fornecedor vinculado a este veículo'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {required && !supplier && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                É obrigatório vincular um fornecedor antes de prosseguir
              </AlertDescription>
            </Alert>
          )}

          <SupplierSelector
            value={supplier}
            onChange={onChange}
            required={required}
          />
        </CardContent>
      </Card>

      {!required && (
        <Alert>
          <AlertDescription>
            O fornecedor é opcional. Você pode definir ou alterar o fornecedor a qualquer momento.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
