'use client';

/**
 * Payment Page
 * Showcases all payment methods prominently with smooth flow
 * Includes FPX bank selection, card details form, and professional loading states
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Shield,
  Clock,
  Loader2,
  Building
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuthStore, useHasHydrated } from '@/lib/store';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fee: string;
  color: string;
  available: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'fpx',
    name: 'FPX',
    description: 'Online Banking - Maybank, CIMB, Public Bank, dan lain-lain',
    icon: <CreditCard className="h-6 w-6" />,
    fee: 'RM 1.00',
    color: 'blue',
    available: true,
  },
  {
    id: 'jompay',
    name: 'JomPAY',
    description: 'Bayar melalui kod JomPAY di mana-mana cawangan bank',
    icon: <Smartphone className="h-6 w-6" />,
    fee: 'RM 0.50',
    color: 'green',
    available: true,
  },
  {
    id: 'ewallet',
    name: 'eWallet',
    description: 'Touch \'n Go, MAE, ShopeePay, dan lain-lain',
    icon: <Smartphone className="h-6 w-6" />,
    fee: '1.5%',
    color: 'purple',
    available: true,
  },
  {
    id: 'ipay88',
    name: 'iPay88',
    description: 'Kad kredit, kad debit, dan banyak lagi',
    icon: <CreditCard className="h-6 w-6" />,
    fee: '2.5%',
    color: 'orange',
    available: true,
  },
];

const FPX_BANKS = [
  { code: 'MB2U', name: 'Maybank2u', logo: '🏦' },
  { code: 'CIMB', name: 'CIMB Clicks', logo: '🏦' },
  { code: 'PBB', name: 'Public Bank', logo: '🏦' },
  { code: 'RHB', name: 'RHB Now', logo: '🏦' },
  { code: 'HLB', name: 'Hong Leong Connect', logo: '🏦' },
  { code: 'AMB', name: 'AmBank', logo: '🏦' },
  { code: 'UOB', name: 'UOB Personal Internet Banking', logo: '🏦' },
  { code: 'OCBC', name: 'OCBC Bank', logo: '🏦' },
  { code: 'AFFIN', name: 'Affin Bank', logo: '🏦' },
  { code: 'ALLIANCE', name: 'Alliance Bank', logo: '🏦' },
];

const cardSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Nombor kad mesti 16 digit')
    .max(19, 'Nombor kad tidak sah')
    .regex(/^\d+$/, 'Hanya nombor dibenarkan'),
  cardName: z.string()
    .min(2, 'Nama mesti sekurang-kurangnya 2 aksara')
    .max(50, 'Nama terlalu panjang'),
  expiryMonth: z.string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Bulan tidak sah'),
  expiryYear: z.string()
    .regex(/^\d{2}$/, 'Tahun mesti 2 digit'),
  cvv: z.string()
    .regex(/^\d{3,4}$/, 'CVV mesti 3 atau 4 digit'),
});

type CardForm = z.infer<typeof cardSchema>;

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  
  const amount = parseFloat(searchParams.get('amount') || '0');
  const zakatType = searchParams.get('type') || 'pendapatan';
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFPXModal, setShowFPXModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<'idle' | 'validating' | 'redirecting' | 'processing'>('idle');

  // If no amount provided, show message to go to calculator first
  const hasAmount = amount && amount > 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
  });

  const cardNumber = watch('cardNumber');
  const expiryMonth = watch('expiryMonth');
  const expiryYear = watch('expiryYear');

  // Auto-format card number
  useEffect(() => {
    if (cardNumber) {
      const formatted = cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted !== cardNumber) {
        setValue('cardNumber', formatted.replace(/\s/g, ''));
      }
    }
  }, [cardNumber, setValue]);

  // Auto-format expiry
  useEffect(() => {
    if (expiryMonth && expiryMonth.length === 2 && !expiryMonth.includes('/')) {
      setValue('expiryMonth', expiryMonth);
    }
    if (expiryYear && expiryYear.length === 2) {
      setValue('expiryYear', expiryYear);
    }
  }, [expiryMonth, expiryYear, setValue]);

  const handlePaymentMethodClick = (methodId: string) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/pay?amount=${amount}&type=${zakatType}`);
      return;
    }

    setSelectedMethod(methodId);

    if (methodId === 'fpx') {
      setShowFPXModal(true);
    } else if (methodId === 'ipay88') {
      setShowCardModal(true);
    } else {
      // For other methods, proceed directly
      processPayment(methodId);
    }
  };

  const handleFPXBankSelect = (bankCode: string) => {
    setSelectedBank(bankCode);
    setShowFPXModal(false);
    processPayment('fpx', bankCode);
  };

  const handleCardSubmit = async (data: CardForm) => {
    setShowCardModal(false);
    processPayment('ipay88', null, data);
  };

  const processPayment = async (
    methodId: string, 
    bankCode?: string | null, 
    cardData?: CardForm | null
  ) => {
    setIsProcessing(true);
    setProcessingStep('validating');

    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessingStep('redirecting');

    // Simulate redirect to payment gateway
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStep('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In real app, this would redirect to payment gateway
    // For demo, redirect to success page
    router.push(`/payment/success?ref=LZS-${Date.now()}&method=${methodId}&amount=${amount}${bankCode ? `&bank=${bankCode}` : ''}`);
  };

  const calculateFee = (method: PaymentMethod) => {
    if (method.fee.includes('%')) {
      const percentage = parseFloat(method.fee.replace('%', ''));
      return (amount * percentage / 100).toFixed(2);
    }
    return method.fee.replace('RM ', '');
  };

  const totalWithFee = (method: PaymentMethod) => {
    const fee = parseFloat(calculateFee(method));
    return (amount + fee).toFixed(2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href={hasAmount ? "/calculator" : "/dashboard"} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {hasAmount ? "Kembali ke Kalkulator" : "Kembali ke Dashboard"}
          </Link>

          {/* No Amount Warning */}
          {!hasAmount && (
            <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Sila Kira Zakat Terlebih Dahulu</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Untuk membayar zakat, sila kira jumlah zakat anda terlebih dahulu menggunakan kalkulator.
                    </p>
                    <Link href="/calculator">
                      <Button>
                        Pergi ke Kalkulator
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ringkasan Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jenis Zakat</span>
                      <span className="font-medium capitalize">{zakatType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jumlah Zakat</span>
                      <span className="font-medium">RM {amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {selectedMethod && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Yuran</span>
                          <span className="font-medium">
                            RM {calculateFee(PAYMENT_METHODS.find(m => m.id === selectedMethod)!)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Jumlah Bayaran</span>
                          <span className="text-primary">
                              RM {parseFloat(totalWithFee(PAYMENT_METHODS.find(m => m.id === selectedMethod)!)).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {!selectedMethod && (
                    <>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          <span>Pembayaran Selamat</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Proses dalam 3 minit</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {hasAmount ? (
                <>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Pilih Kaedah Pembayaran</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Pilih cara pembayaran yang paling mudah untuk anda
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold mb-2">Pilih Kaedah Pembayaran</h1>
                  <p className="text-muted-foreground">
                    Sila kira zakat anda terlebih dahulu untuk meneruskan pembayaran
                  </p>
                </div>
              )}

              {/* Payment Methods Grid */}
              {hasAmount && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  const colorClasses = {
                    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
                    green: 'border-green-500 bg-green-50 dark:bg-green-950/20',
                    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-950/20',
                    orange: 'border-orange-500 bg-orange-50 dark:bg-orange-950/20',
                  };

                  return (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected ? `border-2 ${colorClasses[method.color as keyof typeof colorClasses]}` : 'border-2 border-transparent hover:border-primary/50'
                      } ${!method.available ? 'opacity-50' : ''} ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => method.available && !isProcessing && handlePaymentMethodClick(method.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-${method.color}-100 dark:bg-${method.color}-900/20`}>
                              <div className={`text-${method.color}-600 dark:text-${method.color}-400`}>
                                {method.icon}
                              </div>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{method.name}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {method.description}
                              </CardDescription>
                            </div>
                          </div>
                          {isSelected && isProcessing && (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          )}
                          {isSelected && !isProcessing && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Yuran</span>
                          <Badge variant="outline">{method.fee}</Badge>
                        </div>
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Jumlah Bayaran</span>
                              <span className="font-bold text-primary">
                                RM {parseFloat(totalWithFee(method)).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              )}

              {/* Info Cards */}
              {hasAmount && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Pembayaran Selamat</h3>
                        <p className="text-sm text-muted-foreground">
                          Semua transaksi dilindungi dengan enkripsi SSL dan pematuhan PCI-DSS
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Proses Pantas</h3>
                        <p className="text-sm text-muted-foreground">
                          Selesaikan pembayaran dalam kurang dari 3 minit dan terima resit serta-merta
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              )}

              {/* Individual vs Company Notice */}
              {hasAmount && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Untuk Individu & Syarikat</h3>
                      <p className="text-sm text-muted-foreground">
                        Platform ini menyokong pembayaran zakat untuk kedua-dua individu dan syarikat. 
                        Semua kaedah pembayaran tersedia untuk kedua-dua jenis akaun.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* FPX Bank Selection Modal */}
      <Dialog open={showFPXModal} onOpenChange={setShowFPXModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Pilih Bank untuk FPX</span>
            </DialogTitle>
            <DialogDescription>
              Pilih bank anda untuk meneruskan pembayaran melalui FPX
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {FPX_BANKS.map((bank) => (
              <button
                key={bank.code}
                onClick={() => handleFPXBankSelect(bank.code)}
                className="w-full p-4 text-left border rounded-lg hover:bg-muted transition-colors flex items-center space-x-3"
              >
                <span className="text-2xl">{bank.logo}</span>
                <span className="font-medium">{bank.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Details Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Maklumat Kad</span>
            </DialogTitle>
            <DialogDescription>
              Masukkan maklumat kad kredit/debit anda dengan selamat
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCardSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Nombor Kad</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                {...register('cardNumber')}
                className={errors.cardNumber ? 'border-destructive' : ''}
              />
              {errors.cardNumber && (
                <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Nama pada Kad</Label>
              <Input
                id="cardName"
                placeholder="AHMAD BIN ABDULLAH"
                {...register('cardName')}
                className={errors.cardName ? 'border-destructive' : ''}
              />
              {errors.cardName && (
                <p className="text-sm text-destructive">{errors.cardName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Bulan</Label>
                <Input
                  id="expiryMonth"
                  placeholder="MM"
                  maxLength={2}
                  {...register('expiryMonth')}
                  className={errors.expiryMonth ? 'border-destructive' : ''}
                />
                {errors.expiryMonth && (
                  <p className="text-sm text-destructive">{errors.expiryMonth.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Tahun</Label>
                <Input
                  id="expiryYear"
                  placeholder="YY"
                  maxLength={2}
                  {...register('expiryYear')}
                  className={errors.expiryYear ? 'border-destructive' : ''}
                />
                {errors.expiryYear && (
                  <p className="text-sm text-destructive">{errors.expiryYear.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  {...register('cvv')}
                  className={errors.cvv ? 'border-destructive' : ''}
                />
                {errors.cvv && (
                  <p className="text-sm text-destructive">{errors.cvv.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Maklumat anda dilindungi dengan enkripsi SSL</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCardModal(false)}>
                Batal
              </Button>
              <Button type="submit">
                Teruskan Pembayaran
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    {processingStep === 'validating' && 'Mengesahkan Maklumat...'}
                    {processingStep === 'redirecting' && 'Mengalihkan ke Gateway...'}
                    {processingStep === 'processing' && 'Memproses Pembayaran...'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {processingStep === 'validating' && 'Sila tunggu sebentar...'}
                    {processingStep === 'redirecting' && 'Anda akan dialihkan ke halaman pembayaran...'}
                    {processingStep === 'processing' && 'Jangan tutup halaman ini...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Memuatkan...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
