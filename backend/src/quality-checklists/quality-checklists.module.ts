import { Module } from '@nestjs/common';
import { QualityChecklistController } from './quality-checklists.controller';
import { QualityChecklistService } from './quality-checklists.service';

@Module({
  controllers: [QualityChecklistController],
  providers: [QualityChecklistService],
})
export class QualityChecklistModule {}
