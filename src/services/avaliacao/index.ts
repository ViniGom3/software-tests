import { Avaliacao } from '@prisma/client';
import { Exception } from '../../error';
import prisma from '../../prisma';

export const getAllAvaliacoes = () => {
  return prisma.avaliacao.findMany();
};

export const getAvaliacaoById = (id: number) => {
  return prisma.avaliacao.findUnique({
    where: {
      id,
    },
  });
};

export const createAvaliacao = (avaliacao: Avaliacao) => {
  return prisma.avaliacao.create({
    data: avaliacao,
  });
};

export const deleteAvaliacao = async (id: string) => {
  const avaliacaoId = parseInt(id);

  if (!(await getAvaliacaoById(avaliacaoId)))
    throw new Exception(404, 'Avaliacao não encontrada');

  return prisma.avaliacao.delete({
    where: {
      id: avaliacaoId,
    },
  });
};

export const updateAvaliacao = async (avaliacao: Avaliacao) => {
  if (!(avaliacao.id && (await getAvaliacaoById(avaliacao.id))))
    throw new Exception(404, 'Avaliacao não encontrada');

  return prisma.avaliacao.update({
    where: {
      id: avaliacao.id,
    },
    data: avaliacao,
  });
};
