import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMouldingOrderDto, UpdateMouldingOrderDto } from './dto/moulding-order.dto';

@Injectable()
export class MouldingOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(
    framingShopId: string,
    params: { page?: number; status?: string; mouldingProfile?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { framingShopId };
    if (params.status) where.status = params.status;
    if (params.mouldingProfile) where.mouldingProfile = params.mouldingProfile;

    const [data, total] = await Promise.all([
      this.prisma.mouldingOrder.findMany({
        where,
        orderBy: [{ status: 'asc' }, { customerName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.mouldingOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async pending(framingShopId: string) {
    return this.prisma.mouldingOrder.findMany({
      where: { framingShopId, status: { in: ['pending', 'in_progress'] } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  async get(framingShopId: string, id: string) {
    const order = await this.prisma.mouldingOrder.findFirst({
      where: { id, framingShopId },
    });
    if (!order) throw new NotFoundException('Tel gerdirme siparişi bulunamadı');
    return order;
  }

  async create(framingShopId: string, dto: CreateMouldingOrderDto) {
    return this.prisma.mouldingOrder.create({ data: { ...dto, framingShopId } });
  }

  async update(framingShopId: string, id: string, dto: UpdateMouldingOrderDto) {
    await this.get(framingShopId, id);
    return this.prisma.mouldingOrder.update({ where: { id }, data: dto });
  }

  async remove(framingShopId: string, id: string) {
    await this.get(framingShopId, id);
    return this.prisma.mouldingOrder.delete({ where: { id } });
  }
}
