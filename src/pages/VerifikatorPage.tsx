import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import PenilaianFormNew from '@/components/PenilaianFormNew';
import RekapSkor from '@/components/RekapSkor';
import { BarChart3, FileText, Award } from 'lucide-react';

const VerifikatorPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ProtectedRoute allowedRoles={['verifikator']}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="penilaian" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Penilaian & Evaluasi</span>
            </TabsTrigger>
            <TabsTrigger value="rekap" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Rekap Skor</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="penilaian" className="space-y-6">
            <PenilaianFormNew />
          </TabsContent>

          <TabsContent value="rekap" className="space-y-6">
            <RekapSkor />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default VerifikatorPage;