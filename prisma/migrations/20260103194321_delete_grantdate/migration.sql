/*
  Warnings:

  - You are about to drop the `GrantDate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GrantDate" DROP CONSTRAINT "GrantDate_client_id_fkey";

-- DropForeignKey
ALTER TABLE "GrantDate" DROP CONSTRAINT "GrantDate_company_id_fkey";

-- DropForeignKey
ALTER TABLE "GrantDate" DROP CONSTRAINT "GrantDate_created_by_id_fkey";

-- DropTable
DROP TABLE "GrantDate";
