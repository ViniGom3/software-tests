import { Avaliacao, Situacao } from '@prisma/client';
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

  it('should return 200 and create an avaliacao', async () => {
    mockPrisma.prisma.avaliacao.create.mockResolvedValueOnce(avaliacao);
    const response = await supertest(app)
      .post('/avaliacao')
      .send(avaliacao)
      .expect(200);

    expect(response.body).toHaveProperty('id', 0);
    expect(response.body).toHaveProperty('situacao', 'APROVADO');
  });

  it('should return 200 and delete an avaliacao', async () => {
    mockPrisma.prisma.avaliacao.findUnique.mockResolvedValueOnce(avaliacao);
    mockPrisma.prisma.avaliacao.delete.mockResolvedValueOnce(avaliacao);

    const response = await supertest(app).delete('/avaliacao/0').expect(200);

    expect(response.body).toHaveProperty('id', 0);
    expect(response.body).toHaveProperty('situacao', 'APROVADO');
  });

  it('should return 404 and receive an message error', async () => {
    const response = await supertest(app).delete('/avaliacao/0').expect(404);

    expect(response.body).toHaveProperty(
      'response',
      'Avaliacao não encontrada',
    );
  });

  it('should return 200 and update avaliacao', async () => {
    const updatedAvaliacao = {
      id: 0,
      matriculaAluno: 0,
      codigoTurma: 0,
      grauFinal: 0,
      situacao: Situacao.REPROVADO_FALTAS,
    } as Avaliacao;

    mockPrisma.prisma.avaliacao.findUnique.mockResolvedValueOnce(avaliacao);
    mockPrisma.prisma.avaliacao.update.mockResolvedValueOnce(updatedAvaliacao);

    const response = await supertest(app)
      .patch('/avaliacao')
      .send(avaliacao)
      .expect(200);

    expect(response.body).toHaveProperty('id', 0);
    expect(response.body).toHaveProperty('situacao', 'REPROVADO_FALTAS');
  });
});
