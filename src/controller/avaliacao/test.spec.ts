import { Avaliacao } from '@prisma/client';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

let avaliacao: Avaliacao;
let avaliacoes: Avaliacao[] = [];

describe('Test Avaliação', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';

    avaliacao = {
      id: 0,
      matriculaAluno: 0,
      codigoTurma: 0,
      grauFinal: 0,
      situacao: 'APROVADO',
    } as Avaliacao;

    avaliacoes.push(avaliacao);
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

  it('should return 200 and receive an array with an avaliacao', async () => {
    mockPrisma.prisma.avaliacao.findMany.mockResolvedValueOnce(avaliacoes);
    const response = await supertest(app).get('/avaliacao').expect(200);

    expect(response.body[0]).toHaveProperty('id', 0);
    expect(response.body[0]).toHaveProperty('situacao', 'APROVADO');
  });

  it('should return 200 and create an aluno', async () => {
    mockPrisma.prisma.avaliacao.create.mockResolvedValueOnce(avaliacao);
    const response = await supertest(app)
      .post('/avaliacao')
      .send(avaliacao)
      .expect(200);

    expect(response.body).toHaveProperty('id', 0);
    expect(response.body).toHaveProperty('situacao', 'APROVADO');
  });
});
