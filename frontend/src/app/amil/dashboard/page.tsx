'use client';

/**
 * Amil Dashboard Page
 * Dashboard for amil to view collections, commissions, and performance
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  MapPin,
  Calculator,
  ArrowRight,
  Users,
  Calendar,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

export default function AmilDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role !== 'amil') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'amil') {
    return null;
  }

  // Mock data for demo
  const stats = {
    total_collections: 125,
    total_amount: 156250.00,
    total_commission: 3125.00,
    paid_commission: 2500.00,
    pending_commission: 625.00,
  };

  // Mock data for recent collections
  interface RecentCollection {
    id: string;
    payer_name: string;
    zakat_type: string;
    amount: number;
    ref_no: string;
    collected_at: string;
    location?: string;
  }

  const recentCollections: RecentCollection[] = [
    {
      id: '1',
      payer_name: 'Ahmad Bin Ali',
      zakat_type: 'Zakat Pendapatan',
      amount: 1250.00,
      ref_no: 'LZS-2025-001234',
      collected_at: '20 Januari 2025, 14:30',
      location: '3.1390°N, 101.6869°E'
    },
    {
      id: '2',
      payer_name: 'Syarikat ABC Sdn Bhd',
      zakat_type: 'Zakat Perniagaan',
      amount: 5000.00,
      ref_no: 'LZS-2025-001189',
      collected_at: '15 Januari 2025, 10:15',
      location: '3.1395°N, 101.6875°E'
    },
    {
      id: '3',
      payer_name: 'Fatimah Binti Hassan',
      zakat_type: 'Zakat Emas',
      amount: 2500.00,
      ref_no: 'LZS-2025-001156',
      collected_at: '12 Januari 2025, 16:45',
      location: '3.1385°N, 101.6860°E'
    },
    {
      id: '4',
      payer_name: 'Mohd Zain Bin Ismail',
      zakat_type: 'Zakat Wang Simpanan',
      amount: 1500.00,
      ref_no: 'LZS-2025-001145',
      collected_at: '10 Januari 2025, 11:20',
      location: '3.1400°N, 101.6880°E'
    },
    {
      id: '5',
      payer_name: 'Siti Nurhaliza Binti Ahmad',
      zakat_type: 'Zakat Pendapatan',
      amount: 1000.00,
      ref_no: 'LZS-2025-001134',
      collected_at: '8 Januari 2025, 09:30',
      location: '3.1392°N, 101.6872°E'
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard Amil</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Urus kutipan zakat dan lihat prestasi anda
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Kutipan</CardDescription>
                <CardTitle className="text-2xl">{stats.total_collections}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Receipt className="h-4 w-4 mr-1" />
                  <span>Transaksi</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Kutipan</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.total_amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Jumlah terkumpul</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Komisyen</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.total_commission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>2% dari kutipan</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Komisyen Tertunggak</CardDescription>
                <CardTitle className="text-2xl">
                  RM {stats.pending_commission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-orange-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>Belum dibayar</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/amil/collect')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Kutipan Baru</CardTitle>
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Rekod kutipan zakat baharu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Mula Kutipan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/amil/collections')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Sejarah Kutipan</CardTitle>
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Lihat semua kutipan anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Sejarah
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/amil/commissions')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Komisyen</CardTitle>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Lihat komisyen dan pembayaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Komisyen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Collections */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kutipan Terkini</CardTitle>
                  <CardDescription>5 kutipan terakhir anda</CardDescription>
                </div>
                <Link href="/amil/collections">
                  <Button variant="outline" size="sm">
                    Lihat Semua
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentCollections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tiada kutipan terkini</p>
                  <Link href="/amil/collect">
                    <Button variant="outline" className="mt-4">
                      Mula Kutipan Pertama
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCollections.map((collection) => (
                    <Card key={collection.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{collection.payer_name}</h3>
                              <Badge variant="outline">{collection.zakat_type}</Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4" />
                                <span>{collection.ref_no}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{collection.collected_at}</span>
                              </div>
                              {collection.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span className="text-xs">{collection.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                RM {collection.amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Komisyen: RM {(collection.amount * 0.02).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

