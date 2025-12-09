/*
  # Add Missing Foreign Key Indexes

  ## Performance Optimization
  
  This migration adds indexes for all foreign key columns that were missing indexes,
  which improves query performance when joining tables or filtering by foreign keys.
  
  ## New Indexes Added
  
  ### User Tracking Foreign Keys
  - `bodywork_manufacturers.created_by`
  - `bodywork_models.created_by`
  - `chassis_manufacturers.created_by`
  - `chassis_models.created_by`
  - `companies.created_by`
  - `contacts.created_by`
  - `opportunity_timeline.created_by`
  - `sales_opportunities.assigned_to`
  - `sales_opportunities.created_by`
  - `sales_pipelines.created_by`
  - `vehicle_categories.created_by`
  - `vehicle_subcategories.created_by`
  - `vehicles.created_by`
  
  ### Relationship Foreign Keys
  - `contacts.company_id` (fk_contacts_company)
  - `role_permissions.permission_id`
  - `sales_opportunities.supplier_id` (fk_opportunities_supplier)
  - `sales_opportunities.vehicle_id` (fk_opportunities_vehicle)
  - `sales_opportunities.loss_reason_id`
  
  ## Performance Impact
  
  These indexes significantly improve:
  - JOIN operations between tables
  - Filtering queries by foreign key values
  - Aggregate queries grouped by foreign keys
  - Row Level Security policy evaluation
*/

-- Bodywork manufacturers
CREATE INDEX IF NOT EXISTS idx_bodywork_manufacturers_created_by 
  ON bodywork_manufacturers(created_by);

-- Bodywork models
CREATE INDEX IF NOT EXISTS idx_bodywork_models_created_by 
  ON bodywork_models(created_by);

-- Chassis manufacturers
CREATE INDEX IF NOT EXISTS idx_chassis_manufacturers_created_by 
  ON chassis_manufacturers(created_by);

-- Chassis models
CREATE INDEX IF NOT EXISTS idx_chassis_models_created_by 
  ON chassis_models(created_by);

-- Companies
CREATE INDEX IF NOT EXISTS idx_companies_created_by 
  ON companies(created_by);

-- Contacts
CREATE INDEX IF NOT EXISTS idx_contacts_created_by 
  ON contacts(created_by);

CREATE INDEX IF NOT EXISTS idx_contacts_company_id 
  ON contacts(company_id);

-- Opportunity timeline
CREATE INDEX IF NOT EXISTS idx_opportunity_timeline_created_by 
  ON opportunity_timeline(created_by);

-- Role permissions
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id 
  ON role_permissions(permission_id);

-- Sales opportunities
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_supplier_id 
  ON sales_opportunities(supplier_id);

CREATE INDEX IF NOT EXISTS idx_sales_opportunities_vehicle_id 
  ON sales_opportunities(vehicle_id);

CREATE INDEX IF NOT EXISTS idx_sales_opportunities_assigned_to 
  ON sales_opportunities(assigned_to);

CREATE INDEX IF NOT EXISTS idx_sales_opportunities_created_by 
  ON sales_opportunities(created_by);

CREATE INDEX IF NOT EXISTS idx_sales_opportunities_loss_reason_id 
  ON sales_opportunities(loss_reason_id);

-- Sales pipelines
CREATE INDEX IF NOT EXISTS idx_sales_pipelines_created_by 
  ON sales_pipelines(created_by);

-- Vehicle categories
CREATE INDEX IF NOT EXISTS idx_vehicle_categories_created_by 
  ON vehicle_categories(created_by);

-- Vehicle subcategories
CREATE INDEX IF NOT EXISTS idx_vehicle_subcategories_created_by 
  ON vehicle_subcategories(created_by);

-- Vehicles
CREATE INDEX IF NOT EXISTS idx_vehicles_created_by 
  ON vehicles(created_by);