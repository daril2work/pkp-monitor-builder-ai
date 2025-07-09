import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const Index = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role) {
      // Redirect based on user role
      switch (profile.role) {
        case 'admin_dinkes':
          navigate('/admin');
          break;
        case 'verifikator':
          navigate('/verifikator');
          break;
        case 'petugas_puskesmas':
          navigate('/puskesmas');
          break;
        default:
          // Stay on index if role is unknown
          break;
      }
    }
  }, [profile?.role, navigate]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">PKP Monitor</h1>
          <p className="text-gray-600">Mengalihkan ke halaman yang sesuai...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;