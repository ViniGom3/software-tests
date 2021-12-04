import { Router } from 'express';
import prisma from '../prisma';
import { Exception } from '../error';
import { calcularIra } from '../services/alunos';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    const allAlunos = await prisma.aluno.findMany();

    res.json(allAlunos);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { matricula } = req.body;

    if (!matricula)
      throw new Exception(400, 'O parametro "matricula" é obrigatorio');

    let aluno = await prisma.aluno.findUnique({
      where: {
        matricula,
      },
    });

    if (aluno) {
      res.json(aluno);
      return;
    }

    aluno = await prisma.aluno.create({
      data: {
        matricula: matricula,
      },
    });

    res.json(aluno);
  } catch (error) {
    next(error);
  }
});

router.delete('/:matricula_aluno', async (req, res, next) => {
  try {
    const { matricula_aluno } = req.params;

    if (!matricula_aluno)
      throw new Exception(400, 'O parametro "matricula" é obrigatorio');

    const matricula = parseInt(matricula_aluno);

    let aluno = await prisma.aluno.findUnique({
      where: {
        matricula,
      },
    });

    if (!aluno) throw new Exception(404, 'Aluno não encontrado');

    aluno = await prisma.aluno.delete({
      where: {
        matricula,
      },
    });

    res.json(aluno);
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
