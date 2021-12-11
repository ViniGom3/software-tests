import { Aluno } from '@prisma/client';
import {
  getAllAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno,
  getIraByAluno,
  getIraByPeriod,
} from '.';

import prisma from '../../prisma';

describe('', () => {
  beforeAll(async () => {
    await prisma.aluno.createMany({
      data: [{ status: 'ATIVO' }, { status: 'ATIVO' }] as Aluno[],
    });
  });

  afterAll(async () => {
    const deleteAvaliacao = prisma.avaliacao.deleteMany();
    const deleteTurma = prisma.turma.deleteMany();
    const deleteDisciplina = prisma.disciplina.deleteMany();
    const deletePeriodo = prisma.periodoLetivo.deleteMany();
    const deleteAluno = prisma.aluno.deleteMany();
    const deleteCurso = prisma.curso.deleteMany();

    await prisma.$transaction([
      deleteAvaliacao,
      deleteTurma,
      deleteTurma,
      deleteDisciplina,
      deletePeriodo,
      deleteAluno,
      deleteCurso,
    ]);

    await prisma.$disconnect();
  });

  it('should get 2 alunos', async () => {
    const alunos = await getAllAlunos();
    expect(alunos).toHaveLength(2);

    expect(alunos).toBeTruthy();
  });
});
