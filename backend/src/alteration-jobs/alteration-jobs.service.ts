import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlterationJobDto, UpdateAlterationJobDto } from './dto/alteration-job.dto';

@Injectable()
export class AlterationJobsService {
  constructor(private prisma: PrismaService) {}

  async list(tailoringShopId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tailoringShopId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.alterationJob.findMany({
        where,
        orderBy: { dueAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          workstation: { select: { id: true, name: true, zone: true, specialty: true } },
        },
      }),
      this.prisma.alterationJob.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(tailoringShopId: string, id: string) {
    const session = await this.prisma.alterationJob.findFirst({
      where: { id, tailoringShopId },
      include: { workstation: true },
    });
    if (!session) throw new NotFoundException('Ders oturumu bulunamadı');
    return session;
  }

  async create(tailoringShopId: string, dto: CreateAlterationJobDto) {
    return this.prisma.alterationJob.create({
      data: {
        ...dto,
        tailoringShopId,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : new Date(),
      },
      include: { workstation: true },
    });
  }

  async update(tailoringShopId: string, id: string, dto: UpdateAlterationJobDto) {
    await this.get(tailoringShopId, id);
    const data = { ...dto };
    if (dto.dueAt) {
      (data as { dueAt?: Date }).dueAt = new Date(dto.dueAt);
    }
    return this.prisma.alterationJob.update({
      where: { id },
      data,
      include: { workstation: true },
    });
  }

  async remove(tailoringShopId: string, id: string) {
    await this.get(tailoringShopId, id);
    return this.prisma.alterationJob.delete({ where: { id } });
  }
}
