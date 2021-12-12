import { Avaliacao } from '@prisma/client';
import { Context } from '../../context';
import { Exception } from '../../error';

export const getAllAvaliacoes = (ctx: Context) => {
  return ctx.prisma.avaliacao.findMany();
};

export const getAvaliacaoById = (id: number, ctx: Context) => {
  return ctx.prisma.avaliacao.findUnique({
    where: {
      id,
    },
  });
};

export const createAvaliacao = (avaliacao: Avaliacao, ctx: Context) => {
  return ctx.prisma.avaliacao.create({
    data: avaliacao,
  });
};

export const deleteAvaliacao = async (id: string, ctx: Context) => {
  const avaliacaoId = parseInt(id);

  if (!(await getAvaliacaoById(avaliacaoId, ctx)))
    throw new Exception(404, 'Avaliacao não encontrada');

  return ctx.prisma.avaliacao.delete({
    where: {
      id: avaliacaoId,
    },
  });
};

export const updateAvaliacao = async (avaliacao: Avaliacao, ctx: Context) => {
  if (!(await getAvaliacaoById(avaliacao.id, ctx)))
    throw new Exception(404, 'Avaliacao não encontrada');

  return ctx.prisma.avaliacao.update({
    where: {
      id: avaliacao.id,
    },
    data: avaliacao,
  });
};
