import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Obtener los mejores goleadores calculados dinámicamente desde la tabla Goal
    const scorersQuery = await db.goal.groupBy({
      by: ['playerId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    // Complementar con info de jugadores y sus estadísticas de partidos jugados
    const topScorers = await Promise.all(scorersQuery.map(async (item) => {
      const player = await db.player.findUnique({
        where: { id: item.playerId },
        include: {
          team: true,
          statistics: {
            where: { season: '2026' }
          }
        }
      })
      const matchesPlayed = player?.statistics[0]?.matchesPlayed || 0
      return {
        name: player?.name || 'Desconocido',
        team: player?.team.name || 'S/E',
        goals: item._count.id,
        matchesPlayed
      }
    }))

    // Obtener los mejores asistentes calculados dinámicamente
    const assistsQuery = await db.assist.groupBy({
      by: ['playerId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })

    const topAssists = await Promise.all(assistsQuery.map(async (item) => {
      const player = await db.player.findUnique({
        where: { id: item.playerId },
        include: {
          team: true,
          statistics: {
            where: { season: '2026' }
          }
        }
      })
      const matchesPlayed = player?.statistics[0]?.matchesPlayed || 0
      return {
        name: player?.name || 'Desconocido',
        team: player?.team.name || 'S/E',
        assists: item._count.id,
        matchesPlayed
      }
    }))

    // Formatear los datos finales
    const formattedScorers = topScorers.map((s, index) => ({
      position: index + 1,
      ...s
    }))

    const formattedAssists = topAssists.map((a, index) => ({
      position: index + 1,
      ...a
    }))

    // Obtener estadísticas globales
    const teamsCount = await db.team.count()
    const matchesCount = await db.match.count()
    const goalsCount = await db.goal.count()
    const avgGoals = matchesCount > 0 ? (goalsCount / matchesCount).toFixed(2) : '0.00'

    // Estadísticas adicionales de equipos por temporada
    const teamStatsAll = await db.teamStatistic.findMany({
      where: { season: '2026' },
      include: { team: true }
    })

    const teamStatsWithAvg = teamStatsAll
      .filter(t => t.matchesPlayed > 0)
      .map(t => ({
        ...t,
        defenseAvg: t.goalsAgainst / t.matchesPlayed
      }))

    const bestOffense = [...teamStatsAll].sort((a, b) => b.goalsFor - a.goalsFor)[0]
    const bestDefense = teamStatsWithAvg.sort((a, b) => a.defenseAvg - b.defenseAvg)[0]

    // Obtener tarjetas por equipo para Fair Play
    const allCards = await db.card.findMany({
      include: {
        player: {
          include: { team: true }
        }
      }
    })

    const teamCards: Record<string, { name: string, points: number }> = {}
    allCards.forEach(card => {
      const team = card.player.team
      if (!teamCards[team.id]) {
        teamCards[team.id] = { name: team.name, points: 0 }
      }
      // Amarilla 1 punto, Roja 3 puntos
      teamCards[team.id].points += card.type === 'YELLOW' ? 1 : 3
    })

    const fairPlayArray = Object.values(teamCards).sort((a, b) => a.points - b.points)
    const fairPlayTeam = fairPlayArray.length > 0 ? fairPlayArray[0] : null

    return NextResponse.json({
      topScorers: formattedScorers,
      topAssists: formattedAssists,
      summary: {
        teams: teamsCount,
        matches: matchesCount,
        goals: goalsCount,
        avgGoals
      },
      extras: {
        bestOffense: bestOffense ? { name: bestOffense.team.name, value: bestOffense.goalsFor } : null,
        bestDefense: bestDefense ? { name: bestDefense.team.name, value: parseFloat(bestDefense.defenseAvg.toFixed(2)) } : null,
        fairPlay: fairPlayTeam ? { name: fairPlayTeam.name, value: fairPlayTeam.points } : null
      }
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Error al obtener las estadísticas' },
      { status: 500 }
    )
  }
}