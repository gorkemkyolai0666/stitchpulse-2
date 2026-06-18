import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SHOP_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.framingShop.upsert({
    where: { id: SHOP_ID },
    update: {},
    create: {
      id: SHOP_ID,
      name: 'Gallery Frames & Fine Art',
      phone: '+13125550189',
      address: '189 W Madison Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60602',
      totalWorkBenches: 6,
      timezone: 'America/Chicago',
      users: {
        create: {
          email: 'demo@galleryframes.com',
          passwordHash,
          firstName: 'Aylin',
          lastName: 'Demir',
          role: 'owner',
        },
      },
    },
  });

  const workBenchData = [
    {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Bench A — Standard',
      zone: 'Assembly Floor',
      specialty: 'standard' as const,
      machineModel: 'Fletcher 3000 Mat Cutter',
      status: 'available' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Bench B — Museum',
      zone: 'Assembly Floor',
      specialty: 'museum' as const,
      machineModel: 'D&K Fusion 2500',
      status: 'in_use' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'Bench C — Shadow Box',
      zone: 'Specialty Room',
      specialty: 'shadow_box' as const,
      machineModel: 'Morsø 6800 Chopper',
      status: 'available' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000104',
      name: 'Bench D — Canvas',
      zone: 'Specialty Room',
      specialty: 'canvas' as const,
      machineModel: 'Keencut Ultimat Futura',
      status: 'cleaning' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000105',
      name: 'Glass & Mount Station',
      zone: 'Finishing Bay',
      specialty: 'specialty' as const,
      machineModel: 'Glass Master Ultra',
      status: 'maintenance' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000106',
      name: 'Pickup Counter',
      zone: 'Client Area',
      specialty: 'standard' as const,
      machineModel: null,
      status: 'closed' as const,
    },
  ];

  const workBenches = [];
  for (const bench of workBenchData) {
    const created = await prisma.workBench.upsert({
      where: { id: bench.id },
      update: {},
      create: { ...bench, framingShopId: SHOP_ID },
    });
    workBenches.push(created);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.framingOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      framingShopId: SHOP_ID,
      workBenchId: workBenches[2].id,
      dueAt: yesterday,
      orderType: 'museum_grade',
      cashAmount: 0,
      cardAmount: 485.0,
      itemCount: 1,
      rushFee: 75.0,
      status: 'verified',
      notes: 'Müze camı ile yağlı boya tablo çerçeveleme',
    },
  });

  await prisma.framingOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      framingShopId: SHOP_ID,
      workBenchId: workBenches[1].id,
      dueAt: yesterday,
      orderType: 'shadow_box',
      cashAmount: 150.0,
      cardAmount: 320.0,
      itemCount: 2,
      rushFee: 45.0,
      status: 'verified',
      notes: 'Hatıra eşyası gölge kutu — Thompson ailesi',
    },
  });

  const reportedAt = new Date();
  reportedAt.setDate(reportedAt.getDate() - 2);

  await prisma.equipmentMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      framingShopId: SHOP_ID,
      workBenchId: workBenches[4].id,
      title: 'Cam kesici bıçak aşınması',
      description: 'Glass Master Ultra bıçak değişimi gerekli',
      reportedAt,
      priority: 'urgent',
      status: 'open',
      cost: null,
    },
  });

  await prisma.equipmentMaintenance.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      framingShopId: SHOP_ID,
      workBenchId: workBenches[1].id,
      title: 'Morsø bıçak kalibrasyonu',
      description: 'Köşe birleşimlerinde 1mm boşluk tespit edildi',
      reportedAt,
      priority: 'medium',
      status: 'in_progress',
      cost: 85.0,
    },
  });

  const scheduledAt = new Date();
  scheduledAt.setDate(scheduledAt.getDate() + 1);

  await prisma.qualityChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      framingShopId: SHOP_ID,
      title: 'Müze camı son kontrol — Thompson',
      category: 'glass_check',
      zone: 'Finishing Bay',
      scheduledAt,
      status: 'scheduled',
    },
  });

  await prisma.qualityChecklist.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      framingShopId: SHOP_ID,
      title: 'Köşe birleşim kontrolü — Martinez',
      category: 'corner_joint',
      zone: 'Assembly Floor',
      scheduledAt,
      status: 'scheduled',
    },
  });

  await prisma.pricingTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      framingShopId: SHOP_ID,
      title: 'Standart Çerçeve (16x20)',
      pricingCategory: 'standard_frame',
      basePrice: 89.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  await prisma.pricingTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000502' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000502',
      framingShopId: SHOP_ID,
      title: 'Müze Paketi (UV Cam)',
      pricingCategory: 'museum_package',
      basePrice: 275.0,
      priceMultiplier: 1.35,
      status: 'active',
    },
  });

  await prisma.mouldingOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000601' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000601',
      framingShopId: SHOP_ID,
      customerName: 'Thompson Collection',
      mouldingProfile: 'Gold Leaf Baroque 3"',
      supplierName: 'Larson-Juhl Chicago',
      price: 420.0,
      status: 'pending',
    },
  });

  await prisma.mouldingOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000602' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000602',
      framingShopId: SHOP_ID,
      customerName: 'Martinez Gallery',
      mouldingProfile: 'Walnut Classic 2.5"',
      supplierName: 'Roma Moulding',
      price: 265.0,
      status: 'in_progress',
    },
  });

  console.log('Seed completed: Gallery Frames & Fine Art');
  console.log('Demo: demo@galleryframes.com / demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
