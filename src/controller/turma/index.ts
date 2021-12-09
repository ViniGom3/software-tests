import { Situacao } from '.prisma/client';
import { Router } from 'express';
import prisma from '../../prisma';
import { calcularMediaTurma } from '../../services/turma';

const router = Router();

router.get('/', async (_, res, next) => {
  try {
    const allturmas = await prisma.turma.findMany();

    res.json(allturmas);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      codigo,
      nomeProfessor,
      periodoLetivoId,
      disciplinaId,
      horario,
      qtdVagas,
    } = req.body;

    const turma = await prisma.turma.create({
      data: {
        codigo,
        nomeProfessor,
        periodoLetivoId,
        horario,
        disciplinaId,
        qtdVagas,
      },
    });

    res.json(turma);
  } catch (error) {
    next(error);
  }
});

router.delete('/:codigo_turma', async (req, res, next) => {
  try {
    const { codigo_turma } = req.params;
    const codigo = parseInt(codigo_turma);

    const turma = await prisma.turma.delete({
      where: {
        codigo,
      },
    });

    res.json(turma);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    const {
      codigo,
      nomeProfessor,
      periodoLetivoId,
      disciplinaId,
      horario,
      qtdVagas,
    } = req.body;

    const turma = await prisma.turma.update({
      where: {
        codigo,
      },
      data: {
        nomeProfessor,
        periodoLetivoId,
        horario,
        disciplinaId,
        qtdVagas,
      },
    });

    res.json(turma);
  } catch (error) {
    next(error);
  }
});

router.get('/:codigo/media', async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const codigoTurma = parseInt(codigo);

    const allTurma = await prisma.avaliacao.findMany({
      where: {
        codigoTurma,
        situacao: {
          not: Situacao.REPROVADO_FALTAS,
        },
      },
    });

    const MEDIA = calcularMediaTurma(allTurma);

    res.json({ MEDIA });
  } catch (error) {
    next(error);
  }
});

router.post('/:codigo/inscricao', async (req, res, next) => {
  try {
    const { matricula } = req.body;
    const { codigo } = req.params;
    const codigoTurma = parseInt(codigo);

    const turma = await prisma.turma.findUnique({
      where: {
        codigo: codigoTurma,
      },
      include: {
        Disciplina: {
          include: {
            preRequisitos: true,
          },
        },
      },
    });

    const preRequisitos = turma?.Disciplina.preRequisitos;
    const preRequisitoCodigos = preRequisitos?.map(
      preRequisito => preRequisito.codigo,
    );

    const numberOfPreRequisitoApproved = await prisma.avaliacao.count({
      where: {
        matriculaAluno: matricula,
        turma: {
          disciplinaId: {
            in: preRequisitoCodigos,
          },
        },
        situacao: Situacao.APROVADO,
      },
    });

    const isAlunoApprovedInAllPreRequisito =
      numberOfPreRequisitoApproved === preRequisitoCodigos?.length;

    const disciplinaId = turma?.Disciplina.codigo;

    const alreadyApprovedInDisciplina = await prisma.avaliacao.findFirst({
      where: {
        matriculaAluno: matricula,
        turma: {
          Disciplina: {
            codigo: disciplinaId,
          },
        },
        situacao: {
          equals: Situacao.APROVADO,
        },
      },
      select: {
        id: true,
      },
    });

    const vacanciesInTurma = await prisma.turma.findUnique({
      where: {
        codigo: codigoTurma,
      },
      select: {
        qtdVagas: true,
        Avaliacao: {
          select: {
            matriculaAluno: true,
          },
        },
      },
    });

    const isVacancy =
      vacanciesInTurma &&
      vacanciesInTurma.Avaliacao.length < vacanciesInTurma.qtdVagas;

    let alunoInTurma;
    if (
      isVacancy &&
      isAlunoApprovedInAllPreRequisito &&
      !alreadyApprovedInDisciplina
    ) {
      alunoInTurma = await prisma.avaliacao.create({
        data: {
          matriculaAluno: matricula,
          codigoTurma,
        },
      });
    }

    res.json(alunoInTurma);
  } catch (error) {
    next(error);
  }
});

export default router;
