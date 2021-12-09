import { Router } from 'express';
import {
  createAvaliacao,
  deleteAvaliacao,
  getAllAvaliacoes,
  updateAvaliacao,
} from '../../services/avaliacao';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllAvaliacoes());
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createAvaliacao(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id_avaliacao', async (req, res, next) => {
  try {
    res.json(await deleteAvaliacao(req.params.id_avaliacao));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateAvaliacao(req.body));
  } catch (error) {
    next(error);
  }
});

export default router;
