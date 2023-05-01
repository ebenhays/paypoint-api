/*
  Warnings:

  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.
  - Added the required column `lastChangedDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mustChangePassword` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TELLER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash",
ADD COLUMN     "lastChangedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL;
