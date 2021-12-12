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
});
