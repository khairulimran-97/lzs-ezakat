'use client';

/**
 * Security Settings Page
 * 2FA setup and password management
 */

import { useState } from 'react';
import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Shield, Key, Smartphone, CheckCircle2, Loader2, ArrowLeft, QrCode } from 'lucide-react';
import Link from 'next/link';

const passwordChangeSchema = z.object({
  current_password: z.string().min(1, 'Kata laluan semasa diperlukan'),
  new_password: z.string().min(8, 'Kata laluan baru mesti sekurang-kurangnya 8 aksara'),
  new_password_confirmation: z.string(),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: 'Kata laluan tidak sepadan',
  path: ['new_password_confirmation'],
});

const twoFactorSchema = z.object({
  code: z.string().length(6, 'Kod mesti 6 digit'),
});

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;
type TwoFactorForm = z.infer<typeof twoFactorSchema>;

export default function SecurityPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const passwordForm = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const twoFactorForm = useForm<TwoFactorForm>({
    resolver: zodResolver(twoFactorSchema),
  });

  const onSubmitPassword = async (data: PasswordChangeForm) => {
    setIsLoading(true);
    setIsSaved(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSaved(true);
      passwordForm.reset();
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to generate QR code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='); // Placeholder
      setShow2FASetup(true);
    } catch (error) {
      console.error('Error enabling 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit2FA = async (data: TwoFactorForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(true);
      setShow2FASetup(false);
    } catch (error) {
      console.error('Error verifying 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <Link href="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Profil
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Keselamatan Akaun</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Urus keselamatan dan pengesahan akaun anda
            </p>
          </div>

          <div className="space-y-6">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Tukar Kata Laluan</span>
                </CardTitle>
                <CardDescription>
                  Kemas kini kata laluan anda untuk keselamatan yang lebih baik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Kata Laluan Semasa</Label>
                    <Input
                      id="current_password"
                      type="password"
                      {...passwordForm.register('current_password')}
                      disabled={isLoading}
                    />
                    {passwordForm.formState.errors.current_password && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">Kata Laluan Baru</Label>
                    <Input
                      id="new_password"
                      type="password"
                      {...passwordForm.register('new_password')}
                      disabled={isLoading}
                    />
                    {passwordForm.formState.errors.new_password && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.new_password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password_confirmation">Sahkan Kata Laluan Baru</Label>
                    <Input
                      id="new_password_confirmation"
                      type="password"
                      {...passwordForm.register('new_password_confirmation')}
                      disabled={isLoading}
                    />
                    {passwordForm.formState.errors.new_password_confirmation && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.new_password_confirmation.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : isSaved ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Disimpan!
                      </>
                    ) : (
                      'Simpan Perubahan'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Pengesahan Dua Faktor (2FA)</span>
                </CardTitle>
                <CardDescription>
                  Tambah lapisan keselamatan tambahan dengan 2FA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Status 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled
                        ? 'Pengesahan dua faktor telah diaktifkan'
                        : 'Pengesahan dua faktor belum diaktifkan'}
                    </p>
                  </div>
                  <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
                    {twoFactorEnabled ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Aktif
                      </>
                    ) : (
                      'Tidak Aktif'
                    )}
                  </Badge>
                </div>

                {!twoFactorEnabled && !show2FASetup && (
                  <Button onClick={handleEnable2FA} disabled={isLoading} className="w-full">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Aktifkan 2FA
                  </Button>
                )}

                {show2FASetup && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div className="text-center">
                      <p className="font-medium mb-2">Imbas QR Code dengan Google Authenticator</p>
                      <div className="flex justify-center mb-4">
                        {qrCode ? (
                          <div className="p-4 bg-white rounded-lg border">
                            <QrCode className="h-32 w-32 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground mt-2">QR Code akan dipaparkan di sini</p>
                          </div>
                        ) : (
                          <div className="p-4 bg-muted rounded-lg">
                            <QrCode className="h-32 w-32 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Selepas mengimbas, masukkan kod 6 digit dari aplikasi
                      </p>
                    </div>

                    <form onSubmit={twoFactorForm.handleSubmit(onSubmit2FA)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Kod Pengesahan</Label>
                        <Input
                          id="code"
                          placeholder="123456"
                          maxLength={6}
                          {...twoFactorForm.register('code')}
                          disabled={isLoading}
                        />
                        {twoFactorForm.formState.errors.code && (
                          <p className="text-sm text-destructive">
                            {twoFactorForm.formState.errors.code.message}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShow2FASetup(false)}
                          className="flex-1"
                        >
                          Batal
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mengesahkan...
                            </>
                          ) : (
                            'Sahkan & Aktifkan'
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {twoFactorEnabled && (
                  <Button
                    variant="destructive"
                    onClick={() => setTwoFactorEnabled(false)}
                    className="w-full"
                  >
                    Matikan 2FA
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

