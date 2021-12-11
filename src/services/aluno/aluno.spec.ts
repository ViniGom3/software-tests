import { Aluno } from '@prisma/client';
import { Context, createMockContext, MockContext } from '../../context';
import {
  getAllAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno,
  getIraByAluno,
  getIraByPeriod,
} from '.';

let mockCtx: MockContext;
let ctx: Context;

describe('Test Service', () => {
  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
  });

  it('should get []', async () => {
    const mockedAluno = [] as Aluno[];

    mockCtx.prisma.aluno.findMany.mockResolvedValue(mockedAluno);

    const alunos = await getAllAlunos(ctx);
    expect(alunos).toHaveLength(0);

    expect(alunos).toBeTruthy();
  });
  it('should get 2 alunos', async () => {
    const mockedAluno = [{ status: 'ATIVO' }, { status: 'ATIVO' }] as Aluno[];

    mockCtx.prisma.aluno.findMany.mockResolvedValue(mockedAluno);

    const alunos = await getAllAlunos(ctx);
    expect(alunos).toHaveLength(2);
  });
});
