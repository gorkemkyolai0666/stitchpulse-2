import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingTierDto, UpdatePricingTierDto } from './dto/pricing-tier.dto';

@Injectable()
export class PricingTiersService {
  constructor(private prisma: PrismaService) {}

  async list(framingShopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { framingShopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.pricingTier.findMany({
        where,
        orderBy: { pricingCategory: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pricingTier.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(framingShopId: string, id: string) {
    const tier = await this.prisma.pricingTier.findFirst({
      where: { id, framingShopId },
    });
    if (!tier) throw new NotFoundException('Tarife bulunamadı');
    return tier;
  }

  async create(framingShopId: string, dto: CreatePricingTierDto) {
    return this.prisma.pricingTier.create({ data: { ...dto, framingShopId } });
  }

  async update(framingShopId: string, id: string, dto: UpdatePricingTierDto) {
    await this.get(framingShopId, id);
    return this.prisma.pricingTier.update({ where: { id }, data: dto });
  }

  async remove(framingShopId: string, id: string) {
    await this.get(framingShopId, id);
    return this.prisma.pricingTier.delete({ where: { id } });
  }
}
