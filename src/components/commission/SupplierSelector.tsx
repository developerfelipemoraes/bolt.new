import { useState, useEffect } from 'react';
import { Search, Building2, User, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Supplier, SupplierType } from '@/types/commission';

interface SupplierSelectorProps {
  value?: Supplier;
  onChange: (supplier: Supplier | undefined) => void;
}

export function SupplierSelector({ value, onChange }: SupplierSelectorProps) {
  const [open, setOpen] = useState(false);
  const [supplierType, setSupplierType] = useState<SupplierType>('company');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Supplier[]>([]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      performSearch(searchTerm);
    } else {
      setResults([]);
    }
  }, [searchTerm, supplierType]);

  const performSearch = async (term: string) => {
    const searchLower = term.toLowerCase();

    if (supplierType === 'company') {
      const mockCompanies: Supplier[] = [
        { supplierType: 'company', id: '1', companyName: 'Transportadora ABC Ltda', cnpj: '12.345.678/0001-90', email: 'contato@abc.com', phone: '(11) 98765-4321' },
        { supplierType: 'company', id: '2', companyName: 'Viação XYZ S/A', cnpj: '98.765.432/0001-10', email: 'comercial@xyz.com', phone: '(21) 91234-5678' }
      ];

      const filtered = mockCompanies.filter(c =>
        c.companyName.toLowerCase().includes(searchLower) ||
        c.cnpj.includes(term) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.phone?.includes(term)
      );

      setResults(filtered);
    } else {
      const mockIndividuals: Supplier[] = [
        { supplierType: 'individual', id: '3', fullName: 'João da Silva', cpf: '123.456.789-00', email: 'joao@email.com', phone: '(11) 99999-8888' },
        { supplierType: 'individual', id: '4', fullName: 'Maria Santos', cpf: '987.654.321-00', email: 'maria@email.com', phone: '(21) 98888-7777' }
      ];

      const filtered = mockIndividuals.filter(c =>
        c.fullName.toLowerCase().includes(searchLower) ||
        c.cpf.includes(term) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.phone?.includes(term)
      );

      setResults(filtered);
    }
  };

  const handleSelect = (supplier: Supplier) => {
    onChange(supplier);
    setOpen(false);
    setSearchTerm('');
    setResults([]);
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  const highlightTerm = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Veículo Pertence a</Label>

        {value ? (
          <Card className="p-4 mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {value.supplierType === 'company' ? (
                <Building2 className="h-5 w-5 text-blue-600" />
              ) : (
                <User className="h-5 w-5 text-green-600" />
              )}
              <div>
                <p className="font-medium">
                  {value.supplierType === 'company' ? value.companyName : value.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {value.supplierType === 'company' ? value.cnpj : value.cpf}
                </p>
                {value.phone && (
                  <p className="text-xs text-muted-foreground">{value.phone}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </Card>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-2">
                <Search className="h-4 w-4 mr-2" />
                Buscar/Selecionar Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Selecionar Fornecedor do Veículo</DialogTitle>
                <DialogDescription>
                  Busque por nome, CNPJ/CPF, email ou telefone
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Tipo de Fornecedor</Label>
                  <RadioGroup
                    value={supplierType}
                    onValueChange={(v) => setSupplierType(v as SupplierType)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="cursor-pointer">
                        <Building2 className="inline h-4 w-4 mr-1" />
                        Empresa
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="cursor-pointer">
                        <User className="inline h-4 w-4 mr-1" />
                        Pessoa Física
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Digite nome, CNPJ/CPF, email ou telefone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {searchTerm.length >= 2 && (
                  <div className="space-y-2">
                    {results.length > 0 ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          {results.length} resultado(s) encontrado(s)
                        </p>
                        {results.map((supplier) => (
                          <Card
                            key={supplier.id}
                            className="p-3 hover:bg-accent cursor-pointer transition-colors"
                            onClick={() => handleSelect(supplier)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                {supplier.supplierType === 'company' ? (
                                  <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                                ) : (
                                  <User className="h-5 w-5 text-green-600 mt-0.5" />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {supplier.supplierType === 'company'
                                      ? highlightTerm(supplier.companyName)
                                      : highlightTerm(supplier.fullName)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {supplier.supplierType === 'company'
                                      ? highlightTerm(supplier.cnpj)
                                      : highlightTerm(supplier.cpf)}
                                  </p>
                                  {supplier.email && (
                                    <p className="text-xs text-muted-foreground">
                                      {highlightTerm(supplier.email)}
                                    </p>
                                  )}
                                  {supplier.phone && (
                                    <p className="text-xs text-muted-foreground">
                                      {highlightTerm(supplier.phone)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="secondary">Usar este</Badge>
                            </div>
                          </Card>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Nenhum resultado encontrado
                        </p>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Cadastrar Novo {supplierType === 'company' ? 'Empresa' : 'Pessoa Física'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {searchTerm.length < 2 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Digite ao menos 2 caracteres para buscar
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
