'use client';

/**
 * Zakat Calculator Page
 * Interactive calculator with multiple zakat types and smooth calculation flow
 */

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Calculator, ArrowRight, Info, CreditCard, Smartphone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const calculationSchema = z.object({
  zakat_type: z.string().min(1, 'Sila pilih jenis zakat'),
  // Zakat Pendapatan
  amount_gross: z.number().min(0, 'Jumlah mesti positif').optional(),
  epf: z.number().min(0).optional(),
  socso: z.number().min(0).optional(),
  zakat_selangor: z.number().min(0).optional(),
  // Zakat Perniagaan
  modal: z.number().min(0).optional(),
  untung: z.number().min(0).optional(),
  hutang: z.number().min(0).optional(),
  // Zakat Emas & Perak
  berat_emas: z.number().min(0).optional(),
  harga_emas: z.number().min(0).optional(),
  berat_perak: z.number().min(0).optional(),
  harga_perak: z.number().min(0).optional(),
  // Zakat Simpanan
  jumlah_simpanan: z.number().min(0).optional(),
  // Zakat Saham
  nilai_saham: z.number().min(0).optional(),
  dividen: z.number().min(0).optional(),
  // Zakat Takaful
  nilai_takaful: z.number().min(0).optional(),
  premium_takaful: z.number().min(0).optional(),
});

type CalculationForm = z.infer<typeof calculationSchema>;

const ZAKAT_TYPES = [
  { value: 'pendapatan', label: 'Zakat Pendapatan', description: 'Zakat untuk pendapatan gaji dan upah' },
  { value: 'perniagaan', label: 'Zakat Perniagaan', description: 'Zakat untuk perniagaan dan syarikat' },
  { value: 'emas_perak', label: 'Zakat Emas & Perak', description: 'Zakat untuk emas dan perak' },
  { value: 'simpanan', label: 'Zakat Simpanan', description: 'Zakat untuk simpanan dan deposit' },
  { value: 'saham', label: 'Zakat Saham', description: 'Zakat untuk saham dan pelaburan' },
  { value: 'takaful', label: 'Zakat Takaful', description: 'Zakat untuk takaful dan insurans' },
];

const NISAB = 14624; // RM 14,624
const ZAKAT_RATE = 0.025; // 2.5%

const PAYMENT_METHODS = [
  {
    id: 'fpx',
    name: 'FPX',
    description: 'Online Banking',
    icon: CreditCard,
    fee: 'RM 1.00',
  },
  {
    id: 'jompay',
    name: 'JomPAY',
    description: 'Bayar di cawangan bank',
    icon: Smartphone,
    fee: 'RM 0.50',
  },
  {
    id: 'ewallet',
    name: 'eWallet',
    description: 'TnG, MAE, ShopeePay',
    icon: Smartphone,
    fee: '1.5%',
  },
  {
    id: 'ipay88',
    name: 'iPay88',
    description: 'Kad kredit/debit',
    icon: CreditCard,
    fee: '2.5%',
  },
];

