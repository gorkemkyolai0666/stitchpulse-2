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
import { MouldingOrdersService } from './moulding-orders.service';
import { CreateMouldingOrderDto, UpdateMouldingOrderDto } from './dto/moulding-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('moulding-orders')
@UseGuards(JwtAuthGuard)
export class MouldingOrdersController {
  constructor(private mouldingOrdersService: MouldingOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { framingShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('mouldingProfile') mouldingProfile?: string,
  ) {
    return this.mouldingOrdersService.list(req.user.framingShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      mouldingProfile,
    });
  }

  @Get('pending')
  pending(@Request() req: { user: { framingShopId: string } }) {
    return this.mouldingOrdersService.pending(req.user.framingShopId);
  }

  @Get(':id')
  get(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.mouldingOrdersService.get(req.user.framingShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { framingShopId: string } },
    @Body() dto: CreateMouldingOrderDto,
  ) {
    return this.mouldingOrdersService.create(req.user.framingShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { framingShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateMouldingOrderDto,
  ) {
    return this.mouldingOrdersService.update(req.user.framingShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.mouldingOrdersService.remove(req.user.framingShopId, id);
  }
}
