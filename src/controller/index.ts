import { Express } from 'express';
import { ErrorMiddleware } from '../middlewares';

import Aluno from './aluno';
import Disciplina from './disciplina';
import Avaliacao from './avaliacao';
import Turma from './turma';
import Curso from './curso';
import PeriodoLetivo from './periodo';
import { Context, createContext, createMockContext } from '../context';

export const mockPrismaContext = createMockContext();
export const prismaContext = createContext();

export const ctx: Context =
  process.env.NODE_ENV === 'test' ? mockPrismaContext : prismaContext;

export const setupRoutes = (app: Express): void => {
  app.use('/aluno', Aluno);

  app.use('/disciplina', Disciplina);

  app.use('/turma', Turma);

  app.use('/avaliacao', Avaliacao);

  app.use('/curso', Curso);

  app.use('/periodo', PeriodoLetivo);

  app.use(ErrorMiddleware);
};
