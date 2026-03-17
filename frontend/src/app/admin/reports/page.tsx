'use client';

/**
 * Admin Reports Page
 * View and export various reports with professional layouts
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Download, FileText, CalendarRange, TrendingUp, Building2, CreditCard, Users } from 'lucide-react';

type ReportType =
  | 'daily_summary'
  | 'monthly_summary'
  | 'yearly_summary'
  | 'amil_performance'
  | 'payment_history'
  | 'zakat_types';

interface PaymentRecord {
  noRujukan: string;
  tarikhBayaran: string;
  namaPembayar: string;
  icAtauSsm: string;
  alamat: string;
  jenisZakat: string;
  jumlah: number;
  kaedahBayaran: string;
  namaAmil?: string;
  cawangan?: string;
  status: string;
}

export default function AdminReportsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [reportType, setReportType] = useState<ReportType>('daily_summary');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

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

  // Mock payment records untuk contoh CSV
  const mockPaymentRecords: PaymentRecord[] = [
    {
      noRujukan: 'LZS-2024-001234',
      tarikhBayaran: '2024-12-20',
      namaPembayar: 'Ahmad bin Abdullah',
      icAtauSsm: '850101-10-1234',
      alamat: 'No. 123, Jalan Ampang, 50450 Kuala Lumpur',
      jenisZakat: 'Zakat Pendapatan',
      jumlah: 1250.00,
      kaedahBayaran: 'FPX Online Banking',
      namaAmil: 'Ustaz Muhammad bin Hassan',
      cawangan: 'Shah Alam',
      status: 'Berjaya'
    },
    {
      noRujukan: 'LZS-2024-001235',
      tarikhBayaran: '2024-12-20',
      namaPembayar: 'Syarikat ABC Sdn Bhd',
      icAtauSsm: '123456-X',
      alamat: 'Lot 456, Jalan Perusahaan, 40000 Shah Alam, Selangor',
      jenisZakat: 'Zakat Perniagaan',
      jumlah: 5000.00,
      kaedahBayaran: 'JomPAY',
      namaAmil: 'Ustaz Muhammad bin Hassan',
      cawangan: 'Shah Alam',
      status: 'Berjaya'
    },
    {
      noRujukan: 'LZS-2024-001236',
      tarikhBayaran: '2024-12-19',
      namaPembayar: 'Siti Nurhaliza binti Ahmad',
      icAtauSsm: '920303-03-9012',
      alamat: 'No. 789, Taman Seri Muda, 43300 Seri Kembangan, Selangor',
      jenisZakat: 'Zakat Pendapatan',
      jumlah: 850.00,
      kaedahBayaran: 'TouchnGo eWallet',
      namaAmil: 'Ustazah Fatimah binti Ahmad',
      cawangan: 'Klang',
      status: 'Berjaya'
    },
    {
      noRujukan: 'LZS-2024-001237',
      tarikhBayaran: '2024-12-19',
      namaPembayar: 'XYZ Trading Sdn Bhd',
      icAtauSsm: '987654-Y',
      alamat: 'Suite 10-5, Menara XYZ, Jalan Tun Razak, 50400 Kuala Lumpur',
      jenisZakat: 'Zakat Perniagaan',
      jumlah: 10000.00,
      kaedahBayaran: 'iPay88',
      namaAmil: 'Ustaz Abdul Rahman bin Ismail',
      cawangan: 'Petaling Jaya',
      status: 'Berjaya'
    },
    {
      noRujukan: 'LZS-2024-001238',
      tarikhBayaran: '2024-12-18',
      namaPembayar: 'Mohd Faizal bin Ismail',
      icAtauSsm: '880808-08-5678',
      alamat: 'No. 45, Jalan Masjid, 43000 Kajang, Selangor',
      jenisZakat: 'Zakat Emas',
      jumlah: 320.00,
      kaedahBayaran: 'Kutipan Tunai (Amil)',
      namaAmil: 'Ustazah Siti Aishah binti Yusof',
      cawangan: 'Kajang',
      status: 'Berjaya'
    }
  ];

  // Function untuk generate CSV dengan columns penting
  const generateCSV = () => {
    // Columns untuk CSV
    const headers = [
      'No. Rujukan',
      'Tarikh Bayaran',
      'Nama Pembayar',
      'IC / SSM',
      'Alamat',
      'Jenis Zakat',
      'Jumlah (RM)',
      'Kaedah Bayaran',
      'Nama Amil',
      'Cawangan',
      'Status'
    ];

    // Convert data to CSV format
    const csvRows = [
      headers.join(','),
      ...mockPaymentRecords.map(record => [
        `"${record.noRujukan}"`,
        `"${record.tarikhBayaran}"`,
        `"${record.namaPembayar}"`,
        `"${record.icAtauSsm}"`,
        `"${record.alamat}"`,
        `"${record.jenisZakat}"`,
        record.jumlah.toFixed(2),
        `"${record.kaedahBayaran}"`,
        `"${record.namaAmil || ''}"`,
        `"${record.cawangan || ''}"`,
        `"${record.status}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    
    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM untuk Excel
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_zakat_${reportType}_${dateFrom}_${dateTo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    if (format === 'csv') {
      generateCSV();
      return;
    }
    
    const url = `/api/reports/export/${format}?report_type=${reportType}&date_from=${dateFrom}&date_to=${dateTo}`;
    alert(`Contoh eksport ${reportType} sebagai ${format.toUpperCase()}.\n\nURL backend yang dicadangkan:\n${url}\n\nUntuk CSV, fail telah dimuat turun dengan columns penting.`);
  };

  const today = new Date().toLocaleDateString('ms-MY');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Laporan & Pemantauan</h1>
              <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
                Lihat dan eksport laporan kutipan zakat mengikut hari, bulan, tahun, jenis zakat, saluran pembayaran
                dan prestasi amil / cawangan.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Report Selection & Filters */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Konfigurasi Laporan</span>
                  </CardTitle>
                  <CardDescription>
                    Pilih jenis laporan, julat tarikh dan dimensi pemantauan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Jenis Laporan</label>
                    <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih laporan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily_summary">Ringkasan Harian</SelectItem>
                        <SelectItem value="monthly_summary">Ringkasan Bulanan</SelectItem>
                        <SelectItem value="yearly_summary">Ringkasan Tahunan</SelectItem>
                        <SelectItem value="zakat_types">Mengikut Jenis Zakat</SelectItem>
                        <SelectItem value="amil_performance">Prestasi Amil / Cawangan</SelectItem>
                        <SelectItem value="payment_history">Sejarah Pembayaran</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tarikh Dari</label>
                      <div className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5 text-sm">
                        <CalendarRange className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full bg-transparent outline-none text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tarikh Hingga</label>
                      <div className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5 text-sm">
                        <CalendarRange className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="w-full bg-transparent outline-none text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dimensi Tambahan</label>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <Button variant="outline" size="sm" className="justify-start">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Jenis Zakat
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Kaedah Bayaran
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Building2 className="h-3 w-3 mr-1" />
                        Cawangan
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Users className="h-3 w-3 mr-1" />
                        Amil
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      (Demo) Penapisan sebenar akan diintegrasi dengan API <code>/api/reports/dashboard</code>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Preview */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border border-muted">
                <CardHeader className="border-b bg-muted/40">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span>
                          {reportType === 'daily_summary' && 'Laporan Ringkasan Kutipan Harian'}
                          {reportType === 'monthly_summary' && 'Laporan Ringkasan Kutipan Bulanan'}
                          {reportType === 'yearly_summary' && 'Laporan Ringkasan Kutipan Tahunan'}
                          {reportType === 'zakat_types' && 'Laporan Kutipan Mengikut Jenis Zakat'}
                          {reportType === 'amil_performance' && 'Laporan Prestasi Amil / Cawangan'}
                          {reportType === 'payment_history' && 'Laporan Sejarah Pembayaran Zakat'}
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs sm:text-sm">
                        Contoh susun atur laporan yang akan dijana dalam PDF / Excel bagi tujuan audit & pembentangan.
                      </CardDescription>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground text-right">
                      <p>Lembaga Zakat Selangor • eZakat</p>
                      <p>Tarikh jana: {today}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 text-sm">
                  {/* Ringkasan atas untuk semua jenis laporan */}
                  <section className="space-y-3 pb-4 border-b">
                    <h3 className="font-semibold text-foreground text-base">Ringkasan</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Jumlah Kutipan</p>
                        <p className="font-semibold text-primary">RM {mockPaymentRecords.reduce((sum, r) => sum + r.jumlah, 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Bil. Transaksi</p>
                        <p className="font-semibold">{mockPaymentRecords.length}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Jenis Zakat Tertinggi</p>
                        <p className="font-semibold">Zakat Pendapatan</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Kaedah Dominan</p>
                        <p className="font-semibold">FPX Online Banking</p>
                      </div>
                    </div>
                  </section>

                  {/* Jadual utama mengikut jenis laporan */}
                  {reportType === 'payment_history' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-semibold">No. Rujukan</th>
                            <th className="text-left p-2 font-semibold">Tarikh</th>
                            <th className="text-left p-2 font-semibold">Nama Pembayar</th>
                            <th className="text-left p-2 font-semibold">IC / SSM</th>
                            <th className="text-left p-2 font-semibold">Jenis Zakat</th>
                            <th className="text-right p-2 font-semibold">Jumlah (RM)</th>
                            <th className="text-left p-2 font-semibold">Kaedah</th>
                            <th className="text-left p-2 font-semibold">Amil</th>
                            <th className="text-left p-2 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockPaymentRecords.map((record, idx) => (
                            <tr key={idx} className="border-b hover:bg-muted/30">
                              <td className="p-2">{record.noRujukan}</td>
                              <td className="p-2">{new Date(record.tarikhBayaran).toLocaleDateString('ms-MY')}</td>
                              <td className="p-2">{record.namaPembayar}</td>
                              <td className="p-2">{record.icAtauSsm}</td>
                              <td className="p-2">{record.jenisZakat}</td>
                              <td className="p-2 text-right font-medium">{record.jumlah.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</td>
                              <td className="p-2">{record.kaedahBayaran}</td>
                              <td className="p-2">{record.namaAmil || '-'}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  record.status === 'Berjaya' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-muted/50 font-semibold">
                          <tr>
                            <td colSpan={5} className="p-2 text-right">JUMLAH:</td>
                            <td className="p-2 text-right text-primary">
                              RM {mockPaymentRecords.reduce((sum, r) => sum + r.jumlah, 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                            </td>
                            <td colSpan={3}></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {reportType === 'daily_summary' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-semibold">Jenis Zakat</th>
                            <th className="text-right p-2 font-semibold">Bil. Transaksi</th>
                            <th className="text-right p-2 font-semibold">Jumlah (RM)</th>
                            <th className="text-right p-2 font-semibold">% Daripada Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['Zakat Pendapatan', 'Zakat Perniagaan', 'Zakat Emas'].map((jenis, idx) => {
                            const records = mockPaymentRecords.filter(r => r.jenisZakat === jenis);
                            const total = mockPaymentRecords.reduce((sum, r) => sum + r.jumlah, 0);
                            const jumlah = records.reduce((sum, r) => sum + r.jumlah, 0);
                            const percentage = total > 0 ? (jumlah / total * 100).toFixed(1) : '0.0';
                            return (
                              <tr key={idx} className="border-b hover:bg-muted/30">
                                <td className="p-2">{jenis}</td>
                                <td className="p-2 text-right">{records.length}</td>
                                <td className="p-2 text-right font-medium">{jumlah.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</td>
                                <td className="p-2 text-right">{percentage}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-muted/50 font-semibold">
                          <tr>
                            <td className="p-2">JUMLAH:</td>
                            <td className="p-2 text-right">{mockPaymentRecords.length}</td>
                            <td className="p-2 text-right text-primary">
                              RM {mockPaymentRecords.reduce((sum, r) => sum + r.jumlah, 0).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-2 text-right">100.0%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {reportType === 'monthly_summary' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-semibold">Minggu</th>
                            <th className="text-right p-2 font-semibold">Jumlah Kutipan (RM)</th>
                            <th className="text-right p-2 font-semibold">Bil. Transaksi</th>
                            <th className="text-right p-2 font-semibold">Perubahan vs Minggu Sebelum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'].map((minggu, idx) => (
                            <tr key={idx} className="border-b hover:bg-muted/30">
                              <td className="p-2">{minggu}</td>
                              <td className="p-2 text-right font-medium">RM {(Math.random() * 50000 + 30000).toFixed(2)}</td>
                              <td className="p-2 text-right">{Math.floor(Math.random() * 50 + 20)}</td>
                              <td className="p-2 text-right">
                                <span className={idx > 0 ? 'text-green-600' : 'text-muted-foreground'}>
                                  {idx > 0 ? '+' : ''}{(Math.random() * 10 - 5).toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {reportType === 'yearly_summary' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-semibold">Tahun</th>
                            <th className="text-right p-2 font-semibold">Jumlah Kutipan (RM)</th>
                            <th className="text-right p-2 font-semibold">Bil. Transaksi</th>
                            <th className="text-right p-2 font-semibold">Pertumbuhan YoY</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['2022', '2023', '2024'].map((tahun, idx) => (
                            <tr key={idx} className="border-b hover:bg-muted/30">
                              <td className="p-2">{tahun}</td>
                              <td className="p-2 text-right font-medium">RM {(Math.random() * 2000000 + 1000000).toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</td>
                              <td className="p-2 text-right">{Math.floor(Math.random() * 5000 + 2000)}</td>
                              <td className="p-2 text-right">
                                <span className={idx > 0 ? 'text-green-600' : 'text-muted-foreground'}>
                                  {idx > 0 ? '+' : ''}{(Math.random() * 15 + 5).toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {reportType === 'zakat_types' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-semibold">Jenis Zakat</th>
                            <th className="text-right p-2 font-semibold">Jumlah (RM)</th>
                            <th className="text-right p-2 font-semibold">Bil. Transaksi</th>
                            <th className="text-right p-2 font-semibold">% Daripada Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['Zakat Pendapatan', 'Zakat Perniagaan', 'Zakat Emas', 'Zakat Wang Simpanan', 'Zakat Saham'].map((jenis, idx) => {
                            const records = mockPaymentRecords.filter(r => r.jenisZakat === jenis);
                            const total = mockPaymentRecords.reduce((sum, r) => sum + r.jumlah, 0);
                            const jumlah = records.length > 0 ? records.reduce((sum, r) => sum + r.jumlah, 0) : Math.random() * 50000 + 10000;
                            const percentage = total > 0 ? (jumlah / (total + 50000) * 100).toFixed(1) : (Math.random() * 30 + 10).toFixed(1);
                            return (
                              <tr key={idx} className="border-b hover:bg-muted/30">
                                <td className="p-2">{jenis}</td>
                                <td className="p-2 text-right font-medium">{jumlah.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</td>
                                <td className="p-2 text-right">{records.length || Math.floor(Math.random() * 50 + 10)}</td>
                                <td className="p-2 text-right">{percentage}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {reportType === 'amil_performance' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-semibold">Amil / Cawangan</th>
                            <th className="text-right p-2 font-semibold">Bil. Kutipan</th>
                            <th className="text-right p-2 font-semibold">Jumlah (RM)</th>
                            <th className="text-right p-2 font-semibold">Komisyen Anggaran (RM)</th>
                            <th className="text-right p-2 font-semibold">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['Ustaz Muhammad bin Hassan - Shah Alam', 'Ustazah Fatimah binti Ahmad - Klang', 'Ustaz Abdul Rahman bin Ismail - Petaling Jaya'].map((amil, idx) => {
                            const records = mockPaymentRecords.filter(r => r.namaAmil?.includes(amil.split(' - ')[0]));
                            const jumlah = records.reduce((sum, r) => sum + r.jumlah, 0) || (Math.random() * 100000 + 50000);
                            const komisyen = jumlah * 0.02; // 2% komisyen
                            return (
                              <tr key={idx} className="border-b hover:bg-muted/30">
                                <td className="p-2">{amil}</td>
                                <td className="p-2 text-right">{records.length || Math.floor(Math.random() * 50 + 20)}</td>
                                <td className="p-2 text-right font-medium">{jumlah.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</td>
                                <td className="p-2 text-right">{komisyen.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}</td>
                                <td className="p-2 text-right">{(Math.random() * 0.5 + 4.5).toFixed(1)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="pt-4 border-t text-xs text-muted-foreground">
                    <p className="mb-1">
                      <strong>Nota:</strong> Ini adalah contoh data untuk tujuan demo. Data sebenar akan diambil dari pangkalan data melalui API backend.
                    </p>
                    <p>
                      Untuk muat turun CSV, klik butang <strong>CSV</strong> di atas. Fail CSV akan mengandungi semua columns penting termasuk No. Rujukan, Tarikh, Nama Pembayar, IC/SSM, Alamat, Jenis Zakat, Jumlah, Kaedah Bayaran, Nama Amil, Cawangan, dan Status.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

