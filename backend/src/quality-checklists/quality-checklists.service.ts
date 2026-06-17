import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQualityChecklistDto, UpdateQualityChecklistDto } from './dto/quality-checklist.dto';

@Injectable()
export class QualityChecklistService {
  constructor(private prisma: PrismaService) {}

  async list(tailoringShopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tailoringShopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.qualityChecklist.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.qualityChecklist.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(tailoringShopId: string, id: string) {
    const maintenance = await this.prisma.qualityChecklist.findFirst({
      where: { id, tailoringShopId },
    });
    if (!maintenance) throw new NotFoundException('Kort bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(tailoringShopId: string, dto: CreateQualityChecklistDto) {
    return this.prisma.qualityChecklist.create({
      data: {
        ...dto,
        tailoringShopId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(tailoringShopId: string, id: string, dto: UpdateQualityChecklistDto) {
    await this.get(tailoringShopId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.qualityChecklist.update({ where: { id }, data });
  }

  async remove(tailoringShopId: string, id: string) {
    await this.get(tailoringShopId, id);
    return this.prisma.qualityChecklist.delete({ where: { id } });
  }
}
