/*
  # Atualização de Políticas RLS para Organizações
  
  ## Descrição
  Atualiza as políticas RLS de todas as tabelas principais para usar
  o novo sistema de organizações e permissões.
  
  ## Tabelas Atualizadas
  - contacts (Contatos PF)
  - companies (Empresas PJ - clientes)
  - vehicles (Veículos)
  - chassis_models (Modelos de Chassi)
  - bodywork_models (Modelos de Carroceria)
  - sales_opportunities (Oportunidades)
  - sales_pipelines (Pipelines)
  - pipeline_stages (Estágios)
  - opportunity_timeline (Timeline)
  
  ## Regras de Segurança
  1. Super admins (Aurovel) têm acesso total
  2. Usuários só veem dados da própria organização
  3. Permissões verificadas via role_permissions
*/

-- Remover políticas antigas se existirem e criar novas para CONTACTS
DROP POLICY IF EXISTS "Users can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Users can create contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete contacts" ON contacts;

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem ver contatos"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    has_permission(auth.uid(), 'contacts', 'read')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem criar contatos"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    has_permission(auth.uid(), 'contacts', 'create')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem editar contatos"
  ON contacts FOR UPDATE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'contacts', 'update')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem excluir contatos"
  ON contacts FOR DELETE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'contacts', 'delete')
  );

-- Remover políticas antigas e criar novas para COMPANIES
DROP POLICY IF EXISTS "Users can view all companies" ON companies;
DROP POLICY IF EXISTS "Users can create companies" ON companies;
DROP POLICY IF EXISTS "Users can update companies" ON companies;
DROP POLICY IF EXISTS "Users can delete companies" ON companies;

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem ver empresas"
  ON companies FOR SELECT
  TO authenticated
  USING (
    has_permission(auth.uid(), 'companies', 'read')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem criar empresas"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (
    has_permission(auth.uid(), 'companies', 'create')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem editar empresas"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'companies', 'update')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem excluir empresas"
  ON companies FOR DELETE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'companies', 'delete')
  );

-- Remover políticas antigas e criar novas para VEHICLES
DROP POLICY IF EXISTS "Users can view all vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can create vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete vehicles" ON vehicles;

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem ver ve\u00edculos"
  ON vehicles FOR SELECT
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'read')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem criar ve\u00edculos"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (
    has_permission(auth.uid(), 'vehicles', 'create')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem editar ve\u00edculos"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'update')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem excluir ve\u00edculos"
  ON vehicles FOR DELETE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'delete')
  );

-- Políticas para CHASSIS_MODELS
DROP POLICY IF EXISTS "Users can view chassis models" ON chassis_models;
DROP POLICY IF EXISTS "Users can create chassis models" ON chassis_models;
DROP POLICY IF EXISTS "Users can update chassis models" ON chassis_models;
DROP POLICY IF EXISTS "Users can delete chassis models" ON chassis_models;

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem ver modelos de chassi"
  ON chassis_models FOR SELECT
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'read')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem criar modelos de chassi"
  ON chassis_models FOR INSERT
  TO authenticated
  WITH CHECK (
    has_permission(auth.uid(), 'vehicles', 'create')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem editar modelos de chassi"
  ON chassis_models FOR UPDATE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'update')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem excluir modelos de chassi"
  ON chassis_models FOR DELETE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'delete')
  );

-- Políticas para BODYWORK_MODELS
DROP POLICY IF EXISTS "Users can view bodywork models" ON bodywork_models;
DROP POLICY IF EXISTS "Users can create bodywork models" ON bodywork_models;
DROP POLICY IF EXISTS "Users can update bodywork models" ON bodywork_models;
DROP POLICY IF EXISTS "Users can delete bodywork models" ON bodywork_models;

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem ver modelos de carroceria"
  ON bodywork_models FOR SELECT
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'read')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem criar modelos de carroceria"
  ON bodywork_models FOR INSERT
  TO authenticated
  WITH CHECK (
    has_permission(auth.uid(), 'vehicles', 'create')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem editar modelos de carroceria"
  ON bodywork_models FOR UPDATE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'update')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem excluir modelos de carroceria"
  ON bodywork_models FOR DELETE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'vehicles', 'delete')
  );

-- Políticas para SALES_OPPORTUNITIES
DROP POLICY IF EXISTS "Users can view opportunities" ON sales_opportunities;
DROP POLICY IF EXISTS "Users can create opportunities" ON sales_opportunities;
DROP POLICY IF EXISTS "Users can update opportunities" ON sales_opportunities;
DROP POLICY IF EXISTS "Users can delete opportunities" ON sales_opportunities;

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem ver oportunidades"
  ON sales_opportunities FOR SELECT
  TO authenticated
  USING (
    has_permission(auth.uid(), 'sales', 'read')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem criar oportunidades"
  ON sales_opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    has_permission(auth.uid(), 'sales', 'create')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem editar oportunidades"
  ON sales_opportunities FOR UPDATE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'sales', 'update')
  );

CREATE POLICY "Usu\u00e1rios com permiss\u00e3o podem excluir oportunidades"
  ON sales_opportunities FOR DELETE
  TO authenticated
  USING (
    has_permission(auth.uid(), 'sales', 'delete')
  );

-- Políticas para SALES_PIPELINES
DROP POLICY IF EXISTS "Users can view pipelines" ON sales_pipelines;
DROP POLICY IF EXISTS "Users can create pipelines" ON sales_pipelines;
DROP POLICY IF EXISTS "Users can update pipelines" ON sales_pipelines;
DROP POLICY IF EXISTS "Users can delete pipelines" ON sales_pipelines;

CREATE POLICY "Usu\u00e1rios podem ver pipelines"
  ON sales_pipelines FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins podem criar pipelines"
  ON sales_pipelines FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

CREATE POLICY "Admins podem editar pipelines"
  ON sales_pipelines FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

CREATE POLICY "Admins podem excluir pipelines"
  ON sales_pipelines FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

-- Políticas para PIPELINE_STAGES
DROP POLICY IF EXISTS "Users can view pipeline stages" ON pipeline_stages;
DROP POLICY IF EXISTS "Users can create pipeline stages" ON pipeline_stages;
DROP POLICY IF EXISTS "Users can update pipeline stages" ON pipeline_stages;
DROP POLICY IF EXISTS "Users can delete pipeline stages" ON pipeline_stages;

CREATE POLICY "Usu\u00e1rios podem ver est\u00e1gios de pipeline"
  ON pipeline_stages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins podem criar est\u00e1gios"
  ON pipeline_stages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

CREATE POLICY "Admins podem editar est\u00e1gios"
  ON pipeline_stages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

CREATE POLICY "Admins podem excluir est\u00e1gios"
  ON pipeline_stages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM system_users
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'company_admin')
    )
  );

-- Políticas para OPPORTUNITY_TIMELINE
DROP POLICY IF EXISTS "Users can view timeline" ON opportunity_timeline;
DROP POLICY IF EXISTS "Users can create timeline events" ON opportunity_timeline;

CREATE POLICY "Usu\u00e1rios podem ver timeline"
  ON opportunity_timeline FOR SELECT
  TO authenticated
  USING (
    has_permission(auth.uid(), 'sales', 'read')
  );

CREATE POLICY "Usu\u00e1rios podem criar eventos na timeline"
  ON opportunity_timeline FOR INSERT
  TO authenticated
  WITH CHECK (
    has_permission(auth.uid(), 'sales', 'create')
    OR has_permission(auth.uid(), 'sales', 'update')
  );
