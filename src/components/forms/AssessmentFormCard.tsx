import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, Calendar, Clock } from 'lucide-react';
import { IndicatorWithCluster } from '@/hooks/useIndicators';

interface AssessmentFormCardProps {
  indicator: IndicatorWithCluster;
  value: {
    score?: number;
    actual_achievement?: number;
    calculated_percentage?: number;
  };
  onChange: (value: { score?: number; actual_achievement?: number; calculated_percentage?: number }) => void;
}

export const AssessmentFormCard: React.FC<AssessmentFormCardProps> = ({
  indicator,
  value,
  onChange
}) => {
  const handleScoringChange = (scoreValue: string) => {
    const score = parseInt(scoreValue);
    const calculatedPercentage = (score / 10) * 100;
    onChange({ score, calculated_percentage: calculatedPercentage });
  };

  const handleTargetAchievementChange = (actualValue: number, periodTargetSasaran: number) => {
    const calculatedPercentage = Math.min(100, Math.max(0, (actualValue / periodTargetSasaran) * 100));
    onChange({ actual_achievement: actualValue, calculated_percentage: calculatedPercentage });
  };

  const renderScoringInput = () => {
    if (!indicator.scoring_criteria) return null;
    
    const scoringCriteria = indicator.scoring_criteria as Record<string, string>;
    
    return (
      <RadioGroup 
        value={value.score?.toString()} 
        onValueChange={handleScoringChange}
        className="space-y-3"
      >
        {Object.entries(scoringCriteria).map(([nilai, deskripsi]) => (
          <div key={nilai} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <RadioGroupItem value={nilai} id={`${indicator.id}-${nilai}`} />
            <Label 
              htmlFor={`${indicator.id}-${nilai}`} 
              className="flex-1 cursor-pointer text-sm"
            >
              <div className="flex items-center justify-between">
                <span><strong>{nilai}</strong> - {deskripsi}</span>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  const renderTargetAchievementInput = () => {
    const { target_percentage, total_sasaran, satuan, periodicity } = indicator;
    
    if (!target_percentage || !total_sasaran || !satuan || !periodicity) return null;

    // Calculate period target based on periodicity
    let periodTargetSasaran: number;
    let periodLabel: string;
    let periodDescription: string;
    
    if (periodicity === 'annual') {
      periodTargetSasaran = Math.round((target_percentage / 100) * total_sasaran / 4);
      periodLabel = "Target Triwulan";
      periodDescription = `${target_percentage}% dari ${total_sasaran} ${satuan} tahunan ÷ 4 triwulan`;
    } else {
      periodTargetSasaran = Math.round((target_percentage / 100) * total_sasaran * 3);
      periodLabel = "Target Triwulan";
      periodDescription = `${target_percentage}% dari ${total_sasaran} ${satuan} bulanan × 3 bulan`;
    }
    
    return (
      <div className="space-y-4">
        {/* Periodicity Indicator */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            {periodicity === 'annual' ? (
              <Calendar className="w-4 h-4 text-blue-500" />
            ) : (
              <Clock className="w-4 h-4 text-green-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {periodicity === 'annual' ? 'Target Tahunan (Akumulatif)' : 'Target Bulanan (Per Bulan)'}
            </span>
          </div>
          <Badge variant="outline" className={periodicity === 'annual' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>
            {periodicity === 'annual' ? 'Tahunan' : 'Bulanan'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{periodTargetSasaran}</div>
            <div className="text-sm text-gray-600">{periodLabel} ({satuan})</div>
            <div className="text-xs text-gray-500 mt-1">
              {periodDescription}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {value.calculated_percentage ? `${Math.round(value.calculated_percentage)}%` : '0%'}
            </div>
            <div className="text-sm text-gray-600">Capaian Saat Ini</div>
            <div className="text-xs text-gray-500 mt-1">
              {value.actual_achievement || 0} dari {periodTargetSasaran} target
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`achievement-${indicator.id}`} className="text-sm font-medium">
            Capaian Aktual Triwulan Ini ({satuan})
          </Label>
          <Input
            id={`achievement-${indicator.id}`}
            type="number"
            min="0"
            placeholder={`Masukkan jumlah ${satuan} yang tercapai...`}
            value={value.actual_achievement?.toString() || ''}
            onChange={(e) => {
              const inputValue = parseInt(e.target.value) || 0;
              handleTargetAchievementChange(inputValue, periodTargetSasaran);
            }}
            className="text-center text-lg font-semibold"
          />
        </div>

        {value.calculated_percentage !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress Capaian</span>
              <span className="font-medium">{Math.round(value.calculated_percentage)}%</span>
            </div>
            <Progress value={value.calculated_percentage} className="h-3" />
          </div>
        )}
      </div>
    );
  };

  const getDisplayValue = (): string => {
    if (!value) return '-';
    
    if (value.calculated_percentage !== undefined) {
      return `${Math.round(value.calculated_percentage)}%`;
    }
    
    return value.score?.toString() || value.actual_achievement?.toString() || '-';
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {indicator.cluster.nama_klaster}
            </Badge>
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {indicator.urutan}. {indicator.nama_indikator}
              </CardTitle>
              {indicator.type === 'target_achievement' && (
                <div className="flex items-center space-x-1">
                  <Target className="w-5 h-5 text-green-600" />
                  {indicator.periodicity === 'annual' ? (
                    <Calendar className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {indicator.definisi_operasional}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {indicator.type === 'scoring' ? 'Skor' : 'Capaian'}
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-lg px-3 py-1">
                {getDisplayValue()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {indicator.type === 'scoring' 
          ? renderScoringInput()
          : renderTargetAchievementInput()
        }
      </CardContent>
    </Card>
  );
};