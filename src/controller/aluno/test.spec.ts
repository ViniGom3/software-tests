import { Aluno, Avaliacao, Situacao } from '@prisma/client';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

describe('Test Aluno', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(() => {
    mockPrisma.prisma.aluno.findUnique.mockClear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should return 200 and receive empty array', async () => {
    mockPrisma.prisma.aluno.findMany.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/aluno').expect(200);

    expect(response.body).toEqual([]);
  });

  it('should return 200 and receive an array with an aluno', async () => {
    const aluno = [
      {
        matricula: 0,
        status: 'ATIVO',
      },
    ] as Aluno[];

    mockPrisma.prisma.aluno.findMany.mockResolvedValueOnce(aluno);
    const response = await supertest(app).get('/aluno').expect(200);

    expect(response.body[0]).toHaveProperty('matricula', 0);
    expect(response.body[0]).toHaveProperty('status', 'ATIVO');
  });

  it('should return 200 and create an aluno', async () => {
    const aluno = {
      matricula: 0,
      status: 'ATIVO',
    } as Aluno;

    mockPrisma.prisma.aluno.create.mockResolvedValueOnce(aluno);
    const response = await supertest(app)
      .post('/aluno')
      .send(aluno)
      .expect(200);

    expect(response.body).toHaveProperty('matricula', 0);
    expect(response.body).toHaveProperty('status', 'ATIVO');
  });

  it('should return 400 and receive a message error', async () => {
    const aluno = {
      matricula: 0,
      status: 'ATIVO',
    } as Aluno;

    mockPrisma.prisma.aluno.findUnique.mockResolvedValueOnce(aluno);

    const response = await supertest(app)
      .post('/aluno')
      .send(aluno)
      .expect(400);

    expect(response.body).toHaveProperty('response', 'Aluno já cadastrado');
  });

  it('should return 200 and delete an aluno', async () => {
    const aluno = {
      matricula: 0,
      status: 'ATIVO',
    } as Aluno;

    mockPrisma.prisma.aluno.findUnique.mockResolvedValueOnce(aluno);
    mockPrisma.prisma.aluno.delete.mockResolvedValueOnce(aluno);

    const response = await supertest(app).delete('/aluno/0').expect(200);

    expect(response.body).toHaveProperty('matricula', 0);
    expect(response.body).toHaveProperty('status', 'ATIVO');
  });

  it('should return 404 and receive an message error', async () => {
    const response = await supertest(app).delete('/aluno/0').expect(404);

    expect(response.body).toHaveProperty('response', 'Aluno não encontrado');
  });

  it('should return 200 and update aluno', async () => {
    const aluno = { matricula: 0, status: 'ATIVO' } as Aluno;
    const updatedAluno = { matricula: 0, status: 'INATIVO' } as Aluno;

    mockPrisma.prisma.aluno.findUnique.mockResolvedValueOnce(aluno);
    mockPrisma.prisma.aluno.update.mockResolvedValueOnce(updatedAluno);

    const response = await supertest(app)
      .patch('/aluno')
      .send(aluno)
      .expect(200);

    expect(response.body).toHaveProperty('matricula', 0);
    expect(response.body).toHaveProperty('status', 'INATIVO');
  });

  it('should return 404 and receive an error message', async () => {
    const aluno = {} as Aluno;

    const response = await supertest(app)
      .patch('/aluno')
      .send(aluno)
      .expect(404);

    expect(response.body).toHaveProperty('response', 'Aluno não encontrado');
  });

  it('should return 200 and receive ira', async () => {
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

    const aluno = {
      matricula: 0,
      status: 'ATIVO',
    } as Aluno;

    mockPrisma.prisma.aluno.findUnique.mockResolvedValueOnce(aluno);
    mockPrisma.prisma.avaliacao.findMany.mockResolvedValueOnce(
      findedAvaliacoes,
    );

    const response = await supertest(app).get('/aluno/0/ira').expect(200);

    expect(response.body).toHaveProperty('ira', 8);
  });

  it('should return 404 and receive message error', async () => {
    const response = await supertest(app).get('/aluno/0/ira').expect(404);

    expect(response.body).toHaveProperty('response', 'Aluno não encontrado');
  });

  it('should return 200 and receive ira from aluno in periodo', async () => {
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

    const aluno = {
      matricula: 0,
      status: 'ATIVO',
    } as Aluno;

    mockPrisma.prisma.aluno.findUnique.mockResolvedValueOnce(aluno);
    mockPrisma.prisma.avaliacao.findMany.mockResolvedValueOnce(
      findedAvaliacoes,
    );

    const response = await supertest(app).get('/aluno/0/0/ira').expect(200);

    expect(response.body).toHaveProperty('ira', 8);
  });
});
