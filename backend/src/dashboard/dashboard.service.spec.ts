import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    framingShop: { findUnique: jest.fn() },
    workBench: { count: jest.fn(), groupBy: jest.fn() },
    framingOrder: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    equipmentMaintenance: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    qualityChecklist: { count: jest.fn() },
    pricingTier: { count: jest.fn() },
    mouldingOrder: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return tailoring shop dashboard stats', async () => {
    mockPrisma.framingShop.findUnique.mockResolvedValue({ totalWorkBenches: 8 });
    mockPrisma.workBench.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);
    mockPrisma.framingOrder.count.mockResolvedValue(42);
    mockPrisma.equipmentMaintenance.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    mockPrisma.framingOrder.aggregate.mockResolvedValue({
      _sum: { cashAmount: 120, cardAmount: 280, rushFee: 95 },
    });
    mockPrisma.framingOrder.findMany.mockResolvedValue([]);
    mockPrisma.equipmentMaintenance.findMany.mockResolvedValue([]);
    mockPrisma.qualityChecklist.count.mockResolvedValue(2);
    mockPrisma.pricingTier.count.mockResolvedValue(3);
    mockPrisma.mouldingOrder.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    mockPrisma.workBench.groupBy.mockResolvedValue([
      { zone: 'East Zone', _count: { id: 3 } },
      { zone: 'West Zone', _count: { id: 3 } },
    ]);

    const stats = await service.getStats('shop-1');

    expect(stats).toHaveProperty('workBenchUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyRushFees', 95);
    expect(stats).toHaveProperty('shopZones');
    expect(stats).toHaveProperty('urgentEquipmentMaintenance');
    expect(stats).toHaveProperty('pendingQualityChecklist');
    expect(stats).toHaveProperty('activePricingTiers', 3);
    expect(stats).toHaveProperty('pendingMouldingOrders', 3);
    expect(stats).toHaveProperty('completedMouldingOrders', 2);
    expect(stats).toHaveProperty('availableWorkBenches', 4);
    expect(stats).toHaveProperty('totalWorkBenches', 8);
  });
});
