/*
  Warnings:

  - A unique constraint covering the columns `[cpf,familiaId]` on the table `Responsavel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Responsavel_cpf_key";

-- AlterTable
ALTER TABLE "Impressora" ADD COLUMN     "foto" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_cpf_familiaId_key" ON "Responsavel"("cpf", "familiaId");
