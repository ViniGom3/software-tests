import { Curso } from '@prisma/client';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';

let curso: Curso;
let cursos: Curso[] = [];

describe('Test Curso', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';

    curso = {
      id: 0,
      nome: 'Curso 0',
      codigo: 0,
    } as Curso;

    cursos.push(curso);
  });

  beforeEach(() => {
    mockPrisma.prisma.curso.findUnique.mockClear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should return 200 and receive empty array', async () => {
    mockPrisma.prisma.curso.findMany.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/curso').expect(200);

    expect(response.body).toEqual([]);
  });
});