export default function CalculatorPage() {
  const { isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CalculationForm>({
    resolver: zodResolver(calculationSchema),
    defaultValues: {
      zakat_type: 'pendapatan',
    },
  });

  const zakatType = watch('zakat_type');
  const amountGross = watch('amount_gross') || 0;
  const epf = watch('epf') || 0;
  const socso = watch('socso') || 0;
  const zakatSelangor = watch('zakat_selangor') || 0;
  
  // Zakat Perniagaan
  const modal = watch('modal') || 0;
  const untung = watch('untung') || 0;
  const hutang = watch('hutang') || 0;
  
  // Zakat Emas & Perak
  const beratEmas = watch('berat_emas') || 0;
  const hargaEmas = watch('harga_emas') || 0;
  const beratPerak = watch('berat_perak') || 0;
  const hargaPerak = watch('harga_perak') || 0;
  
  // Zakat Simpanan
  const jumlahSimpanan = watch('jumlah_simpanan') || 0;
  
  // Zakat Saham
  const nilaiSaham = watch('nilai_saham') || 0;
  const dividen = watch('dividen') || 0;
  
  // Zakat Takaful
  const nilaiTakaful = watch('nilai_takaful') || 0;
  const premiumTakaful = watch('premium_takaful') || 0;

  // Calculate based on zakat type
  let amountNet = 0;
  let totalDeductions = 0;
  
  if (zakatType === 'pendapatan') {
    totalDeductions = epf + socso + zakatSelangor;
    amountNet = amountGross - totalDeductions;
  } else if (zakatType === 'perniagaan') {
    amountNet = modal + untung - hutang;
  } else if (zakatType === 'emas_perak') {
    const nilaiEmas = beratEmas * hargaEmas;
    const nilaiPerak = beratPerak * hargaPerak;
    amountNet = nilaiEmas + nilaiPerak;
  } else if (zakatType === 'simpanan') {
    amountNet = jumlahSimpanan;
  } else if (zakatType === 'saham') {
    amountNet = nilaiSaham + dividen;
  } else if (zakatType === 'takaful') {
    amountNet = nilaiTakaful + premiumTakaful;
  }

  const zakatDue = amountNet >= NISAB ? amountNet * ZAKAT_RATE : 0;
  const status = amountNet >= NISAB ? 'wajib' : 'tidak_wajib';

  const onSubmit = async (data: CalculationForm) => {
    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      setResult({
        zakat_type: ZAKAT_TYPES.find(t => t.value === data.zakat_type)?.label,
        amount_gross: zakatType === 'pendapatan' ? data.amount_gross : undefined,
        amount_deductions: zakatType === 'pendapatan' ? totalDeductions : undefined,
        amount_net: amountNet,
        zakat_due: zakatDue,
        status,
        nisab: NISAB,
      });
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Kalkulator Zakat</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Kira zakat anda dengan mudah dan tepat
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Calculator Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>Maklumat Zakat</span>
                  </CardTitle>
                  <CardDescription>
                    Pilih jenis zakat dan masukkan maklumat yang diperlukan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="zakat_type">Jenis Zakat</Label>
                      <Select
                        value={zakatType}
                        onValueChange={(value) => setValue('zakat_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis zakat" />
                        </SelectTrigger>
                        <SelectContent>
                          {ZAKAT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {zakatType && (
                        <p className="text-sm text-muted-foreground">
                          {ZAKAT_TYPES.find(t => t.value === zakatType)?.description}
                        </p>
                      )}
                    </div>

                    {/* Zakat Pendapatan Fields */}
                    {zakatType === 'pendapatan' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="amount_gross">
                            Jumlah Pendapatan Kasar (RM)
                          </Label>
                          <Input
                            id="amount_gross"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('amount_gross', { valueAsNumber: true })}
                          />
                          {errors.amount_gross && (
                            <p className="text-sm text-destructive">
                              {errors.amount_gross.message}
                            </p>
                          )}
                        </div>

                        <Separator />
                        <div className="space-y-4">
                          <h3 className="font-semibold">Potongan</h3>
                          
                          <div className="space-y-2">
                            <Label htmlFor="epf">EPF (RM)</Label>
                            <Input
                              id="epf"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...register('epf', { valueAsNumber: true })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="socso">SOCSO (RM)</Label>
                            <Input
                              id="socso"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...register('socso', { valueAsNumber: true })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="zakat_selangor">Zakat Selangor (RM)</Label>
                            <Input
                              id="zakat_selangor"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...register('zakat_selangor', { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Zakat Perniagaan Fields */}
                    {zakatType === 'perniagaan' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="modal">Modal Perniagaan (RM)</Label>
                          <Input
                            id="modal"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('modal', { valueAsNumber: true })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="untung">Untung Bersih (RM)</Label>
                          <Input
                            id="untung"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('untung', { valueAsNumber: true })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hutang">Hutang Semasa (RM)</Label>
                          <Input
                            id="hutang"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('hutang', { valueAsNumber: true })}
                          />
                        </div>
                      </>
                    )}

                    {/* Zakat Emas & Perak Fields */}
                    {zakatType === 'emas_perak' && (
                      <>
                        <div className="space-y-4">
                          <h3 className="font-semibold">Emas</h3>
                          <div className="space-y-2">
                            <Label htmlFor="berat_emas">Berat Emas (gram)</Label>
                            <Input
                              id="berat_emas"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...register('berat_emas', { valueAsNumber: true })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="harga_emas">Harga Emas Semasa (RM/gram)</Label>
                            <Input
                              id="harga_emas"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...register('harga_emas', { valueAsNumber: true })}
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="font-semibold">Perak</h3>
                          <div className="space-y-2">
                            <Label htmlFor="berat_perak">Berat Perak (gram)</Label>
                            <Input
                              id="berat_perak"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...register('berat_perak', { valueAsNumber: true })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="harga_perak">Harga Perak Semasa (RM/gram)</Label>
                            <Input
                              id="harga_perak"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...register('harga_perak', { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Zakat Simpanan Fields */}
                    {zakatType === 'simpanan' && (
                      <div className="space-y-2">
                        <Label htmlFor="jumlah_simpanan">Jumlah Simpanan (RM)</Label>
                        <Input
                          id="jumlah_simpanan"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register('jumlah_simpanan', { valueAsNumber: true })}
                        />
                      </div>
                    )}

                    {/* Zakat Saham Fields */}
                    {zakatType === 'saham' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="nilai_saham">Nilai Saham (RM)</Label>
                          <Input
                            id="nilai_saham"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('nilai_saham', { valueAsNumber: true })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dividen">Dividen Diterima (RM)</Label>
                          <Input
                            id="dividen"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('dividen', { valueAsNumber: true })}
                          />
                        </div>
                      </>
                    )}

                    {/* Zakat Takaful Fields */}
                    {zakatType === 'takaful' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="nilai_takaful">Nilai Takaful (RM)</Label>
                          <Input
                            id="nilai_takaful"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('nilai_takaful', { valueAsNumber: true })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="premium_takaful">Premium Takaful (RM)</Label>
                          <Input
                            id="premium_takaful"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register('premium_takaful', { valueAsNumber: true })}
                          />
                        </div>
                      </>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg" 
                      disabled={isCalculating || (zakatType === 'pendapatan' && !amountGross) || (zakatType === 'perniagaan' && !modal && !untung) || (zakatType === 'emas_perak' && !beratEmas && !beratPerak) || (zakatType === 'simpanan' && !jumlahSimpanan) || (zakatType === 'saham' && !nilaiSaham) || (zakatType === 'takaful' && !nilaiTakaful)}
                    >
                      {isCalculating ? 'Mengira...' : 'Kira Zakat'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Preview & Result */}
            <div className="space-y-6">
              {/* Quick Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pratonton</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {zakatType === 'pendapatan' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pendapatan Kasar</span>
                        <span className="font-medium">RM {amountGross.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                      </div>
                      
                      {totalDeductions > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Jumlah Potongan</span>
                          <span className="font-medium">- RM {totalDeductions.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </>
                  )}

                  {zakatType === 'perniagaan' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Modal</span>
                        <span className="font-medium">RM {modal.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Untung</span>
                        <span className="font-medium">+ RM {untung.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                      </div>
                      {hutang > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Hutang</span>
                          <span className="font-medium">- RM {hutang.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </>
                  )}

                  {zakatType === 'emas_perak' && (
                    <>
                      {(beratEmas > 0 || beratPerak > 0) && (
                        <>
                          {beratEmas > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Nilai Emas</span>
                              <span className="font-medium">RM {(beratEmas * hargaEmas).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                          {beratPerak > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Nilai Perak</span>
                              <span className="font-medium">RM {(beratPerak * hargaPerak).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {zakatType === 'simpanan' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jumlah Simpanan</span>
                      <span className="font-medium">RM {jumlahSimpanan.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  {zakatType === 'saham' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nilai Saham</span>
                        <span className="font-medium">RM {nilaiSaham.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                      </div>
                      {dividen > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dividen</span>
                          <span className="font-medium">+ RM {dividen.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </>
                  )}

                  {zakatType === 'takaful' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nilai Takaful</span>
                        <span className="font-medium">RM {nilaiTakaful.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                      </div>
                      {premiumTakaful > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Premium Takaful</span>
                          <span className="font-medium">+ RM {premiumTakaful.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-sm font-semibold">
                    <span>
                      {zakatType === 'pendapatan' && 'Pendapatan Bersih'}
                      {zakatType === 'perniagaan' && 'Aset Bersih'}
                      {zakatType === 'emas_perak' && 'Nilai Keseluruhan'}
                      {zakatType === 'simpanan' && 'Jumlah Simpanan'}
                      {zakatType === 'saham' && 'Nilai Keseluruhan'}
                      {zakatType === 'takaful' && 'Nilai Keseluruhan'}
                    </span>
                    <span>RM {amountNet.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Nisab</span>
                      <Badge variant={amountNet >= NISAB ? 'default' : 'secondary'}>
                        RM {NISAB.toLocaleString('ms-MY')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={status === 'wajib' ? 'default' : 'outline'}>
                        {status === 'wajib' ? 'Wajib' : 'Tidak Wajib'}
                      </Badge>
                    </div>
                  </div>

                  {amountNet >= NISAB && (
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Zakat Diwajibkan</span>
                        <span className="text-lg font-bold text-primary">
                          RM {zakatDue.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>Maklumat</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Nisab: RM {NISAB.toLocaleString('ms-MY')} (85g emas)</p>
                  <p>• Kadar Zakat: 2.5%</p>
                  <p>• Haul: 355 hari (tahun Hijrah)</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <Card className="mt-6 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Hasil Pengiraan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Jenis Zakat</p>
                    <p className="font-semibold">{result.zakat_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant={result.status === 'wajib' ? 'default' : 'secondary'}>
                      {result.status === 'wajib' ? 'Wajib' : 'Tidak Wajib'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {zakatType === 'pendapatan' && 'Pendapatan Bersih'}
                      {zakatType === 'perniagaan' && 'Aset Bersih'}
                      {zakatType === 'emas_perak' && 'Nilai Keseluruhan'}
                      {zakatType === 'simpanan' && 'Jumlah Simpanan'}
                      {zakatType === 'saham' && 'Nilai Keseluruhan'}
                      {zakatType === 'takaful' && 'Nilai Keseluruhan'}
                    </p>
                    <p className="font-semibold text-lg">
                      RM {result.amount_net.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Zakat Diwajibkan</p>
                    <p className="font-semibold text-lg text-primary">
                      RM {result.zakat_due.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Payment Button - Only show if user is logged in */}
                {result && isAuthenticated && (
                  <div className="space-y-4">
                    <Link href={`/pay?amount=${result.zakat_due}&type=${zakatType}`}>
                      <Button size="lg" className="w-full" variant={result.status === 'wajib' ? 'default' : 'outline'}>
                        {result.status === 'wajib' ? 'Bayar Zakat Sekarang' : 'Teruskan ke Pembayaran'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    {/* Payment Methods Preview */}
                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold mb-3 text-muted-foreground">Kaedah Pembayaran Tersedia:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PAYMENT_METHODS.map((method) => {
                          const Icon = method.icon;
                          return (
                            <div
                              key={method.id}
                              className="flex flex-col items-center p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <Icon className="h-5 w-5 mb-2 text-primary" />
                              <span className="text-xs font-semibold">{method.name}</span>
                              <span className="text-xs text-muted-foreground mt-1">{method.fee}</span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Pilih kaedah pembayaran yang paling mudah untuk anda
                      </p>
                    </div>
                  </div>
                )}

                {/* Login Prompt - Show if user not logged in */}
                {result && !isAuthenticated && (
                  <div className="pt-4 border-t">
                    <div className="p-4 bg-muted/50 rounded-lg text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Log masuk untuk meneruskan pembayaran zakat
                      </p>
                      <Link href="/auth/login">
                        <Button variant="outline" size="sm">
                          Log Masuk
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

