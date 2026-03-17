'use client';

/**
 * Admin Amil Performance Page
 * Monitor amil performance, collections, and commissions
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award,
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface MockAmil {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  branchAddress: string;
  totalCollections: number;
  totalTransactions: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  performanceRating: number;
  status: 'active' | 'inactive';
  joinDate: string;
  lastCollectionDate?: string;
}

export default function AdminAmilPerformancePage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('collections');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null;
  }

  // Mock data untuk demo
  const mockAmils: MockAmil[] = [
    {
      id: '1',
      name: 'Ustaz Muhammad bin Hassan',
      email: 'muhammad@lzs.gov.my',
      phone: '+60198765432',
      branch: 'Shah Alam',
      branchAddress: 'Cawangan Shah Alam, Lembaga Zakat Selangor',
      totalCollections: 125000.00,
      totalTransactions: 85,
      totalCommission: 2500.00,
      paidCommission: 2000.00,
      pendingCommission: 500.00,
      performanceRating: 4.8,
      status: 'active',
      joinDate: '2023-06-10',
      lastCollectionDate: '2024-12-20'
    },
    {
      id: '2',
      name: 'Ustazah Fatimah binti Ahmad',
      email: 'fatimah@lzs.gov.my',
      phone: '+60123456789',
      branch: 'Klang',
      branchAddress: 'Cawangan Klang, Lembaga Zakat Selangor',
      totalCollections: 98000.00,
      totalTransactions: 72,
      totalCommission: 1960.00,
      paidCommission: 1500.00,
      pendingCommission: 460.00,
      performanceRating: 4.6,
      status: 'active',
      joinDate: '2023-08-15',
      lastCollectionDate: '2024-12-19'
    },
    {
      id: '3',
      name: 'Ustaz Abdul Rahman bin Ismail',
      email: 'abdulrahman@lzs.gov.my',
      phone: '+60198765433',
      branch: 'Petaling Jaya',
      branchAddress: 'Cawangan Petaling Jaya, Lembaga Zakat Selangor',
      totalCollections: 156000.00,
      totalTransactions: 110,
      totalCommission: 3120.00,
      paidCommission: 3000.00,
      pendingCommission: 120.00,
      performanceRating: 4.9,
      status: 'active',
      joinDate: '2023-05-20',
      lastCollectionDate: '2024-12-20'
    },
    {
      id: '4',
      name: 'Ustazah Siti Aishah binti Yusof',
      email: 'sitiaishah@lzs.gov.my',
      phone: '+60123456790',
      branch: 'Kajang',
      branchAddress: 'Cawangan Kajang, Lembaga Zakat Selangor',
      totalCollections: 75000.00,
      totalTransactions: 55,
      totalCommission: 1500.00,
      paidCommission: 1200.00,
      pendingCommission: 300.00,
      performanceRating: 4.4,
      status: 'active',
      joinDate: '2024-01-10',
      lastCollectionDate: '2024-12-18'
    }
  ];

  const filteredAmils = mockAmils
    .filter((amil) => {
      const matchesSearch = 
        amil.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        amil.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        amil.branch.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBranch = branchFilter === 'all' || amil.branch === branchFilter;

      return matchesSearch && matchesBranch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'collections':
          return b.totalCollections - a.totalCollections;
        case 'transactions':
          return b.totalTransactions - a.totalTransactions;
        case 'commission':
          return b.totalCommission - a.totalCommission;
        case 'rating':
          return b.performanceRating - a.performanceRating;
        default:
          return 0;
      }
    });

  const totalCollections = mockAmils.reduce((sum, a) => sum + a.totalCollections, 0);
  const totalTransactions = mockAmils.reduce((sum, a) => sum + a.totalTransactions, 0);
  const totalCommission = mockAmils.reduce((sum, a) => sum + a.totalCommission, 0);
  const totalPendingCommission = mockAmils.reduce((sum, a) => sum + a.pendingCommission, 0);
  const avgRating = mockAmils.reduce((sum, a) => sum + a.performanceRating, 0) / mockAmils.length;

  const branches = Array.from(new Set(mockAmils.map(a => a.branch)));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Prestasi Amil
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                Pantau prestasi, kutipan, dan komisyen amil mengikut cawangan.
              </p>
            </div>
            <Button variant="outline" className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              Eksport Laporan
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Jumlah Amil</CardDescription>
                <CardTitle className="text-2xl">{mockAmils.length}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" />
                Amil aktif
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Jumlah Kutipan</CardDescription>
                <CardTitle className="text-2xl">
                  RM {(totalCollections / 1000).toFixed(0)}K
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Semua cawangan
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Jumlah Transaksi</CardDescription>
                <CardTitle className="text-2xl">{totalTransactions}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                Transaksi berjaya
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Jumlah Komisyen</CardDescription>
                <CardTitle className="text-2xl">
                  RM {(totalCommission / 1000).toFixed(1)}K
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <Award className="h-4 w-4 inline mr-1" />
                Komisyen terkumpul
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Purata Rating</CardDescription>
                <CardTitle className="text-2xl">{avgRating.toFixed(1)}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <Award className="h-4 w-4 inline mr-1" />
                Daripada 5.0
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Cari & Tapis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari nama amil, email, atau cawangan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Cawangan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Cawangan</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Susun mengikut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collections">Jumlah Kutipan</SelectItem>
                    <SelectItem value="transactions">Bil. Transaksi</SelectItem>
                    <SelectItem value="commission">Komisyen</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                Menunjukkan {filteredAmils.length} daripada {mockAmils.length} amil
              </div>
            </CardContent>
          </Card>

          {/* Amil Performance List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAmils.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tiada amil ditemui berdasarkan carian dan penapis anda.</p>
              </div>
            ) : (
              filteredAmils.map((amil) => (
                <Card key={amil.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{amil.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {amil.branch}
                        </CardDescription>
                      </div>
                      <Badge variant={amil.status === 'active' ? 'default' : 'secondary'}>
                        {amil.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{amil.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{amil.phone}</span>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Jumlah Kutipan</p>
                        <p className="text-lg font-semibold text-primary">
                          RM {amil.totalCollections.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Bil. Transaksi</p>
                        <p className="text-lg font-semibold">{amil.totalTransactions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Komisyen Jumlah</p>
                        <p className="text-sm font-semibold">
                          RM {amil.totalCommission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dibayar: RM {amil.paidCommission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })} • 
                          Belum: RM {amil.pendingCommission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Rating Prestasi</p>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-lg font-semibold">{amil.performanceRating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">/ 5.0</span>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Mula: {new Date(amil.joinDate).toLocaleDateString('ms-MY')}</span>
                      </div>
                      {amil.lastCollectionDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Kutipan terakhir: {new Date(amil.lastCollectionDate).toLocaleDateString('ms-MY')}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        Lihat Butiran
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Lihat Komisyen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

