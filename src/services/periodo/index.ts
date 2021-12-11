import { PeriodoLetivo } from '@prisma/client';
import { Context } from '../../context';
import { Exception } from '../../error';

export const getAllPeriodos = (ctx: Context) => {
  return ctx.prisma.periodoLetivo.findMany();
};

export const getPeriodoById = (id: number, ctx: Context) => {
  return ctx.prisma.periodoLetivo.findUnique({ where: { id } });
};

export const createPeriodo = async (periodo: PeriodoLetivo, ctx: Context) => {
  const begin = new Date(periodo.dataInicio);
  const end = new Date(periodo.dataFim);

  if (begin > end)
    throw new Exception(
      400,
      'Data de início não pode ser maior que a data de fim',
    );

  const overlaidBegin = await ctx.prisma.periodoLetivo.findFirst({
    where: {
      dataInicio: {
        lte: begin,
      },
      dataFim: {
        gte: begin,
      },
    },
  });

  if (overlaidBegin) throw new Exception(400, 'Período Letivo sobreposto');

  const overlaidEnd = await ctx.prisma.periodoLetivo.findFirst({
    where: {
      dataInicio: {
        gte: end,
      },
      dataFim: {
        lte: end,
      },
    },
  });

  if (overlaidEnd) throw new Exception(400, 'Período Letivo sobreposto');

  const OverlaidBetween = await ctx.prisma.periodoLetivo.findFirst({
    where: {
      dataInicio: {
        gte: begin,
      },
      dataFim: {
        lte: end,
      },
    },
  });

  if (OverlaidBetween) throw new Exception(400, 'Período Letivo sobreposto');

  return ctx.prisma.periodoLetivo.create({
    data: {
      id: periodo.id,
      dataInicio: begin,
      dataFim: end,
      status: periodo.status,
    },
  });
};

export const deletePeriodo = async (id: string, ctx: Context) => {
  const periodoId = parseInt(id);

  if (!(await getPeriodoById(periodoId, ctx)))
    throw new Exception(400, 'Periodo não encontrado');

  return ctx.prisma.periodoLetivo.delete({ where: { id: periodoId } });
};

export const updatePeriodo = (periodo: PeriodoLetivo, ctx: Context) => {
  return ctx.prisma.periodoLetivo.update({
    where: {
      id: periodo.id,
    },
    data: periodo,
  });
};
