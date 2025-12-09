/*
  # Fix RLS Recursion in system_users

  ## Problem
  The current RLS policies on system_users cause infinite recursion because they query
  the same table they're protecting within the policy definition.

  ## Solution
  1. Create helper functions that bypass RLS using SECURITY DEFINER
  2. Recreate all policies using these helper functions
  3. Keep policies simple and non-recursive

  ## Changes
  - Drop existing problematic policies
  - Create `get_user_organization_id()` function
  - Create `get_user_role()` function
  - Create new, non-recursive policies
*/

-- Drop all existing policies on system_users
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON system_users;
DROP POLICY IF EXISTS "Usuários podem ver colegas da mesma organização" ON system_users;
DROP POLICY IF EXISTS "Admins podem criar usuários na própria organização" ON system_users;
DROP POLICY IF EXISTS "Admins podem atualizar usuários da própria organiza" ON system_users;

-- Create helper function to get user's organization_id (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  org_id uuid;
BEGIN
  SELECT organization_id INTO org_id
  FROM system_users
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN org_id;
END;
$$;

-- Create helper function to get user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM system_users
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_role;
END;
$$;

-- Create new non-recursive policies

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON system_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policy 2: Users can view colleagues in same organization
CREATE POLICY "Users can view same organization"
  ON system_users
  FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- Policy 3: Admins can insert users in their organization
CREATE POLICY "Admins can insert users"
  ON system_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_role() IN ('super_admin', 'company_admin')
    AND organization_id = get_user_organization_id()
  );

-- Policy 4: Admins can update users in their organization
CREATE POLICY "Admins can update users"
  ON system_users
  FOR UPDATE
  TO authenticated
  USING (
    get_user_role() IN ('super_admin', 'company_admin')
    AND organization_id = get_user_organization_id()
  )
  WITH CHECK (
    get_user_role() IN ('super_admin', 'company_admin')
    AND organization_id = get_user_organization_id()
  );

-- Policy 5: Super admins can delete users
CREATE POLICY "Super admins can delete users"
  ON system_users
  FOR DELETE
  TO authenticated
  USING (
    get_user_role() = 'super_admin'
    AND organization_id = get_user_organization_id()
  );
