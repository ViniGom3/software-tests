import { Avaliacao, Disciplina } from '.prisma/client';

export type AvaliacaoUtil = Pick<Avaliacao, 'grauFinal' | 'situacao'> & {
  turma: {
    Disciplina: Pick<Disciplina, 'cargaHoraria'>;
  };
};

export const calcularIra = (avaliacao: AvaliacaoUtil[]) => {
  const sumAllExames = avaliacao.reduce(
    (acc, value) =>
      acc +
      value.turma.Disciplina.cargaHoraria *
        (value.situacao === 'REPROVADO_FALTAS' ? 0 : value.grauFinal),
    0,
  );

  if (sumAllExames === 0) return 0;

  const sumAllHour = avaliacao.reduce(
    (acc, value) => acc + value.turma.Disciplina.cargaHoraria,
    0,
  );

  if (sumAllHour === 0) return 0;

  return sumAllExames / sumAllHour;
};
