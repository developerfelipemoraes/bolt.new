/*
  # Implementação completa de Multi-Tenancy (Multi-Empresa)
  
  ## Objetivo
  Transformar o sistema em 100% multi-empresa com isolamento total de dados.
  Cada organização terá seus próprios dados isolados e inacessíveis para outras organizações.
  
  ## Alterações nas Tabelas
  
  ### Tabelas que recebem organization_id:
  1. **contacts** - Contatos isolados por organização
  2. **companies** - Empresas clientes isoladas por organização
  3. **vehicles** - Veículos isolados por organização
  4. **sales_opportunities** - Oportunidades isoladas por organização
  5. **sales_pipelines** - Pipelines isolados por organização
  6. **pipeline_stages** - Estágios isolados por organização
  7. **chassis_models** - Modelos de chassis isolados por organização
  8. **bodywork_models** - Modelos de carroceria isolados por organização
  9. **loss_reasons** - Motivos de perda isolados por organização
  10. **opportunity_timeline** - Timeline de oportunidades isolada por organização
  
  ## Segurança (RLS Policies)
  
  Todas as tabelas terão policies restritivas que:
  - Permitem acesso APENAS aos dados da organização do usuário
  - Verificam organization_id em TODAS as operações (SELECT, INSERT, UPDATE, DELETE)
  - Impedem acesso cross-tenant (entre organizações)
  - Garantem que usuários sem organização não acessem nada
  
  ## Índices para Performance
  
  Índices compostos em (organization_id, created_at) para:
  - Otimizar queries filtradas por organização
  - Acelerar ordenação por data de criação
  - Melhorar performance em listas paginadas
  
  ## Notas Importantes
  
  1. Dados existentes: Se houver dados nas tabelas, organization_id será NULL inicialmente
  2. Migração de dados: Será necessário popular organization_id manualmente ou via script
  3. NOT NULL: Após popular os dados, pode-se adicionar constraint NOT NULL
  4. Integridade: Foreign keys garantem que organization_id sempre aponte para organização válida
*/

-- ============================================================================
-- STEP 1: Add organization_id column to all tables
-- ============================================================================

-- Add to contacts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE contacts ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_contacts_organization_id ON contacts(organization_id);
    CREATE INDEX IF NOT EXISTS idx_contacts_org_created ON contacts(organization_id, created_at DESC);
  END IF;
END $$;

-- Add to companies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE companies ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_companies_organization_id ON companies(organization_id);
    CREATE INDEX IF NOT EXISTS idx_companies_org_created ON companies(organization_id, created_at DESC);
  END IF;
END $$;

-- Add to vehicles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE vehicles ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_vehicles_organization_id ON vehicles(organization_id);
    CREATE INDEX IF NOT EXISTS idx_vehicles_org_created ON vehicles(organization_id, created_at DESC);
  END IF;
END $$;

-- Add to sales_opportunities
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales_opportunities' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE sales_opportunities ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_opportunities_organization_id ON sales_opportunities(organization_id);
    CREATE INDEX IF NOT EXISTS idx_opportunities_org_created ON sales_opportunities(organization_id, created_at DESC);
  END IF;
END $$;

-- Add to sales_pipelines
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales_pipelines' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE sales_pipelines ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_pipelines_organization_id ON sales_pipelines(organization_id);
    CREATE INDEX IF NOT EXISTS idx_pipelines_org_created ON sales_pipelines(organization_id, created_at DESC);
  END IF;
END $$;

-- Add to pipeline_stages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pipeline_stages' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE pipeline_stages ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_stages_organization_id ON pipeline_stages(organization_id);
    CREATE INDEX IF NOT EXISTS idx_stages_org_pipeline ON pipeline_stages(organization_id, pipeline_id);
  END IF;
END $$;

-- Add to chassis_models
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chassis_models' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE chassis_models ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_chassis_organization_id ON chassis_models(organization_id);
    CREATE INDEX IF NOT EXISTS idx_chassis_org_created ON chassis_models(organization_id, created_at DESC);
  END IF;
