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

router.post('/', async (req, res, next) => {
  try {
    const { codigo, nome, cargaHoraria, nomeDepartamento, nivel } = req.body;

    let disciplina = await prisma.disciplina.findUnique({
      where: {
        codigo,
      },
    });

    if (disciplina) {
      res.json(disciplina);
      return;
    }

    disciplina = await prisma.disciplina.create({
      data: {
        codigo,
        nome,
        cargaHoraria,
        nomeDepartamento,
        nivel,
      },
    });

    res.json(disciplina);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const { codigo } = req.body;

    const disciplina = await prisma.disciplina.delete({
      where: {
        codigo,
      },
    });

    res.json(disciplina);
  } catch (error) {
    next(error);
  }
});

export default router;
