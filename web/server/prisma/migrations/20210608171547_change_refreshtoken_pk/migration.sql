/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "RefreshToken_userId_unique";

-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "id",
ADD PRIMARY KEY ("userId");