END $$;

-- Add to bodywork_models
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bodywork_models' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE bodywork_models ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_bodywork_organization_id ON bodywork_models(organization_id);
    CREATE INDEX IF NOT EXISTS idx_bodywork_org_created ON bodywork_models(organization_id, created_at DESC);
  END IF;
END $$;

-- Add to loss_reasons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loss_reasons' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE loss_reasons ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_loss_reasons_organization_id ON loss_reasons(organization_id);
    CREATE INDEX IF NOT EXISTS idx_loss_reasons_org_created ON loss_reasons(organization_id, created_at DESC);
  END IF;
END $$;

-- Add to opportunity_timeline
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'opportunity_timeline' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE opportunity_timeline ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_timeline_organization_id ON opportunity_timeline(organization_id);
    CREATE INDEX IF NOT EXISTS idx_timeline_org_created ON opportunity_timeline(organization_id, created_at DESC);
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Drop existing policies and create new organization-aware policies
-- ============================================================================

-- Helper function to get user's organization_id
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id 
  FROM system_users 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- ============================================================================
-- CONTACTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON contacts;
DROP POLICY IF EXISTS "Users can insert own data" ON contacts;
DROP POLICY IF EXISTS "Users can update own data" ON contacts;
DROP POLICY IF EXISTS "Users can delete own data" ON contacts;

CREATE POLICY "Users can view contacts from their organization"
  ON contacts FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert contacts in their organization"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update contacts from their organization"
  ON contacts FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete contacts from their organization"
  ON contacts FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- COMPANIES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON companies;
DROP POLICY IF EXISTS "Users can insert own data" ON companies;
DROP POLICY IF EXISTS "Users can update own data" ON companies;
DROP POLICY IF EXISTS "Users can delete own data" ON companies;

CREATE POLICY "Users can view companies from their organization"
  ON companies FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert companies in their organization"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update companies from their organization"
  ON companies FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete companies from their organization"
  ON companies FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- VEHICLES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON vehicles;
DROP POLICY IF EXISTS "Users can insert own data" ON vehicles;
DROP POLICY IF EXISTS "Users can update own data" ON vehicles;
DROP POLICY IF EXISTS "Users can delete own data" ON vehicles;

CREATE POLICY "Users can view vehicles from their organization"
  ON vehicles FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert vehicles in their organization"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update vehicles from their organization"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete vehicles from their organization"
  ON vehicles FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- SALES_OPPORTUNITIES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON sales_opportunities;
DROP POLICY IF EXISTS "Users can insert own data" ON sales_opportunities;
DROP POLICY IF EXISTS "Users can update own data" ON sales_opportunities;
DROP POLICY IF EXISTS "Users can delete own data" ON sales_opportunities;

CREATE POLICY "Users can view opportunities from their organization"
  ON sales_opportunities FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert opportunities in their organization"
  ON sales_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update opportunities from their organization"
  ON sales_opportunities FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete opportunities from their organization"
  ON sales_opportunities FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- SALES_PIPELINES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON sales_pipelines;
DROP POLICY IF EXISTS "Users can insert own data" ON sales_pipelines;
DROP POLICY IF EXISTS "Users can update own data" ON sales_pipelines;
DROP POLICY IF EXISTS "Users can delete own data" ON sales_pipelines;

CREATE POLICY "Users can view pipelines from their organization"
  ON sales_pipelines FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert pipelines in their organization"
  ON sales_pipelines FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update pipelines from their organization"
  ON sales_pipelines FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete pipelines from their organization"
  ON sales_pipelines FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- PIPELINE_STAGES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON pipeline_stages;
DROP POLICY IF EXISTS "Users can insert own data" ON pipeline_stages;
DROP POLICY IF EXISTS "Users can update own data" ON pipeline_stages;
DROP POLICY IF EXISTS "Users can delete own data" ON pipeline_stages;

