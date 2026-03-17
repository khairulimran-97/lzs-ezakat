'use client';

/**
 * Amil Collections Page
 * View all collections made by amil with filter by district and pagination
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Receipt, MapPin, Calendar, Search, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface Collection {
  id: string;
  payer_name: string;
  payer_nric_ssm: string;
  payer_type: 'individual' | 'company';
  zakat_type: string;
  amount: number;
  ref_no: string;
  collected_at: string;
  location: string;
  district: string;
  commission: number;
}

// Daerah di Negeri Selangor
const SELANGOR_DISTRICTS = [
  'Semua Daerah',
  'Gombak',
  'Hulu Langat',
  'Hulu Selangor',
  'Klang',
  'Kuala Langat',
  'Kuala Selangor',
  'Petaling',
  'Sabak Bernam',
  'Sepang',
  'Shah Alam',
];

export default function AmilCollectionsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Semua Daerah');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Mock data untuk sejarah kutipan
  const mockCollections: Collection[] = [
    {
      id: '1',
      payer_name: 'Ahmad Bin Ali',
      payer_nric_ssm: '900101011234',
      payer_type: 'individual',
      zakat_type: 'Zakat Pendapatan',
      amount: 1250.00,
      ref_no: 'LZS-2025-001234',
      collected_at: '20 Januari 2025, 14:30',
      location: '3.1390°N, 101.6869°E',
      district: 'Petaling',
      commission: 25.00,
    },
    {
      id: '2',
      payer_name: 'Syarikat ABC Sdn Bhd',
      payer_nric_ssm: '123456789',
      payer_type: 'company',
      zakat_type: 'Zakat Perniagaan',
      amount: 5000.00,
      ref_no: 'LZS-2025-001189',
      collected_at: '15 Januari 2025, 10:15',
      location: '3.1395°N, 101.6875°E',
      district: 'Shah Alam',
      commission: 100.00,
    },
    {
      id: '3',
      payer_name: 'Fatimah Binti Hassan',
      payer_nric_ssm: '850505055678',
      payer_type: 'individual',
      zakat_type: 'Zakat Emas',
      amount: 2500.00,
      ref_no: 'LZS-2025-001156',
      collected_at: '12 Januari 2025, 16:45',
      location: '3.1385°N, 101.6860°E',
      district: 'Klang',
      commission: 50.00,
    },
    {
      id: '4',
      payer_name: 'Mohd Zain Bin Ismail',
      payer_nric_ssm: '920202021234',
      payer_type: 'individual',
      zakat_type: 'Zakat Wang Simpanan',
      amount: 1500.00,
      ref_no: 'LZS-2025-001145',
      collected_at: '10 Januari 2025, 11:20',
      location: '3.1400°N, 101.6880°E',
      district: 'Gombak',
      commission: 30.00,
    },
    {
      id: '5',
      payer_name: 'Siti Nurhaliza Binti Ahmad',
      payer_nric_ssm: '880808088901',
      payer_type: 'individual',
      zakat_type: 'Zakat Pendapatan',
      amount: 1000.00,
      ref_no: 'LZS-2025-001134',
      collected_at: '8 Januari 2025, 09:30',
      location: '3.1392°N, 101.6872°E',
      district: 'Petaling',
      commission: 20.00,
    },
    {
      id: '6',
      payer_name: 'XYZ Trading Sdn Bhd',
      payer_nric_ssm: '987654321',
      payer_type: 'company',
      zakat_type: 'Zakat Perniagaan',
      amount: 3750.00,
      ref_no: 'LZS-2025-001123',
      collected_at: '5 Januari 2025, 14:15',
      location: '3.1410°N, 101.6890°E',
      district: 'Hulu Langat',
      commission: 75.00,
    },
    {
      id: '7',
      payer_name: 'Abdul Rahman Bin Abdullah',
      payer_nric_ssm: '870707077890',
      payer_type: 'individual',
      zakat_type: 'Zakat Emas',
      amount: 2000.00,
      ref_no: 'LZS-2025-001112',
      collected_at: '3 Januari 2025, 13:45',
      location: '3.1380°N, 101.6855°E',
      district: 'Kuala Selangor',
      commission: 40.00,
    },
    {
      id: '8',
      payer_name: 'Nurul Aini Binti Mohd',
      payer_nric_ssm: '910101011567',
      payer_type: 'individual',
      zakat_type: 'Zakat Fitrah',
      amount: 750.00,
      ref_no: 'LZS-2025-001101',
      collected_at: '1 Januari 2025, 10:00',
      location: '3.1395°N, 101.6870°E',
      district: 'Sepang',
      commission: 15.00,
    },
    {
      id: '9',
      payer_name: 'Hassan Bin Ibrahim',
      payer_nric_ssm: '860606066789',
      payer_type: 'individual',
      zakat_type: 'Zakat Pendapatan',
      amount: 1800.00,
      ref_no: 'LZS-2024-009999',
      collected_at: '28 Disember 2024, 15:30',
      location: '3.1405°N, 101.6885°E',
      district: 'Petaling',
      commission: 36.00,
    },
    {
      id: '10',
      payer_name: 'Syarikat DEF Sdn Bhd',
      payer_nric_ssm: '111222333',
      payer_type: 'company',
      zakat_type: 'Zakat Perniagaan',
      amount: 6000.00,
      ref_no: 'LZS-2024-009988',
      collected_at: '25 Disember 2024, 11:20',
      location: '3.1375°N, 101.6865°E',
      district: 'Klang',
      commission: 120.00,
    },
    {
      id: '11',
      payer_name: 'Aminah Binti Kassim',
      payer_nric_ssm: '890909099012',
      payer_type: 'individual',
      zakat_type: 'Zakat Wang Simpanan',
      amount: 2200.00,
      ref_no: 'LZS-2024-009977',
      collected_at: '22 Disember 2024, 14:00',
      location: '3.1398°N, 101.6878°E',
      district: 'Hulu Selangor',
      commission: 44.00,
    },
    {
      id: '12',
      payer_name: 'Mohd Fadzli Bin Ahmad',
      payer_nric_ssm: '930303033456',
      payer_type: 'individual',
      zakat_type: 'Zakat Emas',
      amount: 3000.00,
      ref_no: 'LZS-2024-009966',
      collected_at: '20 Disember 2024, 16:15',
      location: '3.1388°N, 101.6862°E',
      district: 'Sabak Bernam',
      commission: 60.00,
    },
    {
      id: '13',
      payer_name: 'Norazila Binti Zainal',
      payer_nric_ssm: '900909099345',
      payer_type: 'individual',
      zakat_type: 'Zakat Pendapatan',
      amount: 1350.00,
      ref_no: 'LZS-2024-009955',
      collected_at: '18 Disember 2024, 09:45',
      location: '3.1402°N, 101.6882°E',
      district: 'Kuala Langat',
      commission: 27.00,
    },
    {
      id: '14',
      payer_name: 'Syarikat GHI Sdn Bhd',
      payer_nric_ssm: '444555666',
      payer_type: 'company',
      zakat_type: 'Zakat Perniagaan',
      amount: 4500.00,
      ref_no: 'LZS-2024-009944',
      collected_at: '15 Disember 2024, 13:30',
      location: '3.1393°N, 101.6873°E',
      district: 'Shah Alam',
      commission: 90.00,
    },
    {
      id: '15',
      payer_name: 'Zulkifli Bin Mohd',
      payer_nric_ssm: '880808088234',
      payer_type: 'individual',
      zakat_type: 'Zakat Fitrah',
      amount: 800.00,
      ref_no: 'LZS-2024-009933',
      collected_at: '12 Disember 2024, 10:20',
      location: '3.1378°N, 101.6858°E',
      district: 'Gombak',
      commission: 16.00,
    },
  ];

  // Filter collections
  const filteredCollections = mockCollections.filter((collection) => {
    const matchesDistrict = selectedDistrict === 'Semua Daerah' || collection.district === selectedDistrict;
    const matchesSearch = 
      collection.payer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.payer_nric_ssm.includes(searchQuery) ||
      collection.ref_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.zakat_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCollections = filteredCollections.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDistrict, searchQuery]);

  const collections = paginatedCollections;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Sejarah Kutipan</h1>
                <p className="text-muted-foreground">
                  Semua kutipan zakat yang telah anda rekod
                </p>
              </div>
              <Button variant="outline" onClick={() => alert('Fungsi eksport akan diintegrasikan dengan backend')}>
                <Download className="h-4 w-4 mr-2" />
                Eksport
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Cari
                  </label>
                  <Input
                    placeholder="Cari nama, MyKad/SSM, no. rujukan atau jenis zakat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Daerah
                  </label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih daerah" />
                    </SelectTrigger>
                    <SelectContent>
                      {SELANGOR_DISTRICTS.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {filteredCollections.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Menunjukkan {startIndex + 1}-{Math.min(endIndex, filteredCollections.length)} daripada {filteredCollections.length} kutipan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {collections.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Tiada Kutipan</h3>
                  <p className="text-muted-foreground mb-6">
                    Anda belum membuat sebarang kutipan
                  </p>
                  <button
                    onClick={() => router.push('/amil/collect')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Mula Kutipan Pertama
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {collections.map((collection) => (
                  <Card key={collection.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{collection.payer_name}</h3>
                                <Badge variant="outline">{collection.zakat_type}</Badge>
                                <Badge variant="secondary">{collection.district}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {collection.payer_type === 'individual' ? 'MyKad' : 'SSM'}: {collection.payer_nric_ssm}
                              </p>
                              <p className="text-sm font-medium text-muted-foreground">
                                No. Rujukan: {collection.ref_no}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary mb-1">
                                RM {collection.amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Komisyen: RM {collection.commission.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{collection.collected_at}</span>
                            </div>
                            {collection.location && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="font-mono text-xs">{collection.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Halaman {currentPage} daripada {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Sebelum
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Seterus
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

