import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const data = await request.json()
        const { homeScore, awayScore, status, round, venue, date, notes } = data

        // Obtener el estado previo del partido para saber si ya estaba completado
        const oldMatch = await db.match.findUnique({
            where: { id },
            select: { status: true, homeScore: true, awayScore: true, homeTeamId: true, awayTeamId: true }
        })

        const match = await db.match.update({
            where: { id },
            data: {
                homeScore: homeScore !== undefined ? parseInt(homeScore) : undefined,
                awayScore: awayScore !== undefined ? parseInt(awayScore) : undefined,
                status,
                round,
                venue,
                date: date ? new Date(date) : undefined,
                notes
            }
        })

        // Lógica de Estadísticas
        const season = '2026'
        const wasCompleted = oldMatch?.status === 'COMPLETED'
        const isNowCompleted = status === 'COMPLETED'
        const isPlayoff = round === 'Semifinal' || round === 'Final' || oldMatch?.round === 'Semifinal' || oldMatch?.round === 'Final'

        // Función para actualizar estadísticas de un equipo
        const updateTeamStats = async (teamId: string, diff: number, goalsFor: number, goalsAgainst: number) => {
            const isWin = goalsFor > goalsAgainst ? 1 : 0
            const isDraw = goalsFor === goalsAgainst ? 1 : 0
            const isLoss = goalsFor < goalsAgainst ? 1 : 0
            const points = (isWin * 3) + (isDraw * 1)

            await db.teamStatistic.upsert({
                where: { teamId_season: { teamId, season } },
                update: {
                    matchesPlayed: { increment: 1 * diff },
                    wins: { increment: isWin * diff },
                    draws: { increment: isDraw * diff },
                    losses: { increment: isLoss * diff },
                    goalsFor: { increment: goalsFor * diff },
                    goalsAgainst: { increment: goalsAgainst * diff },
                    points: { increment: points * diff }
                },
                create: {
                    teamId,
                    season,
                    matchesPlayed: 1,
                    wins: isWin,
                    draws: isDraw,
                    losses: isLoss,
                    goalsFor,
                    goalsAgainst,
                    points
                }
            })
        }

        // 1. Si antes estaba completado y ahora NO, restamos las estadísticas viejas
        if (wasCompleted && !isNowCompleted && !isPlayoff) {
            await updateTeamStats(oldMatch!.homeTeamId, -1, oldMatch!.homeScore || 0, oldMatch!.awayScore || 0)
            await updateTeamStats(oldMatch!.awayTeamId, -1, oldMatch!.awayScore || 0, oldMatch!.homeScore || 0)
        }
        // 2. Si ahora está completado y antes NO, sumamos las nuevas
        else if (!wasCompleted && isNowCompleted && !isPlayoff) {
            await updateTeamStats(match.homeTeamId, 1, match.homeScore || 0, match.awayScore || 0)
            await updateTeamStats(match.awayTeamId, 1, match.awayScore || 0, match.homeScore || 0)
        }
        // 3. Si ya estaba completado y sigue completado pero cambiaron los goles, restamos viejas y sumamos nuevas
        else if (wasCompleted && isNowCompleted && !isPlayoff && (oldMatch?.homeScore !== match.homeScore || oldMatch?.awayScore !== match.awayScore)) {
            await updateTeamStats(oldMatch!.homeTeamId, -1, oldMatch!.homeScore || 0, oldMatch!.awayScore || 0)
            await updateTeamStats(oldMatch!.awayTeamId, -1, oldMatch!.awayScore || 0, oldMatch!.homeScore || 0)
            await updateTeamStats(match.homeTeamId, 1, match.homeScore || 0, match.awayScore || 0)
            await updateTeamStats(match.awayTeamId, 1, match.awayScore || 0, match.homeScore || 0)
        }


        return NextResponse.json(match)
    } catch (error) {
        console.error('Error updating match:', error)
        return NextResponse.json(
            { error: 'Error al actualizar el partido' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        await db.match.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting match:', error)
        return NextResponse.json(
            { error: 'Error al eliminar el partido' },
            { status: 500 }
        )
    }
}
