-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customerId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "billingAddress" SET DATA TYPE TEXT,
ALTER COLUMN "paymentMethod" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "medicines_sellerId_idx" ON "medicines"("sellerId");

-- CreateIndex
CREATE INDEX "medicines_categoryId_idx" ON "medicines"("categoryId");

-- CreateIndex
CREATE INDEX "medicines_price_idx" ON "medicines"("price");

-- CreateIndex
CREATE INDEX "medicines_stock_idx" ON "medicines"("stock");
