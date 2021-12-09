import { Router } from 'express';
import { Exception } from '../../error';
import prisma from '../../prisma';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    const allPeriodoLetivo = await prisma.periodoLetivo.findMany();

    res.json(allPeriodoLetivo);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { dataInicio, dataFim, status } = req.body;

    const begin = new Date(dataInicio);
    const end = new Date(dataFim);

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

    if (overlaidBegin || overlaidEnd || OverlaidBetween)
      throw new Exception(400, 'Período Letivo sobreposto');

    const periodoLetivo = await prisma.periodoLetivo.create({
      data: {
        dataInicio: begin,
        dataFim: end,
        status,
      },
    });

    res.json(periodoLetivo);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id_periodo_letivo', async (req, res, next) => {
  try {
    const { id_periodo_letivo } = req.params;
    const id = parseInt(id_periodo_letivo);

    let periodoLetivo = await prisma.periodoLetivo.findUnique({
      where: {
        id,
      },
    });

    if (!periodoLetivo)
      throw new Exception(404, 'Periodo letivo não encontrada');

    periodoLetivo = await prisma.periodoLetivo.delete({
      where: {
        id,
      },
    });

    res.json(periodoLetivo);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    const { id, dataInicio, dataFim, status } = req.body;

    const periodoLetivo = await prisma.periodoLetivo.update({
      where: {
        id,
      },
      data: {
        dataInicio,
        dataFim,
        status,
      },
    });

    res.json(periodoLetivo);
  } catch (error) {
    next(error);
  }
});

export default router;
