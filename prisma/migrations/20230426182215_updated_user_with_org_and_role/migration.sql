/*
  Warnings:

  - Added the required column `orgId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "discount" DROP NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0.00;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "orgId" TEXT NOT NULL,
ALTER COLUMN "lastChangedDate" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orgName" TEXT NOT NULL,
    "orgCode" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgCode_key" ON "Organization"("orgCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("orgCode") ON DELETE RESTRICT ON UPDATE CASCADE;
