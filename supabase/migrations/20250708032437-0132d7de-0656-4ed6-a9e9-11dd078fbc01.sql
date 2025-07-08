-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own puskesmas assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can insert own puskesmas assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can update own puskesmas assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can view own puskesmas evaluations" ON public.quarterly_evaluations;
DROP POLICY IF EXISTS "Users can insert own puskesmas evaluations" ON public.quarterly_evaluations;
DROP POLICY IF EXISTS "Users can update own puskesmas evaluations" ON public.quarterly_evaluations;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_user_puskesmas()
RETURNS UUID AS $$
  SELECT puskesmas_id FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create safe RLS policies for user_profiles
CREATE POLICY "view_own_profile" ON public.user_profiles FOR SELECT TO authenticated 
    USING (id = auth.uid());

CREATE POLICY "update_own_profile" ON public.user_profiles FOR UPDATE TO authenticated 
    USING (id = auth.uid());

CREATE POLICY "insert_own_profile" ON public.user_profiles FOR INSERT TO authenticated 
    WITH CHECK (id = auth.uid());

-- Create safe RLS policies for assessments
CREATE POLICY "view_assessments" ON public.assessments FOR SELECT TO authenticated 
    USING (
        puskesmas_id = public.get_current_user_puskesmas() OR
        public.get_current_user_role() IN ('admin_dinkes', 'verifikator')
    );

CREATE POLICY "insert_assessments" ON public.assessments FOR INSERT TO authenticated 
    WITH CHECK (
        puskesmas_id = public.get_current_user_puskesmas() AND
        user_id = auth.uid()
    );

CREATE POLICY "update_assessments" ON public.assessments FOR UPDATE TO authenticated 
    USING (
        puskesmas_id = public.get_current_user_puskesmas() OR
        public.get_current_user_role() IN ('admin_dinkes', 'verifikator')
    );

-- Create safe RLS policies for quarterly_evaluations
CREATE POLICY "view_evaluations" ON public.quarterly_evaluations FOR SELECT TO authenticated 
    USING (
        puskesmas_id = public.get_current_user_puskesmas() OR
        public.get_current_user_role() IN ('admin_dinkes', 'verifikator')
    );

CREATE POLICY "insert_evaluations" ON public.quarterly_evaluations FOR INSERT TO authenticated 
    WITH CHECK (
        puskesmas_id = public.get_current_user_puskesmas() AND
        user_id = auth.uid()
    );

CREATE POLICY "update_evaluations" ON public.quarterly_evaluations FOR UPDATE TO authenticated 
    USING (
        puskesmas_id = public.get_current_user_puskesmas() OR
        public.get_current_user_role() IN ('admin_dinkes', 'verifikator')
    );