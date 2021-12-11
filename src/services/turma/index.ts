import { Situacao, Turma } from '@prisma/client';
import { Context } from '../../context';
import { Exception } from '../../error';
import { calcularMediaTurma } from '../../utils/turma';

export const getAllTurmas = (ctx: Context) => {
  return ctx.prisma.turma.findMany();
};

export const getTurmaById = (id: number, ctx: Context) => {
  return ctx.prisma.turma.findUnique({
    where: {
      codigo: id,
    },
  });
};

export const createTurma = (turma: Turma, ctx: Context) => {
  return ctx.prisma.turma.create({
    data: turma,
  });
};

export const deleteTurma = async (id: string, ctx: Context) => {
  const codigo = parseInt(id);

  if (!(await getTurmaById(codigo, ctx)))
    throw new Exception(400, 'Turma não encontrada');

  return ctx.prisma.turma.delete({
    where: {
      codigo,
    },
  });
};

export const updateTurma = async (turma: Turma, ctx: Context) => {
  if (!(await getTurmaById(turma.codigo, ctx)))
    throw new Exception(400, 'Turma não encontrada');

  return ctx.prisma.turma.update({
    where: {
      codigo: turma.codigo,
    },
    data: turma,
  });
};

export const getIraMeanTurma = async (id: string, ctx: Context) => {
  const codigoTurma = parseInt(id);

  const allTurma = await ctx.prisma.avaliacao.findMany({
    where: {
      codigoTurma,
      situacao: {
        not: Situacao.REPROVADO_FALTAS,
      },
    },
  });

  return calcularMediaTurma(allTurma);
};

export const subscribeAlunoInTurma = async (
  id: string,
  matricula: number,
  ctx: Context,
) => {
  const codigoTurma = parseInt(id);

  const turma = await ctx.prisma.turma.findUnique({
    where: {
      codigo: codigoTurma,
    },
    include: {
      Disciplina: {
        include: {
          preRequisitos: true,
        },
      },
    },
  });

  if (!turma) throw new Exception(404, 'Turma não encontrada');

  const preRequisitos = turma.Disciplina.preRequisitos;

  const preRequisitoCodigos = preRequisitos?.map(
    preRequisito => preRequisito.codigo,
  );

  const numberOfPreRequisitoApproved = await ctx.prisma.avaliacao.count({
    where: {
      matriculaAluno: matricula,
      turma: {
        disciplinaId: {
          in: preRequisitoCodigos,
        },
      },
      situacao: Situacao.APROVADO,
    },
  });

  const isAlunoApprovedInAllPreRequisito =
    numberOfPreRequisitoApproved === preRequisitoCodigos?.length;

  if (!isAlunoApprovedInAllPreRequisito)
    throw new Exception(400, 'Aluno não está apto para a turma');

  const disciplinaId = turma?.Disciplina.codigo;

  const alreadyApprovedInDisciplina = await ctx.prisma.avaliacao.findFirst({
    where: {
      matriculaAluno: matricula,
      turma: {
        Disciplina: {
          codigo: disciplinaId,
        },
      },
      situacao: {
        equals: Situacao.APROVADO,
      },
    },
    select: {
      id: true,
    },
  });

  if (alreadyApprovedInDisciplina)
    throw new Exception(400, 'Aluno já está aprovado nesta disciplina');

  const vacanciesInTurma = await ctx.prisma.turma.findUnique({
    where: {
      codigo: codigoTurma,
    },
    select: {
      qtdVagas: true,
      Avaliacao: {
        select: {
          matriculaAluno: true,
        },
      },
    },
  });

  const thereVacancy =
    vacanciesInTurma &&
    vacanciesInTurma.Avaliacao.length < vacanciesInTurma.qtdVagas;

  if (!thereVacancy) throw new Exception(400, 'Turma lotada');

  return await ctx.prisma.avaliacao.create({
    data: {
      matriculaAluno: matricula,
      codigoTurma,
    },
  });
};
