-- Create ENUM types
CREATE TYPE public.bundle_status AS ENUM ('draft', 'aktif', 'selesai');
CREATE TYPE public.indicator_type AS ENUM ('scoring', 'target_achievement');
CREATE TYPE public.periodicity AS ENUM ('annual', 'monthly');
CREATE TYPE public.user_role AS ENUM ('admin_dinkes', 'petugas_puskesmas', 'verifikator');
CREATE TYPE public.puskesmas_status AS ENUM ('aktif', 'nonaktif');
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'revision');

-- Create puskesmas table first (referenced by other tables)
CREATE TABLE public.puskesmas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_puskesmas TEXT NOT NULL,
    kode_puskesmas TEXT UNIQUE NOT NULL,
    alamat TEXT,
    kecamatan TEXT,
    kabupaten TEXT,
    telepon TEXT,
    status puskesmas_status NOT NULL DEFAULT 'aktif',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_lengkap TEXT NOT NULL,
    nip TEXT UNIQUE,
    jabatan TEXT,
    role user_role NOT NULL DEFAULT 'petugas_puskesmas',
    puskesmas_id UUID REFERENCES public.puskesmas(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bundles table
CREATE TABLE public.bundles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tahun INTEGER NOT NULL,
    judul TEXT NOT NULL,
    status bundle_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clusters table
CREATE TABLE public.clusters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
    nama_klaster TEXT NOT NULL,
    urutan INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indicators table
CREATE TABLE public.indicators (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
    nama_indikator TEXT NOT NULL,
    definisi_operasional TEXT,
    type indicator_type NOT NULL,
    urutan INTEGER NOT NULL,
    -- For scoring type
    scoring_criteria JSONB,
    -- For target_achievement type
    target_percentage DECIMAL(5,2),
    total_sasaran INTEGER,
    satuan TEXT,
    periodicity periodicity,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessments table
CREATE TABLE public.assessments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
    puskesmas_id UUID NOT NULL REFERENCES public.puskesmas(id) ON DELETE CASCADE,
    indicator_id UUID NOT NULL REFERENCES public.indicators(id) ON DELETE CASCADE,
    periode_triwulan INTEGER NOT NULL CHECK (periode_triwulan BETWEEN 1 AND 4),
    tahun INTEGER NOT NULL,
    -- For scoring type
    selected_score INTEGER CHECK (selected_score IN (0, 4, 7, 10)),
    -- For target_achievement type
    actual_achievement INTEGER,
    calculated_percentage DECIMAL(5,2),
    calculated_score DECIMAL(5,2),
    -- Common fields
    keterangan TEXT,
    bukti_dukung TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verification_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(bundle_id, puskesmas_id, indicator_id, periode_triwulan, tahun)
);

-- Create quarterly_evaluations table
CREATE TABLE public.quarterly_evaluations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
    puskesmas_id UUID NOT NULL REFERENCES public.puskesmas(id) ON DELETE CASCADE,
    periode_triwulan INTEGER NOT NULL CHECK (periode_triwulan BETWEEN 1 AND 4),
    tahun INTEGER NOT NULL,
    analisis_pencapaian TEXT,
    hambatan_kendala TEXT,
    rencana_tindak_lanjut TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verification_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(bundle_id, puskesmas_id, periode_triwulan, tahun)
);

-- Create indexes for better performance
CREATE INDEX idx_clusters_bundle_id ON public.clusters(bundle_id);
CREATE INDEX idx_indicators_cluster_id ON public.indicators(cluster_id);
CREATE INDEX idx_assessments_bundle_puskesmas ON public.assessments(bundle_id, puskesmas_id);
CREATE INDEX idx_assessments_indicator ON public.assessments(indicator_id);
CREATE INDEX idx_assessments_periode ON public.assessments(periode_triwulan, tahun);
CREATE INDEX idx_evaluations_bundle_puskesmas ON public.quarterly_evaluations(bundle_id, puskesmas_id);
CREATE INDEX idx_evaluations_periode ON public.quarterly_evaluations(periode_triwulan, tahun);
CREATE INDEX idx_user_profiles_puskesmas ON public.user_profiles(puskesmas_id);

-- Enable Row Level Security
ALTER TABLE public.puskesmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quarterly_evaluations ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Puskesmas: All authenticated users can view, only admin can modify
CREATE POLICY "Everyone can view puskesmas" ON public.puskesmas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage puskesmas" ON public.puskesmas FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin_dinkes'));

-- User profiles: Users can view their own profile, admin can view all
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT TO authenticated 
    USING (id = auth.uid() OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin_dinkes'));
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admin can manage all profiles" ON public.user_profiles FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin_dinkes'));

-- Bundles: All authenticated users can view, only admin can modify
CREATE POLICY "Everyone can view bundles" ON public.bundles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage bundles" ON public.bundles FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin_dinkes'));

-- Clusters: All authenticated users can view, only admin can modify
CREATE POLICY "Everyone can view clusters" ON public.clusters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage clusters" ON public.clusters FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin_dinkes'));

-- Indicators: All authenticated users can view, only admin can modify
CREATE POLICY "Everyone can view indicators" ON public.indicators FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage indicators" ON public.indicators FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin_dinkes'));

-- Assessments: Users can manage their puskesmas data, admin can view all
CREATE POLICY "Users can view own puskesmas assessments" ON public.assessments FOR SELECT TO authenticated 
    USING (
        puskesmas_id IN (SELECT puskesmas_id FROM public.user_profiles WHERE id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin_dinkes', 'verifikator'))
    );
CREATE POLICY "Users can insert own puskesmas assessments" ON public.assessments FOR INSERT TO authenticated 
    WITH CHECK (
        puskesmas_id IN (SELECT puskesmas_id FROM public.user_profiles WHERE id = auth.uid()) AND
        user_id = auth.uid()
    );
CREATE POLICY "Users can update own puskesmas assessments" ON public.assessments FOR UPDATE TO authenticated 
    USING (
        puskesmas_id IN (SELECT puskesmas_id FROM public.user_profiles WHERE id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin_dinkes', 'verifikator'))
    );

-- Quarterly evaluations: Similar to assessments
CREATE POLICY "Users can view own puskesmas evaluations" ON public.quarterly_evaluations FOR SELECT TO authenticated 
    USING (
        puskesmas_id IN (SELECT puskesmas_id FROM public.user_profiles WHERE id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin_dinkes', 'verifikator'))
    );
CREATE POLICY "Users can insert own puskesmas evaluations" ON public.quarterly_evaluations FOR INSERT TO authenticated 
    WITH CHECK (
        puskesmas_id IN (SELECT puskesmas_id FROM public.user_profiles WHERE id = auth.uid()) AND
        user_id = auth.uid()
    );
CREATE POLICY "Users can update own puskesmas evaluations" ON public.quarterly_evaluations FOR UPDATE TO authenticated 
    USING (
        puskesmas_id IN (SELECT puskesmas_id FROM public.user_profiles WHERE id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('admin_dinkes', 'verifikator'))
    );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_puskesmas_updated_at BEFORE UPDATE ON public.puskesmas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON public.bundles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clusters_updated_at BEFORE UPDATE ON public.clusters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_indicators_updated_at BEFORE UPDATE ON public.indicators FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON public.assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quarterly_evaluations_updated_at BEFORE UPDATE ON public.quarterly_evaluations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, nama_lengkap, role)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email), 
        'petugas_puskesmas'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();