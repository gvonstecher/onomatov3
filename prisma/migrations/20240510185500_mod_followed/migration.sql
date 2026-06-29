-- DropForeignKey
ALTER TABLE "FollowedAuthor" DROP CONSTRAINT "FollowedAuthor_id_author_fkey";

-- DropForeignKey
ALTER TABLE "FollowedAuthor" DROP CONSTRAINT "FollowedAuthor_id_user_fkey";

-- DropForeignKey
ALTER TABLE "FollowedBook" DROP CONSTRAINT "FollowedBook_id_book_fkey";

-- DropForeignKey
ALTER TABLE "FollowedBook" DROP CONSTRAINT "FollowedBook_id_user_fkey";

-- AddForeignKey
ALTER TABLE "FollowedAuthor" ADD CONSTRAINT "FollowedAuthor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedAuthor" ADD CONSTRAINT "FollowedAuthor_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedBook" ADD CONSTRAINT "FollowedBook_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedBook" ADD CONSTRAINT "FollowedBook_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
