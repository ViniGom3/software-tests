import { Router } from 'express';
import {
  createDisciplina,
  deleteDisciplina,
  getAllDisciplinas,
  updateDisciplina,
} from '../../services/disciplina';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllDisciplinas());
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createDisciplina(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:codigo_disciplina', async (req, res, next) => {
  try {
    res.json(await deleteDisciplina(req.params.codigo_disciplina));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateDisciplina(req.body));
  } catch (error) {
    next(error);
  }
});

export default router;
