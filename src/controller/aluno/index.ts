import { Router } from 'express';
import prisma from '../../prisma';
import { Exception } from '../../error';
import { calcularIra } from '../../utils/alunos';
import {
  createAluno,
  deleteAluno,
  getAllAlunos,
  getAlunoById,
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
    const { matricula, cursoId } = req.body;

    if (!matricula)
      throw new Exception(400, 'O parametro "matricula" é obrigatorio');

    if (!cursoId)
      throw new Exception(400, 'O parametro "cursoId" é obrigatorio');

    const aluno = await prisma.aluno.update({
      where: {
        matricula: matricula,
      },
      data: {
        cursoId: cursoId,
      },
    });

    res.json(aluno);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_, res, next) => {
  try {
    const allAlunos = await prisma.aluno.findMany({
      select: {
        matricula: true,
      },
    });

    res.json(allAlunos);
  } catch (error) {
    next(error);
  }
});

router.get('/:matricula/ira', async (req, res, next) => {
  try {
    const { matricula } = req.params;
    const matriculaAluno = parseInt(matricula);

    const avaliacao = await prisma.avaliacao.findMany({
      where: {
        matriculaAluno: matriculaAluno,
      },
      select: {
        grauFinal: true,
        situacao: true,
        turma: {
          select: {
            Disciplina: {
              select: {
                cargaHoraria: true,
              },
            },
          },
        },
      },
    });

    const IRA = calcularIra(avaliacao);

    res.json({ IRA });
  } catch (error) {
    next(error);
  }
});

router.get('/:matricula/:id_periodo/ira', async (req, res, next) => {
  try {
    const { matricula, id_periodo } = req.params;
    const matriculaAluno = parseInt(matricula);
    const periodId = parseInt(id_periodo);

    const avaliacao = await prisma.avaliacao.findMany({
      where: {
        matriculaAluno: matriculaAluno,
        turma: {
          periodoLetivo: {
            id: periodId,
          },
        },
      },
      select: {
        grauFinal: true,
        situacao: true,
        turma: {
          select: {
            Disciplina: {
              select: {
                cargaHoraria: true,
              },
            },
          },
        },
      },
    });

    const IRA = calcularIra(avaliacao);

    res.json({ IRA });
  } catch (error) {
    next(error);
  }
});

export default router;
