/*
  Warnings:

  - You are about to drop the `OrganizationsUsePrograms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationsUsePrograms" DROP CONSTRAINT "OrganizationsUsePrograms_orgId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationsUsePrograms" DROP CONSTRAINT "OrganizationsUsePrograms_programId_fkey";

-- DropForeignKey
ALTER TABLE "WorkerInfo" DROP CONSTRAINT "WorkerInfo_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "WorkerRole" DROP CONSTRAINT "WorkerRole_sessionId_fkey";

-- DropTable
DROP TABLE "OrganizationsUsePrograms";

-- CreateTable
CREATE TABLE "ProgramSession" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "expiryDate" TIMESTAMPTZ(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramSession.orgId_programId_unique" ON "ProgramSession"("orgId", "programId");

-- AddForeignKey
ALTER TABLE "WorkerInfo" ADD FOREIGN KEY ("sessionId") REFERENCES "ProgramSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerRole" ADD FOREIGN KEY ("sessionId") REFERENCES "ProgramSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSession" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSession" ADD FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
