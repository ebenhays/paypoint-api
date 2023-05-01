-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockName" TEXT NOT NULL,
    "stockNo" TEXT NOT NULL,
    "marketName" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "fbdNo" TEXT,
    "manfDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "noOfBoxes" INTEGER NOT NULL,
    "itemPerbox" INTEGER NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "picUrl" TEXT,

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
CREATE TABLE "DailySale" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "batchNo" TEXT NOT NULL,
    "totalSales" DECIMAL(65,30) NOT NULL,
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
    "credit" DECIMAL(65,30) NOT NULL,
    "debit" DECIMAL(65,30) NOT NULL,
    "narration" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
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
    "price" DECIMAL(65,30) NOT NULL,
    "customerAmt" DECIMAL(65,30) NOT NULL,
    "customerBalance" DECIMAL(65,30) NOT NULL,
    "batchNo" TEXT NOT NULL,
    "teller" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "DailySaleEod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailySaleTemp" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,
    "txnDate" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "customerAmt" DECIMAL(65,30) NOT NULL,
    "customerBalance" DECIMAL(65,30) NOT NULL,
    "batchNo" TEXT NOT NULL,
    "teller" TEXT NOT NULL,

    CONSTRAINT "DailySaleTemp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_stockNo_key" ON "Stock"("stockNo");

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryCode_key" ON "Category"("categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "DailySale_batchNo_key" ON "DailySale"("batchNo");

-- AddForeignKey
ALTER TABLE "DailySaleEod" ADD CONSTRAINT "DailySaleEod_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("stockNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailySaleTemp" ADD CONSTRAINT "DailySaleTemp_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("stockNo") ON DELETE RESTRICT ON UPDATE CASCADE;
