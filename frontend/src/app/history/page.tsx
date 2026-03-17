'use client';

/**
 * Payment History Page
 * View all payment transactions
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Receipt, Download, Eye, Calendar, CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock data for demonstration
  interface Payment {
    id: string;
    zakat_type: string;
    status: 'success' | 'pending' | 'failed';
    paid_at: string;
    ref_no: string;
    amount: number;
    payment_method: string;
    receipt_url?: string;
  }

  const payments: Payment[] = [
    {
      id: '1',
      zakat_type: 'Zakat Pendapatan',
      status: 'success',
      paid_at: '20 Januari 2025',
      ref_no: 'LZS-2025-001234',
      amount: 1250.00,
      payment_method: 'FPX Online Banking',
      receipt_url: '/receipts/lzs-2025-001234.pdf'
    },
    {
      id: '2',
      zakat_type: 'Zakat Perniagaan',
      status: 'success',
      paid_at: '15 Januari 2025',
      ref_no: 'LZS-2025-001189',
      amount: 5000.00,
      payment_method: 'JomPAY',
      receipt_url: '/receipts/lzs-2025-001189.pdf'
    },
    {
      id: '3',
      zakat_type: 'Zakat Emas',
      status: 'success',
      paid_at: '10 Januari 2025',
      ref_no: 'LZS-2025-001156',
      amount: 2343.75,
      payment_method: 'eWallet (Touch n Go)',
      receipt_url: '/receipts/lzs-2025-001156.pdf'
    },
    {
      id: '4',
      zakat_type: 'Zakat Wang Simpanan',
      status: 'success',
      paid_at: '5 Januari 2025',
      ref_no: 'LZS-2025-001098',
      amount: 1562.50,
      payment_method: 'iPay88',
      receipt_url: '/receipts/lzs-2025-001098.pdf'
    },
    {
      id: '5',
      zakat_type: 'Zakat Pendapatan',
      status: 'pending',
      paid_at: '22 Januari 2025',
      ref_no: 'LZS-2025-001245',
      amount: 1875.00,
      payment_method: 'FPX Online Banking'
    },
    {
      id: '6',
      zakat_type: 'Zakat Fitrah',
      status: 'success',
      paid_at: '28 Disember 2024',
      ref_no: 'LZS-2024-009876',
      amount: 35.00,
      payment_method: 'Tunai (Amil)',
      receipt_url: '/receipts/lzs-2024-009876.pdf'
    },
    {
      id: '7',
      zakat_type: 'Zakat Pendapatan',
      status: 'success',
      paid_at: '15 Disember 2024',
      ref_no: 'LZS-2024-009543',
      amount: 937.50,
      payment_method: 'eWallet (GrabPay)',
      receipt_url: '/receipts/lzs-2024-009543.pdf'
    },
    {
      id: '8',
      zakat_type: 'Zakat Perniagaan',
      status: 'failed',
      paid_at: '18 Januari 2025',
      ref_no: 'LZS-2025-001201',
      amount: 3750.00,
      payment_method: 'FPX Online Banking'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Sejarah Bayaran</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Semua transaksi zakat anda
            </p>
          </div>

          {payments.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Tiada Transaksi</h3>
                  <p className="text-muted-foreground mb-6">
                    Anda belum membuat sebarang pembayaran zakat
                  </p>
                  <Link href="/calculator">
                    <Button>
                      Mula Bayar Zakat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Jumlah Dibayar</p>
                        <p className="text-2xl font-bold text-primary">
                          RM {payments
                            .filter(p => p.status === 'success')
                            .reduce((sum, p) => sum + p.amount, 0)
                            .toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-primary opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Transaksi Berjaya</p>
                        <p className="text-2xl font-bold text-blue-500">
                          {payments.filter(p => p.status === 'success').length}
                        </p>
                      </div>
                      <Receipt className="h-8 w-8 text-blue-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Menunggu</p>
                        <p className="text-2xl font-bold text-amber-500">
                          {payments.filter(p => p.status === 'pending').length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-amber-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment List */}
              <div className="space-y-4">
                {payments.map((payment) => (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-semibold text-lg">{payment.zakat_type}</h3>
                            <Badge 
                              variant={
                                payment.status === 'success' ? 'default' : 
                                payment.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }
                              className="flex items-center gap-1"
                            >
                              {payment.status === 'success' && <CheckCircle2 className="h-3 w-3" />}
                              {payment.status === 'pending' && <Clock className="h-3 w-3" />}
                              {payment.status === 'failed' && <XCircle className="h-3 w-3" />}
                              {payment.status === 'success' ? 'Berjaya' : 
                               payment.status === 'pending' ? 'Menunggu' : 'Gagal'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{payment.paid_at}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CreditCard className="h-4 w-4" />
                              <span>{payment.payment_method}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">No. Rujukan:</span>
                            <span className="font-mono font-medium">{payment.ref_no}</span>
                          </div>

                          <div className="pt-2 border-t">
                            <span className="text-3xl font-bold text-primary">
                              RM {payment.amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {payment.status === 'success' && payment.receipt_url && (
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              <Download className="h-4 w-4 mr-2" />
                              Muat Turun Resit
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Butiran
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

