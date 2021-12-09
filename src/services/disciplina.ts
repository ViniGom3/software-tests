import { Disciplina } from '@prisma/client';
import { Exception } from '../error';
import prisma from '../prisma';

export const getAllDisciplinas = async () => {
  return prisma.disciplina.findMany();
};

export const getDisciplinaById = async (id: number) => {
  return prisma.disciplina.findUnique({
    where: {
      codigo: id,
    },
  });
};

export const createDisciplina = async (disciplina: Disciplina) => {
  if (await getDisciplinaById(disciplina.codigo))
    throw new Exception(400, 'Disciplina já cadastrada');

  return prisma.disciplina.create({
    data: disciplina,
  });
};

export const deleteDisciplina = async (id: string) => {
  const disciplinaId = parseInt(id);

  if (!(await getDisciplinaById(disciplinaId)))
    throw new Exception(404, 'Disciplina não encontrada');

  return prisma.disciplina.delete({
    where: {
      codigo: disciplinaId,
    },
  });
};

export const updateDisciplina = async (disciplina: Disciplina) => {
  if (!(disciplina.codigo && (await getDisciplinaById(disciplina.codigo))))
    throw new Exception(404, 'Disciplina não encontrada');

  return prisma.disciplina.update({
    where: {
      codigo: disciplina.codigo,
    },
    data: disciplina,
  });
};
