-- DropIndex
DROP INDEX "FollowedAuthor_id_user_id_author_key";

-- DropIndex
DROP INDEX "FollowedBook_id_user_id_book_key";

-- AlterTable
ALTER TABLE "FollowedAuthor" ADD CONSTRAINT "FollowedAuthor_pkey" PRIMARY KEY ("id_user", "id_author");

-- AlterTable
ALTER TABLE "FollowedBook" ADD CONSTRAINT "FollowedBook_pkey" PRIMARY KEY ("id_user", "id_book");
