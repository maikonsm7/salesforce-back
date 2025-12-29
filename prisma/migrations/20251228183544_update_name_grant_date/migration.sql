/*
  Warnings:

  - You are about to drop the `GrandDate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GrandDate" DROP CONSTRAINT "GrandDate_client_id_fkey";

-- DropForeignKey
ALTER TABLE "GrandDate" DROP CONSTRAINT "GrandDate_company_id_fkey";

-- DropForeignKey
ALTER TABLE "GrandDate" DROP CONSTRAINT "GrandDate_created_by_id_fkey";

-- DropTable
DROP TABLE "GrandDate";

-- CreateTable
CREATE TABLE "GrantDate" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "GrantDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GrantDate" ADD CONSTRAINT "GrantDate_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantDate" ADD CONSTRAINT "GrantDate_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantDate" ADD CONSTRAINT "GrantDate_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
