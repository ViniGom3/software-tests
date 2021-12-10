import prisma from '../prisma';
import { Aluno } from '.prisma/client';
import { Exception } from '../error';
import { calcularIra } from '../utils/aluno';

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

export const updateAluno = async (aluno: Aluno) => {
  if (!(aluno.matricula && (await getAlunoById(aluno.matricula))))
    throw new Exception(404, 'Aluno não encontrado');

  return prisma.aluno.update({
    where: {
      matricula: aluno.matricula,
    },
    data: aluno,
  });
};

export const getIraByAluno = async (matricula: string) => {
  const matriculaAluno = parseInt(matricula);

  if (!(await getAlunoById(matriculaAluno)))
    throw new Exception(404, 'Aluno não encontrado');

  const avaliacao = await prisma.avaliacao.findMany({
    where: {
      matriculaAluno,
    },
    select: {
      grauFinal: true,
      situacao: true,
      turma: {
        select: {
          Disciplina: {
            select: {
              cargaHoraria: true,
            },
          },
        },
      },
    },
  });

  return { ira: calcularIra(avaliacao) };
};

export const getIraByPeriod = async (matricula: string, periodo: string) => {
  const matriculaAluno = parseInt(matricula);
  const periodId = parseInt(periodo);

  if (!(await getAlunoById(matriculaAluno)))
    throw new Exception(404, 'Aluno não encontrado');

  const avaliacao = await prisma.avaliacao.findMany({
    where: {
      matriculaAluno: matriculaAluno,
      turma: {
        periodoLetivo: {
          id: periodId,
        },
      },
    },
    select: {
      grauFinal: true,
      situacao: true,
      turma: {
        select: {
          Disciplina: {
            select: {
              cargaHoraria: true,
            },
          },
        },
      },
    },
  });

  return { ira: calcularIra(avaliacao) };
};
