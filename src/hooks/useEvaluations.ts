import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Evaluation = Database['public']['Tables']['quarterly_evaluations']['Row'];
type EvaluationInsert = Database['public']['Tables']['quarterly_evaluations']['Insert'];

export const useEvaluations = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveEvaluation = async (data: Omit<EvaluationInsert, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      const { data: result, error } = await supabase
        .from('quarterly_evaluations')
        .upsert(data, {
          onConflict: 'bundle_id,puskesmas_id,periode_triwulan,tahun'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Evaluasi berhasil disimpan",
        description: "Data evaluasi triwulanan berhasil disimpan",
      });

      return result;
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast({
        title: "Gagal menyimpan evaluasi",
        description: "Terjadi kesalahan saat menyimpan evaluasi",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const getEvaluation = async (bundleId: string, puskesmasId: string, tahun: number, triwulan: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quarterly_evaluations')
        .select('*')
        .eq('bundle_id', bundleId)
        .eq('puskesmas_id', puskesmasId)
        .eq('tahun', tahun)
        .eq('periode_triwulan', triwulan)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      toast({
        title: "Gagal memuat evaluasi",
        description: "Terjadi kesalahan saat memuat data evaluasi",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saving,
    saveEvaluation,
    getEvaluation
  };
};