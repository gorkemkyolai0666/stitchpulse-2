import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { FramingShopService } from './framing-shop.service';
import { UpdateFramingShopDto } from './dto/update-framing-shop.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('framing-shop')
@UseGuards(JwtAuthGuard)
export class FramingShopController {
  constructor(private framingShopService: FramingShopService) {}

  @Get()
  get(@Request() req: { user: { framingShopId: string } }) {
    return this.framingShopService.get(req.user.framingShopId);
  }

  @Patch()
  update(
    @Request() req: { user: { framingShopId: string } },
    @Body() dto: UpdateFramingShopDto,
  ) {
    return this.framingShopService.update(req.user.framingShopId, dto);
  }
}
