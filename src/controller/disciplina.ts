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

router.delete('/:codigo_disciplina', async (req, res, next) => {
  try {
    const { codigo_disciplina } = req.params;
    const codigo = parseInt(codigo_disciplina);

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

router.patch('/', async (req, res, next) => {
  try {
    const { codigo, nome, cargaHoraria, nomeDepartamento, nivel } = req.body;

    const disciplina = await prisma.disciplina.update({
      where: {
        codigo,
      },
      data: {
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

export default router;
