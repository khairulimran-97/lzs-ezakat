'use client';

/**
 * Admin User Management Page
 * Manage users, amil, and companies with search, filter, and CRUD operations
 */

import { useAuthStore, useHasHydrated } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Edit, 
  Trash2, 
  Building2, 
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

type UserRole = 'payer' | 'amil' | 'admin' | 'super_admin';
type UserType = 'individual' | 'company';

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  nricOrSsm: string;
  type: UserType;
  role: UserRole;
  address: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

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

  // Mock data untuk demo
  const mockUsers: MockUser[] = [
    {
      id: '1',
      name: 'Ahmad bin Abdullah',
      email: 'ahmad@example.com',
      phone: '+60123456789',
      nricOrSsm: '850101-10-1234',
      type: 'individual',
      role: 'payer',
      address: 'No. 123, Jalan Ampang, 50450 Kuala Lumpur',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-12-20'
    },
    {
      id: '2',
      name: 'Syarikat ABC Sdn Bhd',
      email: 'info@abc.com.my',
      phone: '+603-12345678',
      nricOrSsm: '123456-X',
      type: 'company',
      role: 'payer',
      address: 'Lot 456, Jalan Perusahaan, 40000 Shah Alam, Selangor',
      status: 'active',
      createdAt: '2024-02-20',
      lastLogin: '2024-12-19'
    },
    {
      id: '3',
      name: 'Ustaz Muhammad bin Hassan',
      email: 'muhammad@lzs.gov.my',
      phone: '+60198765432',
      nricOrSsm: '780505-05-5678',
      type: 'individual',
      role: 'amil',
      address: 'Cawangan Shah Alam, Lembaga Zakat Selangor',
      status: 'active',
      createdAt: '2023-06-10',
      lastLogin: '2024-12-20'
    },
    {
      id: '4',
      name: 'Siti Nurhaliza binti Ahmad',
      email: 'siti@example.com',
      phone: '+60123456790',
      nricOrSsm: '920303-03-9012',
      type: 'individual',
      role: 'payer',
      address: 'No. 789, Taman Seri Muda, 43300 Seri Kembangan, Selangor',
      status: 'inactive',
      createdAt: '2024-03-05',
      lastLogin: '2024-11-15'
    },
    {
      id: '5',
      name: 'XYZ Trading Sdn Bhd',
      email: 'admin@xyz.com.my',
      phone: '+603-87654321',
      nricOrSsm: '987654-Y',
      type: 'company',
      role: 'payer',
      address: 'Suite 10-5, Menara XYZ, Jalan Tun Razak, 50400 Kuala Lumpur',
      status: 'active',
      createdAt: '2024-04-12',
      lastLogin: '2024-12-18'
    }
  ];

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nricOrSsm.includes(searchQuery) ||
      u.phone.includes(searchQuery);
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesType = typeFilter === 'all' || u.type === typeFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesType;
  });

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return 'destructive';
      case 'amil':
        return 'default';
      case 'payer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'payer':
        return 'Pembayar';
      case 'amil':
        return 'Amil';
      case 'admin':
        return 'Admin';
      case 'super_admin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Tidak Aktif';
      case 'suspended':
        return 'Digantung';
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                Pengurusan Pengguna
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                Urus pengguna, amil, dan syarikat. Cari, edit, dan pantau status akaun.
              </p>
            </div>
            <Button className="inline-flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Tambah Pengguna Baru
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Jumlah Pengguna</CardDescription>
                <CardTitle className="text-2xl">{mockUsers.length}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" />
                Semua pengguna
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pembayar</CardDescription>
                <CardTitle className="text-2xl">
                  {mockUsers.filter(u => u.role === 'payer').length}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <UserCheck className="h-4 w-4 inline mr-1" />
                Individu & syarikat
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Amil</CardDescription>
                <CardTitle className="text-2xl">
                  {mockUsers.filter(u => u.role === 'amil').length}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 inline mr-1" />
                Amil aktif
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Akaun Aktif</CardDescription>
                <CardTitle className="text-2xl">
                  {mockUsers.filter(u => u.status === 'active').length}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <UserCheck className="h-4 w-4 inline mr-1" />
                Status aktif
              </CardContent>
            </Card>
          </div>

          {/* Filters & Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Cari & Tapis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari nama, email, MyKad / SSM, atau telefon..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Peranan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Peranan</SelectItem>
                    <SelectItem value="payer">Pembayar</SelectItem>
                    <SelectItem value="amil">Amil</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    <SelectItem value="suspended">Digantung</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="individual">Individu</SelectItem>
                    <SelectItem value="company">Syarikat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                Menunjukkan {filteredUsers.length} daripada {mockUsers.length} pengguna
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Senarai Pengguna</CardTitle>
              <CardDescription>
                Klik pada pengguna untuk melihat butiran lengkap atau edit maklumat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Tiada pengguna ditemui berdasarkan carian dan penapis anda.</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-lg">{user.name}</h3>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {getRoleLabel(user.role)}
                              </Badge>
                              <Badge variant={getStatusBadgeVariant(user.status)}>
                                {getStatusLabel(user.status)}
                              </Badge>
                              {user.type === 'company' && (
                                <Badge variant="outline">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  Syarikat
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                <span>{user.type === 'company' ? 'SSM' : 'MyKad'}: {user.nricOrSsm}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{user.address}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Daftar: {new Date(user.createdAt).toLocaleDateString('ms-MY')}</span>
                              </div>
                              {user.lastLogin && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Log masuk terakhir: {new Date(user.lastLogin).toLocaleDateString('ms-MY')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Padam
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

