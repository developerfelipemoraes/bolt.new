/*
  # Comprehensive RLS Cleanup and Optimization - Final

  ## Security & Performance Enhancement
  
  This migration removes ALL legacy RLS policies and ensures only optimized
  organization-based policies remain. All auth.uid() calls are wrapped with
  (select ...) to prevent per-row re-evaluation.
  
  ## Changes Made
  
  ### 1. Remove All Legacy Permission-Based Policies
  - Drops all "Usuários com permissão podem..." policies
  - These used has_permission(auth.uid(), ...) which re-evaluates per row
  
  ### 2. Remove All Legacy Organization Policies
  - Drops old Portuguese-named organization policies
  - Drops duplicate policies with escaped unicode
  
  ### 3. Fix has_permission Function
  - Sets fixed search_path on overloaded function
  
  ## Tables Affected
  - contacts
  - companies
  - vehicles
  - chassis_models
  - bodywork_models
  - sales_opportunities
  - organizations
  - system_users
  - pipeline_stages
  - opportunity_timeline
  - sales_pipelines
  
  ## Result
  
  All tables will have only English-named "Users can..." policies that:
  - Use organization_id for access control
  - Use (select auth.uid()) for optimal performance
  - Are clear, maintainable, and secure
*/

-- ============================================================================
-- DROP ALL LEGACY PERMISSION-BASED POLICIES
-- ============================================================================

-- Contacts
DROP POLICY IF EXISTS "Usuários com permissão podem ver contatos" ON contacts;
DROP POLICY IF EXISTS "Usuários com permissão podem criar contatos" ON contacts;
DROP POLICY IF EXISTS "Usuários com permissão podem editar contatos" ON contacts;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir contatos" ON contacts;

-- Companies
DROP POLICY IF EXISTS "Usuários com permissão podem ver empresas" ON companies;
DROP POLICY IF EXISTS "Usuários com permissão podem criar empresas" ON companies;
DROP POLICY IF EXISTS "Usuários com permissão podem editar empresas" ON companies;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir empresas" ON companies;

-- Vehicles
DROP POLICY IF EXISTS "Usuários com permissão podem ver veículos" ON vehicles;
DROP POLICY IF EXISTS "Usuários com permissão podem criar veículos" ON vehicles;
DROP POLICY IF EXISTS "Usuários com permissão podem editar veículos" ON vehicles;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir veículos" ON vehicles;

-- Chassis Models
DROP POLICY IF EXISTS "Usuários com permissão podem ver modelos de chassi" ON chassis_models;
DROP POLICY IF EXISTS "Usuários com permissão podem criar modelos de chassi" ON chassis_models;
DROP POLICY IF EXISTS "Usuários com permissão podem editar modelos de chassi" ON chassis_models;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir modelos de chass" ON chassis_models;

-- Bodywork Models
DROP POLICY IF EXISTS "Usuários com permissão podem ver modelos de carroceri" ON bodywork_models;
DROP POLICY IF EXISTS "Usuários com permissão podem criar modelos de carroce" ON bodywork_models;
DROP POLICY IF EXISTS "Usuários com permissão podem editar modelos de carroc" ON bodywork_models;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir modelos de carro" ON bodywork_models;

-- Sales Opportunities
DROP POLICY IF EXISTS "Usuários com permissão podem ver oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários com permissão podem criar oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários com permissão podem editar oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir oportunidades" ON sales_opportunities;

-- ============================================================================
-- DROP ALL OTHER LEGACY POLICIES
-- ============================================================================

-- Organizations - Remove old policy with escaped unicode and old logic
DROP POLICY IF EXISTS "Super admins podem ver todas organiza\u00e7\u00f5es" ON organizations;
DROP POLICY IF EXISTS "Usu\u00e1rios podem ver pr\u00f3pria organiza\u00e7\u00e3o" ON organizations;

-- System Users - Remove old policies with escaped unicode  
DROP POLICY IF EXISTS "Admins podem criar usu\u00e1rios na pr\u00f3pria organiza\u00e7" ON system_users;
DROP POLICY IF EXISTS "Usu\u00e1rios podem ver colegas da mesma organiza\u00e7\u00e3o" ON system_users;
DROP POLICY IF EXISTS "Usu\u00e1rios podem ver pr\u00f3prio perfil" ON system_users;
DROP POLICY IF EXISTS "Admins podem atualizar usu\u00e1rios da pr\u00f3pria organiza\u" ON system_users;

-- Pipeline Stages - Remove old admin policies
DROP POLICY IF EXISTS "Admins podem criar est\u00e1gios" ON pipeline_stages;
DROP POLICY IF EXISTS "Admins podem editar est\u00e1gios" ON pipeline_stages;
DROP POLICY IF EXISTS "Admins podem excluir est\u00e1gios" ON pipeline_stages;
DROP POLICY IF EXISTS "Usu\u00e1rios podem ver est\u00e1gios de pipeline" ON pipeline_stages;

-- Opportunity Timeline - Remove old policies
DROP POLICY IF EXISTS "Usu\u00e1rios podem ver timeline" ON opportunity_timeline;
DROP POLICY IF EXISTS "Usu\u00e1rios podem criar eventos na timeline" ON opportunity_timeline;

-- Sales Pipelines - Remove old policies
DROP POLICY IF EXISTS "Usu\u00e1rios podem ver pipelines" ON sales_pipelines;

-- ============================================================================
-- FIX HAS_PERMISSION FUNCTION
-- ============================================================================

-- Now we can safely drop and recreate the has_permission function with proper search_path
DROP FUNCTION IF EXISTS has_permission(uuid, text, text) CASCADE;
CREATE FUNCTION has_permission(user_id uuid, resource_name text, action_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;