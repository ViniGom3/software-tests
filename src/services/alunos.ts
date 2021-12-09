import { Avaliacao, Disciplina } from '.prisma/client';

type AvaliacaoService = Pick<Avaliacao, 'grauFinal' | 'situacao'> & {
  turma: {
    Disciplina: Pick<Disciplina, 'cargaHoraria'>;
  };
};

export const calcularIra = (avaliacao: AvaliacaoService[]) => {
  const sumAllExames = avaliacao.reduce(
    (acc, value) =>
      acc +
      value.turma.Disciplina.cargaHoraria *
        (value.situacao === 'REPROVADO_FALTAS' ? 0 : value.grauFinal),
    0,
  );

  const sumAllHour = avaliacao.reduce(
    (acc, value) => acc + value.turma.Disciplina.cargaHoraria,
    0,
  );

  return sumAllExames / sumAllHour;
};
