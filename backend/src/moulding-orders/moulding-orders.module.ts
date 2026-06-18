import { Module } from '@nestjs/common';
import { MouldingOrdersController } from './moulding-orders.controller';
import { MouldingOrdersService } from './moulding-orders.service';

@Module({
  controllers: [MouldingOrdersController],
  providers: [MouldingOrdersService],
})
export class MouldingOrdersModule {}
