import { ApiResponse } from '@/types/api';
import { CompanyData } from '@/types/company';
import { supabase } from '@/lib/supabase';

type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

class CompanyService {
  async getCompanies(page: number = 1, limit: number = 50): Promise<CompanyData[]> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('legal_name')
        .range(from, to);

      if (error) throw error;

      return (data || []).map(this.mapSupabaseToCompanyData);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  }

  async getCompanyById(id: string): Promise<CompanyData | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return this.mapSupabaseToCompanyData(data);
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      throw error;
    }
  }

  async createCompany(companyData: CompanyData): Promise<CompanyData> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', user.user.id)
        .single();

      if (!systemUser) throw new Error('Usuário não encontrado');

      const insertData = this.mapCompanyDataToSupabase(companyData, systemUser.organization_id, user.user.id);

      const { data, error } = await supabase
        .from('companies')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      return this.mapSupabaseToCompanyData(data);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  }

  async updateCompany(id: string, companyData: Partial<CompanyData>): Promise<CompanyData> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', user.user.id)
        .single();

      if (!systemUser) throw new Error('Usuário não encontrado');

      const updateData = this.mapCompanyDataToSupabase(companyData as CompanyData, systemUser.organization_id, user.user.id);
      delete updateData.created_at;
      delete updateData.created_by;

      const { data, error } = await supabase
        .from('companies')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.mapSupabaseToCompanyData(data);
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      throw error;
    }
  }

  async searchCompanies(searchTerm: string): Promise<CompanyData[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or(`legal_name.ilike.%${searchTerm}%,trade_name.ilike.%${searchTerm}%,cnpj.ilike.%${searchTerm}%`)
        .order('legal_name');

      if (error) throw error;

      return (data || []).map(this.mapSupabaseToCompanyData);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  }

  private mapSupabaseToCompanyData(data: any): CompanyData {
    return {
      id: data.id,
      identificacao: {
        razaoSocial: data.legal_name || '',
        nomeFantasia: data.trade_name || '',
        cnpj: data.cnpj || '',
        inscricaoEstadual: data.state_registration || '',
        inscricaoMunicipal: data.municipal_registration || '',
        tipoEmpresa: data.company_type || '',
        porte: data.company_size || '',
        dataFundacao: data.founding_date || '',
        atividadePrincipal: data.main_activity || '',
        atividadesSecundarias: data.secondary_activities || [],
        telefone: data.phone || '',
        celular: data.mobile || '',
        email: data.email || '',
        website: data.website || '',
      },
      enderecos: [{
        tipo: 'principal',
        cep: data.address_zip_code || '',
        logradouro: data.address_street || '',
        numero: data.address_number || '',
        complemento: data.address_complement || '',
        bairro: data.address_neighborhood || '',
        cidade: data.address_city || '',
        estado: data.address_state || '',
        pais: 'Brasil',
      }],
      bancaria: {
        banco: data.bank_name || '',
        agencia: data.bank_agency || '',
        conta: data.bank_account || '',
        chavePix: data.pix_key || '',
      },
      financeira: {
        faturamentoMensal: data.monthly_revenue || 0,
        numeroFuncionarios: data.employee_count || 0,
      },
      comercial: {
        fornecedor: data.is_supplier || false,
        cliente: data.is_customer || true,
      },
      observacoes: data.notes || '',
      tags: data.tags || [],
      status: data.status || 'ACTIVE',
    };
  }

  private mapCompanyDataToSupabase(data: CompanyData, organizationId: string, userId: string): any {
    return {
      organization_id: organizationId,
      legal_name: data.identificacao?.razaoSocial || '',
      trade_name: data.identificacao?.nomeFantasia || '',
      cnpj: data.identificacao?.cnpj || '',
      state_registration: data.identificacao?.inscricaoEstadual || '',
      municipal_registration: data.identificacao?.inscricaoMunicipal || '',
      company_type: data.identificacao?.tipoEmpresa || '',
      company_size: data.identificacao?.porte || '',
      founding_date: data.identificacao?.dataFundacao || null,
      main_activity: data.identificacao?.atividadePrincipal || '',
      secondary_activities: data.identificacao?.atividadesSecundarias || [],
      address_street: data.enderecos?.[0]?.logradouro || '',
      address_number: data.enderecos?.[0]?.numero || '',
      address_complement: data.enderecos?.[0]?.complemento || '',
      address_neighborhood: data.enderecos?.[0]?.bairro || '',
      address_city: data.enderecos?.[0]?.cidade || '',
      address_state: data.enderecos?.[0]?.estado || '',
      address_zip_code: data.enderecos?.[0]?.cep || '',
      phone: data.identificacao?.telefone || '',
      mobile: data.identificacao?.celular || '',
      email: data.identificacao?.email || '',
      website: data.identificacao?.website || '',
      bank_name: data.bancaria?.banco || '',
      bank_agency: data.bancaria?.agencia || '',
      bank_account: data.bancaria?.conta || '',
      pix_key: data.bancaria?.chavePix || '',
      monthly_revenue: data.financeira?.faturamentoMensal || 0,
      employee_count: data.financeira?.numeroFuncionarios || 0,
      is_supplier: data.comercial?.fornecedor || false,
      is_customer: data.comercial?.cliente || true,
      notes: data.observacoes || '',
      tags: data.tags || [],
      status: data.status || 'ACTIVE',
      created_by: userId,
      created_at: new Date().toISOString(),
    };
  }
}

export const apiService = new CompanyService();
