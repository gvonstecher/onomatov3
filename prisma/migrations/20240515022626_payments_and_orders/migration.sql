/*
  Warnings:

  - Added the required column `id_order` to the `FollowedBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FollowedBook" ADD COLUMN     "id_order" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "id_user" TEXT NOT NULL,
    "id_book" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "id_order" INTEGER NOT NULL,
    "date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION,
    "mercadopago_id" INTEGER NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_key" ON "Payment"("id");

-- AddForeignKey
ALTER TABLE "FollowedBook" ADD CONSTRAINT "FollowedBook_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_id_book_fkey" FOREIGN KEY ("id_book") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
