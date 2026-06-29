/*
  Warnings:

  - You are about to drop the column `filename` on the `BookPage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthorSocialmedia" DROP CONSTRAINT "AuthorSocialmedia_id_author_fkey";

-- AlterTable
ALTER TABLE "BookPage" DROP COLUMN "filename",
ADD COLUMN     "page_photo" INTEGER;

-- AddForeignKey
ALTER TABLE "AuthorSocialmedia" ADD CONSTRAINT "AuthorSocialmedia_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPage" ADD CONSTRAINT "BookPage_page_photo_fkey" FOREIGN KEY ("page_photo") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
