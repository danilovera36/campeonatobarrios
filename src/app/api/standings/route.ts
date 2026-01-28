import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Obtener todas las estadísticas de equipos de la temporada 2026
    const teamStats = await db.teamStatistic.findMany({
      where: { season: '2026' },
      include: {
        team: true
      },
      orderBy: [
        { points: 'desc' },
        { goalsFor: 'desc' },
        { goalsAgainst: 'asc' }
      ]
    })

    // Calcular y mapear datos básicos
    const standingsData = teamStats.map((stat) => ({
      team: stat.team,
      matchesPlayed: stat.matchesPlayed,
      wins: stat.wins,
      draws: stat.draws,
      losses: stat.losses,
      goalsFor: stat.goalsFor,
      goalsAgainst: stat.goalsAgainst,
      goalDifference: stat.goalsFor - stat.goalsAgainst,
      points: stat.points
    }))

    // Ordenar: 1. Puntos, 2. Diferencia de Goles, 3. Goles a Favor
    standingsData.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    // Calcular posición para cada equipo después de ordenar
    const standings = standingsData.map((stat, index) => ({
      position: index + 1,
      ...stat
    }))

    return NextResponse.json(standings)
  } catch (error) {
    console.error('Error fetching standings:', error)
    return NextResponse.json(
      { error: 'Error al obtener la tabla de posiciones' },
      { status: 500 }
    )
  }
}