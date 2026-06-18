-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'framer');

-- CreateEnum
CREATE TYPE "WorkBenchSpecialty" AS ENUM ('standard', 'museum', 'shadow_box', 'canvas', 'specialty');

-- CreateEnum
CREATE TYPE "WorkBenchStatus" AS ENUM ('available', 'in_use', 'cleaning', 'maintenance', 'closed');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('recorded', 'verified', 'disputed');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('standard_frame', 'museum_grade', 'shadow_box', 'canvas_stretch', 'rush');

-- CreateEnum
CREATE TYPE "EquipmentPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ChecklistCategory" AS ENUM ('glass_check', 'corner_joint', 'mat_alignment', 'dust_cover', 'wire_hanger', 'other');

-- CreateEnum
CREATE TYPE "ChecklistStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "PricingCategory" AS ENUM ('standard_frame', 'museum_package', 'rush_service', 'custom_mat', 'bulk_order', 'other');

-- CreateEnum
CREATE TYPE "PricingTierStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "MouldingOrderStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delivered');

-- CreateTable
CREATE TABLE "framing_shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_work_benches" INTEGER NOT NULL DEFAULT 6,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "framing_shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "framing_shop_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_benches" (
    "id" TEXT NOT NULL,
    "framing_shop_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "specialty" "WorkBenchSpecialty" NOT NULL DEFAULT 'standard',
    "machine_model" TEXT,
    "status" "WorkBenchStatus" NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_benches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "framing_orders" (
    "id" TEXT NOT NULL,
    "framing_shop_id" TEXT NOT NULL,
    "work_bench_id" TEXT NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "order_type" "OrderType" NOT NULL DEFAULT 'standard_frame',
    "cash_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "item_count" INTEGER NOT NULL DEFAULT 1,
    "rush_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL DEFAULT 'recorded',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "framing_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_maintenance" (
    "id" TEXT NOT NULL,
    "framing_shop_id" TEXT NOT NULL,
    "work_bench_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "EquipmentPriority" NOT NULL DEFAULT 'medium',
    "status" "EquipmentStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quality_checklists" (
    "id" TEXT NOT NULL,
    "framing_shop_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ChecklistCategory" NOT NULL DEFAULT 'other',
    "zone" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "ChecklistStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_tiers" (
    "id" TEXT NOT NULL,
    "framing_shop_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pricing_category" "PricingCategory" NOT NULL DEFAULT 'standard_frame',
    "status" "PricingTierStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moulding_orders" (
    "id" TEXT NOT NULL,
    "framing_shop_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "moulding_profile" TEXT NOT NULL,
    "supplier_name" TEXT,
    "status" "MouldingOrderStatus" NOT NULL DEFAULT 'pending',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "moulding_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "work_benches_framing_shop_id_name_key" ON "work_benches"("framing_shop_id", "name");

-- CreateIndex
CREATE INDEX "work_benches_framing_shop_id_status_idx" ON "work_benches"("framing_shop_id", "status");

-- CreateIndex
CREATE INDEX "framing_orders_framing_shop_id_due_at_idx" ON "framing_orders"("framing_shop_id", "due_at");

-- CreateIndex
CREATE INDEX "framing_orders_framing_shop_id_status_idx" ON "framing_orders"("framing_shop_id", "status");

-- CreateIndex
CREATE INDEX "equipment_maintenance_framing_shop_id_status_idx" ON "equipment_maintenance"("framing_shop_id", "status");

-- CreateIndex
CREATE INDEX "equipment_maintenance_framing_shop_id_priority_idx" ON "equipment_maintenance"("framing_shop_id", "priority");

-- CreateIndex
CREATE INDEX "quality_checklists_framing_shop_id_scheduled_at_idx" ON "quality_checklists"("framing_shop_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "pricing_tiers_framing_shop_id_pricing_category_idx" ON "pricing_tiers"("framing_shop_id", "pricing_category");

-- CreateIndex
CREATE INDEX "moulding_orders_framing_shop_id_status_idx" ON "moulding_orders"("framing_shop_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_framing_shop_id_fkey" FOREIGN KEY ("framing_shop_id") REFERENCES "framing_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_benches" ADD CONSTRAINT "work_benches_framing_shop_id_fkey" FOREIGN KEY ("framing_shop_id") REFERENCES "framing_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "framing_orders" ADD CONSTRAINT "framing_orders_framing_shop_id_fkey" FOREIGN KEY ("framing_shop_id") REFERENCES "framing_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "framing_orders" ADD CONSTRAINT "framing_orders_work_bench_id_fkey" FOREIGN KEY ("work_bench_id") REFERENCES "work_benches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "equipment_maintenance_framing_shop_id_fkey" FOREIGN KEY ("framing_shop_id") REFERENCES "framing_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "equipment_maintenance_work_bench_id_fkey" FOREIGN KEY ("work_bench_id") REFERENCES "work_benches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quality_checklists" ADD CONSTRAINT "quality_checklists_framing_shop_id_fkey" FOREIGN KEY ("framing_shop_id") REFERENCES "framing_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_tiers" ADD CONSTRAINT "pricing_tiers_framing_shop_id_fkey" FOREIGN KEY ("framing_shop_id") REFERENCES "framing_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moulding_orders" ADD CONSTRAINT "moulding_orders_framing_shop_id_fkey" FOREIGN KEY ("framing_shop_id") REFERENCES "framing_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
