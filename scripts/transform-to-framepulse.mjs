#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const dirRenames = [
  ['backend/src/tailoring-shop', 'backend/src/framing-shop'],
  ['backend/src/workstations', 'backend/src/work-benches'],
  ['backend/src/alteration-jobs', 'backend/src/framing-orders'],
  ['backend/src/service-rates', 'backend/src/pricing-tiers'],
  ['backend/src/fabric-orders', 'backend/src/moulding-orders'],
  ['frontend/src/app/workstations', 'frontend/src/app/work-benches'],
  ['frontend/src/app/alteration-jobs', 'frontend/src/app/framing-orders'],
  ['frontend/src/app/service-rates', 'frontend/src/app/pricing-tiers'],
  ['frontend/src/app/fabric-orders', 'frontend/src/app/moulding-orders'],
];

const fileRenames = [
  ['backend/src/framing-shop/tailoring-shop.module.ts', 'backend/src/framing-shop/framing-shop.module.ts'],
  ['backend/src/framing-shop/tailoring-shop.controller.ts', 'backend/src/framing-shop/framing-shop.controller.ts'],
  ['backend/src/framing-shop/tailoring-shop.service.ts', 'backend/src/framing-shop/framing-shop.service.ts'],
  ['backend/src/framing-shop/dto/update-tailoring-shop.dto.ts', 'backend/src/framing-shop/dto/update-framing-shop.dto.ts'],
  ['backend/src/work-benches/workstations.module.ts', 'backend/src/work-benches/work-benches.module.ts'],
  ['backend/src/work-benches/workstations.controller.ts', 'backend/src/work-benches/work-benches.controller.ts'],
  ['backend/src/work-benches/workstations.service.ts', 'backend/src/work-benches/work-benches.service.ts'],
  ['backend/src/work-benches/dto/workstation.dto.ts', 'backend/src/work-benches/dto/work-bench.dto.ts'],
  ['backend/src/framing-orders/alteration-jobs.module.ts', 'backend/src/framing-orders/framing-orders.module.ts'],
  ['backend/src/framing-orders/alteration-jobs.controller.ts', 'backend/src/framing-orders/framing-orders.controller.ts'],
  ['backend/src/framing-orders/alteration-jobs.service.ts', 'backend/src/framing-orders/framing-orders.service.ts'],
  ['backend/src/framing-orders/dto/alteration-job.dto.ts', 'backend/src/framing-orders/dto/framing-order.dto.ts'],
  ['backend/src/pricing-tiers/service-rates.module.ts', 'backend/src/pricing-tiers/pricing-tiers.module.ts'],
  ['backend/src/pricing-tiers/service-rates.controller.ts', 'backend/src/pricing-tiers/pricing-tiers.controller.ts'],
  ['backend/src/pricing-tiers/service-rates.service.ts', 'backend/src/pricing-tiers/pricing-tiers.service.ts'],
  ['backend/src/pricing-tiers/dto/rate-tier.dto.ts', 'backend/src/pricing-tiers/dto/pricing-tier.dto.ts'],
  ['backend/src/moulding-orders/fabric-orders.module.ts', 'backend/src/moulding-orders/moulding-orders.module.ts'],
  ['backend/src/moulding-orders/fabric-orders.controller.ts', 'backend/src/moulding-orders/moulding-orders.controller.ts'],
  ['backend/src/moulding-orders/fabric-orders.service.ts', 'backend/src/moulding-orders/moulding-orders.service.ts'],
  ['backend/src/moulding-orders/dto/fabric-order.dto.ts', 'backend/src/moulding-orders/dto/moulding-order.dto.ts'],
];

