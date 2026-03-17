'use client';

/**
 * Profile Management Page
 * User can view and update their profile information
 */

import { useState } from 'react';
import Link from 'next/link';
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
import { User, Mail, Phone, Building2, Save, CheckCircle2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Nama mesti sekurang-kurangnya 2 aksara'),
  phone: z.string().regex(/^60[0-9]{9,10}$/, 'Nombor telefon tidak sah').optional().or(z.literal('')),
  email: z.string().email('Email tidak sah'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        email: user.email,
        phone: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    setIsSaved(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
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
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Profil Saya</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Urus maklumat profil dan akaun anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Maklumat Profil</span>
                  </CardTitle>
                  <CardDescription>
                    Kemas kini maklumat peribadi anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nama Penuh</Label>
                      <Input
                        id="full_name"
                        {...register('full_name')}
                        disabled={isLoading}
                      />
                      {errors.full_name && (
                        <p className="text-sm text-destructive">{errors.full_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nombor Telefon</Label>
                      <Input
                        id="phone"
                        placeholder="60123456789"
                        {...register('phone')}
                        disabled={isLoading}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    <Separator />

                    <Button type="submit" className="w-full" disabled={isLoading}>
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
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Profile Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maklumat Akaun</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jenis Akaun</span>
                    <Badge variant={user.role === 'payer_company' ? 'default' : 'secondary'}>
                      {user.role === 'payer_company' ? (
                        <>
                          <Building2 className="h-3 w-3 mr-1" />
                          Syarikat
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />
                          Individu
                        </>
                      )}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                      {user.is_verified ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Disahkan
                        </>
                      ) : (
                        'Menunggu Pengesahan'
                      )}
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Email</p>
                    <p className="text-sm font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tindakan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/profile/security">
                    <Button variant="outline" className="w-full" size="sm">
                      Keselamatan & 2FA
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" size="sm">
                    Muat Turun Data Saya
                  </Button>
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

