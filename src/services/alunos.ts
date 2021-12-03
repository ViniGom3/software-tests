import { Avaliacao, Disciplina } from '.prisma/client';
import argon2 from 'argon2';

type AvaliacaoService = Pick<Avaliacao, 'grauFinal'> & {
  turma: {
    Disciplina: Pick<Disciplina, 'cargaHoraria'>;
  };
};

export const calcularIra = (avaliacao: AvaliacaoService[]) => {
  const sumAllExames = avaliacao.reduce(
    (acc, value) => acc + value.grauFinal * value.turma.Disciplina.cargaHoraria,
    0,
  );
  const sumAllHour = avaliacao.reduce(
    (acc, value) => acc + value.turma.Disciplina.cargaHoraria,
    0,
  );

  return sumAllExames / sumAllHour;
};

export const hashing = async function (value: string) {
  return await argon2.hash(value);
};

export const verify = async function (hash: string, plaintext: string) {
  return await argon2.verify(hash, plaintext);
};
