import { Turma } from '@prisma/client';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

let turma: Turma;
let turmas: Turma[] = [];

describe('Test Turma', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';

    turma = {
      codigo: 0,
      disciplinaId: 0,
      horario: '08:00 - 18:00',
      nomeProfessor: 'Professor 0',
      periodoLetivoId: 0,
      qtdVagas: 20,
    };

    turmas.push(turma);
  });

  beforeEach(() => {
    mockPrisma.prisma.turma.findUnique.mockClear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should return 200 and receive empty array', async () => {
    mockPrisma.prisma.turma.findMany.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/turma').expect(200);

    expect(response.body).toEqual([]);
  });

  it('should return 200 and receive an array with an turma', async () => {
    mockPrisma.prisma.turma.findMany.mockResolvedValueOnce(turmas);
    const response = await supertest(app).get('/turma').expect(200);

    expect(response.body[0]).toHaveProperty('codigo', 0);
    expect(response.body[0]).toHaveProperty('horario', '08:00 - 18:00');
    expect(response.body[0]).toHaveProperty('qtdVagas', 20);
  });

  it('should return 200 and create an turma', async () => {
    mockPrisma.prisma.turma.create.mockResolvedValueOnce(turma);
    const response = await supertest(app)
      .post('/turma')
      .send(turma)
      .expect(200);

    expect(response.body).toHaveProperty('codigo', 0);
    expect(response.body).toHaveProperty('horario', '08:00 - 18:00');
    expect(response.body).toHaveProperty('qtdVagas', 20);
  });

  it('should return 200 and delete an turma', async () => {
    mockPrisma.prisma.turma.findUnique.mockResolvedValueOnce(turma);
    mockPrisma.prisma.turma.delete.mockResolvedValueOnce(turma);

    const response = await supertest(app).delete('/turma/0').expect(200);

    expect(response.body).toHaveProperty('codigo', 0);
    expect(response.body).toHaveProperty('horario', '08:00 - 18:00');
    expect(response.body).toHaveProperty('qtdVagas', 20);
  });
});
