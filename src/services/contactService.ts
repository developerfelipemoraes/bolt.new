import { ContactData } from '@/types/contact';
import { supabase } from '@/lib/supabase';

class ContactService {
  async getContacts(page: number = 1, limit: number = 50): Promise<ContactData[]> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('full_name')
        .range(from, to);

      if (error) throw error;

      return (data || []).map(this.mapSupabaseToContactData);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw error;
    }
  }

  async getContactById(id: string): Promise<ContactData | null> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return this.mapSupabaseToContactData(data);
    } catch (error) {
      console.error('Erro ao buscar contato:', error);
      throw error;
    }
  }

  async createContact(contactData: ContactData): Promise<ContactData> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', user.user.id)
        .single();

      if (!systemUser) throw new Error('Usuário não encontrado');

      const insertData = this.mapContactDataToSupabase(contactData, systemUser.organization_id, user.user.id);

      const { data, error } = await supabase
        .from('contacts')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      return this.mapSupabaseToContactData(data);
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      throw error;
    }
  }

  async updateContact(id: string, contactData: Partial<ContactData>): Promise<ContactData> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', user.user.id)
        .single();

      if (!systemUser) throw new Error('Usuário não encontrado');

      const updateData = this.mapContactDataToSupabase(contactData as ContactData, systemUser.organization_id, user.user.id);
      delete updateData.created_at;
      delete updateData.created_by;

      const { data, error } = await supabase
        .from('contacts')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return this.mapSupabaseToContactData(data);
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      throw error;
    }
  }

  async searchContacts(searchTerm: string): Promise<ContactData[]> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('full_name');

      if (error) throw error;

      return (data || []).map(this.mapSupabaseToContactData);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      throw error;
    }
  }

  private mapSupabaseToContactData(data: any): ContactData {
    return {
      personal: {
        fullName: data.full_name || '',
        cpf: data.cpf || '',
        birthDate: data.birth_date || '',
        gender: data.gender || '',
        nationality: data.nationality || 'Brasileira',
        birthPlace: data.birth_place || '',
        birthState: data.birth_state || '',
        motherName: data.mother_name || '',
        fatherName: data.father_name || '',
        maritalStatus: data.marital_status || '',
        spouseName: data.spouse_name || '',
        spouseCpf: data.spouse_cpf || '',
        guardianName: '',
        guardianCpf: '',
      },
      documents: {
        type: data.document_type || '',
        number: data.document_number || '',
        issuer: data.document_issuer || '',
        issuerState: data.document_issuer_state || '',
        issueDate: data.document_issue_date || '',
        expirationDate: '',
        attachmentName: '',
      },
      address: {
        street: data.address_street || '',
        number: data.address_number || '',
        complement: data.address_complement || '',
        neighborhood: data.address_neighborhood || '',
        city: data.address_city || '',
        state: data.address_state || '',
        zipCode: data.address_zip_code || '',
        phone: data.phone || '',
        mobile: data.mobile || '',
        fax: '',
        email: data.email || '',
        proofAttachment: '',
      },
      professional: {
        education: '',
        occupation: data.occupation || '',
        company: data.company_name || '',
        companyStreet: '',
        companyNumber: '',
        companyNeighborhood: '',
        companyCity: '',
        companyState: '',
        companyZipCode: '',
        companyPhone: '',
        companyMobile: '',
        incomeProof: '',
      },
      correspondence: {
        type: '',
      },
      financial: {
        salary: Number(data.monthly_income) || 0,
        otherIncome: 0,
        totalIncome: Number(data.monthly_income) || 0,
        assets: [],
      },
      banking: {
        primaryAccount: {
          bank: data.bank_name || '',
          agency: data.bank_agency || '',
          account: data.bank_account || '',
        },
        secondaryAccount: {
          bank: '',
          agency: '',
          account: '',
        },
        isJointAccount: false,
        jointAccountHolderName: '',
        jointAccountHolderCpf: '',
        pixKey: data.pix_key || '',
      },
      compliance: {
        isPep: data.is_pep || false,
        hasPepRelationship: false,
        pepName: '',
        pepCpf: '',
        relationshipPurpose: '',
        authorizeConsultations: true,
        declareAccuracy: true,
        commitToUpdate: true,
        coafAwareness: true,
      },
      completeness: 0,
      kycScore: 0,
      kycClassification: 'ok',
      nextReview: '',
      pendencies: [],
      companyLinks: [],
      createdAt: data.created_at || '',
      updatedAt: data.updated_at || '',
    };
  }

  private mapContactDataToSupabase(data: ContactData, organizationId: string, userId: string): any {
    return {
      organization_id: organizationId,
      full_name: data.personal?.fullName || '',
      cpf: data.personal?.cpf || '',
      birth_date: data.personal?.birthDate || null,
      gender: data.personal?.gender || '',
      nationality: data.personal?.nationality || 'Brasileira',
      birth_place: data.personal?.birthPlace || '',
      birth_state: data.personal?.birthState || '',
      mother_name: data.personal?.motherName || '',
      father_name: data.personal?.fatherName || '',
      marital_status: data.personal?.maritalStatus || '',
      spouse_name: data.personal?.spouseName || '',
      spouse_cpf: data.personal?.spouseCpf || '',
      email: data.address?.email || '',
      phone: data.address?.phone || '',
      mobile: data.address?.mobile || '',
      address_street: data.address?.street || '',
      address_number: data.address?.number || '',
      address_complement: data.address?.complement || '',
      address_neighborhood: data.address?.neighborhood || '',
      address_city: data.address?.city || '',
      address_state: data.address?.state || '',
      address_zip_code: data.address?.zipCode || '',
      document_type: data.documents?.type || '',
      document_number: data.documents?.number || '',
      document_issuer: data.documents?.issuer || '',
      document_issuer_state: data.documents?.issuerState || '',
      document_issue_date: data.documents?.issueDate || null,
      occupation: data.professional?.occupation || '',
      company_name: data.professional?.company || '',
      monthly_income: data.financial?.salary || 0,
      bank_name: data.banking?.primaryAccount?.bank || '',
      bank_agency: data.banking?.primaryAccount?.agency || '',
      bank_account: data.banking?.primaryAccount?.account || '',
      pix_key: data.banking?.pixKey || '',
      is_pep: data.compliance?.isPep || false,
      notes: '',
      tags: [],
      status: 'ACTIVE',
      created_by: userId,
      created_at: new Date().toISOString(),
    };
  }
}

export const contactService = new ContactService();
