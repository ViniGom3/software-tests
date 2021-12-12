import { Aluno, Avaliacao, Situacao } from '@prisma/client';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

describe('Test Avaliação', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(() => {
    mockPrisma.prisma.avaliacao.findUnique.mockClear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should return 200 and receive empty array', async () => {
    mockPrisma.prisma.avaliacao.findMany.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/avaliacao').expect(200);

    expect(response.body).toEqual([]);
  });
});
