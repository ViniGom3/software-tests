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
  it('should create 1 alunos', async () => {
    const aluno = { status: 'ATIVO' } as Aluno;

    mockCtx.prisma.aluno.findUnique.mockResolvedValue(null);
    mockCtx.prisma.aluno.create.mockResolvedValue(aluno);

    expect(await createAluno(aluno, ctx)).toEqual({ status: 'ATIVO' });
  });

  it('should create throw error when aluno is repeated', async () => {
    const aluno = { status: 'ATIVO' } as Aluno;

    mockCtx.prisma.aluno.findUnique.mockResolvedValue(aluno);

    try {
      await createAluno(aluno, ctx);
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error).toHaveProperty('message', 'Aluno já cadastrado');
      expect(error).toHaveProperty('code', 400);
    }
  });
});
