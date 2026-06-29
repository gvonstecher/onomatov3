/*
  Warnings:

  - You are about to alter the column `page_number` on the `BookPage` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "BookPage" ALTER COLUMN "page_number" SET DEFAULT 0,
ALTER COLUMN "page_number" SET DATA TYPE SMALLINT;
