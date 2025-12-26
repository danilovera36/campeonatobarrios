const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const team = await prisma.team.findUnique({
        where: { name: 'La Estación' }
    })

    if (team) {
        await prisma.team.update({
            where: { id: team.id },
            data: {
                sponsor1: '/estacion1.png',
                sponsor2: '/estacion2.png'
            }
        })
        console.log('Sponsors updated for La Estación')
    } else {
        console.log('Team La Estación not found')
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
