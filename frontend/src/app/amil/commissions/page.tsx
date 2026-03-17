'use client';

/**
 * Amil Commissions Page
 * View commission history and payments
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DollarSign, CheckCircle2, Clock, Calendar, Receipt, CreditCard, MapPin } from 'lucide-react';

export default function AmilCommissionsPage() {
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

  // Mock data
  interface Commission {
    id: string;
    payment_ref: string;
    amount: number;
    rate: number;
    collection_amount: number;
    is_paid: boolean;
    paid_at?: string;
    payment_method?: string;
    payment_ref_commission?: string;
    zakat_type: string;
    payer_name: string;
    collected_at: string;
  }

  const summary = {
    total_earned: 3125.00,
    total_paid: 2500.00,
    total_pending: 625.00,
  };

  const commissions: Commission[] = [
    {
      id: '1',
      payment_ref: 'LZS-2025-001234',
      amount: 25.00,
      rate: 0.02,
      collection_amount: 1250.00,
      is_paid: true,
      paid_at: '15 Januari 2025',
      payment_method: 'Bank Transfer',
      payment_ref_commission: 'COM-2025-0001',
      zakat_type: 'Zakat Pendapatan',
      payer_name: 'Ahmad Bin Ali',
      collected_at: '20 Januari 2025'
    },
    {
      id: '2',
      payment_ref: 'LZS-2025-001189',
      amount: 100.00,
      rate: 0.02,
      collection_amount: 5000.00,
      is_paid: true,
      paid_at: '15 Januari 2025',
      payment_method: 'Bank Transfer',
      payment_ref_commission: 'COM-2025-0002',
      zakat_type: 'Zakat Perniagaan',
      payer_name: 'Syarikat ABC Sdn Bhd',
      collected_at: '15 Januari 2025'
    },
    {
      id: '3',
      payment_ref: 'LZS-2025-001156',
      amount: 50.00,
      rate: 0.02,
      collection_amount: 2500.00,
      is_paid: true,
      paid_at: '10 Januari 2025',
      payment_method: 'Bank Transfer',
      payment_ref_commission: 'COM-2025-0003',
      zakat_type: 'Zakat Emas',
      payer_name: 'Fatimah Binti Hassan',
      collected_at: '12 Januari 2025'
    },
    {
      id: '4',
      payment_ref: 'LZS-2025-001145',
      amount: 30.00,
      rate: 0.02,
      collection_amount: 1500.00,
      is_paid: true,
      paid_at: '10 Januari 2025',
      payment_method: 'Bank Transfer',
      payment_ref_commission: 'COM-2025-0004',
      zakat_type: 'Zakat Wang Simpanan',
      payer_name: 'Mohd Zain Bin Ismail',
      collected_at: '10 Januari 2025'
    },
    {
      id: '5',
      payment_ref: 'LZS-2025-001134',
      amount: 20.00,
      rate: 0.02,
      collection_amount: 1000.00,
      is_paid: true,
      paid_at: '5 Januari 2025',
      payment_method: 'Bank Transfer',
      payment_ref_commission: 'COM-2025-0005',
      zakat_type: 'Zakat Pendapatan',
      payer_name: 'Siti Nurhaliza Binti Ahmad',
      collected_at: '8 Januari 2025'
    },
    {
      id: '6',
      payment_ref: 'LZS-2025-001123',
      amount: 75.00,
      rate: 0.02,
      collection_amount: 3750.00,
      is_paid: false,
      zakat_type: 'Zakat Perniagaan',
      payer_name: 'XYZ Trading Sdn Bhd',
      collected_at: '22 Januari 2025'
    },
    {
      id: '7',
      payment_ref: 'LZS-2025-001112',
      amount: 40.00,
      rate: 0.02,
      collection_amount: 2000.00,
      is_paid: false,
      zakat_type: 'Zakat Emas',
      payer_name: 'Abdul Rahman Bin Abdullah',
      collected_at: '25 Januari 2025'
    },
    {
      id: '8',
      payment_ref: 'LZS-2025-001101',
      amount: 15.00,
      rate: 0.02,
      collection_amount: 750.00,
      is_paid: false,
      zakat_type: 'Zakat Fitrah',
      payer_name: 'Nurul Aini Binti Mohd',
      collected_at: '28 Januari 2025'
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Komisyen Saya</h1>
            <p className="text-muted-foreground">
              Lihat sejarah komisyen dan pembayaran
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Jumlah Komisyen</CardDescription>
                <CardTitle className="text-2xl">
                  RM {summary.total_earned.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
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
                <CardDescription>Sudah Dibayar</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  RM {summary.total_paid.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span>Dibayar</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tertunggak</CardDescription>
                <CardTitle className="text-2xl text-orange-600">
                  RM {summary.total_pending.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-orange-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Menunggu pembayaran</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commission History */}
          <Card>
            <CardHeader>
              <CardTitle>Sejarah Komisyen</CardTitle>
              <CardDescription>Semua komisyen dari kutipan anda</CardDescription>
            </CardHeader>
            <CardContent>
              {commissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Tiada komisyen lagi</p>
                  <p className="text-sm mt-2">Komisyen akan muncul selepas kutipan berjaya</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commissions.map((commission) => (
                    <Card key={commission.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    RM {commission.amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                                  </h3>
                                  <Badge variant={commission.is_paid ? 'default' : 'secondary'}>
                                    {commission.is_paid ? (
                                      <span className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Dibayar
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Tertunggak
                                      </span>
                                    )}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {commission.zakat_type}
                                </p>
                                <p className="text-sm font-medium">
                                  {commission.payer_name}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Receipt className="h-4 w-4" />
                                <span>Rujukan: <span className="font-medium text-foreground">{commission.payment_ref}</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span>Kutipan: <span className="font-medium text-foreground">RM {commission.collection_amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <span>Kadar: <span className="font-medium text-foreground">{(commission.rate * 100).toFixed(2)}%</span></span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Dikumpul: <span className="font-medium text-foreground">{commission.collected_at}</span></span>
                              </div>
                              {commission.is_paid && commission.paid_at && (
                                <>
                                  <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Dibayar: <span className="font-medium">{commission.paid_at}</span></span>
                                  </div>
                                  {commission.payment_method && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <CreditCard className="h-4 w-4" />
                                      <span>Kaedah: <span className="font-medium text-foreground">{commission.payment_method}</span></span>
                                    </div>
                                  )}
                                  {commission.payment_ref_commission && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <span>Rujukan Komisyen: <span className="font-medium text-foreground">{commission.payment_ref_commission}</span></span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
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

