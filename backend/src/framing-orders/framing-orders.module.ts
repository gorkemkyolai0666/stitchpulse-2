import { Module } from '@nestjs/common';
import { FramingOrdersController } from './framing-orders.controller';
import { FramingOrdersService } from './framing-orders.service';

@Module({
  controllers: [FramingOrdersController],
  providers: [FramingOrdersService],
})
export class FramingOrdersModule {}
