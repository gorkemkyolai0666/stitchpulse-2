import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEquipmentMaintenanceDto,
  UpdateEquipmentMaintenanceDto,
} from './dto/equipment-maintenance.dto';

@Injectable()
export class EquipmentMaintenanceService {
  constructor(private prisma: PrismaService) {}

  async list(
    tailoringShopId: string,
    params: { page?: number; status?: string; priority?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { tailoringShopId };
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;

    const [data, total] = await Promise.all([
      this.prisma.equipmentMaintenance.findMany({
        where,
        orderBy: { reportedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          workstation: { select: { id: true, name: true, zone: true } },
        },
      }),
      this.prisma.equipmentMaintenance.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async urgent(tailoringShopId: string) {
    return this.prisma.equipmentMaintenance.findMany({
      where: {
        tailoringShopId,
        status: { in: ['open', 'in_progress'] },
        priority: { in: ['high', 'urgent'] },
      },
      include: { workstation: { select: { name: true, zone: true } } },
      orderBy: { reportedAt: 'desc' },
      take: 10,
    });
  }

  async get(tailoringShopId: string, id: string) {
    const maintenance = await this.prisma.equipmentMaintenance.findFirst({
      where: { id, tailoringShopId },
      include: { workstation: true },
    });
    if (!maintenance) throw new NotFoundException('Top makinesi bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(tailoringShopId: string, dto: CreateEquipmentMaintenanceDto) {
    return this.prisma.equipmentMaintenance.create({
      data: {
        ...dto,
        tailoringShopId,
        reportedAt: dto.reportedAt ? new Date(dto.reportedAt) : new Date(),
      },
      include: { workstation: true },
    });
  }

  async update(tailoringShopId: string, id: string, dto: UpdateEquipmentMaintenanceDto) {
    await this.get(tailoringShopId, id);
    const data = { ...dto };
    if (dto.reportedAt) {
      (data as { reportedAt?: Date }).reportedAt = new Date(dto.reportedAt);
    }
    if (dto.completedAt) {
      (data as { completedAt?: Date }).completedAt = new Date(dto.completedAt);
    }
    return this.prisma.equipmentMaintenance.update({
      where: { id },
      data,
      include: { workstation: true },
    });
  }

  async remove(tailoringShopId: string, id: string) {
    await this.get(tailoringShopId, id);
    return this.prisma.equipmentMaintenance.delete({ where: { id } });
  }
}
