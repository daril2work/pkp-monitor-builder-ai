import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Indicator = Database['public']['Tables']['indicators']['Row'];
type Cluster = Database['public']['Tables']['clusters']['Row'];

export interface IndicatorWithCluster extends Indicator {
  cluster: Cluster;
}

export const useIndicators = (bundleId?: string) => {
  const [indicators, setIndicators] = useState<IndicatorWithCluster[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIndicators = async () => {
    if (!bundleId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('indicators')
        .select(`
          *,
          cluster:clusters(*)
        `)
        .eq('clusters.bundle_id', bundleId)
        .order('clusters.urutan')
        .order('urutan');

      if (error) throw error;

      const indicatorsWithCluster = data?.map(item => ({
        ...item,
        cluster: Array.isArray(item.cluster) ? item.cluster[0] : item.cluster
      })) || [];

      setIndicators(indicatorsWithCluster);
    } catch (error) {
      console.error('Error fetching indicators:', error);
      toast({
        title: "Gagal memuat indikator",
        description: "Terjadi kesalahan saat memuat data indikator",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, [bundleId]);

  return {
    indicators,
    loading,
    refetch: fetchIndicators
  };
};