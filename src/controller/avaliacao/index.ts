import { Router } from 'express';
import { Exception } from '../../error';
import prisma from '../../prisma';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    const allAvaliacoes = await prisma.avaliacao.findMany();

    res.json(allAvaliacoes);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { matriculaAluno, codigoTurma, grauFinal, situacao } = req.body;

    const avaliacao = await prisma.avaliacao.create({
      data: {
        matriculaAluno,
        codigoTurma,
        grauFinal,
        situacao,
      },
    });

    res.json(avaliacao);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id_avaliacao', async (req, res, next) => {
  try {
    const { id_avaliacao } = req.params;
    const id = parseInt(id_avaliacao);

    let avaliacao = await prisma.avaliacao.findUnique({
      where: {
        id,
      },
    });

    if (!avaliacao) throw new Exception(404, 'Avaliação não encontrada');

    avaliacao = await prisma.avaliacao.delete({
      where: {
        id,
      },
    });

    res.json(avaliacao);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    const { id, matriculaAluno, codigoTurma, grauFinal, situacao } = req.body;

    const avaliacao = await prisma.avaliacao.update({
      where: {
        id,
      },
      data: {
        matriculaAluno,
        codigoTurma,
        grauFinal,
        situacao,
      },
    });

    res.json(avaliacao);
  } catch (error) {
    next(error);
  }
});

export default router;
