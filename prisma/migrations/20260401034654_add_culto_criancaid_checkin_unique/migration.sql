/*
  Warnings:

  - A unique constraint covering the columns `[culto,criancaId]` on the table `Checkin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Checkin_culto_criancaId_key" ON "Checkin"("culto", "criancaId");
