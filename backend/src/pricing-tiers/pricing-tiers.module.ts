import { Module } from '@nestjs/common';
import { PricingTiersController } from './pricing-tiers.controller';
import { PricingTiersService } from './pricing-tiers.service';

@Module({
  controllers: [PricingTiersController],
  providers: [PricingTiersService],
})
export class PricingTiersModule {}
