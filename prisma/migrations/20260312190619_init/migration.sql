-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('Masculino', 'Feminino');

-- CreateEnum
CREATE TYPE "Parentesco" AS ENUM ('Pai', 'Mae', 'Tio', 'Tia', 'Irmao', 'Irma', 'AvoM', 'AvoF', 'Lider', 'Outro');

-- CreateEnum
CREATE TYPE "Turmas" AS ENUM ('Refubabies', 'Refukids1', 'Refukids2', 'Refuteens');

-- CreateEnum
CREATE TYPE "CheckinEventos" AS ENUM ('Checkin', 'Acolhimento', 'Checkout', 'Anotacao');

-- CreateTable
CREATE TABLE "Turma" (
    "id" "Turmas" NOT NULL,
    "descricao" TEXT NOT NULL,
    "idadeMinima" INTEGER NOT NULL,
    "idadeMaxima" INTEGER NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Familia" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),

    CONSTRAINT "Familia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crianca" (
    "id" TEXT NOT NULL,
    "foto" TEXT,
    "nome" TEXT NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "observacao" TEXT,
    "celula" TEXT,
    "alergia" TEXT,
    "condicaoMedicaMedicamento" TEXT,
    "necessidadeEspecial" TEXT,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),
    "familiaId" TEXT NOT NULL,

    CONSTRAINT "Crianca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsavel" (
    "id" TEXT NOT NULL,
    "foto" TEXT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "parentesco" "Parentesco" NOT NULL,
    "celula" TEXT,
    "responsavelLegal" BOOLEAN NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),
    "familiaId" TEXT NOT NULL,
    "notificacoesToken" TEXT,

    CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impressora" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),
    "ip" TEXT,
    "operadorId" TEXT,

    CONSTRAINT "Impressora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impressao" (
    "id" TEXT NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),
    "impressoraId" TEXT NOT NULL,
    "checkinId" TEXT NOT NULL,

    CONSTRAINT "Impressao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkin" (
    "id" TEXT NOT NULL,
    "culto" TEXT NOT NULL,
    "criancaId" TEXT NOT NULL,
    "turmaId" "Turmas" NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),

    CONSTRAINT "Checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckinEvento" (
    "id" TEXT NOT NULL,
    "tipo" "CheckinEventos" NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),
    "checkinId" TEXT NOT NULL,
    "checkinPorId" TEXT,
    "acolhidoPorId" TEXT,
    "checkoutPorId" TEXT,
    "checkoutParaId" TEXT,
    "anotacao" TEXT,
    "anotadoPorId" TEXT,
    "responsaveisNotificados" BOOLEAN,

    CONSTRAINT "CheckinEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servo" (
    "id" TEXT NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),
    "foto" TEXT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "dataNascimento" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "celula" TEXT,
    "notificacoesToken" TEXT,

    CONSTRAINT "Servo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" TEXT NOT NULL,
    "titulo" TEXT,
    "descricao" TEXT NOT NULL,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),
    "notificadoPorId" TEXT NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioNotificacao" (
    "id" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "cadastradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "deletadoEm" TIMESTAMP(3),
    "notificadoParaServoId" TEXT,
    "notificadoParaResponsavelId" TEXT,
    "notificacaoId" TEXT NOT NULL,

    CONSTRAINT "UsuarioNotificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_cpf_key" ON "Responsavel"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Servo_cpf_key" ON "Servo"("cpf");

-- AddForeignKey
ALTER TABLE "Crianca" ADD CONSTRAINT "Crianca_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsavel" ADD CONSTRAINT "Responsavel_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "Familia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impressora" ADD CONSTRAINT "Impressora_operadorId_fkey" FOREIGN KEY ("operadorId") REFERENCES "Servo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impressao" ADD CONSTRAINT "Impressao_impressoraId_fkey" FOREIGN KEY ("impressoraId") REFERENCES "Impressora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impressao" ADD CONSTRAINT "Impressao_checkinId_fkey" FOREIGN KEY ("checkinId") REFERENCES "Checkin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_criancaId_fkey" FOREIGN KEY ("criancaId") REFERENCES "Crianca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinEvento" ADD CONSTRAINT "CheckinEvento_checkinId_fkey" FOREIGN KEY ("checkinId") REFERENCES "Checkin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinEvento" ADD CONSTRAINT "CheckinEvento_checkinPorId_fkey" FOREIGN KEY ("checkinPorId") REFERENCES "Responsavel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinEvento" ADD CONSTRAINT "CheckinEvento_acolhidoPorId_fkey" FOREIGN KEY ("acolhidoPorId") REFERENCES "Servo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinEvento" ADD CONSTRAINT "CheckinEvento_checkoutPorId_fkey" FOREIGN KEY ("checkoutPorId") REFERENCES "Servo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinEvento" ADD CONSTRAINT "CheckinEvento_checkoutParaId_fkey" FOREIGN KEY ("checkoutParaId") REFERENCES "Responsavel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinEvento" ADD CONSTRAINT "CheckinEvento_anotadoPorId_fkey" FOREIGN KEY ("anotadoPorId") REFERENCES "Servo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_notificadoPorId_fkey" FOREIGN KEY ("notificadoPorId") REFERENCES "Servo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioNotificacao" ADD CONSTRAINT "UsuarioNotificacao_notificadoParaServoId_fkey" FOREIGN KEY ("notificadoParaServoId") REFERENCES "Servo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioNotificacao" ADD CONSTRAINT "UsuarioNotificacao_notificadoParaResponsavelId_fkey" FOREIGN KEY ("notificadoParaResponsavelId") REFERENCES "Responsavel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioNotificacao" ADD CONSTRAINT "UsuarioNotificacao_notificacaoId_fkey" FOREIGN KEY ("notificacaoId") REFERENCES "Notificacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
