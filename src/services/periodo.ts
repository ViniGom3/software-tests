import { PeriodoLetivo } from '@prisma/client';
import { Exception } from '../error';
import prisma from '../prisma';

export const getAllPeriodos = () => {
  return prisma.periodoLetivo.findMany();
};

export const getPeriodoById = (id: number) => {
  return prisma.periodoLetivo.findUnique({ where: { id } });
};

export const createPeriodo = async (periodo: PeriodoLetivo) => {
  const begin = new Date(periodo.dataInicio);
  const end = new Date(periodo.dataFim);

  if (begin > end)
    throw new Exception(
      400,
      'Data de início não pode ser maior que a data de fim',
    );

  const overlaidBegin = await prisma.periodoLetivo.findFirst({
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

  const overlaidEnd = await prisma.periodoLetivo.findFirst({
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

  const OverlaidBetween = await prisma.periodoLetivo.findFirst({
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

  return prisma.periodoLetivo.create({
    data: {
      id: periodo.id,
      dataInicio: begin,
      dataFim: end,
      status: periodo.status,
    },
  });
};

export const deletePeriodo = async (id: string) => {
  const periodoId = parseInt(id);

  if (!(await getPeriodoById(periodoId)))
    throw new Exception(400, 'Periodo não encontrado');

  return prisma.periodoLetivo.delete({ where: { id: periodoId } });
};

export const updatePeriodo = (periodo: PeriodoLetivo) => {
  return prisma.periodoLetivo.update({
    where: {
      id: periodo.id,
    },
    data: periodo,
  });
};
