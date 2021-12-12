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
});
