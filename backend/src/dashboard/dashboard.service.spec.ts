import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    tailoringShop: { findUnique: jest.fn() },
    workstation: { count: jest.fn(), groupBy: jest.fn() },
    alterationJob: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    equipmentMaintenance: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    qualityChecklist: { count: jest.fn() },
    serviceRate: { count: jest.fn() },
    fabricOrder: { count: jest.fn() },
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
    mockPrisma.tailoringShop.findUnique.mockResolvedValue({ totalWorkstations: 8 });
    mockPrisma.workstation.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);
    mockPrisma.alterationJob.count.mockResolvedValue(42);
    mockPrisma.equipmentMaintenance.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    mockPrisma.alterationJob.aggregate.mockResolvedValue({
      _sum: { cashAmount: 120, cardAmount: 280, rushFee: 95 },
    });
    mockPrisma.alterationJob.findMany.mockResolvedValue([]);
    mockPrisma.equipmentMaintenance.findMany.mockResolvedValue([]);
    mockPrisma.qualityChecklist.count.mockResolvedValue(2);
    mockPrisma.serviceRate.count.mockResolvedValue(3);
    mockPrisma.fabricOrder.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    mockPrisma.workstation.groupBy.mockResolvedValue([
      { zone: 'East Zone', _count: { id: 3 } },
      { zone: 'West Zone', _count: { id: 3 } },
    ]);

    const stats = await service.getStats('shop-1');

    expect(stats).toHaveProperty('workstationUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyRushFees', 95);
    expect(stats).toHaveProperty('shopZones');
    expect(stats).toHaveProperty('urgentEquipmentMaintenance');
    expect(stats).toHaveProperty('pendingQualityChecklist');
    expect(stats).toHaveProperty('activeServiceRates', 3);
    expect(stats).toHaveProperty('pendingFabricOrders', 3);
    expect(stats).toHaveProperty('completedFabricOrders', 2);
    expect(stats).toHaveProperty('availableWorkstations', 4);
    expect(stats).toHaveProperty('totalWorkstations', 8);
  });
});
