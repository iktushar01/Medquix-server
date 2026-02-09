-- DropIndex
DROP INDEX "medicines_categoryId_idx";

-- DropIndex
DROP INDEX "medicines_name_idx";

-- DropIndex
DROP INDEX "medicines_price_idx";

-- DropIndex
DROP INDEX "medicines_sellerId_idx";

-- DropIndex
DROP INDEX "medicines_stock_idx";

-- AlterTable
ALTER TABLE "medicines" ALTER COLUMN "manufacturer" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "medicine_images" (
    "id" SERIAL NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "medicineId" INTEGER NOT NULL,

    CONSTRAINT "medicine_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicine_images_medicineId_idx" ON "medicine_images"("medicineId");

-- AddForeignKey
ALTER TABLE "medicine_images" ADD CONSTRAINT "medicine_images_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
