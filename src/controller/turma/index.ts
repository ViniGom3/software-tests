import { Router } from 'express';
import prisma from '../../prisma';
import {
  createTurma,
  deleteTurma,
  getAllTurmas,
  getIraMeanTurma,
  subscribeAlunoInTurma,
  updateTurma,
} from '../../services/turma';

const ctx = {
  prisma,
};

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllTurmas(ctx));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createTurma(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

router.delete('/:codigo_turma', async (req, res, next) => {
  try {
    res.json(await deleteTurma(req.params.codigo_turma, ctx));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateTurma(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

router.get('/:codigo/media', async (req, res, next) => {
  try {
    res.json({ mean: await getIraMeanTurma(req.params.codigo, ctx) });
  } catch (error) {
    next(error);
  }
});

router.post('/:codigo/inscricao', async (req, res, next) => {
  try {
    res.json(
      await subscribeAlunoInTurma(req.params.codigo, req.body.matricula, ctx),
    );
  } catch (error) {
    next(error);
  }
});

export default router;
