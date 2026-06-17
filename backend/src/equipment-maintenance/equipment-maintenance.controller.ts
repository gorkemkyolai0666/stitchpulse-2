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
    @Request() req: { user: { tailoringShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.equipmentMaintenanceService.list(req.user.tailoringShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { tailoringShopId: string } }) {
    return this.equipmentMaintenanceService.urgent(req.user.tailoringShopId);
  }

  @Get(':id')
  get(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.equipmentMaintenanceService.get(req.user.tailoringShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tailoringShopId: string } },
    @Body() dto: CreateEquipmentMaintenanceDto,
  ) {
    return this.equipmentMaintenanceService.create(req.user.tailoringShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tailoringShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentMaintenanceDto,
  ) {
    return this.equipmentMaintenanceService.update(req.user.tailoringShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.equipmentMaintenanceService.remove(req.user.tailoringShopId, id);
  }
}