const replacements = [
  ['TailoringShopModule', 'FramingShopModule'],
  ['TailoringShopController', 'FramingShopController'],
  ['TailoringShopService', 'FramingShopService'],
  ['UpdateTailoringShopDto', 'UpdateFramingShopDto'],
  ['tailoringShopName', 'framingShopName'],
  ['tailoringShopId', 'framingShopId'],
  ['TailoringShop', 'FramingShop'],
  ['tailoringShop', 'framingShop'],
  ['tailoring_shops', 'framing_shops'],
  ['tailoring-shop', 'framing-shop'],
  ['totalWorkstations', 'totalWorkBenches'],
  ['WorkstationsModule', 'WorkBenchesModule'],
  ['WorkstationsController', 'WorkBenchesController'],
  ['WorkstationsService', 'WorkBenchesService'],
  ['CreateWorkstationDto', 'CreateWorkBenchDto'],
  ['UpdateWorkstationDto', 'UpdateWorkBenchDto'],
  ['workstationId', 'workBenchId'],
  ['WorkstationSpecialty', 'WorkBenchSpecialty'],
  ['WorkstationStatus', 'WorkBenchStatus'],
  ['Workstation', 'WorkBench'],
  ['workstation', 'workBench'],
  ['workstations', 'work-benches'],
  ['AlterationJobsModule', 'FramingOrdersModule'],
  ['AlterationJobsController', 'FramingOrdersController'],
  ['AlterationJobsService', 'FramingOrdersService'],
  ['CreateAlterationJobDto', 'CreateFramingOrderDto'],
  ['UpdateAlterationJobDto', 'UpdateFramingOrderDto'],
  ['AlterationJob', 'FramingOrder'],
  ['alterationJob', 'framingOrder'],
  ['alteration-jobs', 'framing-orders'],
  ['alteration_jobs', 'framing_orders'],
  ['JobType', 'OrderType'],
  ['JobStatus', 'OrderStatus'],
  ['jobType', 'orderType'],
  ['ServiceRatesModule', 'PricingTiersModule'],
  ['ServiceRatesController', 'PricingTiersController'],
  ['ServiceRatesService', 'PricingTiersService'],
  ['CreateRateTierDto', 'CreatePricingTierDto'],
  ['UpdateRateTierDto', 'UpdatePricingTierDto'],
  ['ServiceCategory', 'PricingCategory'],
  ['ServiceRateStatus', 'PricingTierStatus'],
  ['rateCategory', 'pricingCategory'],
  ['ServiceRate', 'PricingTier'],
  ['serviceRate', 'pricingTier'],
  ['service-rates', 'pricing-tiers'],
  ['service_rates', 'pricing_tiers'],
  ['FabricOrdersModule', 'MouldingOrdersModule'],
  ['FabricOrdersController', 'MouldingOrdersController'],
  ['FabricOrdersService', 'MouldingOrdersService'],
  ['CreateFabricOrderDto', 'CreateMouldingOrderDto'],
  ['UpdateFabricOrderDto', 'UpdateMouldingOrderDto'],
  ['FabricOrderStatus', 'MouldingOrderStatus'],
  ['FabricOrder', 'MouldingOrder'],
  ['fabricOrder', 'mouldingOrder'],
  ['fabric-orders', 'moulding-orders'],
  ['fabric_orders', 'moulding_orders'],
  ['fabricType', 'mouldingProfile'],
  ['activeServiceRates', 'activePricingTiers'],
  ['pendingFabricOrders', 'pendingMouldingOrders'],
  ['completedFabricOrders', 'completedMouldingOrders'],
  ['recentJobs', 'recentOrders'],
  ['totalJobs', 'totalOrders'],
  ['stitchpulse_token', 'framepulse_token'],
  ['demo@heritagetailors.com', 'demo@galleryframes.com'],
  ['Heritage Tailors & Alterations', 'Gallery Frames & Fine Art'],
  ['Heritage Tailors', 'Gallery Frames'],
  ['heritagetailors', 'galleryframes'],
  ['StitchPulse', 'FramePulse'],
  ['stitchpulse', 'framepulse'],
  ['STITCHPULSE', 'FRAMEPULSE'],
  ['atelier-card', 'gallery-card'],
  ['atelier-btn', 'gallery-btn'],
  ['atelier-nav-border', 'gallery-nav-border'],
  ['station-pill', 'bench-pill'],
  ['--font-playfair', '--font-cormorant'],
  ['font-playfair', 'font-cormorant'],
  ['Playfair_Display', 'Cormorant_Garamond'],
  ['Playfair Display', 'Cormorant Garamond'],
  ['DM_Sans', 'Source_Sans_3'],
  ['DM Sans', 'Source Sans 3'],
  ['--font-dm-sans', '--font-source-sans'],
  ['font-dm-sans', 'font-source-sans'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

for (const [from, to] of dirRenames) {
  const fromPath = path.join(ROOT, from);
  const toPath = path.join(ROOT, to);
  if (fs.existsSync(fromPath)) {
    fs.renameSync(fromPath, toPath);
    console.log(`Renamed dir: ${from} -> ${to}`);
  }
}

for (const [from, to] of fileRenames) {
  const fromPath = path.join(ROOT, from);
  const toPath = path.join(ROOT, to);
  if (fs.existsSync(fromPath)) {
    fs.mkdirSync(path.dirname(toPath), { recursive: true });
    fs.renameSync(fromPath, toPath);
    console.log(`Renamed file: ${from} -> ${to}`);
  }
}

const textExtensions = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yml', '.yaml', '.sh', '.css', '.sql', '.toml', '.prisma', '.example',
]);

for (const file of walk(ROOT)) {
  const ext = path.extname(file);
  if (!textExtensions.has(ext) && !file.endsWith('.gitkeep')) continue;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${path.relative(ROOT, file)}`);
  }
}

fs.writeFileSync(path.join(ROOT, '.active-project'), 'framepulse\n');
console.log('Transform complete.');
