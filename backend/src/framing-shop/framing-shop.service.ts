import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFramingShopDto } from './dto/update-framing-shop.dto';

@Injectable()
export class FramingShopService {
  constructor(private prisma: PrismaService) {}

  async get(framingShopId: string) {
    const framingShop = await this.prisma.framingShop.findUnique({
      where: { id: framingShopId },
    });
    if (!framingShop) throw new NotFoundException('Tenis kulübü bulunamadı');
    return framingShop;
  }

  async update(framingShopId: string, dto: UpdateFramingShopDto) {
    await this.get(framingShopId);
    return this.prisma.framingShop.update({ where: { id: framingShopId }, data: dto });
  }
}
