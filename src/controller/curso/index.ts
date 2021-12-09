import { Router } from 'express';
import {
  createCurso,
  deleteCurso,
  getAllCursos,
  getIraByCurso,
  updateCurso,
} from '../../services/curso';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllCursos());
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createCurso(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id_curso', async (req, res, next) => {
  try {
    res.json(await deleteCurso(req.params.id_curso));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateCurso(req.body));
  } catch (error) {
    next(error);
  }
});

router.get('/:id_curso/ira', async (req, res, next) => {
  try {
    res.json({ ira: await getIraByCurso(req.params.id_curso) });
  } catch (error) {
    next(error);
  }
});

export default router;
