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

  it('should return 200 and receive an array with an curso', async () => {
    mockPrisma.prisma.curso.findMany.mockResolvedValueOnce(cursos);
    const response = await supertest(app).get('/curso').expect(200);

    expect(response.body[0]).toHaveProperty('id', 0);
    expect(response.body[0]).toHaveProperty('nome', 'Curso 0');
  });

  it('should return 200 and create an curso', async () => {
    mockPrisma.prisma.curso.create.mockResolvedValueOnce(curso);
    const response = await supertest(app)
      .post('/curso')
      .send(curso)
      .expect(200);

    expect(response.body).toHaveProperty('id', 0);
    expect(response.body).toHaveProperty('nome', 'Curso 0');
  });

  it('should return 200 and delete an curso', async () => {
    mockPrisma.prisma.curso.findUnique.mockResolvedValueOnce(curso);
    mockPrisma.prisma.curso.delete.mockResolvedValueOnce(curso);

    const response = await supertest(app).delete('/curso/0').expect(200);

    expect(response.body).toHaveProperty('id', 0);
    expect(response.body).toHaveProperty('nome', 'Curso 0');
  });

  it('should return 404 and receive an message error', async () => {
    const response = await supertest(app).delete('/curso/0').expect(404);

    expect(response.body).toHaveProperty('response', 'Curso não encontrado');
  });

  it('should return 200 and update curso', async () => {
    const updatedCurso = {
      id: 0,
      nome: 'Curso 50',
      codigo: 50,
    } as Curso;

    mockPrisma.prisma.curso.findUnique.mockResolvedValueOnce(curso);
    mockPrisma.prisma.curso.update.mockResolvedValueOnce(updatedCurso);

    const response = await supertest(app)
      .patch('/curso')
      .send(curso)
      .expect(200);

    expect(response.body).toHaveProperty('id', 0);
    expect(response.body).toHaveProperty('nome', 'Curso 50');
  });

  it('should return 404 and receive an error message', async () => {
    const response = await supertest(app)
      .patch('/curso')
      .send(curso)
      .expect(404);

    expect(response.body).toHaveProperty('response', 'Curso não encontrado');
  });
});
