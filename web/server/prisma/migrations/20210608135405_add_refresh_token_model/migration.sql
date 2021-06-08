-- CreateTable
CREATE TABLE "RefreshToken" (
    "token" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("token")
);
