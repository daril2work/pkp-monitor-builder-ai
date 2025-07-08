# PKP Monitor - Penilaian Kinerja Puskesmas

Sistem monitoring dan evaluasi kinerja Puskesmas yang komprehensif untuk mendukung peningkatan kualitas pelayanan kesehatan masyarakat.

## 📋 Deskripsi Aplikasi

PKP Monitor adalah aplikasi web yang dirancang untuk memfasilitasi proses penilaian kinerja Puskesmas secara digital. Aplikasi ini mendukung berbagai tingkat pengguna dengan fitur yang disesuaikan dengan peran masing-masing dalam ekosistem kesehatan.

## 🏥 Fitur Utama

### 👨‍💼 Admin Dinkes
- **Dashboard Komprehensif**: Overview semua Puskesmas dalam wilayah kerja
- **Bundle Builder**: Membuat dan mengelola paket indikator penilaian
- **Verifikasi Data**: Proses approval penilaian dari Puskesmas
- **Laporan Komprehensif**: Analisis kinerja seluruh Puskesmas

### 🏥 Petugas Puskesmas
- **Dashboard Personal**: Monitoring kinerja Puskesmas sendiri
- **Form Penilaian**: Input data pencapaian indikator
- **Evaluasi Triwulanan**: Analisis dan rencana tindak lanjut
- **Rekap Skor**: Visualisasi pencapaian kinerja

### 👩‍💻 Verifikator
- **Panel Verifikasi**: Review dan validasi data Puskesmas
- **Dashboard Monitoring**: Overview status verifikasi
- **Rekap Skor**: Analisis kinerja yang telah diverifikasi

## 🗂️ Struktur Database

### Tables Utama
- **bundles**: Paket indikator penilaian per tahun
- **clusters**: Klaster/kelompok indikator dalam bundle
- **indicators**: Indikator penilaian dengan kriteria scoring
- **puskesmas**: Data master Puskesmas
- **user_profiles**: Profil pengguna dengan role-based access
- **assessments**: Data penilaian indikator oleh Puskesmas
- **quarterly_evaluations**: Evaluasi triwulanan Puskesmas

### Role-Based Access Control
- **admin_dinkes**: Full access untuk manajemen sistem
- **petugas_puskesmas**: Access terbatas pada data Puskesmas sendiri
- **verifikator**: Access untuk verifikasi data semua Puskesmas

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 18** - Library UI modern
- **TypeScript** - Type safety dan developer experience
- **Vite** - Build tool yang cepat
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library yang elegant
- **React Query** - Data fetching dan caching
- **React Router DOM** - Client-side routing
- **Recharts** - Data visualization

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database dengan RLS
- **Row Level Security** - Data security per user/role
- **Real-time subscriptions** - Live data updates

### Authentication & Security
- **Supabase Auth** - Email/password authentication
- **JWT Tokens** - Secure session management
- **RLS Policies** - Database-level security
- **SECURITY DEFINER Functions** - Safe role checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ dan npm
- Git

### Installation
```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd pkp-monitor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Aplikasi ini sudah terkonfigurasi dengan Supabase. Untuk development lokal, pastikan koneksi internet untuk akses database.

## 📊 Fitur Detail

### 1. Authentication System
- Login/Register dengan email & password
- Role-based redirecting setelah login
- Session persistence
- Secure logout

### 2. Dashboard Analytics
- Real-time metrics
- Interactive charts dengan Recharts
- Filter berdasarkan periode
- Export functionality

### 3. Bundle Management (Admin)
- CRUD operations untuk bundles
- Dynamic cluster & indicator management
- Drag & drop untuk pengurutan
- Bulk operations

### 4. Assessment Flow
- Progressive form dengan validation
- File upload untuk bukti dukung
- Auto-calculation scoring
- Draft & submit modes

### 5. Verification Workflow
- Queue management untuk verifikator
- Comment system
- Approval/revision flow
- Audit trail

### 6. Reporting System
- Multi-format exports (PDF, Excel)
- Custom date ranges
- Comparative analysis
- Drill-down capabilities

## 🔐 Security Features

- **Row Level Security**: Data isolation per Puskesmas
- **Role-based Access Control**: Granular permissions
- **Input Validation**: Client & server-side validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content sanitization

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Touch-friendly UI

## 🔄 Development Workflow

### Code Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── integrations/       # External service configs
├── lib/                # Utility functions
└── assets/             # Static assets
```

### Database Migrations
```
supabase/
├── migrations/         # SQL migration files
└── config.toml        # Supabase configuration
```

## 🎨 Design System

- **Color Palette**: Blue & purple gradients
- **Typography**: Clean and readable fonts
- **Components**: shadcn/ui dengan custom variants
- **Icons**: Lucide React
- **Spacing**: Consistent Tailwind spacing scale

## 📈 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format dengan fallbacks
- **Caching**: React Query untuk data caching
- **Bundle Optimization**: Tree shaking & minification

## 🧪 Testing & Quality

- **TypeScript**: Compile-time error checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Responsive Testing**: Multi-device compatibility

## 🔧 Maintenance & Updates

### Database Migrations
```bash
# Apply new migrations
supabase db push

# Reset database (development only)
supabase db reset
```

### Dependency Updates
```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated
```

## 📞 Support & Contribution

### Getting Help
- Check console logs untuk debugging
- Review network requests di browser DevTools
- Periksa Supabase dashboard untuk database issues

### Contribution Guidelines
1. Fork repository
2. Create feature branch
3. Make changes dengan testing
4. Submit pull request dengan deskripsi detail

## 🚀 Deployment

### Via Lovable
1. Open [Lovable Project](https://lovable.dev/projects/9d691d61-9dc3-4dc0-bf2b-57c2cc5720bd)
2. Click Share → Publish
3. Configure custom domain (optional)

### Manual Deployment
```bash
# Build production version
npm run build

# Deploy dist/ folder ke hosting platform
```

## 📄 License

Private project untuk Dinas Kesehatan.

## 🔗 Links

- **Lovable Project**: https://lovable.dev/projects/9d691d61-9dc3-4dc0-bf2b-57c2cc5720bd
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentation**: https://docs.lovable.dev/

---

*Dikembangkan dengan ❤️ untuk meningkatkan kualitas pelayanan kesehatan masyarakat*