import { Router } from 'express';
import prisma from '../../prisma';
import {
  createAvaliacao,
  deleteAvaliacao,
  getAllAvaliacoes,
  updateAvaliacao,
} from '../../services/avaliacao';

const ctx = {
  prisma,
};

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllAvaliacoes(ctx));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createAvaliacao(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id_avaliacao', async (req, res, next) => {
  try {
    res.json(await deleteAvaliacao(req.params.id_avaliacao, ctx));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateAvaliacao(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

export default router;
