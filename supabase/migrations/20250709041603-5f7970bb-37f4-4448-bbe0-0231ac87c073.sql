-- Insert sample data for testing

-- Insert sample bundles
INSERT INTO public.bundles (id, judul, tahun, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Penilaian Kinerja Puskesmas 2024', 2024, 'aktif');

-- Insert sample clusters
INSERT INTO public.clusters (id, bundle_id, nama_klaster, urutan) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Klaster 1: Promosi Kesehatan', 1),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Klaster 2: Kesehatan Lingkungan', 2),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Klaster 3: Kesehatan Ibu & Anak', 3),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Klaster 4: Gizi Masyarakat', 4),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Klaster 5: Pencegahan Penyakit', 5);

-- Insert sample indicators with scoring criteria
INSERT INTO public.indicators (id, cluster_id, nama_indikator, definisi_operasional, type, urutan, scoring_criteria) VALUES 
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Rencana 5 Tahunan', 'Apakah Puskesmas memiliki rencana 5 tahunan yang sesuai visi, misi dan analisis kebutuhan masyarakat?', 'scoring', 1, '{"0": "Tidak ada", "4": "Ada, tapi tidak sesuai", "7": "Sesuai tapi belum analisis", "10": "Sesuai & berbasis analisis"}'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Kegiatan Pos Bindu PTM', 'Jumlah pos bindu PTM yang aktif melakukan kegiatan rutin', 'scoring', 2, '{"0": "Tidak ada pos bindu yang aktif", "4": "1-2 pos bindu aktif", "7": "3-4 pos bindu aktif", "10": ">4 pos bindu aktif"}');

-- Insert target achievement indicators
INSERT INTO public.indicators (id, cluster_id, nama_indikator, definisi_operasional, type, urutan, target_percentage, total_sasaran, satuan, periodicity) VALUES 
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002', 'Cakupan Inspeksi Sanitasi TPM', 'Persentase tempat pengelolaan makanan yang diinspeksi sanitasinya (Target Tahunan)', 'target_achievement', 1, 90, 150, 'TPM', 'annual'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'Pembinaan TUPM', 'Jumlah tempat umum dan pengelolaan makanan yang dibina per bulan (Target Bulanan)', 'target_achievement', 2, 85, 50, 'tempat', 'monthly'),
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440003', 'Cakupan K4', 'Persentase ibu hamil yang mendapat pelayanan antenatal sesuai standar (Target Tahunan)', 'target_achievement', 1, 95, 500, 'ibu hamil', 'annual'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440003', 'Kunjungan Neonatal', 'Jumlah kunjungan neonatal per bulan (Target Bulanan)', 'target_achievement', 2, 95, 40, 'kunjungan', 'monthly'),
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440004', 'Cakupan Balita Ditimbang', 'Persentase balita yang ditimbang di posyandu (Target Tahunan)', 'target_achievement', 1, 85, 800, 'balita', 'annual'),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440004', 'Distribusi PMT Balita', 'Distribusi PMT untuk balita gizi kurang per bulan (Target Bulanan)', 'target_achievement', 2, 90, 25, 'balita', 'monthly'),
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440005', 'Cakupan Penemuan TB', 'Persentase penemuan kasus TB dari target yang ditetapkan (Target Tahunan)', 'target_achievement', 1, 70, 100, 'kasus', 'annual'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440005', 'Pemeriksaan Kontak TB', 'Jumlah pemeriksaan kontak TB per bulan (Target Bulanan)', 'target_achievement', 2, 80, 15, 'pemeriksaan', 'monthly');

-- Insert sample puskesmas
INSERT INTO public.puskesmas (id, nama_puskesmas, kode_puskesmas, alamat, kecamatan, kabupaten, telepon, status) VALUES 
('660e8400-e29b-41d4-a716-446655440000', 'Puskesmas Sehat Mandiri', 'PKM001', 'Jl. Kesehatan No. 123', 'Kecamatan Sehat', 'Kabupaten Sejahtera', '021-1234567', 'aktif'),
('660e8400-e29b-41d4-a716-446655440001', 'Puskesmas Bahagia', 'PKM002', 'Jl. Bahagia No. 456', 'Kecamatan Bahagia', 'Kabupaten Sejahtera', '021-7654321', 'aktif');