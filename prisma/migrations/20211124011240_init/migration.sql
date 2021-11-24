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

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("matricula")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "alunoId" INTEGER NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turma" (
    "codigo" SERIAL NOT NULL,
    "nomeProfessor" TEXT NOT NULL,
    "periodoLetivoId" INTEGER NOT NULL,
    "horario" TEXT NOT NULL,
    "disciplinaId" INTEGER NOT NULL,

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
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "nomeDepartamento" TEXT NOT NULL,
    "nivel" "Nivel" NOT NULL DEFAULT E'BACHARELADO',
    "disciplinaId" INTEGER,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "matriculaAluno" INTEGER NOT NULL,
    "codigoTurma" INTEGER NOT NULL,
    "grauFinal" TEXT NOT NULL,
    "situacao" "Situacao" NOT NULL DEFAULT E'APROVADO',

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Curso_codigo_key" ON "Curso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_alunoId_key" ON "Curso"("alunoId");

-- CreateIndex
CREATE UNIQUE INDEX "Turma_disciplinaId_key" ON "Turma"("disciplinaId");

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_nome_key" ON "Disciplina"("nome");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turma" ADD CONSTRAINT "Turma_periodoLetivoId_fkey" FOREIGN KEY ("periodoLetivoId") REFERENCES "PeriodoLetivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turma" ADD CONSTRAINT "Turma_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_matriculaAluno_fkey" FOREIGN KEY ("matriculaAluno") REFERENCES "Aluno"("matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_codigoTurma_fkey" FOREIGN KEY ("codigoTurma") REFERENCES "Turma"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
