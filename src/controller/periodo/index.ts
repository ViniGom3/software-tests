import { Router } from 'express';
import {
  createPeriodo,
  deletePeriodo,
  getAllPeriodos,
  updatePeriodo,
} from '../../services/periodo';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllPeriodos());
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createPeriodo(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id_periodo_letivo', async (req, res, next) => {
  try {
    res.json(await deletePeriodo(req.params.id_periodo_letivo));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updatePeriodo(req.body));
  } catch (error) {
    next(error);
  }
});

export default router;
