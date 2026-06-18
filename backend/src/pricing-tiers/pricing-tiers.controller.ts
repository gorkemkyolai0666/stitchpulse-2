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
import { PricingTiersService } from './pricing-tiers.service';
import { CreatePricingTierDto, UpdatePricingTierDto } from './dto/pricing-tier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pricing-tiers')
@UseGuards(JwtAuthGuard)
export class PricingTiersController {
  constructor(private pricingTiersService: PricingTiersService) {}

  @Get()
  list(
    @Request() req: { user: { framingShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.pricingTiersService.list(req.user.framingShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.pricingTiersService.get(req.user.framingShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { framingShopId: string } },
    @Body() dto: CreatePricingTierDto,
  ) {
    return this.pricingTiersService.create(req.user.framingShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { framingShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePricingTierDto,
  ) {
    return this.pricingTiersService.update(req.user.framingShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { framingShopId: string } }, @Param('id') id: string) {
    return this.pricingTiersService.remove(req.user.framingShopId, id);
  }
}
