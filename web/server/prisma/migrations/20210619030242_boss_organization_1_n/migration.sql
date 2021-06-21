/*
  Warnings:

  - You are about to drop the column `orgId` on the `BossInfo` table. All the data in the column will be lost.
  - Added the required column `bossInfoId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BossInfo" DROP CONSTRAINT "BossInfo_orgId_fkey";

-- DropIndex
DROP INDEX "BossInfo_orgId_unique";

-- AlterTable
ALTER TABLE "BossInfo" DROP COLUMN "orgId";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "bossInfoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD FOREIGN KEY ("bossInfoId") REFERENCES "BossInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
