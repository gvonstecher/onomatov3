/*
  Warnings:

  - A unique constraint covering the columns `[mercadopago_payment_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_mercadopago_payment_id_key" ON "Payment"("mercadopago_payment_id");
