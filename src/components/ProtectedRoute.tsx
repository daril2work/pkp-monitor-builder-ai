import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin_dinkes' | 'petugas_puskesmas' | 'verifikator'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">Memuat PKP Monitor</h3>
              <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">Akses Ditolak</h3>
              <p className="text-sm text-gray-500">Anda tidak memiliki akses ke halaman ini</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;