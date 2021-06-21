/*
  Warnings:

  - You are about to drop the `UserInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BossInfo" DROP CONSTRAINT "BossInfo_userInfoId_fkey";

-- DropForeignKey
ALTER TABLE "UserInfo" DROP CONSTRAINT "UserInfo_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkerInfo" DROP CONSTRAINT "WorkerInfo_userInfoId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserInfo";

-- CreateTable
CREATE TABLE "UserDetail" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_userId_unique" ON "UserDetail"("userId");

-- AddForeignKey
ALTER TABLE "UserDetail" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossInfo" ADD FOREIGN KEY ("userInfoId") REFERENCES "UserDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerInfo" ADD FOREIGN KEY ("userInfoId") REFERENCES "UserDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
