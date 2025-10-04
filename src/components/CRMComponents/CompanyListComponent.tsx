import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Building2, Search, Filter, Edit, Trash2, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { CompanyData } from './CompanyWizardComponent';

interface CompanyListProps {
  companies?: CompanyData[];
  onEdit?: (company: CompanyData) => void;
  onDelete?: (companyId: string) => void;
  className?: string;
}

export const CompanyListComponent: React.FC<CompanyListProps> = ({
  companies = [],
  onEdit,
  onDelete,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cnpj.includes(searchTerm);
    
    const matchesFilter = filterSegment === '' || company.segmento === filterSegment;
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (companyId: string, companyName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a empresa "${companyName}"?`)) {
      if (onDelete) {
        onDelete(companyId);
      }
      toast.success('Empresa excluída com sucesso!');
    }
  };

  const segments = [...new Set(companies.map(c => c.segmento).filter(Boolean))].sort();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Lista de Empresas ({companies.length})
        </CardTitle>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, razão social, email ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Todos os segmentos</option>
              {segments.map(segment => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {companies.length === 0 ? 'Nenhuma empresa cadastrada' : 'Nenhuma empresa encontrada'}
            </h3>
            <p className="text-muted-foreground">
              {companies.length === 0 
                ? 'Comece cadastrando sua primeira empresa'
                : 'Tente ajustar os filtros de busca'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{company.nomeFantasia}</h3>
                        <div className="flex gap-2">
                          {company.segmento && (
                            <Badge variant="secondary">{company.segmento}</Badge>
                          )}
                          {company.porte && (
                            <Badge variant="outline">{company.porte}</Badge>
                          )}
                        </div>
                      </div>
                      
                      {company.razaoSocial !== company.nomeFantasia && (
                        <p className="text-sm text-muted-foreground mb-2">{company.razaoSocial}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {company.email}
                        </div>
                        
                        {(company.celular || company.telefone) && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {company.celular || company.telefone}
                          </div>
                        )}
                        
                        {company.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {company.website}
                          </div>
                        )}
                        
                        {(company.cidade || company.estado) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {[company.cidade, company.estado].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCompany(company)}
                          >
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes da Empresa</DialogTitle>
                          </DialogHeader>
                          {selectedCompany && (
                            <div className="space-y-6">
                              {/* Dados da Empresa */}
                              <div>
                                <h4 className="font-semibold mb-3 border-b pb-2">Dados da Empresa</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Nome Fantasia:</span>
                                    <p>{selectedCompany.nomeFantasia}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Razão Social:</span>
                                    <p>{selectedCompany.razaoSocial}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">CNPJ:</span>
                                    <p>{selectedCompany.cnpj}</p>
                                  </div>
                                  {selectedCompany.inscricaoEstadual && (
                                    <div>
                                      <span className="font-medium">Inscrição Estadual:</span>
                                      <p>{selectedCompany.inscricaoEstadual}</p>
                                    </div>
                                  )}
                                  {selectedCompany.inscricaoMunicipal && (
                                    <div>
                                      <span className="font-medium">Inscrição Municipal:</span>
                                      <p>{selectedCompany.inscricaoMunicipal}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Contato */}
                              <div>
                                <h4 className="font-semibold mb-3 border-b pb-2">Contato</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Email:</span>
                                    <p>{selectedCompany.email}</p>
                                  </div>
                                  {selectedCompany.website && (
                                    <div>
                                      <span className="font-medium">Website:</span>
                                      <p>{selectedCompany.website}</p>
                                    </div>
                                  )}
                                  {selectedCompany.telefone && (
                                    <div>
                                      <span className="font-medium">Telefone:</span>
                                      <p>{selectedCompany.telefone}</p>
                                    </div>
                                  )}
                                  {selectedCompany.celular && (
                                    <div>
                                      <span className="font-medium">Celular:</span>
                                      <p>{selectedCompany.celular}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Endereço */}
                              <div>
                                <h4 className="font-semibold mb-3 border-b pb-2">Endereço</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">CEP:</span>
                                    <p>{selectedCompany.cep}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Cidade:</span>
                                    <p>{selectedCompany.cidade}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Estado:</span>
                                    <p>{selectedCompany.estado}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-medium">Endereço:</span>
                                    <p>{selectedCompany.endereco}, {selectedCompany.numero}</p>
                                    {selectedCompany.complemento && <p>{selectedCompany.complemento}</p>}
                                    {selectedCompany.bairro && <p>{selectedCompany.bairro}</p>}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Dados Comerciais */}
                              {(selectedCompany.segmento || selectedCompany.porte || selectedCompany.faturamento || selectedCompany.numeroFuncionarios) && (
                                <div>
                                  <h4 className="font-semibold mb-3 border-b pb-2">Dados Comerciais</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    {selectedCompany.segmento && (
                                      <div>
                                        <span className="font-medium">Segmento:</span>
                                        <p>{selectedCompany.segmento}</p>
                                      </div>
                                    )}
                                    {selectedCompany.porte && (
                                      <div>
                                        <span className="font-medium">Porte:</span>
                                        <p>{selectedCompany.porte}</p>
                                      </div>
                                    )}
                                    {selectedCompany.faturamento && (
                                      <div>
                                        <span className="font-medium">Faturamento:</span>
                                        <p>{selectedCompany.faturamento}</p>
                                      </div>
                                    )}
                                    {selectedCompany.numeroFuncionarios && (
                                      <div>
                                        <span className="font-medium">Funcionários:</span>
                                        <p>{selectedCompany.numeroFuncionarios}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Observações */}
                              {selectedCompany.observacoes && (
                                <div>
                                  <h4 className="font-semibold mb-3 border-b pb-2">Observações</h4>
                                  <p className="text-sm">{selectedCompany.observacoes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(company)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(company.id!, company.nomeFantasia)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyListComponent;