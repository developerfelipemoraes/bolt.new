/*
  # Optimize RLS Policies and Remove Duplicates

  ## Security & Performance Optimization
  
  This migration optimizes Row Level Security (RLS) policies for better performance
  and removes duplicate policies that were created over time.
  
  ## Changes Made
  
  ### Performance Optimization
  - Wraps all `auth.uid()` calls with `(select auth.uid())` to prevent re-evaluation per row
  - This significantly improves query performance at scale
  
  ### Duplicate Policy Removal
  - Removes duplicate policies across all tables
  - Consolidates multiple permissive policies into single, clear policies
  - Maintains security while improving maintainability
  
  ## Tables Affected
  - bodywork_manufacturers
  - bodywork_models  
  - chassis_manufacturers
  - chassis_models
  - companies
  - contacts
  - loss_reasons
  - opportunity_timeline
  - organizations
  - pipeline_stages
  - sales_opportunities
  - sales_pipelines
  - system_users
  - vehicle_categories
  - vehicle_subcategories
  - vehicles
*/

-- ============================================================================
-- BODYWORK MODELS
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Usuários com permissão podem ver modelos de carroceri" ON bodywork_models;
DROP POLICY IF EXISTS "Usuários com permissão podem criar modelos de carroce" ON bodywork_models;
DROP POLICY IF EXISTS "Usuários com permissão podem editar modelos de carroc" ON bodywork_models;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir modelos de carro" ON bodywork_models;
DROP POLICY IF EXISTS "Users can read bodywork models" ON bodywork_models;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view bodywork models from their organization" ON bodywork_models;
CREATE POLICY "Users can view bodywork models from their organization"
  ON bodywork_models FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert bodywork models in their organization" ON bodywork_models;
CREATE POLICY "Users can insert bodywork models in their organization"
  ON bodywork_models FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update bodywork models from their organization" ON bodywork_models;
CREATE POLICY "Users can update bodywork models from their organization"
  ON bodywork_models FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete bodywork models from their organization" ON bodywork_models;
CREATE POLICY "Users can delete bodywork models from their organization"
  ON bodywork_models FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- CHASSIS MODELS
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Usuários com permissão podem ver modelos de chassi" ON chassis_models;
DROP POLICY IF EXISTS "Usuários com permissão podem criar modelos de chassi" ON chassis_models;
DROP POLICY IF EXISTS "Usuários com permissão podem editar modelos de chassi" ON chassis_models;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir modelos de chass" ON chassis_models;
DROP POLICY IF EXISTS "Users can read chassis models" ON chassis_models;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view chassis models from their organization" ON chassis_models;
CREATE POLICY "Users can view chassis models from their organization"
  ON chassis_models FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert chassis models in their organization" ON chassis_models;
CREATE POLICY "Users can insert chassis models in their organization"
  ON chassis_models FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update chassis models from their organization" ON chassis_models;
CREATE POLICY "Users can update chassis models from their organization"
  ON chassis_models FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete chassis models from their organization" ON chassis_models;
CREATE POLICY "Users can delete chassis models from their organization"
  ON chassis_models FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- COMPANIES
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Usuários com permissão podem ver empresas" ON companies;
DROP POLICY IF EXISTS "Usuários com permissão podem criar empresas" ON companies;
DROP POLICY IF EXISTS "Usuários com permissão podem editar empresas" ON companies;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir empresas" ON companies;
DROP POLICY IF EXISTS "Users can read all companies" ON companies;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view companies from their organization" ON companies;
CREATE POLICY "Users can view companies from their organization"
  ON companies FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert companies in their organization" ON companies;
CREATE POLICY "Users can insert companies in their organization"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update companies from their organization" ON companies;
CREATE POLICY "Users can update companies from their organization"
  ON companies FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete companies from their organization" ON companies;
CREATE POLICY "Users can delete companies from their organization"
  ON companies FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- CONTACTS
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Usuários com permissão podem ver contatos" ON contacts;
DROP POLICY IF EXISTS "Usuários com permissão podem criar contatos" ON contacts;
DROP POLICY IF EXISTS "Usuários com permissão podem editar contatos" ON contacts;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir contatos" ON contacts;
DROP POLICY IF EXISTS "Users can read all contacts" ON contacts;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view contacts from their organization" ON contacts;
CREATE POLICY "Users can view contacts from their organization"
  ON contacts FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert contacts in their organization" ON contacts;
CREATE POLICY "Users can insert contacts in their organization"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update contacts from their organization" ON contacts;
CREATE POLICY "Users can update contacts from their organization"
  ON contacts FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete contacts from their organization" ON contacts;
CREATE POLICY "Users can delete contacts from their organization"
  ON contacts FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- LOSS REASONS
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar motivos de perda" ON loss_reasons;
DROP POLICY IF EXISTS "Usuários autenticados podem criar motivos de perda" ON loss_reasons;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar motivos de perda" ON loss_reasons;

-- Keep organization-based policies with optimization (already exist, just recreate optimized)
DROP POLICY IF EXISTS "Users can view loss reasons from their organization" ON loss_reasons;
CREATE POLICY "Users can view loss reasons from their organization"
  ON loss_reasons FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert loss reasons in their organization" ON loss_reasons;
CREATE POLICY "Users can insert loss reasons in their organization"
  ON loss_reasons FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update loss reasons from their organization" ON loss_reasons;
CREATE POLICY "Users can update loss reasons from their organization"
  ON loss_reasons FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- OPPORTUNITY TIMELINE
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Usuários podem ver timeline" ON opportunity_timeline;
DROP POLICY IF EXISTS "Usuários podem criar eventos na timeline" ON opportunity_timeline;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar timeline" ON opportunity_timeline;
DROP POLICY IF EXISTS "Usuários autenticados podem criar eventos de timeline" ON opportunity_timeline;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view timeline from their organization" ON opportunity_timeline;
CREATE POLICY "Users can view timeline from their organization"
  ON opportunity_timeline FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert timeline in their organization" ON opportunity_timeline;
CREATE POLICY "Users can insert timeline in their organization"
  ON opportunity_timeline FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update timeline from their organization" ON opportunity_timeline;
CREATE POLICY "Users can update timeline from their organization"
  ON opportunity_timeline FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================

-- Optimize existing policies
DROP POLICY IF EXISTS "Usuários podem ver própria organização" ON organizations;
CREATE POLICY "Usuários podem ver própria organização"
  ON organizations FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Super admins podem ver todas organizações" ON organizations;
CREATE POLICY "Super admins podem ver todas organizações"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM system_users WHERE id = (SELECT auth.uid())) = 'super_admin'
  );

-- ============================================================================
-- PIPELINE STAGES
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Admins podem criar estágios" ON pipeline_stages;
DROP POLICY IF EXISTS "Admins podem editar estágios" ON pipeline_stages;
DROP POLICY IF EXISTS "Admins podem excluir estágios" ON pipeline_stages;
DROP POLICY IF EXISTS "Usuários podem ver estágios de pipeline" ON pipeline_stages;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar estágios" ON pipeline_stages;
DROP POLICY IF EXISTS "Usuários autenticados podem criar estágios" ON pipeline_stages;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar estágios" ON pipeline_stages;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar estágios" ON pipeline_stages;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view stages from their organization" ON pipeline_stages;
CREATE POLICY "Users can view stages from their organization"
  ON pipeline_stages FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert stages in their organization" ON pipeline_stages;
CREATE POLICY "Users can insert stages in their organization"
  ON pipeline_stages FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update stages from their organization" ON pipeline_stages;
CREATE POLICY "Users can update stages from their organization"
  ON pipeline_stages FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete stages from their organization" ON pipeline_stages;
CREATE POLICY "Users can delete stages from their organization"
  ON pipeline_stages FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- SALES OPPORTUNITIES
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Usuários com permissão podem ver oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários com permissão podem criar oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários com permissão podem editar oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários autenticados podem criar oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar oportunidades" ON sales_opportunities;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar oportunidades que criaram" ON sales_opportunities;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view opportunities from their organization" ON sales_opportunities;
CREATE POLICY "Users can view opportunities from their organization"
  ON sales_opportunities FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert opportunities in their organization" ON sales_opportunities;
CREATE POLICY "Users can insert opportunities in their organization"
  ON sales_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update opportunities from their organization" ON sales_opportunities;
CREATE POLICY "Users can update opportunities from their organization"
  ON sales_opportunities FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete opportunities from their organization" ON sales_opportunities;
CREATE POLICY "Users can delete opportunities from their organization"
  ON sales_opportunities FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- SALES PIPELINES
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Admins podem criar pipelines" ON sales_pipelines;
DROP POLICY IF EXISTS "Admins podem editar pipelines" ON sales_pipelines;
DROP POLICY IF EXISTS "Admins podem excluir pipelines" ON sales_pipelines;
DROP POLICY IF EXISTS "Usuários podem ver pipelines" ON sales_pipelines;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar pipelines ativos" ON sales_pipelines;
DROP POLICY IF EXISTS "Usuários autenticados podem criar pipelines" ON sales_pipelines;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar pipelines que criaram" ON sales_pipelines;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar pipelines que criaram" ON sales_pipelines;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view pipelines from their organization" ON sales_pipelines;
CREATE POLICY "Users can view pipelines from their organization"
  ON sales_pipelines FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert pipelines in their organization" ON sales_pipelines;
CREATE POLICY "Users can insert pipelines in their organization"
  ON sales_pipelines FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update pipelines from their organization" ON sales_pipelines;
CREATE POLICY "Users can update pipelines from their organization"
  ON sales_pipelines FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete pipelines from their organization" ON sales_pipelines;
CREATE POLICY "Users can delete pipelines from their organization"
  ON sales_pipelines FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- SYSTEM USERS
-- ============================================================================

-- Optimize existing policies
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON system_users;
CREATE POLICY "Usuários podem ver próprio perfil"
  ON system_users FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Usuários podem ver colegas da mesma organização" ON system_users;
CREATE POLICY "Usuários podem ver colegas da mesma organização"
  ON system_users FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Admins podem criar usuários na própria organização" ON system_users;
CREATE POLICY "Admins podem criar usuários na própria organização"
  ON system_users FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM system_users WHERE id = (SELECT auth.uid())) IN ('admin', 'super_admin')
    AND organization_id IN (
      SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins podem atualizar usuários da própria organiza" ON system_users;
CREATE POLICY "Admins podem atualizar usuários da própria organiza"
  ON system_users FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM system_users WHERE id = (SELECT auth.uid())) IN ('admin', 'super_admin')
    AND organization_id IN (
      SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    (SELECT role FROM system_users WHERE id = (SELECT auth.uid())) IN ('admin', 'super_admin')
    AND organization_id IN (
      SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- VEHICLE CATEGORIES
-- ============================================================================

-- Optimize existing policies
DROP POLICY IF EXISTS "Users can view categories from their organization" ON vehicle_categories;
CREATE POLICY "Users can view categories from their organization"
  ON vehicle_categories FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert categories in their organization" ON vehicle_categories;
CREATE POLICY "Users can insert categories in their organization"
  ON vehicle_categories FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update categories in their organization" ON vehicle_categories;
CREATE POLICY "Users can update categories in their organization"
  ON vehicle_categories FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete categories in their organization" ON vehicle_categories;
CREATE POLICY "Users can delete categories in their organization"
  ON vehicle_categories FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- VEHICLE SUBCATEGORIES
-- ============================================================================

-- Optimize existing policies
DROP POLICY IF EXISTS "Users can view subcategories from their organization" ON vehicle_subcategories;
CREATE POLICY "Users can view subcategories from their organization"
  ON vehicle_subcategories FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert subcategories in their organization" ON vehicle_subcategories;
CREATE POLICY "Users can insert subcategories in their organization"
  ON vehicle_subcategories FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update subcategories in their organization" ON vehicle_subcategories;
CREATE POLICY "Users can update subcategories in their organization"
  ON vehicle_subcategories FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete subcategories in their organization" ON vehicle_subcategories;
CREATE POLICY "Users can delete subcategories in their organization"
  ON vehicle_subcategories FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- CHASSIS MANUFACTURERS
-- ============================================================================

-- Optimize existing policies
DROP POLICY IF EXISTS "Users can view chassis manufacturers from their organization" ON chassis_manufacturers;
CREATE POLICY "Users can view chassis manufacturers from their organization"
  ON chassis_manufacturers FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert chassis manufacturers in their organization" ON chassis_manufacturers;
CREATE POLICY "Users can insert chassis manufacturers in their organization"
  ON chassis_manufacturers FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update chassis manufacturers in their organization" ON chassis_manufacturers;
CREATE POLICY "Users can update chassis manufacturers in their organization"
  ON chassis_manufacturers FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete chassis manufacturers in their organization" ON chassis_manufacturers;
CREATE POLICY "Users can delete chassis manufacturers in their organization"
  ON chassis_manufacturers FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- BODYWORK MANUFACTURERS
-- ============================================================================

-- Optimize existing policies
DROP POLICY IF EXISTS "Users can view bodywork manufacturers from their organization" ON bodywork_manufacturers;
CREATE POLICY "Users can view bodywork manufacturers from their organization"
  ON bodywork_manufacturers FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert bodywork manufacturers in their organization" ON bodywork_manufacturers;
CREATE POLICY "Users can insert bodywork manufacturers in their organization"
  ON bodywork_manufacturers FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update bodywork manufacturers in their organization" ON bodywork_manufacturers;
CREATE POLICY "Users can update bodywork manufacturers in their organization"
  ON bodywork_manufacturers FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete bodywork manufacturers in their organization" ON bodywork_manufacturers;
CREATE POLICY "Users can delete bodywork manufacturers in their organization"
  ON bodywork_manufacturers FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

-- ============================================================================
-- VEHICLES
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Usuários com permissão podem ver veículos" ON vehicles;
DROP POLICY IF EXISTS "Usuários com permissão podem criar veículos" ON vehicles;
DROP POLICY IF EXISTS "Usuários com permissão podem editar veículos" ON vehicles;
DROP POLICY IF EXISTS "Usuários com permissão podem excluir veículos" ON vehicles;
DROP POLICY IF EXISTS "Users can read all vehicles" ON vehicles;

-- Keep organization-based policies with optimization
DROP POLICY IF EXISTS "Users can view vehicles from their organization" ON vehicles;
CREATE POLICY "Users can view vehicles from their organization"
  ON vehicles FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can insert vehicles in their organization" ON vehicles;
CREATE POLICY "Users can insert vehicles in their organization"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can update vehicles from their organization" ON vehicles;
CREATE POLICY "Users can update vehicles from their organization"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete vehicles from their organization" ON vehicles;
CREATE POLICY "Users can delete vehicles from their organization"
  ON vehicles FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = (SELECT auth.uid())
  ));