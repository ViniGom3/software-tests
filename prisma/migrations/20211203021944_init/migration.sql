/*
  Warnings:

  - You are about to drop the column `disciplinaId` on the `Disciplina` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Disciplina" DROP CONSTRAINT "Disciplina_disciplinaId_fkey";

-- AlterTable
ALTER TABLE "Disciplina" DROP COLUMN "disciplinaId";

-- CreateTable
CREATE TABLE "_PreRequisito" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PreRequisito_AB_unique" ON "_PreRequisito"("A", "B");

-- CreateIndex
CREATE INDEX "_PreRequisito_B_index" ON "_PreRequisito"("B");

-- AddForeignKey
ALTER TABLE "_PreRequisito" ADD FOREIGN KEY ("A") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreRequisito" ADD FOREIGN KEY ("B") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;
