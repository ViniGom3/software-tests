import { Avaliacao, Disciplina } from ".prisma/client";

export type AvaliacaoService = Pick<Avaliacao, 'grauFinal'> & {   
    turma: {
        Disciplina: Pick<Disciplina, 'cargaHoraria'>
    }
}

export const calcularIra = (avaliacao: AvaliacaoService[]) => {
    const sumAllExames = avaliacao.reduce(
        (acc, value) =>
          acc + value.grauFinal * value.turma.Disciplina.cargaHoraria,
        0,
      );
      const sumAllHour = avaliacao.reduce(
        (acc, value) => acc + value.turma.Disciplina.cargaHoraria,
        0,
      );
    
      return sumAllExames / sumAllHour
}
