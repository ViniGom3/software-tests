import { Disciplina } from '@prisma/client';
import { Context } from '../../context';
import { Exception } from '../../error';

export const getAllDisciplinas = async (ctx: Context) => {
  return ctx.prisma.disciplina.findMany();
};

export const getDisciplinaById = async (id: number, ctx: Context) => {
  return ctx.prisma.disciplina.findUnique({
    where: {
      codigo: id,
    },
  });
};

export const createDisciplina = async (
  disciplina: Disciplina,
  ctx: Context,
) => {
  if (await getDisciplinaById(disciplina.codigo, ctx))
    throw new Exception(400, 'Disciplina já cadastrada');

  return ctx.prisma.disciplina.create({
    data: disciplina,
  });
};

export const deleteDisciplina = async (id: string, ctx: Context) => {
  const disciplinaId = parseInt(id);

  if (!(await getDisciplinaById(disciplinaId, ctx)))
    throw new Exception(404, 'Disciplina não encontrada');

  return ctx.prisma.disciplina.delete({
    where: {
      codigo: disciplinaId,
    },
  });
};

export const updateDisciplina = async (
  disciplina: Disciplina,
  ctx: Context,
) => {
  if (!(disciplina.codigo && (await getDisciplinaById(disciplina.codigo, ctx))))
    throw new Exception(404, 'Disciplina não encontrada');

  return ctx.prisma.disciplina.update({
    where: {
      codigo: disciplina.codigo,
    },
    data: disciplina,
  });
};
