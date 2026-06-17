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
import { ServiceRatesService } from './service-rates.service';
import { CreateServiceRateDto, UpdateServiceRateDto } from './dto/rate-tier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('service-rates')
@UseGuards(JwtAuthGuard)
export class ServiceRatesController {
  constructor(private serviceRatesService: ServiceRatesService) {}

  @Get()
  list(
    @Request() req: { user: { tailoringShopId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.serviceRatesService.list(req.user.tailoringShopId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.serviceRatesService.get(req.user.tailoringShopId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { tailoringShopId: string } },
    @Body() dto: CreateServiceRateDto,
  ) {
    return this.serviceRatesService.create(req.user.tailoringShopId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { tailoringShopId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateServiceRateDto,
  ) {
    return this.serviceRatesService.update(req.user.tailoringShopId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { tailoringShopId: string } }, @Param('id') id: string) {
    return this.serviceRatesService.remove(req.user.tailoringShopId, id);
  }
}
