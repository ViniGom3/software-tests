import { Avaliacao } from '.prisma/client';

type TurmaService = Pick<Avaliacao, 'grauFinal'>;

export const calcularMediaTurma = (avalicao: TurmaService[]) =>
  avalicao.reduce((acc, value) => acc + value.grauFinal, 0) / avalicao.length;
