import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const matches = await db.match.findMany({
      include: {
        homeTeam: {
          include: {
            players: { where: { isActive: true } },
            statistics: {
              where: { season: '2026' }
            }
          }
        },
        awayTeam: {
          include: {
            players: { where: { isActive: true } },
            statistics: {
              where: { season: '2026' }
            }
          }
        },
        goals: {
          include: {
            player: {
              include: {
                team: true
              }
            }
          }
        },
        cards: {
          include: {
            player: {
              include: {
                team: true
              }
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Error al obtener los partidos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      homeTeamId,
      awayTeamId,
      date,
      venue,
      round,
      notes
    } = data

    const match = await db.match.create({
      data: {
        homeTeamId,
        awayTeamId,
        date: new Date(date),
        venue,
        round,
        notes
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })

    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Error al crear el partido' },
      { status: 500 }
    )
  }
}