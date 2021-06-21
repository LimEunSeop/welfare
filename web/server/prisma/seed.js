const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'admin',
    },
  })

  const moderator = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'moderator',
    },
  })

  const user = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'user',
    },
  })

  const employee = await prisma.role.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'employee',
    },
  })

  const jugan = await prisma.program.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'jugan',
      description: '주간프로그램',
    },
  })

  const bangmun = await prisma.program.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'bangmun',
      description: '방문프로그램',
    },
  })

  const ganho = await prisma.program.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'ganho',
      description: '간호프로그램',
    },
  })

  const mokyok = await prisma.program.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'mokyok',
      description: '목욕프로그램',
    },
  })

  console.log({
    admin,
    moderator,
    user,
    employee,
    jugan,
    bangmun,
    ganho,
    mokyok,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
