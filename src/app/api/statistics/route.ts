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

    // Complementar con info de jugadores
    const topScorers = await Promise.all(scorersQuery.map(async (item) => {
      const player = await db.player.findUnique({
        where: { id: item.playerId },
        include: { team: true }
      })
      return {
        name: player?.name || 'Desconocido',
        team: player?.team.name || 'S/E',
        goals: item._count.id
      }
    }))

    // Obtener los mejores asistentes calculados dinámicamente (Si hubiera tabla Assist, similar a Goal)
    // Por ahora, como el usuario solo pidió goles y tarjetas, mantenemos la estructura pero dinámica si es posible.
    // Si no hay tabla de asistencias, devolvemos vacío o corregimos la query.
    // Viendo el esquema, EXSITE la tabla Assist.
    const assistsQuery = await db.assist.groupBy({
      by: ['playerId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })

    const topAssists = await Promise.all(assistsQuery.map(async (item) => {
      const player = await db.player.findUnique({
        where: { id: item.playerId },
        include: { team: true }
      })
      return {
        name: player?.name || 'Desconocido',
        team: player?.team.name || 'S/E',
        assists: item._count.id
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

    return NextResponse.json({
      topScorers: formattedScorers,
      topAssists: formattedAssists,
      summary: {
        teams: teamsCount,
        matches: matchesCount,
        goals: goalsCount,
        avgGoals
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