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
import { QualityChecklistService } from './quality-checklists.service';
import { CreateQualityChecklistDto, UpdateQualityChecklistDto } from './dto/quality-checklist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quality-checklists')
@UseGuards(JwtAuthGuard)
export class QualityChecklistController {
  constructor(private qualityChecklistService: QualityChecklistService) {}

  @Get()
  list(
    @Request() req: { user: { tailoringShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.qualityChecklistService.list(req.user.tailoringShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.qualityChecklistService.get(req.user.tailoringShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tailoringShopId: string } },
    @Body() dto: CreateQualityChecklistDto,
  ) {
    return this.qualityChecklistService.create(req.user.tailoringShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tailoringShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateQualityChecklistDto,
  ) {
    return this.qualityChecklistService.update(req.user.tailoringShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.qualityChecklistService.remove(req.user.tailoringShopId, id);
  }
}
