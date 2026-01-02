/*
  Warnings:

  - Added the required column `release_date` to the `GrantDate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GrantDate" ADD COLUMN     "release_date" DATE NOT NULL;
