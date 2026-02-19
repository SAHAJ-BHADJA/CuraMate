/*
  # Fix Infinite Recursion in RLS Policies

  ## Problem
  Admin policies that query the profiles table create infinite recursion because:
  - Policy on medical_records checks profiles.role = 'admin'
  - This triggers a SELECT on profiles
  - Which triggers the profiles policy
  - Which may check profiles again, creating a loop

  ## Solution
  1. Create a security definer function to check admin role (bypasses RLS)
  2. Drop existing admin policies that cause recursion
  3. Recreate policies using the helper function

  ## Changes
  - Create `is_admin()` helper function
  - Update all admin policies to use the helper function
  - This breaks the recursion cycle
*/

-- Drop existing admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert doctors" ON doctors;
DROP POLICY IF EXISTS "Admins can update doctors" ON doctors;
DROP POLICY IF EXISTS "Admins can delete doctors" ON doctors;
DROP POLICY IF EXISTS "Admins can view all medical records" ON medical_records;
DROP POLICY IF EXISTS "Admins can view all documents" ON documents;
DROP POLICY IF EXISTS "Admins can view all reminders" ON reminders;
DROP POLICY IF EXISTS "Admins can view all wellness logs" ON wellness_logs;
DROP POLICY IF EXISTS "Admins can view all care plans" ON care_plans;
DROP POLICY IF EXISTS "Admins can update care plans" ON care_plans;
DROP POLICY IF EXISTS "Admins can view all consultations" ON consultations;
DROP POLICY IF EXISTS "Admins can update consultations" ON consultations;
DROP POLICY IF EXISTS "Admins can view all emergency alerts" ON emergency_alerts;
DROP POLICY IF EXISTS "Admins can update emergency alerts" ON emergency_alerts;
DROP POLICY IF EXISTS "Admins can view all feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON feedback;

-- Create helper function to check if user is admin (security definer bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Recreate admin policies using the helper function

-- Profiles admin policy
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- Doctors admin policies
CREATE POLICY "Admins can insert doctors"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update doctors"
  ON doctors FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete doctors"
  ON doctors FOR DELETE
  TO authenticated
  USING (is_admin());

-- Medical records admin policy
CREATE POLICY "Admins can view all medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (is_admin());

-- Documents admin policy
CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (is_admin());

-- Reminders admin policy
CREATE POLICY "Admins can view all reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (is_admin());

-- Wellness logs admin policy
CREATE POLICY "Admins can view all wellness logs"
  ON wellness_logs FOR SELECT
  TO authenticated
  USING (is_admin());

-- Care plans admin policies
CREATE POLICY "Admins can view all care plans"
  ON care_plans FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update care plans"
  ON care_plans FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Consultations admin policies
CREATE POLICY "Admins can view all consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update consultations"
  ON consultations FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Emergency alerts admin policies
CREATE POLICY "Admins can view all emergency alerts"
  ON emergency_alerts FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update emergency alerts"
  ON emergency_alerts FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Feedback admin policies
CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (is_admin());
