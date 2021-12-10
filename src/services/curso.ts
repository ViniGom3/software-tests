import { Curso } from '@prisma/client';
import { Exception } from '../error';
import prisma from '../prisma';
import { calcularIra } from '../utils/aluno';

export const getAllCursos = () => {
  return prisma.curso.findMany();
};

export const getCursoById = (id: number) => {
  return prisma.curso.findUnique({
    where: {
      codigo: id,
    },
  });
};

export const createCurso = (curso: Curso) => {
  return prisma.curso.create({
    data: curso,
  });
};

export const deleteCurso = async (id: string) => {
  const cursoId = parseInt(id);

  if (!(await getCursoById(cursoId)))
    throw new Exception(404, 'Curso não encontrado');

  return prisma.curso.delete({
    where: {
      id: cursoId,
    },
  });
};

export const updateCurso = async (curso: Curso) => {
  if (!(!!curso.id && (await getCursoById(curso.id))))
    throw new Exception(404, 'Curso não encontrado');

  return prisma.curso.update({
    where: {
      id: curso.id,
    },
    data: curso,
  });
};

export const getIraByCurso = async (id: string) => {
  const cursoId = parseInt(id);

  const ultimosPeriodosLetivos = await prisma.periodoLetivo.findMany({
    orderBy: {
      dataFim: 'desc',
    },
    take: 4,
    select: {
      id: true,
    },
  });

  const ultimosPeriodosLetivosIds = ultimosPeriodosLetivos.map(
    periodos => periodos.id,
  );

  const turmasDoCursoNosUltimosPeriodos = await prisma.avaliacao.findMany({
    where: {
      aluno: {
        cursoId,
      },
      turma: {
        periodoLetivoId: {
          in: ultimosPeriodosLetivosIds,
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

  return calcularIra(turmasDoCursoNosUltimosPeriodos);
};
