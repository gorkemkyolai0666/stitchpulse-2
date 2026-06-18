import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(framingShopId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      framingShop,
      totalWorkBenches,
      availableWorkBenches,
      inUseWorkBenches,
      totalOrders,
      openEquipmentMaintenance,
      urgentEquipmentMaintenance,
      pendingQualityChecklist,
      activePricingTiers,
      pendingMouldingOrders,
      completedMouldingOrders,
      revenueTotals,
      recentOrders,
      recentEquipmentMaintenance,
      shopZones,
    ] = await Promise.all([
      this.prisma.framingShop.findUnique({ where: { id: framingShopId } }),
      this.prisma.workBench.count({ where: { framingShopId } }),
      this.prisma.workBench.count({ where: { framingShopId, status: 'available' } }),
      this.prisma.workBench.count({ where: { framingShopId, status: 'in_use' } }),
      this.prisma.framingOrder.count({ where: { framingShopId } }),
      this.prisma.equipmentMaintenance.count({
        where: { framingShopId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.equipmentMaintenance.count({
        where: {
          framingShopId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.qualityChecklist.count({
        where: {
          framingShopId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.pricingTier.count({
        where: { framingShopId, status: 'active' },
      }),
      this.prisma.mouldingOrder.count({
        where: { framingShopId, status: { in: ['pending', 'in_progress'] } },
      }),
      this.prisma.mouldingOrder.count({
        where: { framingShopId, status: { in: ['completed', 'delivered'] } },
      }),
      this.prisma.framingOrder.aggregate({
        where: { framingShopId, dueAt: { gte: today } },
        _sum: { cashAmount: true, cardAmount: true, rushFee: true },
      }),
      this.prisma.framingOrder.findMany({
        where: { framingShopId },
        include: {
          workBench: { select: { name: true, zone: true, specialty: true } },
        },
        orderBy: { dueAt: 'desc' },
        take: 5,
      }),
      this.prisma.equipmentMaintenance.findMany({
        where: { framingShopId, status: { in: ['open', 'in_progress'] } },
        include: {
          workBench: { select: { name: true, zone: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.workBench.groupBy({
        by: ['zone'],
        where: { framingShopId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = framingShop?.totalWorkBenches || totalWorkBenches || 1;
    const workBenchUtilizationRate =
      totalWorkBenches > 0 ? Math.round((inUseWorkBenches / totalWorkBenches) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashAmount || 0) +
      (revenueTotals._sum.cardAmount || 0) +
      (revenueTotals._sum.rushFee || 0);

    const dailyRushFees = revenueTotals._sum.rushFee || 0;

    const monthlyTrend = await this.getMonthlyTrend(framingShopId, sixMonthsAgo);

    return {
      totalWorkBenches,
      availableWorkBenches,
      inUseWorkBenches,
      totalCapacity,
      workBenchUtilizationRate,
      totalOrders,
      openEquipmentMaintenance,
      urgentEquipmentMaintenance,
      pendingQualityChecklist,
      activePricingTiers,
      pendingMouldingOrders,
      completedMouldingOrders,
      dailyRevenue,
      dailyRushFees,
      recentOrders,
      recentEquipmentMaintenance,
      shopZones: shopZones.map((w) => ({
        zone: w.zone,
        workBenchCount: w._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(framingShopId: string, since: Date) {
    const sessions = await this.prisma.framingOrder.findMany({
      where: { framingShopId, dueAt: { gte: since } },
      select: {
        dueAt: true,
        cashAmount: true,
        cardAmount: true,
        rushFee: true,
        itemCount: true,
      },
    });

    const months: Record<string, { games: number; revenue: number; itemCount: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { games: 0, revenue: 0, itemCount: 0 };
    }

    sessions.forEach((session) => {
      const key = `${session.dueAt.getFullYear()}-${String(session.dueAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].games++;
        months[key].revenue +=
          session.cashAmount + session.cardAmount + session.rushFee;
        months[key].itemCount += session.itemCount;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
