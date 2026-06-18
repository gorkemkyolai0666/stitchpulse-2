'use client';

import { useEffect, useState } from 'react';
import { CircleDot, DollarSign, Puzzle, ClipboardCheck, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { StatCard } from '@/components/stat-card';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
  formatOrderStatus,
  formatEquipmentMaintenanceStatus,
  formatEquipmentMaintenancePriority,
  formatWorkBenchSpecialty,
  formatOrderType,
} from '@/lib/utils';

interface DashboardStats {
  totalWorkBenches: number;
  availableWorkBenches: number;
  inUseWorkBenches: number;
  workBenchUtilizationRate: number;
  openEquipmentMaintenance: number;
  urgentEquipmentMaintenance: number;
  pendingQualityChecklist: number;
  dailyRevenue: number;
  recentOrders: Array<{
    id: string;
    cashAmount: number;
    cardAmount: number;
    rushFee: number;
    dueAt: string;
    orderType?: string;
    status: string;
    workBench?: { name: string; zone: string; specialty: string };
  }>;
  recentEquipmentMaintenance: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    reportedAt: string;
    workBench?: { name: string; zone: string };
  }>;
  shopZones: Array<{ zone: string; workBenchCount: number }>;
  monthlyTrend: Array<{ month: string; games: number; revenue: number }>;
}

function formatTrendMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(date);
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.dashboard
      .stats(token)
      .then((data) => setStats(data as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-primary">Operasyon Paneli</h1>
          <p className="text-muted-foreground">Tezgah kullanımı ve günlük gelir özeti</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Tezgah Kullanımı"
                value={formatPercent(stats.workBenchUtilizationRate)}
                description={`${stats.availableWorkBenches}/${stats.totalWorkBenches} tezgah müsait`}
                icon={<CircleDot className="h-4 w-4" />}
              />
              <StatCard
                title="Günlük Gelir"
                value={formatCurrency(stats.dailyRevenue)}
                description={`${stats.inUseWorkBenches} tezgah aktif`}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <StatCard
                title="Ekipman Bakımı"
                value={stats.openEquipmentMaintenance}
                description={`${stats.urgentEquipmentMaintenance} acil/yüksek öncelik`}
                icon={<Puzzle className="h-4 w-4" />}
              />
              <StatCard
                title="Kalite Kontrol Planı"
                value={stats.pendingQualityChecklist}
                description="7 gün içinde planlanan"
                icon={<ClipboardCheck className="h-4 w-4" />}
              />
            </div>

            <Card className="gallery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <Users className="h-4 w-4 text-accent" />
                  Son Tadilat İşleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz oturum kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentOrders.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{session.workBench?.name || '—'}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.workBench?.zone} · {formatWorkBenchSpecialty(session.workBench?.specialty || '')} · {formatOrderType(session.orderType || '')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold">
                            {formatCurrency(
                              session.cashAmount + session.cardAmount + session.rushFee,
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(session.dueAt)}</p>
                        </div>
                        <Badge variant="secondary">{formatOrderStatus(session.status)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="gallery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Açık Ekipman Bakım Kayıtları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentEquipmentMaintenance.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Açık bakım kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentEquipmentMaintenance.map((item) => (
                      <div key={item.id} className="bg-muted/40 px-4 py-3">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.workBench?.name || 'İstasyon belirtilmemiş'} · {item.workBench?.zone} · {formatEquipmentMaintenancePriority(item.priority)} ·{' '}
                          {formatEquipmentMaintenanceStatus(item.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="gallery-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Aylık Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.monthlyTrend.map((row) => (
                    <div key={row.month} className="flex justify-between text-sm">
                      <span>{formatTrendMonth(row.month)}</span>
                      <span className="font-mono font-semibold">{formatCurrency(row.revenue)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gallery-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <CircleDot className="h-4 w-4 text-accent" />
                    Kanat Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.shopZones.map((w) => (
                    <div key={w.zone} className="flex justify-between text-sm">
                      <span>{w.zone}</span>
                      <Badge variant="secondary">{w.workBenchCount} oda</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
