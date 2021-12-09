import { Situacao } from '.prisma/client';
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
import { calcularMediaTurma } from '../../utils/turma';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllTurmas());
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createTurma(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:codigo_turma', async (req, res, next) => {
  try {
    res.json(await deleteTurma(req.params.codigo_turma));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateTurma(req.body));
  } catch (error) {
    next(error);
  }
});

router.get('/:codigo/media', async (req, res, next) => {
  try {
    res.json({ mean: await getIraMeanTurma(req.params.codigo) });
  } catch (error) {
    next(error);
  }
});

router.post('/:codigo/inscricao', async (req, res, next) => {
  try {
    res.json(await subscribeAlunoInTurma(req.params.codigo, req.body.id));
  } catch (error) {
    next(error);
  }
});

export default router;
