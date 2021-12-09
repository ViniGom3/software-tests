import { Router } from 'express';
import { Exception } from '../../error';
import prisma from '../../prisma';
import { calcularIra } from '../../services/alunos';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    const allCursos = await prisma.curso.findMany();

    res.json(allCursos);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { nome, codigo } = req.body;

    const curso = await prisma.curso.create({
      data: {
        nome,
        codigo,
      },
    });

    res.json(curso);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id_curso', async (req, res, next) => {
  try {
    const { id_curso } = req.params;
    const id = parseInt(id_curso);

    let curso = await prisma.curso.findUnique({
      where: {
        id,
      },
    });

    if (!curso) throw new Exception(404, 'Curso não encontrado');

    curso = await prisma.curso.delete({
      where: {
        id,
      },
    });

    res.json(curso);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    const { id, nome, codigo } = req.body;

    const curso = await prisma.curso.update({
      where: {
        id,
      },
      data: {
        nome,
        codigo,
      },
    });

    res.json(curso);
  } catch (error) {
    next(error);
  }
});

router.get('/:id_curso/ira', async (req, res, next) => {
  try {
    const { id_curso } = req.params;
    const id = parseInt(id_curso);

    const ultimosPeriodosLetivos = await prisma.periodoLetivo.findMany({
      orderBy: {
        dataFim: 'desc',
      },
      take: 4,
      select: {
        id: true,
      },
    });

    const ultimosPeriodosLetivosIds = ultimosPeriodosLetivos.map(
      periodos => periodos.id,
    );

    const turmasDoCursoNosUltimosPeriodos = await prisma.avaliacao.findMany({
      where: {
        aluno: {
          cursoId: id,
        },
        turma: {
          periodoLetivoId: {
            in: ultimosPeriodosLetivosIds,
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

    const IRA = calcularIra(turmasDoCursoNosUltimosPeriodos);

    res.json({ IRA });
  } catch (error) {
    next(error);
  }
});

export default router;
