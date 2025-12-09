/*
  # Criação da Estrutura Completa de Taxonomia e Modelos de Veículos
  
  1. Novas Tabelas
    - `vehicle_categories` - Categorias de veículos (Urbano, Rodoviário, Turismo, etc.)
    - `vehicle_subcategories` - Subcategorias (Básico, Midi, Padron, Articulado, etc.)
    - `chassis_manufacturers` - Fabricantes de chassi (Agrale, Mercedes, Volvo, etc.)
    - `bodywork_manufacturers` - Fabricantes de carroceria (Busscar, Marcopolo, Caio, etc.)
    - Expansão de `chassis_models` e `bodywork_models` com campos técnicos completos
  
  2. Segurança
    - RLS habilitado em todas as tabelas
    - Policies para controle por organização
    - Apenas usuários autenticados podem acessar dados de sua organização
  
  3. Índices
    - Otimização de buscas por organização, fabricante, categoria
    - Índices GIN para campos JSONB
*/

-- =====================================================
-- CATEGORIAS E SUBCATEGORIAS DE VEÍCULOS
-- =====================================================

CREATE TABLE IF NOT EXISTS vehicle_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(organization_id, name)
);

CREATE TABLE IF NOT EXISTS vehicle_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES vehicle_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(organization_id, category_id, name)
);

-- =====================================================
-- FABRICANTES
-- =====================================================

CREATE TABLE IF NOT EXISTS chassis_manufacturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  country text DEFAULT 'Brasil',
  website text,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(organization_id, name)
);

CREATE TABLE IF NOT EXISTS bodywork_manufacturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  country text DEFAULT 'Brasil',
  website text,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(organization_id, name)
);

-- =====================================================
-- MODELOS DE CHASSI (EXPANDIDO)
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'manufacturer_id') THEN
    ALTER TABLE chassis_models ADD COLUMN manufacturer_id uuid REFERENCES chassis_manufacturers(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'chassis_model') THEN
    ALTER TABLE chassis_models ADD COLUMN chassis_model text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'vehicle_type') THEN
    ALTER TABLE chassis_models ADD COLUMN vehicle_type text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'drive_system') THEN
    ALTER TABLE chassis_models ADD COLUMN drive_system text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'axle_count') THEN
    ALTER TABLE chassis_models ADD COLUMN axle_count integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'production_start_year') THEN
    ALTER TABLE chassis_models ADD COLUMN production_start_year integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'production_end_year') THEN
    ALTER TABLE chassis_models ADD COLUMN production_end_year integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'in_production') THEN
    ALTER TABLE chassis_models ADD COLUMN in_production boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'engine_position') THEN
    ALTER TABLE chassis_models ADD COLUMN engine_position text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'emissions_standard') THEN
    ALTER TABLE chassis_models ADD COLUMN emissions_standard text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'fuel_type_enum') THEN
    ALTER TABLE chassis_models ADD COLUMN fuel_type_enum text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'segments') THEN
    ALTER TABLE chassis_models ADD COLUMN segments jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'manufacture_model_year_pairs') THEN
    ALTER TABLE chassis_models ADD COLUMN manufacture_model_year_pairs jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'engine') THEN
    ALTER TABLE chassis_models ADD COLUMN engine jsonb DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'injection') THEN
    ALTER TABLE chassis_models ADD COLUMN injection jsonb DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'transmission_data') THEN
    ALTER TABLE chassis_models ADD COLUMN transmission_data jsonb DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'suspension') THEN
    ALTER TABLE chassis_models ADD COLUMN suspension jsonb DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'wheels_tires') THEN
    ALTER TABLE chassis_models ADD COLUMN wheels_tires jsonb DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'brakes') THEN
    ALTER TABLE chassis_models ADD COLUMN brakes jsonb DEFAULT '{}'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chassis_models' AND column_name = 'source_metadata') THEN
    ALTER TABLE chassis_models ADD COLUMN source_metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- =====================================================
