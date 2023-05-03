-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "barCodeId" TEXT,
ADD COLUMN     "productCode" TEXT;

-- CreateTable
CREATE TABLE "BarCode" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barCodeName" TEXT NOT NULL,
    "barCodeNo" TEXT NOT NULL,

    CONSTRAINT "BarCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarCode_barCodeNo_key" ON "BarCode"("barCodeNo");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_barCodeId_fkey" FOREIGN KEY ("barCodeId") REFERENCES "BarCode"("barCodeNo") ON DELETE SET NULL ON UPDATE CASCADE;
