import { Suspense } from 'react'
import { TeamProfile } from '@/components/teams/TeamProfile'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
    params: { id: string }
}

export default async function TeamPage({ params }: PageProps) {
    const { id } = await params

    const team = await db.team.findUnique({
        where: { id },
        include: {
            players: {
                where: { isActive: true },
                orderBy: { number: 'asc' }
            },
            statistics: {
                where: { season: '2026' }
            }
        }
    })

    if (!team) {
        notFound()
    }

    // Convert types to match TeamProfile interface if needed
    const formattedTeam = {
        ...team,
        players: team.players.map(p => ({
            id: p.id,
            name: p.name,
            number: p.number,
            position: p.position
        })),
        statistics: team.statistics.map(s => ({
            points: s.points,
            matchesPlayed: s.matchesPlayed,
            wins: s.wins,
            draws: s.draws,
            losses: s.losses,
            goalsFor: s.goalsFor,
            goalsAgainst: s.goalsAgainst
        }))
    }

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando perfil de equipo...</div>}>
            <TeamProfile team={formattedTeam as any} />
        </Suspense>
    )
}
