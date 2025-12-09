import { supabase } from './supabase';

export async function getUserOrganizationId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('system_users')
    .select('organization_id')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching organization_id:', error);
    return null;
  }

  return data.organization_id;
}

export async function addOrganizationId<T extends Record<string, any>>(
  data: T
): Promise<T & { organization_id: string }> {
  const organizationId = await getUserOrganizationId();

  if (!organizationId) {
    throw new Error('User organization not found. Please ensure you are logged in.');
  }

  return {
    ...data,
    organization_id: organizationId,
  };
}

export async function addOrganizationIdToArray<T extends Record<string, any>>(
  items: T[]
): Promise<Array<T & { organization_id: string }>> {
  const organizationId = await getUserOrganizationId();

  if (!organizationId) {
    throw new Error('User organization not found. Please ensure you are logged in.');
  }

  return items.map(item => ({
    ...item,
    organization_id: organizationId,
  }));
}
