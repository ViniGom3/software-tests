import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    const allDisciplinas = await prisma.disciplina.findMany();

    res.json(allDisciplinas);
  } catch (error) {
    next(error);
  }
});

export default router;
