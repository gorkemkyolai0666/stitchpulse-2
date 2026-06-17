import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { TailoringShopModule } from './tailoring-shop/tailoring-shop.module';
import { WorkstationsModule } from './workstations/workstations.module';
import { AlterationJobsModule } from './alteration-jobs/alteration-jobs.module';
import { EquipmentMaintenanceModule } from './equipment-maintenance/equipment-maintenance.module';
import { QualityChecklistModule } from './quality-checklists/quality-checklists.module';
import { ServiceRatesModule } from './service-rates/service-rates.module';
import { FabricOrdersModule } from './fabric-orders/fabric-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    TailoringShopModule,
    WorkstationsModule,
    AlterationJobsModule,
    EquipmentMaintenanceModule,
    QualityChecklistModule,
    ServiceRatesModule,
    FabricOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
