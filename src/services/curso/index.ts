import { Curso } from '@prisma/client';
import { Context } from '../../context';
import { Exception } from '../../error';
import { calcularIra } from '../../utils/aluno';

export const getAllCursos = (ctx: Context) => {
  return ctx.prisma.curso.findMany();
};

export const getCursoById = (id: number, ctx: Context) => {
  return ctx.prisma.curso.findUnique({
    where: {
      codigo: id,
    },
  });
};

export const createCurso = (curso: Curso, ctx: Context) => {
  return ctx.prisma.curso.create({
    data: curso,
  });
};

export const deleteCurso = async (id: string, ctx: Context) => {
  const cursoId = parseInt(id);

  if (!(await getCursoById(cursoId, ctx)))
    throw new Exception(404, 'Curso não encontrado');

  return ctx.prisma.curso.delete({
    where: {
      id: cursoId,
    },
  });
};

export const updateCurso = async (curso: Curso, ctx: Context) => {
  if (!(await getCursoById(curso.id, ctx)))
    throw new Exception(404, 'Curso não encontrado');

  const { codigo, ...cursoWithoutCodigo } = curso;

  return ctx.prisma.curso.update({
    where: {
      id: curso.id,
    },
    data: cursoWithoutCodigo,
  });
};

export const getIraByCurso = async (id: string, ctx: Context) => {
  const cursoId = parseInt(id);

  const ultimosPeriodosLetivos = await ctx.prisma.periodoLetivo.findMany({
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

  const turmasDoCursoNosUltimosPeriodos = await ctx.prisma.avaliacao.findMany({
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
