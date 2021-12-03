import { Express } from 'express';
import { ErrorMiddleware } from '../middlewares';
import Aluno from './alunos';
import Disciplina from './disciplina';
import Turma from './turma';

export const setupRoutes = (app: Express): void => {
  app.use('/aluno', Aluno);

  // app.use(verifyJWT);
  app.use('/disciplina', Disciplina);

  // app.use(verifyRole);
  app.use("/turma", Turma);

  // app.use(verifyAdmin);
  // app.use("/avaliacao", Avaliacao);

  // app.use(verifyAdmin);
  // app.use("/curso", Curso);

  // app.use(verifyAdmin);
  // app.use("/periodo_letivo", PeriodoLetivo);

  app.use(ErrorMiddleware);
};
