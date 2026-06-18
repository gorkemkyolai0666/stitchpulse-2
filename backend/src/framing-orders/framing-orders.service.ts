import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFramingOrderDto, UpdateFramingOrderDto } from './dto/framing-order.dto';

@Injectable()
export class FramingOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(framingShopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { framingShopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.framingOrder.findMany({
        where,
        orderBy: { dueAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          workBench: { select: { id: true, name: true, zone: true, specialty: true } },
        },
      }),
      this.prisma.framingOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(framingShopId: string, id: string) {
    const session = await this.prisma.framingOrder.findFirst({
      where: { id, framingShopId },
      include: { workBench: true },
    });
    if (!session) throw new NotFoundException('Ders oturumu bulunamadı');
    return session;
  }

  async create(framingShopId: string, dto: CreateFramingOrderDto) {
    return this.prisma.framingOrder.create({
      data: {
        ...dto,
        framingShopId,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : new Date(),
      },
      include: { workBench: true },
    });
  }

  async update(framingShopId: string, id: string, dto: UpdateFramingOrderDto) {
    await this.get(framingShopId, id);
    const data = { ...dto };
    if (dto.dueAt) {
      (data as { dueAt?: Date }).dueAt = new Date(dto.dueAt);
    }
    return this.prisma.framingOrder.update({
      where: { id },
      data,
      include: { workBench: true },
    });
  }

  async remove(framingShopId: string, id: string) {
    await this.get(framingShopId, id);
    return this.prisma.framingOrder.delete({ where: { id } });
  }
}
