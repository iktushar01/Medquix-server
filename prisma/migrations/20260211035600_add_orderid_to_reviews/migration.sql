/*
  Warnings:

  - A unique constraint covering the columns `[customerId,medicineId,orderId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_medicineId_fkey";

-- DropIndex
DROP INDEX "reviews_createdAt_idx";

-- DropIndex
DROP INDEX "reviews_customerId_medicineId_key";

-- DropIndex
DROP INDEX "reviews_rating_idx";

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "orderId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "reviews_orderId_idx" ON "reviews"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_customerId_medicineId_orderId_key" ON "reviews"("customerId", "medicineId", "orderId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
