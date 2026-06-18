import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { FramingShopModule } from './framing-shop/framing-shop.module';
import { WorkBenchesModule } from './work-benches/work-benches.module';
import { FramingOrdersModule } from './framing-orders/framing-orders.module';
import { EquipmentMaintenanceModule } from './equipment-maintenance/equipment-maintenance.module';
import { QualityChecklistModule } from './quality-checklists/quality-checklists.module';
import { PricingTiersModule } from './pricing-tiers/pricing-tiers.module';
import { MouldingOrdersModule } from './moulding-orders/moulding-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    FramingShopModule,
    WorkBenchesModule,
    FramingOrdersModule,
    EquipmentMaintenanceModule,
    QualityChecklistModule,
    PricingTiersModule,
    MouldingOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
