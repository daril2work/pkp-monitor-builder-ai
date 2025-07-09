import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboard from '@/components/AdminDashboard';
import BundleBuilder from '@/components/BundleBuilder';
import VerifikasiPanel from '@/components/VerifikasiPanel';
import { BarChart3, FileText, Users, Settings } from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ProtectedRoute allowedRoles={['admin_dinkes']}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="bundle-builder" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Buat Bundle</span>
            </TabsTrigger>
            <TabsTrigger value="verifikasi" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Verifikasi</span>
            </TabsTrigger>
            <TabsTrigger value="laporan" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Laporan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="bundle-builder" className="space-y-6">
            <BundleBuilder />
          </TabsContent>

          <TabsContent value="verifikasi" className="space-y-6">
            <VerifikasiPanel />
          </TabsContent>

          <TabsContent value="laporan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Komprehensif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fitur laporan akan tersedia segera...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;