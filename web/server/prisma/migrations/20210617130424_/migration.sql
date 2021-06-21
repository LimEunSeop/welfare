-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInfo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BossInfo" (
    "id" SERIAL NOT NULL,
    "userInfoId" INTEGER NOT NULL,
    "orgId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerInfo" (
    "id" SERIAL NOT NULL,
    "userInfoId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkerRole" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isManager" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationsUsePrograms" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "expiryDate" TIMESTAMPTZ(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiryDate" TIMESTAMPTZ(3) NOT NULL,

    PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "regDate" TIMESTAMPTZ(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserOnRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_userId_unique" ON "UserInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BossInfo_userInfoId_unique" ON "BossInfo"("userInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "BossInfo_orgId_unique" ON "BossInfo"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkerInfo_userInfoId_unique" ON "WorkerInfo"("userInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationsUsePrograms.orgId_programId_unique" ON "OrganizationsUsePrograms"("orgId", "programId");

-- CreateIndex
CREATE INDEX "RefreshToken.token_index" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "_UserOnRole_AB_unique" ON "_UserOnRole"("A", "B");

-- CreateIndex
CREATE INDEX "_UserOnRole_B_index" ON "_UserOnRole"("B");

-- AddForeignKey
ALTER TABLE "UserInfo" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossInfo" ADD FOREIGN KEY ("userInfoId") REFERENCES "UserInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BossInfo" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerInfo" ADD FOREIGN KEY ("userInfoId") REFERENCES "UserInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerInfo" ADD FOREIGN KEY ("sessionId") REFERENCES "OrganizationsUsePrograms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerInfo" ADD FOREIGN KEY ("roleId") REFERENCES "WorkerRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerRole" ADD FOREIGN KEY ("sessionId") REFERENCES "OrganizationsUsePrograms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationsUsePrograms" ADD FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationsUsePrograms" ADD FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOnRole" ADD FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOnRole" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
