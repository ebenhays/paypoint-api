-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "orgCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mustChangePassword" SET DEFAULT true;
