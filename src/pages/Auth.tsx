import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Shield, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PuskesmasOption {
  id: string;
  nama_puskesmas: string;
  kode_puskesmas: string;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [role, setRole] = useState<'admin_dinkes' | 'petugas_puskesmas' | 'verifikator'>('petugas_puskesmas');
  const [puskesmasId, setPuskesmasId] = useState('');
  const [puskesmasList, setPuskesmasList] = useState<PuskesmasOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch puskesmas list for signup
  useEffect(() => {
    const fetchPuskesmas = async () => {
      try {
        const { data, error } = await supabase
          .from('puskesmas')
          .select('id, nama_puskesmas, kode_puskesmas')
          .eq('status', 'aktif')
          .order('nama_puskesmas');

        if (error) {
          console.error('Error fetching puskesmas:', error);
        } else {
          setPuskesmasList(data || []);
        }
      } catch (error) {
        console.error('Error in fetchPuskesmas:', error);
      }
    };

    if (!isLogin) {
      fetchPuskesmas();
    }
  }, [isLogin]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return false;
    }

    if (!isLogin) {
      if (!namaLengkap) {
        setError('Nama lengkap harus diisi');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Konfirmasi password tidak sesuai');
        return false;
      }

      if (password.length < 6) {
        setError('Password minimal 6 karakter');
        return false;
      }

      if (role === 'petugas_puskesmas' && !puskesmasId) {
        setError('Puskesmas harus dipilih untuk petugas puskesmas');
        return false;
      }
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email atau password salah');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Silakan konfirmasi email Anda terlebih dahulu');
        } else {
          setError(error.message || 'Gagal login');
        }
      } else {
        toast({
          title: "Login berhasil",
          description: "Selamat datang di PKP Monitor",
        });
      }
    } catch (error) {
      setError('Terjadi kesalahan sistem');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const profileData = {
        nama_lengkap: namaLengkap,
        nip: nip || null,
        jabatan: jabatan || null,
        role,
        puskesmas_id: role === 'petugas_puskesmas' ? puskesmasId : null
      };

      const { error } = await signUp(email, password, profileData);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Email sudah terdaftar');
        } else if (error.message.includes('Password should be at least')) {
          setError('Password minimal 6 karakter');
        } else {
          setError(error.message || 'Gagal mendaftar');
        }
      } else {
        toast({
          title: "Pendaftaran berhasil",
          description: "Akun Anda telah dibuat. Silakan login.",
        });
        setIsLogin(true);
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNamaLengkap('');
        setNip('');
        setJabatan('');
        setRole('petugas_puskesmas');
        setPuskesmasId('');
      }
    } catch (error) {
      setError('Terjadi kesalahan sistem');
      console.error('SignUp error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNamaLengkap('');
    setNip('');
    setJabatan('');
    setRole('petugas_puskesmas');
    setPuskesmasId('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PKP Monitor</h1>
            <p className="text-gray-600">Penilaian Kinerja Puskesmas</p>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              {isLogin ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? "login" : "signup"} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="login" 
                  onClick={() => { setIsLogin(true); resetForm(); }}
                >
                  Masuk
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  onClick={() => { setIsLogin(false); resetForm(); }}
                >
                  Daftar
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap *</Label>
                    <Input
                      id="nama"
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Nama lengkap"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={role} onValueChange={(value: any) => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petugas_puskesmas">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Petugas Puskesmas</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="verifikator">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Verifikator</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin_dinkes">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4" />
                            <span>Admin Dinkes</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {role === 'petugas_puskesmas' && (
                    <div className="space-y-2">
                      <Label htmlFor="puskesmas">Puskesmas *</Label>
                      <Select value={puskesmasId} onValueChange={setPuskesmasId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Puskesmas" />
                        </SelectTrigger>
                        <SelectContent>
                          {puskesmasList.map((puskesmas) => (
                            <SelectItem key={puskesmas.id} value={puskesmas.id}>
                              {puskesmas.nama_puskesmas} ({puskesmas.kode_puskesmas})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                      id="nip"
                      type="text"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="Nomor Induk Pegawai (opsional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jabatan">Jabatan</Label>
                    <Input
                      id="jabatan"
                      type="text"
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      placeholder="Jabatan (opsional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Memproses...' : 'Daftar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600">
          © 2024 PKP Monitor - Sistem Penilaian Kinerja Puskesmas
        </p>
      </div>
    </div>
  );
};

export default Auth;