import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Puskesmas = Database['public']['Tables']['puskesmas']['Row'];

const ProfileSetup = () => {
  const { profile, loading, updateProfile } = useUserProfile();
  const [puskesmasList, setPuskesmasList] = useState<Puskesmas[]>([]);
  const [loadingPuskesmas, setLoadingPuskesmas] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nip: '',
    jabatan: '',
    puskesmas_id: ''
  });

  useEffect(() => {
    const fetchPuskesmas = async () => {
      setLoadingPuskesmas(true);
      try {
        const { data, error } = await supabase
          .from('puskesmas')
          .select('*')
          .eq('status', 'aktif')
          .order('nama_puskesmas');

        if (error) throw error;
        setPuskesmasList(data || []);
      } catch (error) {
        console.error('Error fetching puskesmas:', error);
        toast({
          title: "Gagal memuat data Puskesmas",
          description: "Terjadi kesalahan saat memuat daftar Puskesmas",
          variant: "destructive"
        });
      } finally {
        setLoadingPuskesmas(false);
      }
    };

    fetchPuskesmas();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        nama_lengkap: profile.nama_lengkap || '',
        nip: profile.nip || '',
        jabatan: profile.jabatan || '',
        puskesmas_id: profile.puskesmas_id || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_lengkap.trim()) {
      toast({
        title: "Nama lengkap harus diisi",
        variant: "destructive"
      });
      return;
    }

    if (!formData.puskesmas_id) {
      toast({
        title: "Pilih Puskesmas",
        description: "Anda harus memilih Puskesmas untuk melanjutkan",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        nama_lengkap: formData.nama_lengkap,
        nip: formData.nip || null,
        jabatan: formData.jabatan || null,
        puskesmas_id: formData.puskesmas_id
      });

      toast({
        title: "Profile berhasil diperbarui",
        description: "Anda sekarang dapat menggunakan form penilaian",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Gagal memperbarui profile",
        description: "Terjadi kesalahan saat menyimpan profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Memuat profile...</span>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <User className="w-6 h-6 mr-2 text-blue-600" />
          Lengkapi Profile Anda
        </CardTitle>
        <p className="text-sm text-gray-600">
          Mohon lengkapi informasi profile untuk dapat menggunakan form penilaian
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
            <Input
              id="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
              placeholder="Masukkan nama lengkap Anda"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nip">NIP</Label>
            <Input
              id="nip"
              value={formData.nip}
              onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
              placeholder="Masukkan NIP (opsional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jabatan">Jabatan</Label>
            <Input
              id="jabatan"
              value={formData.jabatan}
              onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
              placeholder="Masukkan jabatan Anda"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="puskesmas">Puskesmas *</Label>
            <Select 
              value={formData.puskesmas_id} 
              onValueChange={(value) => setFormData({ ...formData, puskesmas_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Puskesmas" />
              </SelectTrigger>
              <SelectContent>
                {loadingPuskesmas ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Memuat...
                    </div>
                  </SelectItem>
                ) : (
                  puskesmasList.map((puskesmas) => (
                    <SelectItem key={puskesmas.id} value={puskesmas.id}>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        <div>
                          <div className="font-medium">{puskesmas.nama_puskesmas}</div>
                          <div className="text-xs text-gray-500">{puskesmas.kode_puskesmas}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={saving || loadingPuskesmas}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <User className="w-4 h-4 mr-2" />
              )}
              Simpan Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSetup;