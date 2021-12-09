import { Situacao, Turma } from '@prisma/client';
import { Exception } from '../error';
import prisma from '../prisma';
import { calcularMediaTurma } from '../utils/turma';

export const getAllTurmas = () => {
  return prisma.turma.findMany();
};

export const getTurmaById = (id: number) => {
  return prisma.turma.findUnique({
    where: {
      codigo: id,
    },
  });
};

export const createTurma = (turma: Turma) => {
  return prisma.turma.create({
    data: turma,
  });
};

export const deleteTurma = async (id: string) => {
  const codigo = parseInt(id);

  if (!(await getTurmaById(codigo)))
    throw new Exception(400, 'Turma não encontrada');

  return prisma.turma.delete({
    where: {
      codigo,
    },
  });
};

export const updateTurma = async (turma: Turma) => {
  if (!(await getTurmaById(turma.codigo)))
    throw new Exception(400, 'Turma não encontrada');

  return prisma.turma.update({
    where: {
      codigo: turma.codigo,
    },
    data: turma,
  });
};

export const getIraMeanTurma = async (id: string) => {
  const codigoTurma = parseInt(id);

  const allTurma = await prisma.avaliacao.findMany({
    where: {
      codigoTurma,
      situacao: {
        not: Situacao.REPROVADO_FALTAS,
      },
    },
  });

  return calcularMediaTurma(allTurma);
};

export const subscribeAlunoInTurma = async (id: string, matricula: number) => {
  const codigoTurma = parseInt(id);

  const turma = await prisma.turma.findUnique({
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

  const preRequisitos = turma?.Disciplina.preRequisitos;

  const preRequisitoCodigos = preRequisitos?.map(
    preRequisito => preRequisito.codigo,
  );

  const numberOfPreRequisitoApproved = await prisma.avaliacao.count({
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

  const alreadyApprovedInDisciplina = await prisma.avaliacao.findFirst({
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

  const vacanciesInTurma = await prisma.turma.findUnique({
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

  return await prisma.avaliacao.create({
    data: {
      matriculaAluno: matricula,
      codigoTurma,
    },
  });
};
