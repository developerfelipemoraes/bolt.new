/*
  # Fix Function Search Paths

  ## Security Enhancement
  
  Sets fixed search paths for database functions to prevent search_path manipulation attacks.
  Functions with mutable search paths can be exploited if an attacker can modify the search_path.
  
  ## Functions Modified
  - update_updated_at_column
  - get_user_organization_id
  - generate_opportunity_number
  - has_permission
  
  ## Security Impact
  
  By setting a fixed search_path, these functions will always use the specified schema,
  preventing potential SQL injection or privilege escalation attacks.
*/

-- Drop and recreate update_updated_at_column function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate get_user_organization_id function
DROP FUNCTION IF EXISTS get_user_organization_id() CASCADE;
CREATE FUNCTION get_user_organization_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  org_id uuid;
BEGIN
  SELECT organization_id INTO org_id
  FROM system_users
  WHERE id = auth.uid();
  
  RETURN org_id;
END;
$$;

-- Drop and recreate generate_opportunity_number function
DROP FUNCTION IF EXISTS generate_opportunity_number() CASCADE;
CREATE FUNCTION generate_opportunity_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_number text;
  year_suffix text;
  counter int;
BEGIN
  year_suffix := to_char(now(), 'YY');
  
  SELECT COUNT(*) + 1 INTO counter
  FROM sales_opportunities
  WHERE opportunity_number LIKE 'OPP-' || year_suffix || '%';
  
  new_number := 'OPP-' || year_suffix || '-' || LPAD(counter::text, 6, '0');
  
  RETURN new_number;
END;
$$;

-- Drop and recreate has_permission function
DROP FUNCTION IF EXISTS has_permission(text) CASCADE;
CREATE FUNCTION has_permission(permission_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role text;
  has_perm boolean;
BEGIN
  SELECT role INTO user_role
  FROM system_users
  WHERE id = auth.uid();
  
  IF user_role = 'super_admin' THEN
    RETURN true;
  END IF;
  
  SELECT EXISTS (
    SELECT 1
    FROM role_permissions rp
    JOIN permissions p ON p.id = rp.permission_id
    WHERE rp.role = user_role
    AND p.name = permission_name
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$;

-- Recreate triggers that use update_updated_at_column
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT DISTINCT event_object_table 
    FROM information_schema.triggers 
    WHERE trigger_name LIKE '%updated_at%'
    AND event_object_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', r.event_object_table);
    EXECUTE format('
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    ', r.event_object_table);
  END LOOP;
END;
$$;