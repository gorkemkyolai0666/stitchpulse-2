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
import { FabricOrdersService } from './fabric-orders.service';
import { CreateFabricOrderDto, UpdateFabricOrderDto } from './dto/fabric-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fabric-orders')
@UseGuards(JwtAuthGuard)
export class FabricOrdersController {
  constructor(private fabricOrdersService: FabricOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { tailoringShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('fabricType') fabricType?: string,
  ) {
    return this.fabricOrdersService.list(req.user.tailoringShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      fabricType,
    });
  }

  @Get('pending')
  pending(@Request() req: { user: { tailoringShopId: string } }) {
    return this.fabricOrdersService.pending(req.user.tailoringShopId);
  }

  @Get(':id')
  get(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.fabricOrdersService.get(req.user.tailoringShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tailoringShopId: string } },
    @Body() dto: CreateFabricOrderDto,
  ) {
    return this.fabricOrdersService.create(req.user.tailoringShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tailoringShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateFabricOrderDto,
  ) {
    return this.fabricOrdersService.update(req.user.tailoringShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.fabricOrdersService.remove(req.user.tailoringShopId, id);
  }
}
