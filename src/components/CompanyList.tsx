import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, ArrowLeft, Plus, Search, Edit, Eye, Trash2, MapPin, Globe, Phone } from 'lucide-react';
// Mock data removed - using empty initial state
import { CompanyData } from '@/types/company';

interface CompanyListProps {
  onBack: () => void;
  onEdit: (company: CompanyData) => void;
  onView: (company: CompanyData) => void;
  onNew: () => void;
}

export default function CompanyList({ onBack, onEdit, onView, onNew }: CompanyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<CompanyData[]>([
    {},
    {
      ...{},
      id: '2',
      identificacao: {
        ...{}.identificacao,
        cnpj: '98.765.432/0001-10',
        razaoSocial: 'Translog Brasil Transportes S.A.',
        nomeFantasia: 'Translog',
        inscricaoMunicipal: '987654321'
      },
      endereco: {
        ...{}.endereco,
        cep: '20040-020',
        logradouro: 'Av. Rio Branco, 156',
        cidade: 'Rio de Janeiro',
        uf: 'RJ'
      },
      contatos: {
        ...{}.contatos,
        telefone: '(21) 3333-4444',
        email: 'contato@translog.com.br',
        site: 'https://translog.com.br'
      }
    },
    {
      ...{},
      id: '3',
      identificacao: {
        ...{}.identificacao,
        cnpj: '11.222.333/0001-44',
        razaoSocial: 'InovaCorp Tecnologia Ltda',
        nomeFantasia: 'InovaCorp',
        inscricaoMunicipal: '112233445'
      },
      endereco: {
        ...{}.endereco,
        cep: '30112-000',
        logradouro: 'Rua da Bahia, 1148',
        cidade: 'Belo Horizonte',
        uf: 'MG'
      },
      contatos: {
        ...{}.contatos,
        telefone: '(31) 2222-3333',
        email: 'contato@inovacorp.com.br',
        site: 'https://inovacorp.com.br'
      }
    }
  ]);

  // Função para normalizar string (remover acentos e converter para minúsculas)
  const normalize = (str: string): string => {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Filtrar empresas com base no termo de busca
  const filteredCompanies = companies.filter(company => {
    const searchNorm = normalize(searchTerm);
    return (
      normalize(company.identificacao?.razaoSocial || '').includes(searchNorm) ||
      normalize(company.identificacao?.nomeFantasia || '').includes(searchNorm) ||
      normalize(company.identificacao?.cnpj || '').includes(searchNorm) ||
      normalize(company.endereco?.cidade || '').includes(searchNorm) ||
      normalize(company.contatos?.email || '').includes(searchNorm)
    );
  });

  // Calcular score KYC (simulado)
  const calculateKYCScore = (company: CompanyData): number => {
    let score = 0;
    let totalFields = 0;

    // Identificação (peso 30%)
    const identificacaoFields = [
      company.identificacao?.cnpj,
      company.identificacao?.razaoSocial,
      company.identificacao?.nomeFantasia,
      company.identificacao?.inscricaoEstadual,
      company.identificacao?.inscricaoMunicipal
    ];
    const identificacaoCompletos = identificacaoFields.filter(Boolean).length;
    score += (identificacaoCompletos / identificacaoFields.length) * 30;
    totalFields += identificacaoFields.length;

    // Endereço (peso 20%)
    const enderecoFields = [
      company.endereco?.cep,
      company.endereco?.logradouro,
      company.endereco?.cidade,
      company.endereco?.uf
    ];
    const enderecoCompletos = enderecoFields.filter(Boolean).length;
    score += (enderecoCompletos / enderecoFields.length) * 20;
    totalFields += enderecoFields.length;

    // Contatos (peso 25%)
    const contatoFields = [
      company.contatos?.telefone,
      company.contatos?.email,
      company.contatos?.site
    ];
    const contatoCompletos = contatoFields.filter(Boolean).length;
    score += (contatoCompletos / contatoFields.length) * 25;
    totalFields += contatoFields.length;

    // Financeiro (peso 25%)
    const financeiroFields = [
      company.financeiro?.faturamentoAnual,
      company.financeiro?.numeroFuncionarios,
      company.bancario?.banco,
      company.bancario?.agencia,
      company.bancario?.conta
    ];
    const financeiroCompletos = financeiroFields.filter(Boolean).length;
    score += (financeiroCompletos / financeiroFields.length) * 25;
    totalFields += financeiroFields.length;

    return Math.round(score);
  };

  // Função para obter cor do score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  // Função para remover empresa
  const handleDelete = (companyId: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      setCompanies(companies.filter(c => c.id !== companyId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao CRM
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-blue-600 mb-2">
                Consulta de Empresas (PJ)
              </h1>
              <p className="text-gray-600">
                Gerencie e consulte todas as empresas cadastradas no sistema
              </p>
            </div>
            
            <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Pesquisar por razão social, CNPJ, cidade, e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{filteredCompanies.length}</div>
                <div className="text-sm text-gray-500">empresas encontradas</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Score Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(filteredCompanies.reduce((acc, company) => acc + calculateKYCScore(company), 0) / filteredCompanies.length || 0)}
                </div>
                <div className="text-sm text-gray-500">KYC score</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => {
            const kycScore = calculateKYCScore(company);
            
            return (
              <Card key={company.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {company.identificacao?.nomeFantasia || company.identificacao?.razaoSocial}
                      </CardTitle>
                      {company.identificacao?.nomeFantasia && (
                        <CardDescription className="text-sm">
                          {company.identificacao?.razaoSocial}
                        </CardDescription>
                      )}
                    </div>
                    <Badge className={`${getScoreColor(kycScore)} font-semibold`}>
                      KYC: {kycScore}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* CNPJ */}
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">CNPJ:</span>
                    <span>{company.identificacao?.cnpj}</span>
                  </div>

                  {/* Localização */}
                  {company.endereco?.cidade && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{company.endereco?.cidade} - {company.endereco?.uf}</span>
                    </div>
                  )}

                  {/* Telefone */}
                  {company.contatos?.telefone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{company.contatos?.telefone}</span>
                    </div>
                  )}

                  {/* Site */}
                  {company.contatos?.site && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {company.contatos?.site}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onView(company)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onEdit(company)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(company.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando sua primeira empresa'}
            </p>
            <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Empresa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}