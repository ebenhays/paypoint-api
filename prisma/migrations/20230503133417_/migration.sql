/*
  Warnings:

  - A unique constraint covering the columns `[barCodeUid]` on the table `BarCode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BarCode" ADD COLUMN     "barCodeUid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BarCode_barCodeUid_key" ON "BarCode"("barCodeUid");
