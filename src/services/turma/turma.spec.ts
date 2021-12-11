import { Aluno, Avaliacao, Disciplina, Situacao, Turma } from '@prisma/client';
import { Context, createMockContext, MockContext } from '../../context';
import { getIraMeanTurma, subscribeAlunoInTurma } from '.';

let mockCtx: MockContext;
let ctx: Context;

type TurmaType = Turma & {
  Avaliacao: Pick<Avaliacao, 'matriculaAluno'>[];
  Disciplina: {
    preRequisitos: Disciplina[];
  };
};

describe('Test Service', () => {
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

    mockCtx.prisma.turma.findUnique.mockResolvedValueOnce(
      mockedNeededPreRequisitos,
    );
    mockCtx.prisma.avaliacao.count.mockResolvedValue(
      mockedNeededPreRequisitos.Disciplina.preRequisitos.length,
    );
    mockCtx.prisma.avaliacao.findFirst.mockResolvedValue(null);

    mockCtx.prisma.turma.findUnique.mockResolvedValueOnce(
      mockedNeededPreRequisitos,
    );

    mockCtx.prisma.avaliacao.create.mockResolvedValueOnce(subscribeInTurma);

    const avaliacao = await subscribeAlunoInTurma('1', 1, ctx);

    expect(avaliacao).toEqual({ matriculaAluno: 1, codigoTurma: 1 });
  });
});
