import prisma from "../src/prisma";
// import * as faker from 'faker-br';

const length = 50

const alunos = Array.from({ length }).map((v, i) => ({
  matricula: i,
}))

// const interests = Array.from({ length }).map((v, i) => ({
//   uConfirmation: i < mean ? false : true,
//   pConfirmation: i < mean ? false : true,
//   userId: length - i,
//   propertyId: i + 1
// }))

async function main() {
  await prisma.aluno.createMany({
    data: alunos
  })
}

main().catch((e) => {
  console.log(e)
  process.exit(1)
}).finally(() => {
  prisma.$disconnect()
})

