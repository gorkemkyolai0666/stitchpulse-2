import { Module } from '@nestjs/common';
import { FramingShopController } from './framing-shop.controller';
import { FramingShopService } from './framing-shop.service';

@Module({
  controllers: [FramingShopController],
  providers: [FramingShopService],
})
export class FramingShopModule {}
