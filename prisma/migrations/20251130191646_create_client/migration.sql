/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_id_fkey";

-- DropTable
DROP TABLE "Token";

-- DropEnum
DROP TYPE "TypeToken";

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "observation" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "Client"("cpf");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
