'use client';

/**
 * Dashboard Page
 * User dashboard with quick actions and overview
 */

import Link from 'next/link';
import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  Calculator, 
  CreditCard, 
  Receipt, 
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Selamat Datang, {user.full_name}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Urus zakat anda dengan mudah dan pantas
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/calculator')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Kira Zakat</CardTitle>
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Kira zakat anda dengan mudah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Mula Kira
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/calculator')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Bayar Zakat</CardTitle>
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Kira dan bayar zakat dengan pelbagai kaedah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Bayar Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/history')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Sejarah Bayaran</CardTitle>
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
                <CardDescription>
                  Lihat semua transaksi anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Lihat Sejarah
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Bayaran Tahun Ini</CardDescription>
                <CardTitle className="text-2xl">RM 0.00</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Tiada rekod</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Transaksi</CardDescription>
                <CardTitle className="text-2xl">0</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Receipt className="h-4 w-4 mr-1" />
                  <span>Tiada transaksi</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Status Akaun</CardDescription>
                <CardTitle className="text-lg">
                  <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                    {user.is_verified ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Disahkan
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Menunggu Pengesahan
                      </>
                    )}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {user.is_verified 
                    ? 'Akaun anda telah disahkan' 
                    : 'Sila semak email untuk pengesahan'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Aktiviti Terkini</CardTitle>
              <CardDescription>Transaksi dan aktiviti terkini anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tiada aktiviti terkini</p>
                <Link href="/calculator">
                  <Button variant="outline" className="mt-4">
                    Mula Bayar Zakat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

