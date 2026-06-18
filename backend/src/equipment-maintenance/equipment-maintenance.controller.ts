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
import { EquipmentMaintenanceService } from './equipment-maintenance.service';
import {
  CreateEquipmentMaintenanceDto,
  UpdateEquipmentMaintenanceDto,
} from './dto/equipment-maintenance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('equipment-maintenance')
@UseGuards(JwtAuthGuard)
export class EquipmentMaintenanceController {
  constructor(private equipmentMaintenanceService: EquipmentMaintenanceService) {}

  @Get()
  list(
    @Request() req: { user: { framingShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.equipmentMaintenanceService.list(req.user.framingShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { framingShopId: string } }) {
    return this.equipmentMaintenanceService.urgent(req.user.framingShopId);
  }

  @Get(':id')
  get(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.equipmentMaintenanceService.get(req.user.framingShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { framingShopId: string } },
    @Body() dto: CreateEquipmentMaintenanceDto,
  ) {
    return this.equipmentMaintenanceService.create(req.user.framingShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { framingShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentMaintenanceDto,
  ) {
    return this.equipmentMaintenanceService.update(req.user.framingShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.equipmentMaintenanceService.remove(req.user.framingShopId, id);
  }
}
