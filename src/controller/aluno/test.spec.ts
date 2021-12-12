import { Aluno } from '@prisma/client';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

describe('Test Aluno', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should return 200 and receive empty array', async () => {
    mockPrisma.prisma.aluno.findMany.mockResolvedValue([]);

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

    mockPrisma.prisma.aluno.findMany.mockResolvedValue(aluno);
    const response = await supertest(app).get('/aluno').expect(200);

    expect(response.body[0]).toHaveProperty('matricula', 0);
    expect(response.body[0]).toHaveProperty('status', 'ATIVO');
  });

  it('should return 200 and create an aluno', async () => {
    const aluno = {
      matricula: 0,
      status: 'ATIVO',
    } as Aluno;

    mockPrisma.prisma.aluno.findUnique.mockResolvedValue(null);
    mockPrisma.prisma.aluno.create.mockResolvedValue(aluno);
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

    mockPrisma.prisma.aluno.findUnique.mockResolvedValue(aluno);

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

    mockPrisma.prisma.aluno.findUnique.mockResolvedValue(aluno);
    mockPrisma.prisma.aluno.delete.mockResolvedValue(aluno);

    const response = await supertest(app).delete('/aluno/0').expect(200);

    expect(response.body).toHaveProperty('matricula', 0);
    expect(response.body).toHaveProperty('status', 'ATIVO');
  });
});
