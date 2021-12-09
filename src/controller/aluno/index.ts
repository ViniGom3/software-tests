import { Router } from 'express';
import {
  createAluno,
  deleteAluno,
  getAllAlunos,
  getIraByAluno,
  getIraByPeriod,
  updateAluno,
} from '../../services/aluno';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllAlunos());
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createAluno(req.body));
  } catch (error) {
    next(error);
  }
});

router.delete('/:matricula_aluno', async (req, res, next) => {
  try {
    res.json(await deleteAluno(req.params.matricula_aluno));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateAluno(req.body));
  } catch (error) {
    next(error);
  }
});

router.get('/:matricula/ira', async (req, res, next) => {
  try {
    res.json(await getIraByAluno(req.params.matricula));
  } catch (error) {
    next(error);
  }
});

router.get('/:matricula/:id_periodo/ira', async (req, res, next) => {
  try {
    res.json(await getIraByPeriod(req.params.matricula, req.params.id_periodo));
  } catch (error) {
    next(error);
  }
});

export default router;
