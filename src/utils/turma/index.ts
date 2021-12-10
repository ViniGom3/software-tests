import { Avaliacao } from '.prisma/client';

export type TurmaUtil = Pick<Avaliacao, 'grauFinal'>;

export const calcularMediaTurma = (avalicao: TurmaUtil[]) =>
  !!avalicao.length
    ? avalicao.reduce((acc, value) => acc + value.grauFinal, 0) /
      avalicao.length
    : 0;
