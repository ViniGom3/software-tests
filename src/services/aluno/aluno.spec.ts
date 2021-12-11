import { Aluno, Avaliacao, Situacao } from '@prisma/client';
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
import { AvaliacaoUtil } from '../../utils/aluno';

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
      expect(error).toHaveProperty('message', 'Aluno já cadastrado');
      expect(error).toHaveProperty('code', 400);
    }
  });

  it('should delete an existing aluno', async () => {
    const aluno = { matricula: 1, status: 'ATIVO' } as Aluno;

    mockCtx.prisma.aluno.findUnique.mockResolvedValue(aluno);
    mockCtx.prisma.aluno.delete.mockResolvedValue(aluno);

    expect(await deleteAluno('1', ctx)).toEqual({
      matricula: 1,
      status: 'ATIVO',
    });
  });

  it('should throw error when aluno is not exist', async () => {
    mockCtx.prisma.aluno.findUnique.mockResolvedValue(null);

    try {
      await deleteAluno('1', ctx);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Aluno não encontrado');
      expect(error).toHaveProperty('code', 404);
    }
  });

  it('should update an existing aluno', async () => {
    const alunoBeforeUpdate = { matricula: 1, status: 'ATIVO' } as Aluno;
    const aluno = { matricula: 1, status: 'INATIVO' } as Aluno;

    mockCtx.prisma.aluno.findUnique.mockResolvedValue(alunoBeforeUpdate);
    mockCtx.prisma.aluno.update.mockResolvedValue(aluno);

    expect(await updateAluno(aluno, ctx)).toEqual({
      matricula: 1,
      status: 'INATIVO',
    });
  });

  it('should throw error when aluno is not exist', async () => {
    const alunoBeforeUpdate = { matricula: 1, status: 'ATIVO' } as Aluno;

    mockCtx.prisma.aluno.findUnique.mockResolvedValue(null);

    try {
      await updateAluno(alunoBeforeUpdate, ctx);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Aluno não encontrado');
      expect(error).toHaveProperty('code', 404);
    }
  });

  it('should get ira from aluno', async () => {
    const findedAvaliacoes = [
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 8,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 10,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 9,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 6,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 7,
        situacao: Situacao.APROVADO,
      },
    ] as unknown as Avaliacao[];

    const aluno = { matricula: 1, status: 'INATIVO' } as Aluno;

    mockCtx.prisma.aluno.findUnique.mockResolvedValue(aluno);
    mockCtx.prisma.avaliacao.findMany.mockResolvedValue(findedAvaliacoes);

    expect(await getIraByAluno('1', ctx)).toEqual({ ira: 8 });
  });
});
