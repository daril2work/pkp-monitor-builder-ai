import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/components/Dashboard';
import PenilaianForm from '@/components/PenilaianForm';
import RekapSkor from '@/components/RekapSkor';
import VerifikasiPanel from '@/components/VerifikasiPanel';
import AdminDashboard from '@/components/AdminDashboard';
import BundleBuilder from '@/components/BundleBuilder';
import { BarChart3, FileText, CheckCircle, Users, Settings, Shield, Award, LogOut } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, signOut } = useAuth();
  
  // Determine user interface based on role
  const isDinkes = profile?.role === 'admin_dinkes';
  const isVerifikator = profile?.role === 'verifikator';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PKP Monitor</h1>
                  <p className="text-sm text-gray-500">Penilaian Kinerja Puskesmas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{profile?.nama_lengkap}</p>
                    <p className="text-xs text-gray-500">
                      {profile?.role === 'admin_dinkes' ? 'Admin Dinkes' : 
                       profile?.role === 'verifikator' ? 'Verifikator' : 
                       profile?.puskesmas?.nama_puskesmas || 'Petugas Puskesmas'}
                    </p>
                  </div>
                </div>
                
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Tahun 2024
                </Badge>
                
                <Badge variant="secondary" className={`${
                  isDinkes ? 'bg-purple-100 text-purple-700' : 
                  isVerifikator ? 'bg-orange-100 text-orange-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  {profile?.role === 'admin_dinkes' ? 'Admin Dinkes' : 
                   profile?.role === 'verifikator' ? 'Verifikator' : 'Puskesmas'}
                  {isDinkes && <Shield className="w-3 h-3 ml-1" />}
                </Badge>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isDinkes ? (
            // Admin Interface (Dinkes) - 4 tabs
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
          ) : (
            // User Interface (Puskesmas/Verifikator) - 3 tabs
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
                <PenilaianForm />
              </TabsContent>

              <TabsContent value="rekap" className="space-y-6">
                <RekapSkor />
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;