import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Start seeding (clean)...')

    // Clean up existing data
    await prisma.goal.deleteMany()
    await prisma.assist.deleteMany()
    await prisma.card.deleteMany()
    await prisma.matchEvent.deleteMany()
    await prisma.match.deleteMany()
    await prisma.playerStatistic.deleteMany()
    await prisma.player.deleteMany()
    await prisma.teamStatistic.deleteMany()
    await prisma.team.deleteMany()
    await prisma.news.deleteMany()
    await prisma.championship.deleteMany()

    // 1. Create Championship
    await prisma.championship.create({
        data: {
            name: "Campeonato de los Barrios",
            subtitle: "Alfredo 'Tente' Zulueta",
            season: "2026",
            startDate: new Date('2026-01-01'),
            isActive: true,
            description: "El torneo de barrios más importante de la comunidad"
        }
    })

    // 2. Create Teams only
    const teamsData = [
        { name: 'La Estación', neighborhood: 'Barrio La Estación', color: '#16a34a', logo: '/estacion.png' },
        { name: 'Los Hornos', neighborhood: 'Barrio Los Hornos', color: '#2563eb', logo: '/hornos.png' },
        { name: 'La Cuchilla', neighborhood: 'Barrio La Cuchilla', color: '#1e40af', logo: '/parque.png' },
        { name: 'La Pascual', neighborhood: 'Barrio La Pascual', color: '#ca8a04', logo: '/pascual.png' },
        { name: 'El Pastoreo', neighborhood: 'Barrio El Pastoreo', color: '#9333ea', logo: '/pastoreo.png' },
        { name: 'Centro', neighborhood: 'Centro', color: '#4b5563', logo: '/centro.png' },
    ]

    for (const teamData of teamsData) {
        const team = await prisma.team.create({
            data: teamData
        })

        // Create minimal team statistics for the season
        await prisma.teamStatistic.create({
            data: {
                teamId: team.id,
                season: "2026",
                matchesPlayed: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0
            }
        })
    }

    console.log('✅ Seeding finished (clean).')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
