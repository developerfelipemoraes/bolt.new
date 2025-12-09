/*
  # Sistema de Organizações e Usuários

  ## Descrição
  Esta migration cria a estrutura de organizações do sistema (diferentes das empresas clientes)
  e usuários com permissões.
  
  ## Tabelas Criadas
  
  ### 1. `organizations` (Organizações do Sistema)
  Representa as organizações que usam o CRM (não confundir com a tabela companies que são clientes).
  - `id` (uuid, PK) - Identificador único
  - `name` (text) - Nome da organização
  - `slug` (text) - Slug único
  - `is_active` (boolean) - Status
  - `settings` (jsonb) - Configurações
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. `system_users` (Usuários do Sistema)
  Usuários que acessam o CRM.
  - `id` (uuid, PK) - Mesmo ID do auth.users
  - `organization_id` (uuid, FK) - Organização
  - `email` (text) - Email
  - `full_name` (text) - Nome completo
  - `role` (text) - super_admin, company_admin, sales, support
  - `is_active` (boolean) - Status
  - `avatar_url` (text) - Foto
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. `permissions` (Permissões)
  - `id` (uuid, PK)
  - `resource` (text) - contacts, companies, vehicles, etc
  - `action` (text) - create, read, update, delete
  - `description` (text)
  
  ### 4. `role_permissions` (Permissões por Role)
  - `id` (uuid, PK)
  - `role` (text)
  - `permission_id` (uuid, FK)
  
  ## Segurança
  - RLS habilitado
  - Usuários veem apenas dados da própria organização
  - Super admins têm acesso total
*/

-- Criar tabela de organizações do sistema
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de usuários do sistema
CREATE TABLE IF NOT EXISTS system_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'sales', 'support')),
  is_active boolean DEFAULT true,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de permissões
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource text NOT NULL,
  action text NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'manage')),
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource, action)
);

-- Criar tabela de permissões por role
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Inserir organização Aurovel (master)
INSERT INTO organizations (id, name, slug, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Aurovel',
  'aurovel',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Inserir permissões básicas
INSERT INTO permissions (resource, action, description) VALUES
  ('contacts', 'create', 'Criar contatos'),
  ('contacts', 'read', 'Visualizar contatos'),
  ('contacts', 'update', 'Editar contatos'),
  ('contacts', 'delete', 'Excluir contatos'),
  ('companies', 'create', 'Criar empresas'),
  ('companies', 'read', 'Visualizar empresas'),
  ('companies', 'update', 'Editar empresas'),
  ('companies', 'delete', 'Excluir empresas'),
  ('vehicles', 'create', 'Criar veículos'),
  ('vehicles', 'read', 'Visualizar veículos'),
  ('vehicles', 'update', 'Editar veículos'),
  ('vehicles', 'delete', 'Excluir veículos'),
  ('sales', 'create', 'Criar vendas'),
  ('sales', 'read', 'Visualizar vendas'),
  ('sales', 'update', 'Editar vendas'),
  ('sales', 'delete', 'Excluir vendas'),
  ('reports', 'read', 'Visualizar relatórios'),
  ('admin', 'manage', 'Gerenciar sistema')
ON CONFLICT (resource, action) DO NOTHING;

-- Configurar permissões para super_admin (todas)
INSERT INTO role_permissions (role, permission_id)
SELECT 'super_admin', id FROM permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Configurar permissões para company_admin (tudo exceto admin)
INSERT INTO role_permissions (role, permission_id)
SELECT 'company_admin', id FROM permissions
WHERE resource != 'admin'
ON CONFLICT (role, permission_id) DO NOTHING;

-- Configurar permissões para sales (criar/ler/editar vendas, ler o resto)
INSERT INTO role_permissions (role, permission_id)
SELECT 'sales', id FROM permissions
WHERE 
  (resource = 'sales' AND action IN ('create', 'read', 'update'))
  OR (resource IN ('contacts', 'companies', 'vehicles') AND action = 'read')
  OR (resource = 'reports' AND action = 'read')
ON CONFLICT (role, permission_id) DO NOTHING;

-- Configurar permissões para support (apenas leitura)
INSERT INTO role_permissions (role, permission_id)
SELECT 'support', id FROM permissions
WHERE action = 'read'
ON CONFLICT (role, permission_id) DO NOTHING;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_system_users_organization_id ON system_users(organization_id);
CREATE INDEX IF NOT EXISTS idx_system_users_email ON system_users(email);
CREATE INDEX IF NOT EXISTS idx_system_users_role ON system_users(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);

-- Habilitar RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Policies para organizations
CREATE POLICY "Super admins podem ver todas organiza\u00e7\u00f5es"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM system_users
      WHERE system_users.id = auth.uid()
      AND system_users.organization_id = '00000000-0000-0000-0000-000000000001'
    )
  );

CREATE POLICY "Usu\u00e1rios podem ver pr\u00f3pria organiza\u00e7\u00e3o"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

-- Policies para system_users
CREATE POLICY "Usu\u00e1rios podem ver pr\u00f3prio perfil"
  ON system_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Usu\u00e1rios podem ver colegas da mesma organiza\u00e7\u00e3o"
  ON system_users FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins podem criar usu\u00e1rios na pr\u00f3pria organiza\u00e7\u00e3o"
  ON system_users FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

CREATE POLICY "Admins podem atualizar usu\u00e1rios da pr\u00f3pria organiza\u00e7\u00e3o"
  ON system_users FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

-- Policies para permissions (leitura para todos)
CREATE POLICY "Todos autenticados podem ver permiss\u00f5es"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

-- Policies para role_permissions (leitura para todos)
CREATE POLICY "Todos autenticados podem ver permiss\u00f5es de roles"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- Trigger para updated_at em organizations
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at em system_users
CREATE TRIGGER update_system_users_updated_at
  BEFORE UPDATE ON system_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fun\u00e7\u00e3o auxiliar para verificar permiss\u00e3o
CREATE OR REPLACE FUNCTION has_permission(
  user_id uuid,
  resource_name text,
  action_name text
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM system_users su
    JOIN role_permissions rp ON rp.role = su.role
    JOIN permissions p ON p.id = rp.permission_id
    WHERE su.id = user_id
    AND p.resource = resource_name
    AND p.action = action_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
