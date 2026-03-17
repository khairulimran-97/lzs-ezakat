'use client';

/**
 * Admin Communications & Reminders Page
 * Manage WhatsApp / Email / SMS notifications and automated campaigns.
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  MessageCircle, 
  Mail, 
  Smartphone,
  CalendarClock,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  Receipt,
  MoonStar
} from 'lucide-react';

type Channel = 'whatsapp' | 'email' | 'sms';

type Recipient = {
  id: string;
  name: string;
  email: string;
  nricOrSsm: string;
  type: 'individual' | 'company';
};

export default function AdminCommunicationsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState<Channel>('whatsapp');
  const [isHaulCampaignActive, setIsHaulCampaignActive] = useState(false);
  const [isRamadanCampaignActive, setIsRamadanCampaignActive] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);

  const mockRecipients: Recipient[] = useMemo(
    () => [
      {
        id: 'r1',
        name: 'Ahmad Bin Ali',
        email: 'ahmad@example.com',
        nricOrSsm: '900101-10-1234',
        type: 'individual',
      },
      {
        id: 'r2',
        name: 'Siti Binti Karim',
        email: 'siti@example.com',
        nricOrSsm: '920202-14-5678',
        type: 'individual',
      },
      {
        id: 'r3',
        name: 'Syarikat Maju Sdn Bhd',
        email: 'finance@maju.com',
        nricOrSsm: '1234567-A',
        type: 'company',
      },
      {
        id: 'r4',
        name: 'Azman Bin Rahman',
        email: 'azman@example.com',
        nricOrSsm: '880303-08-9999',
        type: 'individual',
      },
    ],
    []
  );

  const filteredRecipients = useMemo(() => {
    const term = recipientSearch.trim().toLowerCase();
    if (!term) return mockRecipients;
    return mockRecipients.filter((r) =>
      [r.name, r.email, r.nricOrSsm].some((field) => field.toLowerCase().includes(term))
    );
  }, [mockRecipients, recipientSearch]);

  const toggleRecipient = (id: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    setSelectedRecipientIds(filteredRecipients.map((r) => r.id));
  };

  const clearSelected = () => {
    setSelectedRecipientIds([]);
  };

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

  const handleSendTest = (templateName: string, channel: Channel) => {
    // Demo only – integrate with backend /notifications later
    const count = selectedRecipientIds.length || 1;
    const targets =
      selectedRecipientIds.length > 0
        ? `${count} penerima terpilih (contoh: ${mockRecipients.find((r) => r.id === selectedRecipientIds[0])?.email ?? '...'} dan lain-lain)`
        : 'akaun admin (ujian sendiri)';

    alert(
      `Contoh penghantaran:\n\n` +
        `• Templat: ${templateName}\n` +
        `• Saluran: ${channel.toUpperCase()}\n` +
        `• Penerima: ${targets}\n\n` +
        `Ini hanya simulasi UI. Integrasi sebenar akan menggunakan API /notifications & gateway WhatsApp/Email/SMS.`
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Komunikasi & Pengingat
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                Urus pengingat haul, sijil zakat, dan kempen automatik (Ramadan, akhir tahun, promosi potongan cukai)
                melalui WhatsApp, emel dan SMS.
              </p>
            </div>
            <Badge variant="secondary" className="text-xs sm:text-sm">
              Modul Demo • Integrasi sebenar melalui API /notifications & gateway WhatsApp/SMS
            </Badge>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Kempen Aktif</CardDescription>
                <CardTitle className="text-2xl">2</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Haul & Ramadan sedang diaktifkan untuk semua muzakki yang layak.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Mesej Hari Ini</CardDescription>
                <CardTitle className="text-2xl">120</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Termasuk WhatsApp, emel dan SMS pengesahan pembayaran & pengingat lembut.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Kadar Kejayaan</CardDescription>
                <CardTitle className="text-2xl">98%</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Berdasarkan penghantaran berjaya & kadar buka emel / respon WhatsApp.
              </CardContent>
            </Card>
          </div>

          {/* Recipient selection */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Penerima Kempen</CardTitle>
              <CardDescription>
                Pilih muzakki / syarikat yang akan menerima pengingat. Boleh cari melalui nama, email atau No. MyKad / SSM.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Input
                    placeholder="Cari nama, email atau MyKad / SSM..."
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllVisible}
                  >
                    Pilih Semua Yang Dipaparkan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSelected}
                    disabled={selectedRecipientIds.length === 0}
                  >
                    Kosongkan Pilihan ({selectedRecipientIds.length})
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/30 max-h-56 overflow-y-auto text-sm">
                {filteredRecipients.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-xs">
                    Tiada penerima ditemui untuk carian ini.
                  </div>
                ) : (
                  <ul>
                    {filteredRecipients.map((r) => {
                      const checked = selectedRecipientIds.includes(r.id);
                      return (
                        <li
                          key={r.id}
                          className="flex items-center justify-between px-3 py-2 border-b last:border-b-0 hover:bg-background cursor-pointer"
                          onClick={() => toggleRecipient(r.id)}
                        >
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{r.name}</p>
                            <p className="text-[11px] sm:text-xs text-muted-foreground">
                              {r.email} • {r.nricOrSsm}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={r.type === 'company' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                              {r.type === 'company' ? 'Syarikat' : 'Individu'}
                            </Badge>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleRecipient(r.id)}
                              className="h-4 w-4 accent-primary"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {selectedRecipientIds.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedRecipientIds.length} penerima dipilih untuk kempen ini. Ini adalah contoh UI – integrasi sebenar akan
                  menggunakan senarai penerima dari pangkalan data.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tabs for campaigns */}
          <Tabs defaultValue="haul" className="space-y-6">
            <TabsList>
              <TabsTrigger value="haul">
                <CalendarClock className="h-4 w-4 mr-2" />
                Pengingat Haul
              </TabsTrigger>
              <TabsTrigger value="certificate">
                <Receipt className="h-4 w-4 mr-2" />
                Sijil Zakat
              </TabsTrigger>
              <TabsTrigger value="ramadan">
                <MoonStar className="h-4 w-4 mr-2" />
                Kempen Ramadan
              </TabsTrigger>
              <TabsTrigger value="yearend">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Akhir Tahun & Cukai
              </TabsTrigger>
            </TabsList>

            {/* Haul Reminder */}
            <TabsContent value="haul" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <span>Pengingat Haul Zakat</span>
                    </CardTitle>
                    <CardDescription>
                      Notifikasi automatik kepada muzakki apabila haul hampir cukup setahun berdasarkan rekod pembayaran & tarikh haul terakhir.
                    </CardDescription>
                  </div>
                  <Button
                    variant={isHaulCampaignActive ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => setIsHaulCampaignActive((v) => !v)}
                    className="inline-flex items-center gap-1"
                  >
                    {isHaulCampaignActive ? (
                      <>
                        <PauseCircle className="h-4 w-4" />
                        Hentikan Kempen
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4" />
                        Aktifkan Kempen
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Triggers */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Kriteria & Jadual</h3>
                    <div className="space-y-2 rounded-lg border bg-muted/50 p-4 text-sm">
                      <p className="font-medium mb-1">Sasaran:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Muzakki dengan rekod pembayaran zakat pendapatan / perniagaan.</li>
                        <li>Haul hampir lengkap 11 bulan (± 30 hari sebelum cukup haul).</li>
                        <li>Akaun aktif & emel / nombor telefon disahkan.</li>
                      </ul>
                      <p className="font-medium mt-3 mb-1">Jadual:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Jalankan setiap hari melalui Laravel Scheduler.</li>
                        <li>Had maksimum notifikasi: 1 kali per muzakki per tempoh haul.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Templates */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Templat Mesej</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setActiveChannel('whatsapp')}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
                            activeChannel === 'whatsapp' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground'
                          }`}
                        >
                          <MessageCircle className="h-3 w-3" />
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveChannel('email')}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
                            activeChannel === 'email' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground'
                          }`}
                        >
                          <Mail className="h-3 w-3" />
                          Emel
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveChannel('sms')}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${
                            activeChannel === 'sms' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground'
                          }`}
                        >
                          <Smartphone className="h-3 w-3" />
                          SMS
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Pratonton mesej ({activeChannel.toUpperCase()})
                      </label>
                      <Textarea
                        className="min-h-[140px] text-sm"
                        readOnly
                        value={
                          activeChannel === 'whatsapp'
                            ? `Assalamualaikum {NAMA},\n\nSukacita dimaklumkan bahawa haul zakat anda akan cukup setahun tidak lama lagi.\n\nRingkasan:\n• Jenis zakat: {JENIS_ZAKAT}\n• Anggaran zakat: RM {ANGGARAN}\n\nAnda boleh mengira semula dan menunaikan zakat melalui platform Lembaga Zakat Selangor:\nhttps://ezakat.lzs.gov.my\n\n“Dan dirikanlah sembahyang dan tunaikanlah zakat...” (Al-Baqarah: 110)`
                            : activeChannel === 'email'
                            ? `Subjek: Pengingat Haul Zakat Anda\n\nAssalamualaikum {NAMA},\n\nRekod kami menunjukkan bahawa haul zakat anda hampir mencukupi tempoh satu tahun.\n\nRingkasan maklumat:\n• Jenis zakat: {JENIS_ZAKAT}\n• Anggaran zakat: RM {ANGGARAN}\n• Tarikh cukup haul (anggaran): {TARIKH_HAUL}\n\nSebagai peringatan penuh kasih, kami menggalakkan tuan/puan untuk menyemak semula pengiraan dan menunaikan zakat melalui saluran rasmi Lembaga Zakat Selangor.\n\nKlik di sini untuk mengira zakat:\nhttps://ezakat.lzs.gov.my\n\nSekian, terima kasih.\nLembaga Zakat Selangor\n“Sentiasa Bersama, Sentiasa Menjaga”`
                            : `Assalamualaikum {NAMA}, haul zakat anda hampir cukup setahun. Sila semak & tunaikan zakat melalui Lembaga Zakat Selangor.`
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendTest('Pengingat Haul', activeChannel)}
                      >
                        Hantar Ujian ke Saya
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sijil Zakat */}
            <TabsContent value="certificate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    <span>Notifikasi Sijil Zakat</span>
                  </CardTitle>
                  <CardDescription>
                    Mesej automatik apabila sijil zakat / resit rasmi tersedia untuk dimuat turun bagi tujuan potongan cukai.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Pencetus</h3>
                    <div className="space-y-2 rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Pembayaran zakat berjaya & resit / sijil PDF dijana.</li>
                        <li>Satu notifikasi per transaksi berjaya.</li>
                        <li>Menyokong e-mel, WhatsApp dan SMS bergantung kepada pilihan pengguna.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Contoh Emel</h3>
                    <Textarea
                      className="min-h-[180px] text-sm"
                      readOnly
                      value={`Subjek: Sijil Zakat Anda Sedia Untuk Dimuat Turun\n\nAssalamualaikum {NAMA},\n\nTerima kasih kerana menunaikan zakat melalui Lembaga Zakat Selangor.\n\nButiran transaksi:\n• Jenis zakat: {JENIS_ZAKAT}\n• Jumlah: RM {JUMLAH}\n• No. rujukan: {NO_RUJUKAN}\n• Tarikh bayaran: {TARIKH_BAYARAN}\n\nSijil / resit zakat anda kini sedia untuk dimuat turun bagi tujuan rekod dan potongan cukai pendapatan.\n\nMuat turun di sini:\n{PAUTAN_SIJIL}\n\nSekian, terima kasih.\nLembaga Zakat Selangor\n“Bila Peluang Diberi, Potensi Terbukti.”`}
                    />
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendTest('Sijil Zakat', 'email')}
                      >
                        Hantar Emel Ujian
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ramadan Campaign */}
            <TabsContent value="ramadan" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <MoonStar className="h-5 w-5 text-primary" />
                      <span>Kempen Ramadan</span>
                    </CardTitle>
                    <CardDescription>
                      Kempen automatik sepanjang Ramadan untuk menggalakkan pembayaran zakat pendapatan & perniagaan.
                    </CardDescription>
                  </div>
                  <Button
                    variant={isRamadanCampaignActive ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => setIsRamadanCampaignActive((v) => !v)}
                    className="inline-flex items-center gap-1"
                  >
                    {isRamadanCampaignActive ? (
                      <>
                        <PauseCircle className="h-4 w-4" />
                        Hentikan Kempen
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4" />
                        Aktifkan Kempen Ramadan
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">Profil Sasaran:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Muzakki aktif 2 tahun terkini.</li>
                        <li>Mereka yang belum menunaikan zakat untuk tahun semasa.</li>
                        <li>Segmentasi tambahan: individu vs syarikat, lokasi cawangan, dsb.</li>
                      </ul>
                      <p className="font-semibold text-foreground mt-3">Jadual:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Minggu 1–2 Ramadan: mesej pengenalan kempen & pengingat lembut.</li>
                        <li>Minggu 3–4 Ramadan: mesej follow-up & penegasan kelebihan zakat.</li>
                        <li>Had maksimum: 1–2 mesej per minggu per penerima.</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <p className="font-semibold text-sm">Contoh Mesej WhatsApp (Ramadan)</p>
                      <Textarea
                        className="min-h-[160px] text-sm"
                        readOnly
                        value={`Assalamualaikum {NAMA},\n\nRamadan Kareem daripada Lembaga Zakat Selangor.\n\nDi bulan yang penuh keberkatan ini, marilah kita menyempurnakan ibadah zakat bagi membersihkan harta & menyantuni asnaf yang memerlukan.\n\nRingkasan:\n• Jenis zakat: Zakat Pendapatan / Perniagaan\n• Anggaran zakat: RM {ANGGARAN}\n\nTunaikan zakat anda melalui saluran rasmi LZS:\nhttps://ezakat.lzs.gov.my\n\n“Ilmu Dibina, Masa Depan Terjana. Rezeki Dikongsi, Rahmat Dikecapi.”`}
                      />
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendTest('Kempen Ramadan', 'whatsapp')}
                        >
                          Hantar Ujian WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Year-end Tax Campaign */}
            <TabsContent value="yearend" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <span>Kempen Akhir Tahun & Potongan Cukai</span>
                  </CardTitle>
                  <CardDescription>
                    Kempen bulan November–Disember menekankan tarikh akhir potongan cukai pendapatan dan kelebihan berzakat sebelum hujung tahun kewangan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Objektif:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Meningkatkan kutipan akhir tahun.</li>
                      <li>Mengingatkan muzakki tentang manfaat potongan cukai.</li>
                      <li>Menyasarkan individu & syarikat yang belum membuat bayaran untuk tahun semasa.</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="font-semibold text-sm">Contoh Emel Akhir Tahun</p>
                    <Textarea
                      className="min-h-[160px] text-sm"
                      readOnly
                      value={`Subjek: Penghujung Tahun – Lengkapkan Zakat & Potongan Cukai Anda\n\nAssalamualaikum {NAMA},\n\nTahun kewangan akan berakhir tidak lama lagi. Sekiranya tuan/puan belum menunaikan zakat bagi tahun ini, masih ada masa untuk berbuat demikian dan menikmati manfaat potongan cukai pendapatan.\n\nRingkasan:\n• Anggaran zakat: RM {ANGGARAN}\n• Tarikh akhir potongan cukai: {TARIKH_AKHIR}\n\nTunaikan zakat anda dengan mudah melalui platform Lembaga Zakat Selangor:\nhttps://ezakat.lzs.gov.my\n\nSemoga Allah menerima amal ibadah kita semua.\n\nLembaga Zakat Selangor\n“Sentiasa Bersama, Sentiasa Menjaga”`}
                    />
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendTest('Kempen Akhir Tahun', 'email')}
                      >
                        Hantar Emel Ujian
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}


