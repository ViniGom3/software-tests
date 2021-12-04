-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_codigoTurma_fkey";

-- DropForeignKey
ALTER TABLE "Avaliacao" DROP CONSTRAINT "Avaliacao_matriculaAluno_fkey";

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_matriculaAluno_fkey" FOREIGN KEY ("matriculaAluno") REFERENCES "Aluno"("matricula") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_codigoTurma_fkey" FOREIGN KEY ("codigoTurma") REFERENCES "Turma"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;
