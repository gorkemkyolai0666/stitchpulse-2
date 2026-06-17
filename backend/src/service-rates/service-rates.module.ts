import { Module } from '@nestjs/common';
import { ServiceRatesController } from './service-rates.controller';
import { ServiceRatesService } from './service-rates.service';

@Module({
  controllers: [ServiceRatesController],
  providers: [ServiceRatesService],
})
export class ServiceRatesModule {}
