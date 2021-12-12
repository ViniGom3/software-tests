import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

describe('Test Aluno', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });
  afterAll(async () => {});
  it('should return 200 and receive empty array', async () => {
    mockPrisma.prisma.aluno.findMany.mockResolvedValue([]);

    const response = await supertest(app).get('/aluno').expect(200);

    expect(response.body).toEqual([]);
  });
});
