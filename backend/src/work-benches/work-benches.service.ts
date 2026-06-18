import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkBenchDto, UpdateWorkBenchDto } from './dto/work-bench.dto';

@Injectable()
export class WorkBenchesService {
  constructor(private prisma: PrismaService) {}

  async list(framingShopId: string, params: { page?: number; status?: string; zone?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { framingShopId };
    if (params.status) where.status = params.status;
    if (params.zone) where.zone = params.zone;

    const [data, total] = await Promise.all([
      this.prisma.workBench.findMany({
        where,
        orderBy: [{ zone: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          equipmentMaintenance: {
            where: { status: { in: ['open', 'in_progress'] } },
            take: 1,
            orderBy: { reportedAt: 'desc' },
          },
        },
      }),
      this.prisma.workBench.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(framingShopId: string, id: string) {
    const court = await this.prisma.workBench.findFirst({
      where: { id, framingShopId },
      include: {
        equipmentMaintenance: { orderBy: { reportedAt: 'desc' }, take: 5 },
        framingOrders: { orderBy: { dueAt: 'desc' }, take: 5 },
      },
    });
    if (!court) throw new NotFoundException('İstasyon bulunamadı');
    return court;
  }

  async create(framingShopId: string, dto: CreateWorkBenchDto) {
    return this.prisma.workBench.create({ data: { ...dto, framingShopId } });
  }

  async update(framingShopId: string, id: string, dto: UpdateWorkBenchDto) {
    await this.get(framingShopId, id);
    return this.prisma.workBench.update({ where: { id }, data: dto });
  }

  async remove(framingShopId: string, id: string) {
    await this.get(framingShopId, id);
    return this.prisma.workBench.delete({ where: { id } });
  }
}
