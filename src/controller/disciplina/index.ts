import { Router } from 'express';
import { ctx } from '../.';
import {
  createDisciplina,
  deleteDisciplina,
  getAllDisciplinas,
  updateDisciplina,
} from '../../services/disciplina';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllDisciplinas(ctx));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createDisciplina(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

router.delete('/:codigo_disciplina', async (req, res, next) => {
  try {
    res.json(await deleteDisciplina(req.params.codigo_disciplina, ctx));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateDisciplina(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

export default router;
