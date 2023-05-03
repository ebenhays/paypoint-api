/*
  Warnings:

  - A unique constraint covering the columns `[userGuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_userGuid_key" ON "User"("userGuid");
