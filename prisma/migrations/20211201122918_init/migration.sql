/*
  Warnings:

  - You are about to drop the column `alunoId` on the `Curso` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_alunoId_fkey";

-- DropIndex
DROP INDEX "Curso_alunoId_key";

-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "cursoId" INTEGER;

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "alunoId";

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
