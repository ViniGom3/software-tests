import { Aluno } from '@prisma/client';
import { Context } from '../../context';
import { Exception } from '../../error';
import { calcularIra } from '../../utils/aluno';

export const getAllAlunos = (ctx: Context) => {
  return ctx.prisma.aluno.findMany();
};

export const getAlunoById = (matricula: number, ctx: Context) => {
  return ctx.prisma.aluno.findUnique({
    where: {
      matricula,
    },
  });
};

export const createAluno = async (aluno: Aluno, ctx: Context) => {
  if (await getAlunoById(aluno.matricula, ctx))
    throw new Exception(400, 'Aluno já cadastrado');

  return ctx.prisma.aluno.create({
    data: aluno,
  });
};

export const deleteAluno = async (matric: string, ctx: Context) => {
  const matricula = parseInt(matric);

  if (!(await getAlunoById(matricula, ctx)))
    throw new Exception(404, 'Aluno não encontrado');

  return ctx.prisma.aluno.delete({
    where: {
      matricula,
    },
  });
};

export const updateAluno = async (aluno: Aluno, ctx: Context) => {
  if (!(aluno.matricula && (await getAlunoById(aluno.matricula, ctx))))
    throw new Exception(404, 'Aluno não encontrado');

  return ctx.prisma.aluno.update({
    where: {
      matricula: aluno.matricula,
    },
    data: aluno,
  });
};

export const getIraByAluno = async (matricula: string, ctx: Context) => {
  const matriculaAluno = parseInt(matricula);

  if (!(await getAlunoById(matriculaAluno, ctx)))
    throw new Exception(404, 'Aluno não encontrado');

  const avaliacao = await ctx.prisma.avaliacao.findMany({
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

export const getIraByPeriod = async (
  matricula: string,
  periodo: string,
  ctx: Context,
) => {
  const matriculaAluno = parseInt(matricula);
  const periodId = parseInt(periodo);

  if (!(await getAlunoById(matriculaAluno, ctx)))
    throw new Exception(404, 'Aluno não encontrado');

  const avaliacao = await ctx.prisma.avaliacao.findMany({
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
