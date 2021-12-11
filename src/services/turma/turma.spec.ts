import { Aluno, Avaliacao, Situacao } from '@prisma/client';
import { Context, createMockContext, MockContext } from '../../context';
import { getIraMeanTurma, subscribeAlunoInTurma } from '.';

let mockCtx: MockContext;
let ctx: Context;

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
});
