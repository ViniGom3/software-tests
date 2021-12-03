import { Router } from 'express';
import prisma from '../prisma';
import argon2 from 'argon2';
import { Exception } from '../error';
import { calcularIra } from '../services/alunos';

export const hashing = async function (value: string) {
  return await argon2.hash(value);
};

export const verify = async function (hash: string, plaintext: string) {
  return await argon2.verify(hash, plaintext);
};

const router = Router();

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

router.post('/', async (req, res, next) => {
  try {
    const { matricula } = req.body;

    const aluno = await prisma.aluno.create({
      data: {
        matricula: matricula,
      },
    });

    res.json(aluno);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const { matricula } = req.body;

    const aluno = await prisma.aluno.delete({
      where: {
        matricula: matricula,
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
    const matriculaAluno = Number.parseInt(matricula);

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

    res.json({ IRA});
  } catch (error) {
    next(error);
  }
});

router.get('/:matricula/:id_periodo/ira', async (req, res, next) => {
  try {
    const { matricula, id_periodo } = req.params;
    const matriculaAluno = Number.parseInt(matricula);
    const periodId = Number.parseInt(id_periodo);

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

    res.json({ IRA});
  } catch (error) {
    next(error);
  }
});

export default router;