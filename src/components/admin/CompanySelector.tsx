import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Crown, 
  Users, 
  Settings,
  ChevronDown,
  Check
} from 'lucide-react';
import { useAuth } from '@/components/auth';
import { LogoutButton } from '@/components/auth';
import { Company } from '@/types/auth';
import { toast } from 'sonner';

interface CompanySelectorProps {
  className?: string;
}

// Mock companies - em produção viria da API
const AVAILABLE_COMPANIES: Company[] = [
  {
    id: 'aurovel',
    name: 'Aurovel',
    type: 'master',
    logo: '👑',
    description: 'Controle Total do Sistema',
    settings: {
      maxUsers: 1000,
      allowedModules: ['all'],
      customBranding: true,
      dataRetentionDays: 365
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'tech-solutions',
    name: 'Tech Solutions Ltda',
    type: 'client',
    logo: '🏢',
    description: 'Empresa Cliente - Tecnologia',
    settings: {
      maxUsers: 50,
      allowedModules: ['contacts', 'companies', 'vehicles'],
      customBranding: false,
      dataRetentionDays: 90
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'inovacao-digital',
    name: 'Inovação Digital S.A.',
    type: 'client',
    logo: '💡',
    description: 'Empresa Cliente - Inovação',
    settings: {
      maxUsers: 25,
      allowedModules: ['contacts', 'companies'],
      customBranding: false,
      dataRetentionDays: 60
    },
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const CompanySelector: React.FC<CompanySelectorProps> = ({ className = "" }) => {
  const { user, company, isSuperAdmin, switchCompany } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!isSuperAdmin || !user || !company) {
    return null;
  }

  const handleCompanySwitch = async (companyId: string) => {
    if (companyId === company.id) return;
    
    setIsLoading(true);
    try {
      await switchCompany(companyId);
      const targetCompany = AVAILABLE_COMPANIES.find(c => c.id === companyId);
      toast.success(`Empresa alterada para: ${targetCompany?.name}`);
    } catch (error) {
      toast.error('Erro ao trocar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`border-purple-200 bg-purple-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Crown className="h-5 w-5" />
          Seletor de Empresa
          <Badge variant="default" className="bg-purple-600 text-xs">
            Super Admin
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-700">
            Empresa Ativa:
          </label>
          <Select
            value={company.id}
            onValueChange={handleCompanySwitch}
            disabled={isLoading}
          >
            <SelectTrigger className="border-purple-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_COMPANIES.map((comp) => (
                <SelectItem key={comp.id} value={comp.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{comp.logo}</span>
                    <div className="flex-1">
                      <div className="font-medium">{comp.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {comp.type === 'master' ? 'Controle Total' : 'Cliente'}
                      </div>
                    </div>
                    {comp.id === company.id && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Info */}
        <div className="bg-white p-3 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{company.logo}</span>
            <div>
              <h4 className="font-semibold text-purple-900">{company.name}</h4>
              <p className="text-xs text-purple-600">{company.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-purple-600">Tipo:</span>
              <span className="ml-1 font-medium">
                {company.type === 'master' ? 'Master' : 'Cliente'}
              </span>
            </div>
            <div>
              <span className="text-purple-600">Usuários:</span>
              <span className="ml-1 font-medium">
                {company.settings.maxUsers}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-2 rounded border border-purple-200">
            <div className="text-lg font-bold text-purple-600">156</div>
            <div className="text-xs text-purple-500">Contatos</div>
          </div>
          <div className="bg-white p-2 rounded border border-purple-200">
            <div className="text-lg font-bold text-purple-600">43</div>
            <div className="text-xs text-purple-500">Empresas</div>
          </div>
          <div className="bg-white p-2 rounded border border-purple-200">
            <div className="text-lg font-bold text-purple-600">89</div>
            <div className="text-xs text-purple-500">Veículos</div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-xs text-purple-600 mt-1">Trocando empresa...</p>
          </div>
        )}

        {/* Quick Logout for Super Admin */}
        <div className="pt-3 border-t border-purple-200">
          <LogoutButton 
            variant="outline" 
            size="sm" 
            className="w-full text-red-600 hover:text-red-600 hover:bg-red-50 border-red-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySelector;