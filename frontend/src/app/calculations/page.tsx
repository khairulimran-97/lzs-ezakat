'use client';

/**
 * Calculation History Page
 * View all saved zakat calculations
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Calculator, Receipt, Calendar, ArrowRight, Trash2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function CalculationsPage() {
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
  interface Calculation {
    id: string;
    zakat_type: string;
    status: 'wajib' | 'tidak_wajib';
    amount_net: number;
    zakat_due: number;
    created_at: string;
    is_paid: boolean;
    payment_ref?: string;
    details?: {
      nisab?: number;
      rate?: number;
      calculation_method?: string;
    };
  }

  const calculations: Calculation[] = [
    {
      id: '1',
      zakat_type: 'Zakat Pendapatan',
      status: 'wajib',
      amount_net: 50000.00,
      zakat_due: 1250.00,
      created_at: '20 Januari 2025',
      is_paid: true,
      payment_ref: 'LZS-2025-001234',
      details: {
        nisab: 5000.00,
        rate: 2.5,
        calculation_method: 'Pendapatan Tahunan - Perbelanjaan Wajib'
      }
    },
    {
      id: '2',
      zakat_type: 'Zakat Perniagaan',
      status: 'wajib',
      amount_net: 200000.00,
      zakat_due: 5000.00,
      created_at: '15 Januari 2025',
      is_paid: true,
      payment_ref: 'LZS-2025-001189',
      details: {
        nisab: 5000.00,
        rate: 2.5,
        calculation_method: 'Aset Semasa - Liabiliti Semasa'
      }
    },
    {
      id: '3',
      zakat_type: 'Zakat Emas',
      status: 'wajib',
      amount_net: 93750.00,
      zakat_due: 2343.75,
      created_at: '10 Januari 2025',
      is_paid: true,
      payment_ref: 'LZS-2025-001156',
      details: {
        nisab: 85,
        rate: 2.5,
        calculation_method: 'Berat Emas (gram) × Harga Semasa × 2.5%'
      }
    },
    {
      id: '4',
      zakat_type: 'Zakat Wang Simpanan',
      status: 'wajib',
      amount_net: 62500.00,
      zakat_due: 1562.50,
      created_at: '5 Januari 2025',
      is_paid: true,
      payment_ref: 'LZS-2025-001098',
      details: {
        nisab: 5000.00,
        rate: 2.5,
        calculation_method: 'Baki Minimum Setahun × 2.5%'
      }
    },
    {
      id: '5',
      zakat_type: 'Zakat Pendapatan',
      status: 'wajib',
      amount_net: 75000.00,
      zakat_due: 1875.00,
      created_at: '22 Januari 2025',
      is_paid: false,
      details: {
        nisab: 5000.00,
        rate: 2.5,
        calculation_method: 'Pendapatan Tahunan - Perbelanjaan Wajib'
      }
    },
    {
      id: '6',
      zakat_type: 'Zakat Fitrah',
      status: 'wajib',
      amount_net: 35.00,
      zakat_due: 35.00,
      created_at: '28 Disember 2024',
      is_paid: true,
      payment_ref: 'LZS-2024-009876',
      details: {
        nisab: 0,
        rate: 100,
        calculation_method: 'Kadar Tetap (RM 35.00)'
      }
    },
    {
      id: '7',
      zakat_type: 'Zakat Pendapatan',
      status: 'tidak_wajib',
      amount_net: 3500.00,
      zakat_due: 0.00,
      created_at: '12 Januari 2025',
      is_paid: false,
      details: {
        nisab: 5000.00,
        rate: 2.5,
        calculation_method: 'Pendapatan Tahunan - Perbelanjaan Wajib'
      }
    },
    {
      id: '8',
      zakat_type: 'Zakat Emas',
      status: 'wajib',
      amount_net: 50000.00,
      zakat_due: 1250.00,
      created_at: '18 Januari 2025',
      is_paid: false,
      details: {
        nisab: 85,
        rate: 2.5,
        calculation_method: 'Berat Emas (gram) × Harga Semasa × 2.5%'
      }
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Sejarah Pengiraan</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Semua pengiraan zakat yang telah anda simpan
            </p>
          </div>

          {calculations.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Calculator className="h-12 w-12 mx-auto opacity-50 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold mb-2">Tiada Pengiraan Disimpan</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pengiraan zakat yang anda buat akan disimpan di sini untuk rujukan masa hadapan
                    </p>
                    <Link href="/calculator">
                      <Button>
                        <Calculator className="mr-2 h-4 w-4" />
                        Kira Zakat Sekarang
                      </Button>
                    </Link>
                  </div>
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
                        <p className="text-sm text-muted-foreground mb-1">Jumlah Zakat Diwajibkan</p>
                        <p className="text-2xl font-bold text-primary">
                          RM {calculations
                            .filter(c => c.status === 'wajib')
                            .reduce((sum, c) => sum + c.zakat_due, 0)
                            .toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <Calculator className="h-8 w-8 text-primary opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Telah Dibayar</p>
                        <p className="text-2xl font-bold text-green-500">
                          {calculations.filter(c => c.is_paid).length}
                        </p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Belum Dibayar</p>
                        <p className="text-2xl font-bold text-amber-500">
                          {calculations.filter(c => !c.is_paid && c.status === 'wajib').length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-amber-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Calculations List */}
              <div className="space-y-4">
                {calculations.map((calc) => (
                  <Card 
                    key={calc.id} 
                    className={`hover:shadow-md transition-shadow ${
                      calc.is_paid ? 'border-l-4 border-l-green-500' : 
                      calc.status === 'wajib' ? 'border-l-4 border-l-primary' : 
                      'border-l-4 border-l-gray-300'
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{calc.zakat_type}</h3>
                            <Badge 
                              variant={calc.status === 'wajib' ? 'default' : 'secondary'}
                              className="flex items-center gap-1"
                            >
                              {calc.status === 'wajib' ? (
                                <>
                                  <AlertCircle className="h-3 w-3" />
                                  Wajib
                                </>
                              ) : (
                                <>
                                  <Info className="h-3 w-3" />
                                  Tidak Wajib
                                </>
                              )}
                            </Badge>
                            {calc.is_paid && (
                              <Badge variant="default" className="bg-green-500 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Telah Dibayar
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!calc.is_paid && calc.status === 'wajib' && (
                              <Link href={`/pay?amount=${calc.zakat_due}&type=${calc.zakat_type}`}>
                                <Button size="sm" variant="default">
                                  Bayar Sekarang
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                            {calc.is_paid && calc.payment_ref && (
                              <Link href={`/history`}>
                                <Button size="sm" variant="outline">
                                  <Receipt className="h-4 w-4 mr-2" />
                                  Lihat Resit
                                </Button>
                              </Link>
                            )}
                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm pt-3 border-t">
                          <div>
                            <p className="text-muted-foreground mb-1">Jumlah Bersih</p>
                            <p className="font-semibold text-lg">
                              RM {calc.amount_net.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Zakat Diwajibkan</p>
                            <p className={`font-semibold text-lg ${calc.status === 'wajib' ? 'text-primary' : 'text-muted-foreground'}`}>
                              {calc.status === 'wajib' ? (
                                <>RM {calc.zakat_due.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</>
                              ) : (
                                <>RM 0.00</>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Tarikh Pengiraan</p>
                            <p className="font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {calc.created_at}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Status Pembayaran</p>
                            <p className="font-medium">
                              {calc.is_paid ? (
                                <Badge variant="default" className="bg-green-500 text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Telah Dibayar
                                </Badge>
                              ) : calc.status === 'wajib' ? (
                                <Badge variant="outline" className="text-xs border-amber-500 text-amber-500">
                                  Belum Dibayar
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Tidak Wajib
                                </Badge>
                              )}
                            </p>
                            {calc.is_paid && calc.payment_ref && (
                              <p className="text-xs text-muted-foreground mt-1 font-mono">
                                {calc.payment_ref}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Calculation Details */}
                        {calc.details && (
                          <div className="pt-3 border-t bg-muted/30 rounded-lg p-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div>
                                <p className="text-muted-foreground">Nisab</p>
                                <p className="font-medium">
                                  {calc.details.nisab !== undefined 
                                    ? calc.details.nisab === 0 
                                      ? 'Tidak Berkenaan' 
                                      : `RM ${calc.details.nisab.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`
                                    : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Kadar</p>
                                <p className="font-medium">{calc.details.rate}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Kaedah Pengiraan</p>
                                <p className="font-medium">{calc.details.calculation_method || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        )}
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

