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

async function main() {
  await prisma.aluno.deleteMany({});
  await prisma.curso.deleteMany({});

  await prisma.curso.createMany({
    data: curso,
  });
  await prisma.aluno.createMany({
    data: alunos,
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
