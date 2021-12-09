import { Aluno } from '.prisma/client';
import { Exception } from '../error';
import prisma from '../prisma';

export const getAllAlunos = () => {
  return prisma.aluno.findMany();
};

export const getAlunoById = (matricula: number) => {
  return prisma.aluno.findUnique({
    where: {
      matricula,
    },
  });
};

export const createAluno = async (aluno: Aluno) => {
  if (await getAlunoById(aluno.matricula))
    throw new Exception(400, 'Aluno já cadastrado');

  return prisma.aluno.create({
    data: aluno,
  });
};

export const deleteAluno = async (matric: string) => {
  const matricula = parseInt(matric);

  if (!(await getAlunoById(matricula)))
    throw new Exception(404, 'Aluno não encontrado');

  return prisma.aluno.delete({
    where: {
      matricula,
    },
  });
};
