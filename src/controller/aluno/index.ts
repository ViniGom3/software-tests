import { Router } from 'express';
import prisma from '../../prisma';
import {
  createAluno,
  deleteAluno,
  getAllAlunos,
  getIraByAluno,
  getIraByPeriod,
  updateAluno,
} from '../../services/aluno';

const ctx = {
  prisma,
};

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(await getAllAlunos(ctx));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await createAluno(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

router.delete('/:matricula_aluno', async (req, res, next) => {
  try {
    res.json(await deleteAluno(req.params.matricula_aluno, ctx));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    res.json(await updateAluno(req.body, ctx));
  } catch (error) {
    next(error);
  }
});

router.get('/:matricula/ira', async (req, res, next) => {
  try {
    res.json(await getIraByAluno(req.params.matricula, ctx));
  } catch (error) {
    next(error);
  }
});

router.get('/:matricula/:id_periodo/ira', async (req, res, next) => {
  try {
    res.json(
      await getIraByPeriod(req.params.matricula, req.params.id_periodo, ctx),
    );
  } catch (error) {
    next(error);
  }
});

export default router;
function Context(ctx: any, Context: any) {
  throw new Error('Function not implemented.');
}
