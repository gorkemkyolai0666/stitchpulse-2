import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRateDto, UpdateServiceRateDto } from './dto/rate-tier.dto';

@Injectable()
export class ServiceRatesService {
  constructor(private prisma: PrismaService) {}

  async list(tailoringShopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tailoringShopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.serviceRate.findMany({
        where,
        orderBy: { rateCategory: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.serviceRate.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(tailoringShopId: string, id: string) {
    const tier = await this.prisma.serviceRate.findFirst({
      where: { id, tailoringShopId },
    });
    if (!tier) throw new NotFoundException('Tarife bulunamadı');
    return tier;
  }

  async create(tailoringShopId: string, dto: CreateServiceRateDto) {
    return this.prisma.serviceRate.create({ data: { ...dto, tailoringShopId } });
  }

  async update(tailoringShopId: string, id: string, dto: UpdateServiceRateDto) {
    await this.get(tailoringShopId, id);
    return this.prisma.serviceRate.update({ where: { id }, data: dto });
  }

  async remove(tailoringShopId: string, id: string) {
    await this.get(tailoringShopId, id);
    return this.prisma.serviceRate.delete({ where: { id } });
  }
}
