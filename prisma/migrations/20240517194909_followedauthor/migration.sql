/*
  Warnings:

  - The primary key for the `FollowedAuthor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FollowedAuthor` table. All the data in the column will be lost.
  - The primary key for the `FollowedBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FollowedBook` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_user,id_author]` on the table `FollowedAuthor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user,id_book]` on the table `FollowedBook` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "followed_books_id_key";

-- AlterTable
ALTER TABLE "FollowedAuthor" DROP CONSTRAINT "followed_authors_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "FollowedBook" DROP CONSTRAINT "followed_books_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "FollowedAuthor_id_user_id_author_key" ON "FollowedAuthor"("id_user", "id_author");

-- CreateIndex
CREATE UNIQUE INDEX "FollowedBook_id_user_id_book_key" ON "FollowedBook"("id_user", "id_book");
