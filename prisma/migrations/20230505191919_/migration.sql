-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TELLER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "mustChangePassword" BOOLEAN DEFAULT true,
    "lastChangedDate" TIMESTAMP(3),
    "role" "Role" NOT NULL,
    "orgId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "primaryPhone" TEXT,
    "secondayPhone" TEXT,
    "userGuid" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orgName" TEXT NOT NULL,
    "orgCode" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockName" TEXT NOT NULL,
    "stockNo" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "marketName" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION DEFAULT 0.00,
    "fbdNo" TEXT,
    "manfDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "noOfBoxes" INTEGER NOT NULL,
    "itemPerbox" INTEGER NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "priceAfterDiscount" DOUBLE PRECISION,
    "picUrl" TEXT,
    "productCode" TEXT,
    "barCodeId" TEXT,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarCode" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barCodeName" TEXT NOT NULL,
    "barCodeNo" TEXT NOT NULL,
    "barCodeUid" TEXT,

    CONSTRAINT "BarCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySale" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "batchNo" TEXT NOT NULL,
    "totalSales" DOUBLE PRECISION NOT NULL,
    "salesDate" TIMESTAMP(3) NOT NULL,
    "teller" TEXT NOT NULL,
    "txnDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "txnDate" TIMESTAMP(3) NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL,
    "narration" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "teller" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySaleEod" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "txnDate" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "customerAmt" DOUBLE PRECISION NOT NULL,
    "customerBalance" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "batchNo" TEXT NOT NULL,
    "teller" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "tellerId" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,

    CONSTRAINT "DailySaleEod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySaleTemp" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,
    "txnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qty" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "customerAmt" DOUBLE PRECISION NOT NULL,
    "customerBalance" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "batchNo" TEXT NOT NULL,
    "teller" TEXT NOT NULL,
    "tellerId" TEXT NOT NULL,
    "txnId" TEXT,

    CONSTRAINT "DailySaleTemp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "custName" TEXT NOT NULL,
    "customerNo" TEXT NOT NULL,
    "primaryPhone" TEXT NOT NULL,
    "secondaryPhone" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_primaryPhone_key" ON "User"("primaryPhone");

-- CreateIndex
CREATE UNIQUE INDEX "User_userGuid_key" ON "User"("userGuid");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgCode_key" ON "Organization"("orgCode");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_stockNo_key" ON "Stock"("stockNo");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryCode_key" ON "Category"("categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "BarCode_barCodeNo_key" ON "BarCode"("barCodeNo");

-- CreateIndex
CREATE UNIQUE INDEX "BarCode_barCodeUid_key" ON "BarCode"("barCodeUid");

-- CreateIndex
CREATE UNIQUE INDEX "DailySale_batchNo_key" ON "DailySale"("batchNo");

-- CreateIndex
CREATE UNIQUE INDEX "DailySaleEod_txnId_key" ON "DailySaleEod"("txnId");

-- CreateIndex
CREATE UNIQUE INDEX "DailySaleTemp_txnId_key" ON "DailySaleTemp"("txnId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerNo_key" ON "Customer"("customerNo");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_primaryPhone_key" ON "Customer"("primaryPhone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_emailAddress_key" ON "Customer"("emailAddress");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("orgCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_barCodeId_fkey" FOREIGN KEY ("barCodeId") REFERENCES "BarCode"("barCodeNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "DailySale"("batchNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySaleEod" ADD CONSTRAINT "DailySaleEod_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("stockNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySaleTemp" ADD CONSTRAINT "DailySaleTemp_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("stockNo") ON DELETE RESTRICT ON UPDATE CASCADE;
