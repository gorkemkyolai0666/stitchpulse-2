import { Module } from '@nestjs/common';
import { WorkBenchesController } from './work-benches.controller';
import { WorkBenchesService } from './work-benches.service';

@Module({
  controllers: [WorkBenchesController],
  providers: [WorkBenchesService],
})
export class WorkBenchesModule {}
