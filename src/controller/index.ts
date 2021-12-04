import { Express } from 'express';
import { ErrorMiddleware } from '../middlewares';
import Aluno from './alunos';
import Disciplina from './disciplina';
import Avaliacao from './avaliacao';
import Turma from './turma';

export const setupRoutes = (app: Express): void => {
  app.use('/aluno', Aluno);

  app.use('/disciplina', Disciplina);

  app.use('/turma', Turma);

  app.use('/avaliacao', Avaliacao);

  // app.use("/curso", Curso);

  // app.use("/periodo_letivo", PeriodoLetivo);

  app.use(ErrorMiddleware);
};
