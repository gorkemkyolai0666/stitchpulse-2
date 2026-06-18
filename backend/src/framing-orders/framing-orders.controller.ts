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
import { FramingOrdersService } from './framing-orders.service';
import { CreateFramingOrderDto, UpdateFramingOrderDto } from './dto/framing-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('framing-orders')
@UseGuards(JwtAuthGuard)
export class FramingOrdersController {
  constructor(private framingOrdersService: FramingOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { framingShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.framingOrdersService.list(req.user.framingShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.framingOrdersService.get(req.user.framingShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { framingShopId: string } },
    @Body() dto: CreateFramingOrderDto,
  ) {
    return this.framingOrdersService.create(req.user.framingShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { framingShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateFramingOrderDto,
  ) {
    return this.framingOrdersService.update(req.user.framingShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.framingOrdersService.remove(req.user.framingShopId, id);
  }
}
