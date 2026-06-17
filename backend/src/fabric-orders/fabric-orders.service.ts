import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFabricOrderDto, UpdateFabricOrderDto } from './dto/fabric-order.dto';

@Injectable()
export class FabricOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(
    tailoringShopId: string,
    params: { page?: number; status?: string; fabricType?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tailoringShopId };
    if (params.status) where.status = params.status;
    if (params.fabricType) where.fabricType = params.fabricType;

    const [data, total] = await Promise.all([
      this.prisma.fabricOrder.findMany({
        where,
        orderBy: [{ status: 'asc' }, { customerName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.fabricOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async pending(tailoringShopId: string) {
    return this.prisma.fabricOrder.findMany({
      where: { tailoringShopId, status: { in: ['pending', 'in_progress'] } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  async get(tailoringShopId: string, id: string) {
    const order = await this.prisma.fabricOrder.findFirst({
      where: { id, tailoringShopId },
    });
    if (!order) throw new NotFoundException('Tel gerdirme siparişi bulunamadı');
    return order;
  }

  async create(tailoringShopId: string, dto: CreateFabricOrderDto) {
    return this.prisma.fabricOrder.create({ data: { ...dto, tailoringShopId } });
  }

  async update(tailoringShopId: string, id: string, dto: UpdateFabricOrderDto) {
    await this.get(tailoringShopId, id);
    return this.prisma.fabricOrder.update({ where: { id }, data: dto });
  }

  async remove(tailoringShopId: string, id: string) {
    await this.get(tailoringShopId, id);
    return this.prisma.fabricOrder.delete({ where: { id } });
  }
}
