-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('BACHARELADO', 'LICENCIATURA', 'MESTRADO', 'DOUTORADO');

-- CreateEnum
CREATE TYPE "Situacao" AS ENUM ('APROVADO', 'REPROVADO_NOTA', 'REPROVADO_FALTAS');

-- CreateTable
CREATE TABLE "Aluno" (
    "matricula" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'ATIVO',
    "cursoId" INTEGER,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("matricula")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" INTEGER NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turma" (
    "codigo" SERIAL NOT NULL,
    "nomeProfessor" TEXT NOT NULL,
    "periodoLetivoId" INTEGER NOT NULL,
    "horario" TEXT NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "qtdVagas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "PeriodoLetivo" (
    "id" SERIAL NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'ATIVO',

    CONSTRAINT "PeriodoLetivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "codigo" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "nomeDepartamento" TEXT NOT NULL,
    "nivel" "Nivel" NOT NULL DEFAULT E'BACHARELADO',

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "matriculaAluno" INTEGER NOT NULL,
    "codigoTurma" INTEGER NOT NULL,
    "grauFinal" INTEGER NOT NULL DEFAULT 0,
    "situacao" "Situacao" NOT NULL DEFAULT E'REPROVADO_NOTA',

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PreRequisito" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Curso_codigo_key" ON "Curso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_nome_key" ON "Disciplina"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "_PreRequisito_AB_unique" ON "_PreRequisito"("A", "B");

-- CreateIndex
CREATE INDEX "_PreRequisito_B_index" ON "_PreRequisito"("B");

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turma" ADD CONSTRAINT "Turma_periodoLetivoId_fkey" FOREIGN KEY ("periodoLetivoId") REFERENCES "PeriodoLetivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turma" ADD CONSTRAINT "Turma_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_matriculaAluno_fkey" FOREIGN KEY ("matriculaAluno") REFERENCES "Aluno"("matricula") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_codigoTurma_fkey" FOREIGN KEY ("codigoTurma") REFERENCES "Turma"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreRequisito" ADD FOREIGN KEY ("A") REFERENCES "Disciplina"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreRequisito" ADD FOREIGN KEY ("B") REFERENCES "Disciplina"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;
