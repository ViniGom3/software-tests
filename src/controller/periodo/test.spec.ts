import { PeriodoLetivo } from '@prisma/client';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

let periodo: PeriodoLetivo;
let periodos: PeriodoLetivo[] = [];

describe('Test PeriodoLetivo', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';

    periodo = {
      id: 0,
      dataInicio: new Date(),
      dataFim: new Date(),
      status: 'ATIVO',
    };

    periodos.push(periodo);
  });

  beforeEach(() => {
    mockPrisma.prisma.periodoLetivo.findUnique.mockClear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should return 200 and receive empty array', async () => {
    mockPrisma.prisma.periodoLetivo.findMany.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/periodo').expect(200);

    expect(response.body).toEqual([]);
  });

  it('should return 200 and receive an array with an periodo', async () => {
    mockPrisma.prisma.periodoLetivo.findMany.mockResolvedValueOnce(periodos);
    const response = await supertest(app).get('/periodo').expect(200);

    expect(response.body[0]).toHaveProperty('id', 0);
    expect(response.body[0]).toHaveProperty('status', 'ATIVO');
  });

  it('should return 200 and create an periodo', async () => {
    mockPrisma.prisma.periodoLetivo.create.mockResolvedValueOnce(periodo);
    const response = await supertest(app)
      .post('/periodo')
      .send(periodo)
      .expect(200);

    expect(response.body).toHaveProperty('id', 0);
    expect(response.body).toHaveProperty('status', 'ATIVO');
  });

  it('should return 400 and receive a message error', async () => {
    const now = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const periodoBug = {
      id: 0,
      dataInicio: now,
      dataFim: yesterday,
      status: 'ATIVO',
    } as PeriodoLetivo;

    const response = await supertest(app)
      .post('/periodo')
      .send(periodoBug)
      .expect(400);

    expect(response.body).toHaveProperty(
      'response',
      'Data de início não pode ser maior que a data de fim',
    );
  });
});
