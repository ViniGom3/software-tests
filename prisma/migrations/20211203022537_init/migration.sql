/*
  Warnings:

  - The primary key for the `Disciplina` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Disciplina` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PreRequisito" DROP CONSTRAINT "_PreRequisito_A_fkey";

-- DropForeignKey
ALTER TABLE "_PreRequisito" DROP CONSTRAINT "_PreRequisito_B_fkey";

-- DropForeignKey
ALTER TABLE "Turma" DROP CONSTRAINT "Turma_disciplinaId_fkey";

-- AlterTable
ALTER TABLE "Disciplina" DROP CONSTRAINT "Disciplina_pkey",
DROP COLUMN "id",
ADD COLUMN     "codigo" SERIAL NOT NULL,
ADD CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("codigo");

-- AddForeignKey
ALTER TABLE "Turma" ADD CONSTRAINT "Turma_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreRequisito" ADD FOREIGN KEY ("A") REFERENCES "Disciplina"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreRequisito" ADD FOREIGN KEY ("B") REFERENCES "Disciplina"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;
