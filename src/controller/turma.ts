import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    const allturmas = await prisma.turma.findMany();

    res.json(allturmas);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { codigo, nomeProfessor, periodoLetivoId, disciplinaId, horario, qtdVagas} = req.body;

    let turma = await prisma.turma.findUnique({
      where: {
        codigo,
      },
    });

    if (turma) {
      res.json(turma);
      return;
    }

    turma = await prisma.turma.create({
      data: {
        codigo,
        nomeProfessor,
        periodoLetivoId,
        horario,
        disciplinaId,
        qtdVagas,
      },
    });

    res.json(turma);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const { codigo } = req.body;

    const turma = await prisma.turma.delete({
      where: {
        codigo,
      },
    });

    res.json(turma);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    const { codigo, nomeProfessor, periodoLetivoId, disciplinaId, horario, qtdVagas} = req.body;

    const turma = await prisma.turma.update({
      where: {
        codigo,
      },
      data: {
        nomeProfessor,
        periodoLetivoId,
        horario,
        disciplinaId,
        qtdVagas,
      },
    });

    res.json(turma);
  } catch (error) {
    next(error);
  }
});

export default router;
