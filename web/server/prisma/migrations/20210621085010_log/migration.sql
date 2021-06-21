/*
  Warnings:

  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Logs";

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "regDate" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogDescription" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("code")
);
