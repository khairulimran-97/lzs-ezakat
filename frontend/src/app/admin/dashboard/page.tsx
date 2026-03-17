'use client';

/**
 * Admin Dashboard Page
 * Admin dashboard with reports, analytics, and monitoring
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
  Users, 
  Receipt,
  Building2,
  BarChart3,
  CheckCircle2,
  MessagesSquare,
  PieChart,
  CreditCard
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();

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

  // Mock data
  const stats = {
    total_collection: 1562500.00,
    total_transactions: 1250,
    success_rate: 98.5,
    active_payers: 850,
  };

  // Mock data untuk charts
  const zakatTypeData = [
    { name: 'Zakat Pendapatan', amount: 625000, color: '#16a34a' },
    { name: 'Zakat Perniagaan', amount: 468750, color: '#22c55e' },
    { name: 'Zakat Emas', amount: 234375, color: '#4ade80' },
    { name: 'Zakat Wang Simpanan', amount: 156250, color: '#86efac' },
    { name: 'Zakat Lain-lain', amount: 78125, color: '#bbf7d0' },
  ];

  const paymentMethodData = [
    { name: 'FPX', amount: 625000, color: '#3b82f6' },
    { name: 'JomPAY', amount: 312500, color: '#60a5fa' },
    { name: 'eWallet', amount: 281250, color: '#93c5fd' },
    { name: 'iPay88', amount: 187500, color: '#bfdbfe' },
    { name: 'Tunai (Amil)', amount: 156250, color: '#dbeafe' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Pemantauan dan laporan kutipan zakat
            </p>
          </div>

          {/* Key Metrics - high level monitoring */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardDescription className="text-sm font-medium">Jumlah Kutipan</CardDescription>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold">
                  RM {stats.total_collection.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12.5% dari bulan lepas</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardDescription className="text-sm font-medium">Jumlah Transaksi</CardDescription>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold">{stats.total_transactions.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Receipt className="h-4 w-4 mr-1" />
                  <span>Transaksi berjaya</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardDescription className="text-sm font-medium">Kadar Kejayaan</CardDescription>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold">{stats.success_rate}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span>Pembayaran berjaya</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardDescription className="text-sm font-medium">Pembayar Aktif</CardDescription>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold">{stats.active_payers.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Pengguna aktif</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-2 hover:border-primary/50 group" 
              onClick={() => router.push('/admin/reports')}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">Laporan</CardTitle>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardDescription className="text-sm">
                  Lihat laporan harian, bulanan, dan tahunan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Lihat Laporan
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-2 hover:border-blue-500/50 group" 
              onClick={() => router.push('/admin/users')}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold group-hover:text-blue-500 transition-colors">Pengurusan Pengguna</CardTitle>
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <CardDescription className="text-sm">
                  Urus pengguna, amil, dan syarikat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  Urus Pengguna
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-2 hover:border-green-500/50 group" 
              onClick={() => router.push('/admin/amil-performance')}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold group-hover:text-green-500 transition-colors">Prestasi Amil</CardTitle>
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <Building2 className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <CardDescription className="text-sm">
                  Pantau prestasi dan komisyen amil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-green-500 group-hover:text-white transition-colors">
                  Lihat Prestasi
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-2 hover:border-purple-500/50 group" 
              onClick={() => router.push('/admin/communications')}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold group-hover:text-purple-500 transition-colors">Komunikasi & Pengingat</CardTitle>
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <MessagesSquare className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <CardDescription className="text-sm">
                  Urus kempen WhatsApp, emel dan SMS berjadual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  Buka Modul Komunikasi
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Kutipan Mengikut Jenis Zakat - Bar Chart */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Kutipan Mengikut Jenis Zakat
                    </CardTitle>
                    <CardDescription className="mt-1">Bulan semasa (Januari 2025)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zakatTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      className="text-xs"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `RM${(value / 1000).toFixed(0)}k`}
                      className="text-xs"
                    />
                    <Tooltip 
                      formatter={(value: number) => [`RM ${value.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`, 'Jumlah']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="amount" 
                      name="Jumlah Kutipan"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                    >
                      {zakatTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {zakatTypeData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.name}:</span>
                        <span className="font-semibold">
                          RM {(item.amount / 1000).toFixed(0)}k
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kutipan Mengikut Kaedah Bayaran - Pie Chart */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Kutipan Mengikut Kaedah Bayaran
                    </CardTitle>
                    <CardDescription className="mt-1">Bulan semasa (Januari 2025)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`RM ${value.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`, 'Jumlah']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {paymentMethodData.map((item, index) => {
                      const total = paymentMethodData.reduce((sum, d) => sum + d.amount, 0);
                      const percentage = ((item.amount / total) * 100).toFixed(1);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">{item.name}:</span>
                          <span className="font-semibold">
                            {percentage}% (RM {(item.amount / 1000).toFixed(0)}k)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

