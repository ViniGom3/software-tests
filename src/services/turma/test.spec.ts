import { Avaliacao, Disciplina, Situacao, Turma } from '@prisma/client';
import { Context, createMockContext, MockContext } from '../../context';
import { getIraMeanTurma, subscribeAlunoInTurma } from '.';

let mockCtx: MockContext;
let ctx: Context;

export type TurmaType = Turma & {
  Avaliacao: Pick<Avaliacao, 'matriculaAluno'>[];
  Disciplina: {
    preRequisitos: Disciplina[];
  };
};

describe('Test Turma Service', () => {
  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
  });

  it('should get turma mean', async () => {
    const mockedAvaliacao = [
      {
        matriculaAluno: 1,
        codigoTurma: 1,
        grauFinal: 10,
        situacao: Situacao.APROVADO,
      },
      {
        matriculaAluno: 2,
        codigoTurma: 2,
        grauFinal: 5,
        situacao: Situacao.APROVADO,
      },
      {
        matriculaAluno: 3,
        codigoTurma: 3,
        grauFinal: 7,
        situacao: Situacao.REPROVADO_NOTA,
      },
    ] as Avaliacao[];

    mockCtx.prisma.avaliacao.findMany.mockResolvedValue(mockedAvaliacao);

    const avaliacao = await getIraMeanTurma('1', ctx);
    expect(avaliacao).toBeCloseTo(7.3, 1);
  });

  it('should subscribe aluno in turma', async () => {
    const mockedNeededPreRequisitos = {
      Avaliacao: [
        {
          matriculaAluno: 1,
        },
        { matriculaAluno: 2 },
        { matriculaAluno: 3 },
      ],
      Disciplina: {
        preRequisitos: [{ codigo: 1 }, { codigo: 2 }, { codigo: 3 }],
      },
      qtdVagas: 20,
    } as TurmaType;

    const subscribeInTurma = { matriculaAluno: 1, codigoTurma: 1 } as Avaliacao;

    mockCtx.prisma.turma.findUnique.mockResolvedValue(
      mockedNeededPreRequisitos,
    );
    mockCtx.prisma.avaliacao.count.mockResolvedValue(
      mockedNeededPreRequisitos.Disciplina.preRequisitos.length,
    );
    mockCtx.prisma.avaliacao.findFirst.mockResolvedValue(null);

    mockCtx.prisma.avaliacao.create.mockResolvedValue(subscribeInTurma);

    expect(await subscribeAlunoInTurma('1', 1, ctx)).toEqual({
      matriculaAluno: 1,
      codigoTurma: 1,
    });
  });

  it('should throw error when aluno already approved in this disciplina', async () => {
    const mockedNeededPreRequisitos = {
      Avaliacao: [
        {
          matriculaAluno: 1,
        },
        { matriculaAluno: 2 },
        { matriculaAluno: 3 },
      ],
      Disciplina: {
        preRequisitos: [{ codigo: 1 }, { codigo: 2 }, { codigo: 3 }],
      },
      qtdVagas: 20,
    } as TurmaType;

    const alreadyApproved = { matriculaAluno: 1, codigoTurma: 1 } as Avaliacao;

    mockCtx.prisma.turma.findUnique.mockResolvedValue(
      mockedNeededPreRequisitos,
    );
    mockCtx.prisma.avaliacao.count.mockResolvedValue(
      mockedNeededPreRequisitos.Disciplina.preRequisitos.length,
    );
    mockCtx.prisma.avaliacao.findFirst.mockResolvedValue(alreadyApproved);

    try {
      await subscribeAlunoInTurma('1', 1, ctx);
    } catch (error) {
      expect(error).toHaveProperty(
        'message',
        'Aluno já está aprovado nesta disciplina',
      );
      expect(error).toHaveProperty('code', 400);
    }
  });

  it('should throw error when turma there are no vacancy', async () => {
    const mockedNeededPreRequisitos = {
      Avaliacao: [
        {
          matriculaAluno: 1,
        },
        { matriculaAluno: 2 },
        { matriculaAluno: 3 },
      ],
      Disciplina: {
        preRequisitos: [{ codigo: 1 }, { codigo: 2 }, { codigo: 3 }],
      },
      qtdVagas: 2,
    } as TurmaType;

    mockCtx.prisma.turma.findUnique.mockResolvedValue(
      mockedNeededPreRequisitos,
    );
    mockCtx.prisma.avaliacao.count.mockResolvedValue(
      mockedNeededPreRequisitos.Disciplina.preRequisitos.length,
    );
    mockCtx.prisma.avaliacao.findFirst.mockResolvedValue(null);

    try {
      await subscribeAlunoInTurma('1', 1, ctx);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Turma lotada');
      expect(error).toHaveProperty('code', 400);
    }
  });

  it('should throw error when turma there are no vacancy', async () => {
    const mockedNeededPreRequisitos = {
      Avaliacao: [
        {
          matriculaAluno: 1,
        },
        { matriculaAluno: 2 },
      ],
      Disciplina: {
        preRequisitos: [{ codigo: 1 }, { codigo: 2 }, { codigo: 3 }],
      },
      qtdVagas: 20,
    } as TurmaType;

    mockCtx.prisma.turma.findUnique.mockResolvedValue(
      mockedNeededPreRequisitos,
    );
    mockCtx.prisma.avaliacao.count.mockResolvedValue(
      mockedNeededPreRequisitos.Avaliacao.length,
    );

    try {
      await subscribeAlunoInTurma('1', 1, ctx);
    } catch (error) {
      expect(error).toHaveProperty(
        'message',
        'Aluno não está apto para a turma',
      );
      expect(error).toHaveProperty('code', 400);
    }
  });

  it('should throw error when turma is not found', async () => {
    try {
      await subscribeAlunoInTurma('1', 1, ctx);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Turma não encontrada');
      expect(error).toHaveProperty('code', 404);
    }
  });
});