CREATE POLICY "Users can view stages from their organization"
  ON pipeline_stages FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert stages in their organization"
  ON pipeline_stages FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update stages from their organization"
  ON pipeline_stages FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete stages from their organization"
  ON pipeline_stages FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- CHASSIS_MODELS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON chassis_models;
DROP POLICY IF EXISTS "Users can insert own data" ON chassis_models;
DROP POLICY IF EXISTS "Users can update own data" ON chassis_models;
DROP POLICY IF EXISTS "Users can delete own data" ON chassis_models;

CREATE POLICY "Users can view chassis models from their organization"
  ON chassis_models FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert chassis models in their organization"
  ON chassis_models FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update chassis models from their organization"
  ON chassis_models FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete chassis models from their organization"
  ON chassis_models FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- BODYWORK_MODELS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON bodywork_models;
DROP POLICY IF EXISTS "Users can insert own data" ON bodywork_models;
DROP POLICY IF EXISTS "Users can update own data" ON bodywork_models;
DROP POLICY IF EXISTS "Users can delete own data" ON bodywork_models;

CREATE POLICY "Users can view bodywork models from their organization"
  ON bodywork_models FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert bodywork models in their organization"
  ON bodywork_models FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update bodywork models from their organization"
  ON bodywork_models FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete bodywork models from their organization"
  ON bodywork_models FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- LOSS_REASONS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON loss_reasons;
DROP POLICY IF EXISTS "Users can insert own data" ON loss_reasons;
DROP POLICY IF EXISTS "Users can update own data" ON loss_reasons;
DROP POLICY IF EXISTS "Users can delete own data" ON loss_reasons;

CREATE POLICY "Users can view loss reasons from their organization"
  ON loss_reasons FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert loss reasons in their organization"
  ON loss_reasons FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update loss reasons from their organization"
  ON loss_reasons FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete loss reasons from their organization"
  ON loss_reasons FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- OPPORTUNITY_TIMELINE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own data" ON opportunity_timeline;
DROP POLICY IF EXISTS "Users can insert own data" ON opportunity_timeline;
DROP POLICY IF EXISTS "Users can update own data" ON opportunity_timeline;
DROP POLICY IF EXISTS "Users can delete own data" ON opportunity_timeline;

CREATE POLICY "Users can view timeline from their organization"
  ON opportunity_timeline FOR SELECT
  TO authenticated
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert timeline in their organization"
  ON opportunity_timeline FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update timeline from their organization"
  ON opportunity_timeline FOR UPDATE
  TO authenticated
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete timeline from their organization"
  ON opportunity_timeline FOR DELETE
  TO authenticated
  USING (organization_id = get_user_organization_id());

-- ============================================================================
-- STEP 3: Add comments for documentation
-- ============================================================================

COMMENT ON FUNCTION get_user_organization_id() IS 
'Returns the organization_id of the currently authenticated user. Used by RLS policies to enforce multi-tenancy.';

COMMENT ON COLUMN contacts.organization_id IS 'Organization that owns this contact. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN companies.organization_id IS 'Organization that owns this company. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN vehicles.organization_id IS 'Organization that owns this vehicle. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN sales_opportunities.organization_id IS 'Organization that owns this opportunity. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN sales_pipelines.organization_id IS 'Organization that owns this pipeline. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN pipeline_stages.organization_id IS 'Organization that owns this stage. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN chassis_models.organization_id IS 'Organization that owns this chassis model. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN bodywork_models.organization_id IS 'Organization that owns this bodywork model. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN loss_reasons.organization_id IS 'Organization that owns this loss reason. Ensures multi-tenant data isolation.';
COMMENT ON COLUMN opportunity_timeline.organization_id IS 'Organization that owns this timeline event. Ensures multi-tenant data isolation.';
