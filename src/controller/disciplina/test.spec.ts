import { Disciplina } from '@prisma/client';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

let disciplina: Disciplina;
let disciplinas: Disciplina[] = [];

describe('Test Disciplina', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';

    disciplina = {
      codigo: 0,
      nome: 'Linguagem de Programação 1',
      cargaHoraria: 60,
      nomeDepartamento: 'Departamento de Computação',
      nivel: 'BACHARELADO',
    };

    disciplinas.push(disciplina);
  });

  beforeEach(() => {
    mockPrisma.prisma.disciplina.findUnique.mockClear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should return 200 and receive empty array', async () => {
    mockPrisma.prisma.disciplina.findMany.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/disciplina').expect(200);

    expect(response.body).toEqual([]);
  });

  it('should return 200 and receive an array with an disciplina', async () => {
    mockPrisma.prisma.disciplina.findMany.mockResolvedValueOnce(disciplinas);
    const response = await supertest(app).get('/disciplina').expect(200);

    expect(response.body[0]).toHaveProperty('codigo', 0);
    expect(response.body[0]).toHaveProperty(
      'nome',
      'Linguagem de Programação 1',
    );
  });

  it('should return 200 and create an disciplina', async () => {
    mockPrisma.prisma.disciplina.create.mockResolvedValueOnce(disciplina);
    const response = await supertest(app)
      .post('/disciplina')
      .send(disciplina)
      .expect(200);

    expect(response.body).toHaveProperty('codigo', 0);
    expect(response.body).toHaveProperty('nome', 'Linguagem de Programação 1');
  });
});
