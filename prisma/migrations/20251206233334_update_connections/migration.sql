-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_updated_by_id_fkey";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_by_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Production" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
