import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Assessment = Database['public']['Tables']['assessments']['Row'];
type AssessmentInsert = Database['public']['Tables']['assessments']['Insert'];

export const useAssessments = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveAssessment = async (data: Omit<AssessmentInsert, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      const { data: result, error } = await supabase
        .from('assessments')
        .upsert(data, {
          onConflict: 'indicator_id,puskesmas_id,periode_triwulan,tahun'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Berhasil disimpan",
        description: "Data penilaian berhasil disimpan",
      });

      return result;
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const getAssessments = async (bundleId: string, puskesmasId: string, tahun: number, triwulan: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('bundle_id', bundleId)
        .eq('puskesmas_id', puskesmasId)
        .eq('tahun', tahun)
        .eq('periode_triwulan', triwulan);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast({
        title: "Gagal memuat data",
        description: "Terjadi kesalahan saat memuat data penilaian",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saving,
    saveAssessment,
    getAssessments
  };
};