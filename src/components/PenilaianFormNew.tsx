import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Save, ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIndicators } from '@/hooks/useIndicators';
import { useAssessments } from '@/hooks/useAssessments';
import { useEvaluations } from '@/hooks/useEvaluations';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { AssessmentFormCard } from './forms/AssessmentFormCard';
import ProfileSetup from './ProfileSetup';

interface IndikatorValue {
  score?: number;
  actual_achievement?: number;
  calculated_percentage?: number;
}

interface EvaluasiData {
  analisis: string;
  hambatan: string;
  rencana: string;
}

const PenilaianFormNew = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [currentIndikatorIndex, setCurrentIndikatorIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<Record<string, IndikatorValue>>({});
  const [currentTribulan, setCurrentTribulan] = useState(1);
  const [evaluasiData, setEvaluasiData] = useState<Record<number, EvaluasiData>>({
    1: { analisis: '', hambatan: '', rencana: '' },
    2: { analisis: '', hambatan: '', rencana: '' },
    3: { analisis: '', hambatan: '', rencana: '' },
    4: { analisis: '', hambatan: '', rencana: '' }
  });

  // Use the active bundle for 2024
  const bundleId = '550e8400-e29b-41d4-a716-446655440000';
  const tahun = 2024;

  const { indicators, loading: loadingIndicators } = useIndicators(bundleId);
  const { saving: savingAssessment, saveAssessment, getAssessments } = useAssessments();
  const { saving: savingEvaluation, saveEvaluation, getEvaluation } = useEvaluations();

  const tribunanLabels = {
    1: { label: 'Q1 (Jan-Mar)', period: 'Januari - Maret 2024' },
    2: { label: 'Q2 (Apr-Jun)', period: 'April - Juni 2024' },
    3: { label: 'Q3 (Jul-Sep)', period: 'Juli - September 2024' },
    4: { label: 'Q4 (Okt-Des)', period: 'Oktober - Desember 2024' }
  };

  // Load existing assessments and evaluations
  useEffect(() => {
    const loadExistingData = async () => {
      if (!profile?.puskesmas_id) return;

      try {
        // Load assessments
        const assessments = await getAssessments(bundleId, profile.puskesmas_id, tahun, currentTribulan);
        const assessmentValues: Record<string, IndikatorValue> = {};
        
        assessments.forEach(assessment => {
          assessmentValues[assessment.indicator_id] = {
            score: assessment.selected_score || undefined,
            actual_achievement: assessment.actual_achievement || undefined,
            calculated_percentage: assessment.calculated_percentage || undefined
          };
        });
        
        setSelectedValues(assessmentValues);

        // Load evaluation
        const evaluation = await getEvaluation(bundleId, profile.puskesmas_id, tahun, currentTribulan);
        if (evaluation) {
          setEvaluasiData(prev => ({
            ...prev,
            [currentTribulan]: {
              analisis: evaluation.analisis_pencapaian || '',
              hambatan: evaluation.hambatan_kendala || '',
              rencana: evaluation.rencana_tindak_lanjut || ''
            }
          }));
        }
      } catch (error) {
        console.error('Error loading existing data:', error);
      }
    };

    loadExistingData();
  }, [profile?.puskesmas_id, currentTribulan]);

  const currentIndikator = indicators[currentIndikatorIndex];

  const handleIndikatorValueChange = async (indikatorId: string, value: IndikatorValue) => {
    if (!profile?.puskesmas_id || !user?.id) {
      toast({
        title: "Error",
        description: "User profile tidak ditemukan",
        variant: "destructive"
      });
      return;
    }

    setSelectedValues(prev => ({
      ...prev,
      [indikatorId]: value
    }));

    // Auto-save assessment
    try {
      await saveAssessment({
        bundle_id: bundleId,
        indicator_id: indikatorId,
        puskesmas_id: profile.puskesmas_id,
        user_id: user.id,
        tahun,
        periode_triwulan: currentTribulan,
        selected_score: value.score || null,
        actual_achievement: value.actual_achievement || null,
        calculated_percentage: value.calculated_percentage || null
      });
    } catch (error) {
      console.error('Error auto-saving assessment:', error);
    }
  };

  const handleEvaluasiChange = (field: keyof EvaluasiData, value: string) => {
    setEvaluasiData(prev => ({
      ...prev,
      [currentTribulan]: {
        ...prev[currentTribulan],
        [field]: value
      }
    }));
  };

  const handleSaveEvaluation = async () => {
    if (!profile?.puskesmas_id || !user?.id) {
      toast({
        title: "Error",
        description: "User profile tidak ditemukan",
        variant: "destructive"
      });
      return;
    }

    const currentEvaluasi = evaluasiData[currentTribulan];
    if (!currentEvaluasi.analisis.trim() || !currentEvaluasi.hambatan.trim() || !currentEvaluasi.rencana.trim()) {
      toast({
        title: "Data evaluasi belum lengkap",
        description: `Mohon lengkapi evaluasi untuk ${tribunanLabels[currentTribulan].label}`,
        variant: "destructive"
      });
      return;
    }

    try {
      await saveEvaluation({
        bundle_id: bundleId,
        puskesmas_id: profile.puskesmas_id,
        user_id: user.id,
        tahun,
        periode_triwulan: currentTribulan,
        analisis_pencapaian: currentEvaluasi.analisis,
        hambatan_kendala: currentEvaluasi.hambatan,
        rencana_tindak_lanjut: currentEvaluasi.rencana
      });
    } catch (error) {
      console.error('Error saving evaluation:', error);
    }
  };

  const calculateProgress = (): number => {
    if (indicators.length === 0) return 0;
    const filledIndicators = Object.keys(selectedValues).length;
    return (filledIndicators / indicators.length) * 100;
  };

  const getDisplayValue = (indikatorId: string): string => {
    const value = selectedValues[indikatorId];
    if (!value) return '-';
    
    if (value.calculated_percentage !== undefined) {
      return `${Math.round(value.calculated_percentage)}%`;
    }
    
    return value.score?.toString() || value.actual_achievement?.toString() || '-';
  };

  const isDataComplete = (tribunan: number): boolean => {
    const data = evaluasiData[tribunan];
    return !!(data.analisis.trim() && data.hambatan.trim() && data.rencana.trim());
  };

  const handlePrevious = () => {
    if (currentIndikatorIndex > 0) {
      setCurrentIndikatorIndex(currentIndikatorIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndikatorIndex < indicators.length - 1) {
      setCurrentIndikatorIndex(currentIndikatorIndex + 1);
    }
  };

  if (loadingIndicators) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Memuat indikator...</span>
      </div>
    );
  }

  if (!profile?.puskesmas_id) {
    return <ProfileSetup />;
  }

  if (indicators.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Indikator</h3>
          <p className="text-gray-600">
            Belum ada indikator yang tersedia untuk bundle ini.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndikatorIndex === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">Indikator</p>
            <p className="text-lg font-semibold">
              {currentIndikatorIndex + 1} dari {indicators.length}
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndikatorIndex === indicators.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Indikator Card */}
        {currentIndikator && (
          <AssessmentFormCard
            indicator={currentIndikator}
            value={selectedValues[currentIndikator.id] || {}}
            onChange={(value) => handleIndikatorValueChange(currentIndikator.id, value)}
          />
        )}

        {/* Evaluasi Triwulanan Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Evaluasi Triwulanan
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {tribunanLabels[currentTribulan].period}
                </p>
              </div>
              <Badge 
                variant={isDataComplete(currentTribulan) ? "default" : "secondary"}
                className="text-sm"
              >
                {isDataComplete(currentTribulan) ? "Lengkap" : "Belum Lengkap"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Pagination Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTribulan(Math.max(1, currentTribulan - 1))}
                disabled={currentTribulan === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </Button>

              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((q) => (
                  <Button
                    key={q}
                    variant={currentTribulan === q ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentTribulan(q)}
                    className="relative"
                  >
                    {tribunanLabels[q].label}
                    {isDataComplete(q) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTribulan(Math.min(4, currentTribulan + 1))}
                disabled={currentTribulan === 4}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Evaluasi Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Analisis Capaian */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    📊 Analisis Capaian
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Jelaskan pencapaian kinerja pada triwulan ini
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Contoh: Pada triwulan ini, capaian imunisasi mencapai 85% dari target yang ditetapkan..."
                    value={evaluasiData[currentTribulan].analisis}
                    onChange={(e) => handleEvaluasiChange('analisis', e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {evaluasiData[currentTribulan].analisis.length}/500 karakter
                  </div>
                </CardContent>
              </Card>

              {/* Hambatan */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    🚧 Hambatan & Kendala
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Identifikasi hambatan yang dihadapi
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Contoh: Kendala utama yang dihadapi antara lain keterbatasan tenaga kesehatan..."
                    value={evaluasiData[currentTribulan].hambatan}
                    onChange={(e) => handleEvaluasiChange('hambatan', e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {evaluasiData[currentTribulan].hambatan.length}/500 karakter
                  </div>
                </CardContent>
              </Card>

              {/* Rencana Tindak Lanjut */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    🎯 Rencana Tindak Lanjut
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Rencana perbaikan untuk triwulan selanjutnya
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Contoh: Untuk triwulan selanjutnya, akan dilakukan penambahan jadwal posyandu..."
                    value={evaluasiData[currentTribulan].rencana}
                    onChange={(e) => handleEvaluasiChange('rencana', e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {evaluasiData[currentTribulan].rencana.length}/500 karakter
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveEvaluation} 
            size="lg" 
            disabled={savingEvaluation}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {savingEvaluation ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Simpan Evaluasi {tribunanLabels[currentTribulan].label}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="sticky top-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Progress Pengisian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress Indikator</span>
                <span className="font-medium">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
              <p className="text-xs text-gray-500">
                {Object.keys(selectedValues).length} dari {indicators.length} indikator terisi
              </p>
            </div>

            {/* Indicator List */}
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Daftar Indikator:</p>
              {indicators.map((indikator, index) => (
                <div 
                  key={indikator.id} 
                  className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                    index === currentIndikatorIndex 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentIndikatorIndex(index)}
                >
                  <div className="flex-1">
                    <div className="truncate">{indikator.urutan}. {indikator.nama_indikator}</div>
                    <div className="text-xs text-gray-500 truncate">{indikator.cluster.nama_klaster}</div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${selectedValues[indikator.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                  >
                    {getDisplayValue(indikator.id)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PenilaianFormNew;