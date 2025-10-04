import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Plus, X, Building2, User } from 'lucide-react';
import { Supplier, SupplierLink } from '../types/supplier';
import { getAllSuppliers, saveSupplier, searchSuppliers } from '../services/localSupplierRepo';
import { SupplierDialog } from './SupplierDialog';
import { formatDocument } from '../lib/doc';

interface SupplierSelectorProps {
  value?: SupplierLink | null;
  onChange: (supplier: SupplierLink | null) => void;
  required?: boolean;
}

export function SupplierSelector({ value, onChange, required }: SupplierSelectorProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = () => {
    const all = getAllSuppliers();
    setSuppliers(all);
  };

  const filteredSuppliers = searchQuery
    ? searchSuppliers(searchQuery)
    : suppliers;

  const handleSelectSupplier = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      const link: SupplierLink = {
        supplierId: supplier.id,
        type: supplier.type,
        name: supplier.name,
        document: supplier.document,
        email: supplier.email,
        phone: supplier.phone
      };
      onChange(link);
    }
  };

  const handleSaveSupplier = (supplier: Supplier) => {
    saveSupplier(supplier);
    loadSuppliers();

    const link: SupplierLink = {
      supplierId: supplier.id,
      type: supplier.type,
      name: supplier.name,
      document: supplier.document,
      email: supplier.email,
      phone: supplier.phone
    };
    onChange(link);
  };

  const handleClearSupplier = () => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          Fornecedor {required && <span className="text-red-500">*</span>}
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedSupplier(null);
            setShowDialog(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      {value ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {value.type === 'company' ? (
                  <Building2 className="w-5 h-5 text-blue-600 mt-1" />
                ) : (
                  <User className="w-5 h-5 text-green-600 mt-1" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{value.name}</p>
                    <Badge variant="outline">
                      {value.type === 'company' ? 'PJ' : 'PF'}
                    </Badge>
                  </div>
                  {value.document && (
                    <p className="text-sm text-gray-600">{formatDocument(value.document)}</p>
                  )}
                  {value.email && (
                    <p className="text-sm text-gray-600">{value.email}</p>
                  )}
                  {value.phone && (
                    <p className="text-sm text-gray-600">{value.phone}</p>
                  )}
                </div>
              </div>
              {!required && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSupplier}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar fornecedor por nome, documento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredSuppliers.length > 0 ? (
            <div className="border rounded-lg max-h-60 overflow-y-auto">
              {filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSelectSupplier(supplier.id)}
                >
                  <div className="flex items-center gap-2">
                    {supplier.type === 'company' ? (
                      <Building2 className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4 text-green-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{supplier.name}</p>
                      {supplier.document && (
                        <p className="text-xs text-gray-600">
                          {formatDocument(supplier.document)}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {supplier.type === 'company' ? 'PJ' : 'PF'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              {searchQuery
                ? 'Nenhum fornecedor encontrado'
                : 'Nenhum fornecedor cadastrado'}
            </div>
          )}
        </div>
      )}

      <SupplierDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveSupplier}
        supplier={selectedSupplier}
      />
    </div>
  );
}
