import { User, Company, UserRole } from '@/types/auth';
import { supabase } from '@/lib/supabase';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const COMPANY_KEY = 'company';

export class UserService {
  async authenticate(email: string, password: string): Promise<{ user: User; company: Company } | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro ao autenticar:', error);
        return null;
      }

      if (!data.user) {
        return null;
      }

      const { data: systemUser, error: userError } = await supabase
        .from('system_users')
        .select('*, organizations(*)')
        .eq('id', data.user.id)
        .single();

      if (userError || !systemUser) {
        console.error('Usuário não encontrado em system_users:', userError);
        await supabase.auth.signOut();
        return null;
      }

      if (!systemUser.is_active) {
        console.error('Usuário está inativo');
        await supabase.auth.signOut();
        return null;
      }

      const user: User = {
        id: systemUser.id,
        email: systemUser.email,
        name: systemUser.full_name,
        role: systemUser.role as UserRole,
        companyId: systemUser.organization_id,
        isActive: systemUser.is_active,
        createdAt: systemUser.created_at,
      };

      const company: Company = {
        id: systemUser.organizations.id,
        name: systemUser.organizations.name,
        type: 'ENTERPRISE',
        logo: '',
        description: '',
        settings: {
          maxUsers: 100,
          allowedModules: ['contacts', 'companies', 'vehicles', 'opportunities'],
          customBranding: true,
          dataRetentionDays: 365,
        },
        isActive: systemUser.organizations.is_active,
        createdAt: systemUser.organizations.created_at,
        updatedAt: systemUser.organizations.updated_at,
      };

      localStorage.setItem(AUTH_TOKEN_KEY, data.session?.access_token || '');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));

      return { user, company };
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return null;
    }
  }

  async signUp(email: string, password: string, fullName: string, organizationId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !data.user) {
        console.error('Erro ao criar usuário:', error);
        return false;
      }

      const { error: insertError } = await supabase
        .from('system_users')
        .insert({
          id: data.user.id,
          organization_id: organizationId,
          email,
          full_name: fullName,
          role: 'sales',
          is_active: true,
        });

      if (insertError) {
        console.error('Erro ao criar registro em system_users:', insertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return null;

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!systemUser) return null;

      return {
        id: systemUser.id,
        email: systemUser.email,
        name: systemUser.full_name,
        role: systemUser.role as UserRole,
        companyId: systemUser.organization_id,
        isActive: systemUser.is_active,
        createdAt: systemUser.created_at,
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }

  logout(): void {
    supabase.auth.signOut();
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COMPANY_KEY);
  }

  async logUserAction(userId: string, action: string, metadata: any): Promise<void> {
    console.log('User action:', { userId, action, metadata });
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      const redirectUrl = `${window.location.origin}`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Erro ao resetar senha:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return false;
    }
  }

  async updatePassword(newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return false;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', user.user.id)
        .single();

      if (!systemUser) return [];

      const { data: users, error } = await supabase
        .from('system_users')
        .select('*')
        .eq('organization_id', systemUser.organization_id)
        .order('full_name');

      if (error) throw error;

      return (users || []).map(u => ({
        id: u.id,
        email: u.email,
        name: u.full_name,
        role: u.role as UserRole,
        companyId: u.organization_id,
        isActive: u.is_active,
        createdAt: u.created_at,
      }));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }

  async createUser(userData: { email: string; fullName: string; role: UserRole; password: string }): Promise<boolean> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return false;

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', currentUser.user.id)
        .single();

      if (!systemUser) return false;

      return await this.signUp(
        userData.email,
        userData.password,
        userData.fullName,
        systemUser.organization_id
      );
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return false;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const updateData: any = {};

      if (updates.name) updateData.full_name = updates.name;
      if (updates.role) updateData.role = updates.role;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { error } = await supabase
        .from('system_users')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Erro ao deletar usuário:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return false;
    }
  }
}

export const userService = new UserService();
