import { Avaliacao, PeriodoLetivo, Situacao } from '@prisma/client';
import { Context, createMockContext, MockContext } from '../../context';
import { getIraByCurso } from '.';
import { AvaliacaoUtil } from '../../utils/aluno';

let mockCtx: MockContext;
let ctx: Context;

type AvaliacaoType = Avaliacao & AvaliacaoUtil;

describe('Test Service', () => {
  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
  });

  it('should get turma mean', async () => {
    const mockedPeriodo = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ] as PeriodoLetivo[];

    const mockedAvaliacao = [
      {
        grauFinal: 8,
        situacao: Situacao.APROVADO,
        turma: { Disciplina: { cargaHoraria: 60 } },
      },
      {
        grauFinal: 5,
        situacao: Situacao.APROVADO,
        turma: { Disciplina: { cargaHoraria: 60 } },
      },
      {
        grauFinal: 9,
        situacao: Situacao.REPROVADO_FALTAS,
        turma: { Disciplina: { cargaHoraria: 30 } },
      },
    ] as AvaliacaoType[];

    mockCtx.prisma.periodoLetivo.findMany.mockResolvedValue(mockedPeriodo);

    mockCtx.prisma.avaliacao.findMany.mockResolvedValue(mockedAvaliacao);

    const avaliacao = await getIraByCurso('1', ctx);
    expect(avaliacao).toBeCloseTo((8 * 60 + 5 * 60 + 0) / (2 * 60 + 30), 1);
  });
});
