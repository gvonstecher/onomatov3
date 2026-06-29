-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR,
    "email" VARCHAR,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "bio" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "profile_photo" INTEGER,
    "header_photo" INTEGER,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorSocialmedia" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR,
    "type" TEXT,
    "id_author" INTEGER NOT NULL,

    CONSTRAINT "authors_socialmedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "last_free_page" SMALLINT,
    "slug" TEXT,
    "id_author" INTEGER NOT NULL,
    "cover" INTEGER,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookPage" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "filename" VARCHAR,
    "page_number" DECIMAL DEFAULT 0,
    "id_book" INTEGER NOT NULL,

    CONSTRAINT "books_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookTag" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "id_book" INTEGER NOT NULL,
    "id_tag" INTEGER NOT NULL,

    CONSTRAINT "books_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookVote" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "id_user" TEXT NOT NULL,
    "id_book" INTEGER NOT NULL,

    CONSTRAINT "books_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowedAuthor" (
    "id" SERIAL NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_author" INTEGER NOT NULL,

    CONSTRAINT "followed_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowedBook" (
    "id" SERIAL NOT NULL,
    "bought" BOOLEAN DEFAULT false,
    "lastpage_read" DECIMAL DEFAULT 0,
    "id_user" TEXT NOT NULL,
    "id_book" INTEGER NOT NULL,

    CONSTRAINT "followed_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "authors_id_key" ON "Author"("id");

-- CreateIndex
CREATE UNIQUE INDEX "authors_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Author_id_user_key" ON "Author"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "books_id_key" ON "Book"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_id_key" ON "Tag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "books_pages_id_key" ON "BookPage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "followed_books_id_key" ON "FollowedBook"("id");

-- CreateIndex
CREATE UNIQUE INDEX "files_id_key" ON "File"("id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_profile_photo_fkey" FOREIGN KEY ("profile_photo") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_header_photo_fkey" FOREIGN KEY ("header_photo") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorSocialmedia" ADD CONSTRAINT "AuthorSocialmedia_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "Author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "Author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_cover_fkey" FOREIGN KEY ("cover") REFERENCES "File"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "BookPage" ADD CONSTRAINT "BookPage_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_id_tag_fkey" FOREIGN KEY ("id_tag") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookVote" ADD CONSTRAINT "BookVote_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookVote" ADD CONSTRAINT "BookVote_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedAuthor" ADD CONSTRAINT "FollowedAuthor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedAuthor" ADD CONSTRAINT "FollowedAuthor_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedBook" ADD CONSTRAINT "FollowedBook_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedBook" ADD CONSTRAINT "FollowedBook_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
