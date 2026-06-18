import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { WorkBenchesService } from './work-benches.service';
import { CreateWorkBenchDto, UpdateWorkBenchDto } from './dto/work-bench.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('work-benches')
@UseGuards(JwtAuthGuard)
export class WorkBenchesController {
  constructor(private workBenchesService: WorkBenchesService) {}

  @Get()
  list(
    @Request() req: { user: { framingShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('zone') zone?: string,
  ) {
    return this.workBenchesService.list(req.user.framingShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      zone,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.workBenchesService.get(req.user.framingShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { framingShopId: string } },
    @Body() dto: CreateWorkBenchDto,
  ) {
    return this.workBenchesService.create(req.user.framingShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { framingShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateWorkBenchDto,
  ) {
    return this.workBenchesService.update(req.user.framingShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.workBenchesService.remove(req.user.framingShopId, id);
  }
}
