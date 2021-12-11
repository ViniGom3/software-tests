import { Router } from 'express';
import prisma from '../../prisma';
import {
  createPeriodo,
  deletePeriodo,
  getAllPeriodos,
  updatePeriodo,
} from '../../services/periodo';

const ctx = {
  prisma,
};

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllPeriodos(ctx));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createPeriodo(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id_periodo_letivo', async (req, res, next) => {
  try {
    res.json(await deletePeriodo(req.params.id_periodo_letivo, ctx));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updatePeriodo(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

export default router;
