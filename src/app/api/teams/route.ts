import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const teams = await db.team.findMany({
      include: {
        players: {
          where: { isActive: true },
          orderBy: { number: 'asc' }
        },
        statistics: {
          where: { season: '2026' }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Error al obtener los equipos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, neighborhood, description, logo, color, foundedAt } = data

    const team = await db.team.create({
      data: {
        name,
        neighborhood,
        description,
        logo,
        color,
        foundedAt: foundedAt ? new Date(foundedAt) : null
      }
    })

    // Crear estadísticas iniciales para el equipo
    await db.teamStatistic.create({
      data: {
        teamId: team.id,
        season: '2026'
      }
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Error al crear el equipo' },
      { status: 500 }
    )
  }
}