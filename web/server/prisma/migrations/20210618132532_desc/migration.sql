/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Program` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Program.name_unique" ON "Program"("name");