-- MODELOS DE CARROCERIA (EXPANDIDO)
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bodywork_models' AND column_name = 'manufacturer_id') THEN
    ALTER TABLE bodywork_models ADD COLUMN manufacturer_id uuid REFERENCES bodywork_manufacturers(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bodywork_models' AND column_name = 'category_id') THEN
    ALTER TABLE bodywork_models ADD COLUMN category_id uuid REFERENCES vehicle_categories(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bodywork_models' AND column_name = 'subcategory_id') THEN
    ALTER TABLE bodywork_models ADD COLUMN subcategory_id uuid REFERENCES vehicle_subcategories(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bodywork_models' AND column_name = 'production_start_year') THEN
    ALTER TABLE bodywork_models ADD COLUMN production_start_year integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bodywork_models' AND column_name = 'production_end_year') THEN
    ALTER TABLE bodywork_models ADD COLUMN production_end_year integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bodywork_models' AND column_name = 'year_entries_data') THEN
    ALTER TABLE bodywork_models ADD COLUMN year_entries_data jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bodywork_models' AND column_name = 'year_ranges') THEN
    ALTER TABLE bodywork_models ADD COLUMN year_ranges jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bodywork_models' AND column_name = 'year_rules') THEN
    ALTER TABLE bodywork_models ADD COLUMN year_rules jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_vehicle_categories_org ON vehicle_categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_categories_active ON vehicle_categories(organization_id, is_active);

CREATE INDEX IF NOT EXISTS idx_vehicle_subcategories_org ON vehicle_subcategories(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_subcategories_category ON vehicle_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_subcategories_active ON vehicle_subcategories(organization_id, is_active);

CREATE INDEX IF NOT EXISTS idx_chassis_manufacturers_org ON chassis_manufacturers(organization_id);
CREATE INDEX IF NOT EXISTS idx_chassis_manufacturers_active ON chassis_manufacturers(organization_id, is_active);

CREATE INDEX IF NOT EXISTS idx_bodywork_manufacturers_org ON bodywork_manufacturers(organization_id);
CREATE INDEX IF NOT EXISTS idx_bodywork_manufacturers_active ON bodywork_manufacturers(organization_id, is_active);

CREATE INDEX IF NOT EXISTS idx_chassis_models_manufacturer ON chassis_models(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_chassis_models_type ON chassis_models(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_chassis_models_production_years ON chassis_models(production_start_year, production_end_year);
CREATE INDEX IF NOT EXISTS idx_chassis_models_segments ON chassis_models USING gin(segments);

CREATE INDEX IF NOT EXISTS idx_bodywork_models_manufacturer ON bodywork_models(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_bodywork_models_category ON bodywork_models(category_id);
CREATE INDEX IF NOT EXISTS idx_bodywork_models_subcategory ON bodywork_models(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_bodywork_models_year_entries ON bodywork_models USING gin(year_entries_data);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE vehicle_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view categories from their organization"
  ON vehicle_categories FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert categories in their organization"
  ON vehicle_categories FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update categories in their organization"
  ON vehicle_categories FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete categories in their organization"
  ON vehicle_categories FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

ALTER TABLE vehicle_subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subcategories from their organization"
  ON vehicle_subcategories FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert subcategories in their organization"
  ON vehicle_subcategories FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update subcategories in their organization"
  ON vehicle_subcategories FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete subcategories in their organization"
  ON vehicle_subcategories FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

ALTER TABLE chassis_manufacturers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chassis manufacturers from their organization"
  ON chassis_manufacturers FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert chassis manufacturers in their organization"
  ON chassis_manufacturers FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update chassis manufacturers in their organization"
  ON chassis_manufacturers FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete chassis manufacturers in their organization"
  ON chassis_manufacturers FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

ALTER TABLE bodywork_manufacturers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bodywork manufacturers from their organization"
  ON bodywork_manufacturers FOR SELECT
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert bodywork manufacturers in their organization"
  ON bodywork_manufacturers FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update bodywork manufacturers in their organization"
  ON bodywork_manufacturers FOR UPDATE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ))
  WITH CHECK (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete bodywork manufacturers in their organization"
  ON bodywork_manufacturers FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM system_users WHERE id = auth.uid()
  ));