import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Building, Edit, Eye, Plus, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/services/companyService';
import { CompanyData } from '@/types/company';
import { useAuth } from '@/components/auth';
import { PermissionGuard } from '@/components/ui/permission-guard';

interface CompanyListProps {
  onBack: () => void;
  onEdit: (company: CompanyData) => void;
  onView: (company: CompanyData) => void;
  onNew: () => void;
}

export default function CompanyList({ onBack, onEdit, onView, onNew }: CompanyListProps) {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { hasPermission } = useAuth();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCompanies();
      setCompanies(Array.isArray(data) ? (data as CompanyData[]) : []);
    }
     catch (error)
    {
      console.error('Erro ao carregar empresas:', error);
      toast.error('Erro ao carregar empresas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = (companies || []).filter(company => {
    const term = searchTerm.toLowerCase();
    return (
      (company.corporateName && company.corporateName.toLowerCase().includes(term)) ||
      (company.tradeName && company.tradeName.toLowerCase().includes(term)) ||
      (company.cnpj && company.cnpj.includes(term)) ||
      (company.primaryEmail && company.primaryEmail.toLowerCase().includes(term))
    );
  });

  const getKycBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Baixo';
    if (score >= 60) return 'Médio';
    return 'Alto';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando empresas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lista de Empresas</h1>
              <p className="text-gray-600">
                {filteredCompanies.length} empresas encontradas
              </p>
            </div>
          </div>
          <PermissionGuard resource="companies" action="create" showFallback={false}>
            <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
            </Button>
          </PermissionGuard>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por razão social, nome fantasia, CNPJ ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {searchTerm
                  ? 'Tente ajustar os termos de busca.'
                  : 'Comece criando sua primeira empresa no sistema.'
                }
              </p>
              {!searchTerm && (
                <PermissionGuard resource="companies" action="create" showFallback={false}>
                  <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Empresa
                  </Button>
                </PermissionGuard>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.cnpj} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {company.corporateName || company.tradeName || 'Empresa sem nome'}
                      </CardTitle>
                      {company.tradeName && company.corporateName && (
                        <p className="text-sm text-gray-600 mt-1">
                          {company.corporateName}
                        </p>
                      )}
                    </div>
                    <Badge className={getKycBadgeColor(company.kycScore || 0)}>
                      KYC: {company.kycScore || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    {company.cnpj && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        CNPJ: {company.cnpj}
                      </div>
                    )}
                    {company.commercialAddress.city  && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {company.commercialAddress.city}, {company.commercialAddress.state}
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {company.phone}
                      </div>
                    )}
                    {company.primaryEmail && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {company.primaryEmail}
                      </div>
                    )}
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600">
                      Risco: <span className={`font-medium ${
                        getRiskLevel(company.kycScore || 0) === 'Baixo' ? 'text-green-600' :
                        getRiskLevel(company.kycScore || 0) === 'Médio' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {getRiskLevel(company.kycScore || 0)}
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onView(company)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <PermissionGuard resource="companies" action="update" showFallback={false}>
                        <Button size="sm" variant="outline" onClick={() => onEdit(company)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}