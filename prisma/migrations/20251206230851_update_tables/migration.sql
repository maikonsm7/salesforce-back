/*
  Warnings:

  - Added the required column `created_by_id` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `Production` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "updated_by_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Production" ADD COLUMN     "created_by_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
