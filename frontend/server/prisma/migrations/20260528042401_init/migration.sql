-- CreateEnum
CREATE TYPE "StatusEvidencia" AS ENUM ('PENDENTE', 'REGISTRADA', 'COMPATIVEL', 'DIVERGENTE');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencias" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "identificador" TEXT NOT NULL,
    "hashDados" TEXT NOT NULL,
    "hashTransacao" TEXT,
    "enderecoContrato" TEXT,
    "carteiraRegistradora" TEXT,
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusEvidencia" NOT NULL DEFAULT 'REGISTRADA',
    "contratacao" JSONB NOT NULL,

    CONSTRAINT "evidencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "evidencias_usuarioId_idx" ON "evidencias"("usuarioId");

-- CreateIndex
CREATE INDEX "evidencias_identificador_idx" ON "evidencias"("identificador");

-- CreateIndex
CREATE INDEX "evidencias_hashDados_idx" ON "evidencias"("hashDados");

-- AddForeignKey
ALTER TABLE "evidencias" ADD CONSTRAINT "evidencias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
