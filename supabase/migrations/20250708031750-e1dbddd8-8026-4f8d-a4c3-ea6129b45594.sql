-- Insert sample Puskesmas data
INSERT INTO public.puskesmas (nama_puskesmas, kode_puskesmas, alamat, kecamatan, kabupaten, telepon, status) VALUES
('Puskesmas Kota Utara', 'PKM001', 'Jl. Kesehatan No. 123', 'Kota Utara', 'Kabupaten Sehat', '021-1234567', 'aktif'),
('Puskesmas Kota Selatan', 'PKM002', 'Jl. Pelayanan No. 456', 'Kota Selatan', 'Kabupaten Sehat', '021-7654321', 'aktif'),
('Puskesmas Kota Timur', 'PKM003', 'Jl. Medis No. 789', 'Kota Timur', 'Kabupaten Sehat', '021-9876543', 'aktif'),
('Puskesmas Kota Barat', 'PKM004', 'Jl. Dokter No. 321', 'Kota Barat', 'Kabupaten Sehat', '021-3456789', 'aktif'),
('Puskesmas Kota Tengah', 'PKM005', 'Jl. Kesehatan Masyarakat No. 654', 'Kota Tengah', 'Kabupaten Sehat', '021-6543210', 'aktif');

-- Insert sample Bundle for 2024
INSERT INTO public.bundles (tahun, judul, status) VALUES
(2024, 'Bundle PKP Yankes 2024', 'aktif');

-- Get the bundle ID for further insertions
DO $$
DECLARE
    bundle_uuid UUID;
    cluster1_uuid UUID;
    cluster2_uuid UUID;
    cluster3_uuid UUID;
BEGIN
    -- Get the bundle ID
    SELECT id INTO bundle_uuid FROM public.bundles WHERE tahun = 2024 AND judul = 'Bundle PKP Yankes 2024';
    
    -- Insert sample Clusters
    INSERT INTO public.clusters (bundle_id, nama_klaster, urutan) VALUES
    (bundle_uuid, 'Pelayanan Kesehatan Dasar', 1),
    (bundle_uuid, 'Manajemen dan Administrasi', 2),
    (bundle_uuid, 'Sarana dan Prasarana', 3)
    RETURNING id INTO cluster1_uuid;
    
    -- Get cluster IDs
    SELECT id INTO cluster1_uuid FROM public.clusters WHERE bundle_id = bundle_uuid AND nama_klaster = 'Pelayanan Kesehatan Dasar';
    SELECT id INTO cluster2_uuid FROM public.clusters WHERE bundle_id = bundle_uuid AND nama_klaster = 'Manajemen dan Administrasi';
    SELECT id INTO cluster3_uuid FROM public.clusters WHERE bundle_id = bundle_uuid AND nama_klaster = 'Sarana dan Prasarana';
    
    -- Insert sample Indicators for Cluster 1 (Pelayanan Kesehatan Dasar)
    INSERT INTO public.indicators (cluster_id, nama_indikator, definisi_operasional, type, urutan, scoring_criteria) VALUES
    (cluster1_uuid, 'Kelengkapan Peralatan Medis', 'Persentase kelengkapan peralatan medis yang tersedia dan berfungsi dengan baik', 'scoring', 1, 
     '{"0": "Kelengkapan < 50%", "4": "Kelengkapan 50-69%", "7": "Kelengkapan 70-89%", "10": "Kelengkapan ≥ 90%"}'),
    (cluster1_uuid, 'Ketersediaan Tenaga Kesehatan', 'Rasio tenaga kesehatan terhadap jumlah penduduk yang dilayani', 'scoring', 2,
     '{"0": "Rasio < 60%", "4": "Rasio 60-74%", "7": "Rasio 75-89%", "10": "Rasio ≥ 90%"}');
    
    -- Insert target achievement indicators for Cluster 1
    INSERT INTO public.indicators (cluster_id, nama_indikator, definisi_operasional, type, urutan, target_percentage, total_sasaran, satuan, periodicity) VALUES
    (cluster1_uuid, 'Cakupan Imunisasi Dasar Lengkap', 'Persentase bayi yang mendapat imunisasi dasar lengkap', 'target_achievement', 3, 95.00, 1000, 'bayi', 'annual'),
    (cluster1_uuid, 'Cakupan Pelayanan ANC K4', 'Persentase ibu hamil yang mendapat pelayanan antenatal minimal 4 kali', 'target_achievement', 4, 90.00, 800, 'ibu hamil', 'annual');
    
    -- Insert sample Indicators for Cluster 2 (Manajemen dan Administrasi)
    INSERT INTO public.indicators (cluster_id, nama_indikator, definisi_operasional, type, urutan, scoring_criteria) VALUES
    (cluster2_uuid, 'Kelengkapan Dokumen Administratif', 'Persentase kelengkapan dokumen administrasi puskesmas', 'scoring', 1,
     '{"0": "Kelengkapan < 60%", "4": "Kelengkapan 60-74%", "7": "Kelengkapan 75-89%", "10": "Kelengkapan ≥ 90%"}'),
    (cluster2_uuid, 'Sistem Informasi Kesehatan', 'Kualitas pengelolaan sistem informasi dan pelaporan', 'scoring', 2,
     '{"0": "Tidak ada sistem", "4": "Sistem manual", "7": "Sistem digital parsial", "10": "Sistem digital terintegrasi"}');
    
    -- Insert target achievement indicators for Cluster 2
    INSERT INTO public.indicators (cluster_id, nama_indikator, definisi_operasional, type, urutan, target_percentage, total_sasaran, satuan, periodicity) VALUES
    (cluster2_uuid, 'Ketepatan Waktu Pelaporan', 'Persentase laporan bulanan yang diserahkan tepat waktu', 'target_achievement', 3, 100.00, 12, 'laporan', 'monthly');
    
    -- Insert sample Indicators for Cluster 3 (Sarana dan Prasarana)
    INSERT INTO public.indicators (cluster_id, nama_indikator, definisi_operasional, type, urutan, scoring_criteria) VALUES
    (cluster3_uuid, 'Kondisi Bangunan Puskesmas', 'Penilaian kondisi fisik bangunan puskesmas', 'scoring', 1,
     '{"0": "Rusak berat", "4": "Rusak sedang", "7": "Baik dengan perbaikan minor", "10": "Kondisi sangat baik"}'),
    (cluster3_uuid, 'Ketersediaan Utilitas', 'Ketersediaan listrik, air bersih, dan sanitasi yang memadai', 'scoring', 2,
     '{"0": "Utilitas tidak tersedia", "4": "Utilitas terbatas", "7": "Utilitas cukup", "10": "Utilitas lengkap dan memadai"}');
    
    -- Insert target achievement indicator for Cluster 3
    INSERT INTO public.indicators (cluster_id, nama_indikator, definisi_operasional, type, urutan, target_percentage, total_sasaran, satuan, periodicity) VALUES
    (cluster3_uuid, 'Cakupan Area Pelayanan', 'Persentase wilayah kerja yang terlayani dengan baik', 'target_achievement', 3, 95.00, 100, 'persen area', 'annual');
    
END $$;