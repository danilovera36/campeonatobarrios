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

    // Estadísticas adicionales de equipos calculadas dinámicamente incluyendo PLAYOFFS
    const allCompletedMatches = await db.match.findMany({
      where: { status: 'COMPLETED' },
      include: { homeTeam: true, awayTeam: true }
    })

    const dynamicTeamStats: Record<string, {
      name: string,
      goalsFor: number,
      goalsAgainst: number,
      matchesPlayed: number
    }> = {}

    allCompletedMatches.forEach(match => {
      if (!dynamicTeamStats[match.homeTeamId]) {
        dynamicTeamStats[match.homeTeamId] = { name: match.homeTeam.name, goalsFor: 0, goalsAgainst: 0, matchesPlayed: 0 }
      }
      dynamicTeamStats[match.homeTeamId].goalsFor += match.homeScore || 0
      dynamicTeamStats[match.homeTeamId].goalsAgainst += match.awayScore || 0
      dynamicTeamStats[match.homeTeamId].matchesPlayed += 1

      if (!dynamicTeamStats[match.awayTeamId]) {
        dynamicTeamStats[match.awayTeamId] = { name: match.awayTeam.name, goalsFor: 0, goalsAgainst: 0, matchesPlayed: 0 }
      }
      dynamicTeamStats[match.awayTeamId].goalsFor += match.awayScore || 0
      dynamicTeamStats[match.awayTeamId].goalsAgainst += match.homeScore || 0
      dynamicTeamStats[match.awayTeamId].matchesPlayed += 1
    })

    const dynamicStatsArray = Object.values(dynamicTeamStats).map(t => ({
      ...t,
      defenseAvg: t.goalsAgainst / t.matchesPlayed
    }))

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
      teamCards[team.id].points += card.type === 'YELLOW' ? 1 : 3
    })

    const fairPlayArray = Object.entries(teamCards).map(([id, data]) => {
      const stats = dynamicTeamStats[id]
      const matchesPlayed = stats?.matchesPlayed || 0
      const pointsAvg = matchesPlayed > 0 ? data.points / matchesPlayed : 0
      return {
        ...data,
        id,
        matchesPlayed,
        pointsAvg
      }
    })
      .filter(t => t.matchesPlayed > 0)
      .sort((a, b) => a.pointsAvg - b.pointsAvg)

    // Obtener los mejores récords (manejando empates)
    const sortedOffense = [...dynamicStatsArray].sort((a, b) => b.goalsFor - a.goalsFor)
    const maxGoalsFor = sortedOffense.length > 0 ? sortedOffense[0].goalsFor : null
    const bestOffenseTeams = maxGoalsFor !== null ? sortedOffense.filter(t => t.goalsFor === maxGoalsFor) : []

    const sortedDefense = [...dynamicStatsArray].sort((a, b) => a.defenseAvg - b.defenseAvg)
    const minDefenseAvg = sortedDefense.length > 0 ? sortedDefense[0].defenseAvg : null
    const bestDefenseTeams = minDefenseAvg !== null ? sortedDefense.filter(t => Math.abs(t.defenseAvg - minDefenseAvg) < 0.001) : []

    const bestFairPlayAvg = fairPlayArray.length > 0 ? fairPlayArray[0].pointsAvg : null
    const bestFairPlayTeams = bestFairPlayAvg !== null ? fairPlayArray.filter(t => Math.abs(t.pointsAvg - bestFairPlayAvg) < 0.001) : []

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
        bestOffense: bestOffenseTeams.length > 0 ? {
          name: bestOffenseTeams.map(t => t.name).join(' - '),
          value: maxGoalsFor
        } : null,
        bestDefense: bestDefenseTeams.length > 0 ? {
          name: bestDefenseTeams.map(t => t.name).join(' - '),
          value: parseFloat(bestDefenseTeams[0].defenseAvg.toFixed(2)),
          total: bestDefenseTeams[0].goalsAgainst
        } : null,
        fairPlay: bestFairPlayTeams.length > 0 ? {
          name: bestFairPlayTeams.map(t => t.name).join(' - '),
          value: parseFloat(bestFairPlayTeams[0].pointsAvg.toFixed(2)),
          total: bestFairPlayTeams[0].points
        } : null
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