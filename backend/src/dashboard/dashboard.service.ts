import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(tailoringShopId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      tailoringShop,
      totalWorkstations,
      availableWorkstations,
      inUseWorkstations,
      totalJobs,
      openEquipmentMaintenance,
      urgentEquipmentMaintenance,
      pendingQualityChecklist,
      activeServiceRates,
      pendingFabricOrders,
      completedFabricOrders,
      revenueTotals,
      recentJobs,
      recentEquipmentMaintenance,
      shopZones,
    ] = await Promise.all([
      this.prisma.tailoringShop.findUnique({ where: { id: tailoringShopId } }),
      this.prisma.workstation.count({ where: { tailoringShopId } }),
      this.prisma.workstation.count({ where: { tailoringShopId, status: 'available' } }),
      this.prisma.workstation.count({ where: { tailoringShopId, status: 'in_use' } }),
      this.prisma.alterationJob.count({ where: { tailoringShopId } }),
      this.prisma.equipmentMaintenance.count({
        where: { tailoringShopId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.equipmentMaintenance.count({
        where: {
          tailoringShopId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.qualityChecklist.count({
        where: {
          tailoringShopId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.serviceRate.count({
        where: { tailoringShopId, status: 'active' },
      }),
      this.prisma.fabricOrder.count({
        where: { tailoringShopId, status: { in: ['pending', 'in_progress'] } },
      }),
      this.prisma.fabricOrder.count({
        where: { tailoringShopId, status: { in: ['completed', 'delivered'] } },
      }),
      this.prisma.alterationJob.aggregate({
        where: { tailoringShopId, dueAt: { gte: today } },
        _sum: { cashAmount: true, cardAmount: true, rushFee: true },
      }),
      this.prisma.alterationJob.findMany({
        where: { tailoringShopId },
        include: {
          workstation: { select: { name: true, zone: true, specialty: true } },
        },
        orderBy: { dueAt: 'desc' },
        take: 5,
      }),
      this.prisma.equipmentMaintenance.findMany({
        where: { tailoringShopId, status: { in: ['open', 'in_progress'] } },
        include: {
          workstation: { select: { name: true, zone: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.workstation.groupBy({
        by: ['zone'],
        where: { tailoringShopId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = tailoringShop?.totalWorkstations || totalWorkstations || 1;
    const workstationUtilizationRate =
      totalWorkstations > 0 ? Math.round((inUseWorkstations / totalWorkstations) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashAmount || 0) +
      (revenueTotals._sum.cardAmount || 0) +
      (revenueTotals._sum.rushFee || 0);

    const dailyRushFees = revenueTotals._sum.rushFee || 0;

    const monthlyTrend = await this.getMonthlyTrend(tailoringShopId, sixMonthsAgo);

    return {
      totalWorkstations,
      availableWorkstations,
      inUseWorkstations,
      totalCapacity,
      workstationUtilizationRate,
      totalJobs,
      openEquipmentMaintenance,
      urgentEquipmentMaintenance,
      pendingQualityChecklist,
      activeServiceRates,
      pendingFabricOrders,
      completedFabricOrders,
      dailyRevenue,
      dailyRushFees,
      recentJobs,
      recentEquipmentMaintenance,
      shopZones: shopZones.map((w) => ({
        zone: w.zone,
        workstationCount: w._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(tailoringShopId: string, since: Date) {
    const sessions = await this.prisma.alterationJob.findMany({
      where: { tailoringShopId, dueAt: { gte: since } },
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
