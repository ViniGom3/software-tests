import { Disciplina } from '.prisma/client';
import prisma from '../src/prisma';
// import * as faker from 'faker-br';

const length = 50;

const alunos = Array.from({ length }).map((v, i) => ({
  matricula: i,
  cursoId: i,
}));
const curso = Array.from({ length }).map((v, i) => ({
  id: i,
  nome: 'Curso ' + i,
  codigo: i,
}));

const turma = Array.from({ length: 2 }).map((v, i) => ({
  codigo: i,
  nomeProfessor: 'Professor ' + i,
  periodoLetivoId: i % 2 === 0 ? 1 : 2,
  horario: '08:00 - 18:00',
  disciplinaId: 0,
}));

const avaliacao = Array.from({ length: 200 }).map((v, i) => ({
  id: i,
  matriculaAluno: Math.floor(i / 4),
  codigoTurma: i % 2 === 0 ? 0 : 1,
  grauFinal: Math.floor(Math.random() * 10),
}));

async function main() {
  await prisma.avaliacao.deleteMany({});
  await prisma.turma.deleteMany({});
  await prisma.disciplina.deleteMany({});
  await prisma.periodoLetivo.deleteMany({});
  await prisma.aluno.deleteMany({});
  await prisma.curso.deleteMany({});

  await prisma.curso.createMany({
    data: curso,
  });
  await prisma.aluno.createMany({
    data: alunos,
  });
  await prisma.periodoLetivo.create({
    data: {
      id: 1,
      dataInicio: new Date('2021-01-01T08:00:00'),
      dataFim: new Date('2021-06-30T23:59:59'),
      status: 'ATIVO',
    },
  });
  await prisma.periodoLetivo.create({
    data: {
      id: 2,
      dataInicio: new Date('2021-01-01T08:00:00'),
      dataFim: new Date('2021-06-30T23:59:59'),
      status: 'ATIVO',
    },
  });
  await prisma.disciplina.create({
    data: {
      codigo: 0,
      nome: 'Topicos Especiais em Sistemas de Informação',
      cargaHoraria: 60,
      nomeDepartamento: 'Departamento de Computação',
      nivel: 'BACHARELADO',
    },
  });

  await prisma.turma.createMany({
    data: turma,
  });

  await prisma.avaliacao.createMany({
    data: avaliacao,
  });
}

main()
  .catch(e => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
