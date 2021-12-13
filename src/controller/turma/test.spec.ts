import { Avaliacao, Turma } from '@prisma/client';
import { response } from 'express';
import supertest from 'supertest';
import { mockPrismaContext as mockPrisma } from '..';
import { app } from '../..';
import { TurmaType } from '../../services/turma/test.spec';

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

  it('should return 404 and receive an message error', async () => {
    const response = await supertest(app).delete('/turma/0').expect(404);

    expect(response.body).toHaveProperty('response', 'Turma não encontrada');
  });

  it('should return 200 and update turma', async () => {
    const updatedCurso = {
      codigo: 0,
      disciplinaId: 0,
      horario: '12:00 - 18:00',
      nomeProfessor: 'Professor 0',
      periodoLetivoId: 0,
      qtdVagas: 10,
    } as Turma;

    mockPrisma.prisma.turma.findUnique.mockResolvedValueOnce(turma);
    mockPrisma.prisma.turma.update.mockResolvedValueOnce(updatedCurso);

    const response = await supertest(app)
      .patch('/turma')
      .send(turma)
      .expect(200);

    expect(response.body).toHaveProperty('codigo', 0);
    expect(response.body).toHaveProperty('horario', '12:00 - 18:00');
    expect(response.body).toHaveProperty('qtdVagas', 10);
  });

  it('should return 404 and receive an error message', async () => {
    const response = await supertest(app)
      .patch('/turma')
      .send(turma)
      .expect(404);

    expect(response.body).toHaveProperty('response', 'Turma não encontrada');
  });

  it('should return 200 and ira from turma', async () => {
    const turmaWithGrauFinal = [
      {
        grauFinal: 10,
      },
      {
        grauFinal: 5,
      },
      {
        grauFinal: 7,
      },
    ] as unknown as Avaliacao[];

    mockPrisma.prisma.avaliacao.findMany.mockResolvedValueOnce(
      turmaWithGrauFinal,
    );

    const response = await supertest(app)
      .get('/turma/0/media')
      .send(turma)
      .expect(200);

    expect(response.body.mean).toBeCloseTo(7.3, 1);
  });

  it('should return 200 and subscribe aluno in turma', async () => {
    const mockedNeededPreRequisitos = {
      Avaliacao: [
        {
          matriculaAluno: 1,
        },
        { matriculaAluno: 2 },
        { matriculaAluno: 3 },
      ],
      Disciplina: {
        preRequisitos: [{ codigo: 1 }, { codigo: 2 }, { codigo: 3 }],
      },
      qtdVagas: 20,
    } as TurmaType;

    const subscribeInTurma = { matriculaAluno: 1, codigoTurma: 1 } as Avaliacao;

    mockPrisma.prisma.turma.findUnique.mockResolvedValue(
      mockedNeededPreRequisitos,
    );
    mockPrisma.prisma.avaliacao.count.mockResolvedValue(
      mockedNeededPreRequisitos.Disciplina.preRequisitos.length,
    );
    mockPrisma.prisma.avaliacao.create.mockResolvedValue(subscribeInTurma);

    const response = await supertest(app)
      .post('/turma/0/inscricao')
      .send(turma)
      .expect(200);

    expect(response.body).toHaveProperty('matriculaAluno', 1);
    expect(response.body).toHaveProperty('codigoTurma', 1);
  });
});
