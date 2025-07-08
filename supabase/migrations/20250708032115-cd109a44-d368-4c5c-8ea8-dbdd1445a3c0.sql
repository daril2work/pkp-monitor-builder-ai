-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own puskesmas assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can update own puskesmas assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can view own puskesmas evaluations" ON public.quarterly_evaluations;
DROP POLICY IF EXISTS "Users can update own puskesmas evaluations" ON public.quarterly_evaluations;

-- Create security definer function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to get current user puskesmas safely
CREATE OR REPLACE FUNCTION public.get_current_user_puskesmas()
RETURNS UUID AS $$
  SELECT puskesmas_id FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new safe RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT TO authenticated 
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE TO authenticated 
    USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT TO authenticated 
    WITH CHECK (id = auth.uid());

-- Create new safe RLS policies for assessments
CREATE POLICY "Users can view assessments" ON public.assessments FOR SELECT TO authenticated 
    USING (
        -- Users can see their own puskesmas data
        puskesmas_id = public.get_current_user_puskesmas() OR
        -- Admins and verifikators can see all
        public.get_current_user_role() IN ('admin_dinkes', 'verifikator')
    );

CREATE POLICY "Users can insert assessments" ON public.assessments FOR INSERT TO authenticated 
    WITH CHECK (
        puskesmas_id = public.get_current_user_puskesmas() AND
        user_id = auth.uid()
    );

CREATE POLICY "Users can update assessments" ON public.assessments FOR UPDATE TO authenticated 
    USING (
        -- Users can update their own puskesmas data
        puskesmas_id = public.get_current_user_puskesmas() OR
        -- Admins and verifikators can update all (for verification)
        public.get_current_user_role() IN ('admin_dinkes', 'verifikator')
    );

-- Create new safe RLS policies for quarterly_evaluations
CREATE POLICY "Users can view evaluations" ON public.quarterly_evaluations FOR SELECT TO authenticated 
    USING (
        -- Users can see their own puskesmas data
        puskesmas_id = public.get_current_user_puskesmas() OR
        -- Admins and verifikators can see all
        public.get_current_user_role() IN ('admin_dinkes', 'verifikator')
    );

CREATE POLICY "Users can insert evaluations" ON public.quarterly_evaluations FOR INSERT TO authenticated 
    WITH CHECK (
        puskesmas_id = public.get_current_user_puskesmas() AND
        user_id = auth.uid()
    );

CREATE POLICY "Users can update evaluations" ON public.quarterly_evaluations FOR UPDATE TO authenticated 
    USING (
        -- Users can update their own puskesmas data
        puskesmas_id = public.get_current_user_puskesmas() OR
        -- Admins and verifikators can update all (for verification)
        public.get_current_user_role() IN ('admin_dinkes', 'verifikator')
    );