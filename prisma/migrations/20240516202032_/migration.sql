/*
  Warnings:

  - You are about to drop the column `mercadopagoId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `mercadopago_id` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `mercadopago_payment_id` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "mercadopagoId",
ADD COLUMN     "currency_id" TEXT,
ADD COLUMN     "mercadopago_id" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "mercadopago_id",
ADD COLUMN     "currency_id" TEXT,
ADD COLUMN     "mercadopago_payment_id" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
