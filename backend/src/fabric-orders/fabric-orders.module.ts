import { Module } from '@nestjs/common';
import { FabricOrdersController } from './fabric-orders.controller';
import { FabricOrdersService } from './fabric-orders.service';

@Module({
  controllers: [FabricOrdersController],
  providers: [FabricOrdersService],
})
export class FabricOrdersModule {}
