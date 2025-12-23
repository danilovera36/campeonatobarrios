import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: matchId } = await params
        const { playerId, minute, isOwnGoal, isPenalty } = await request.json()

        const goal = await db.goal.create({
            data: {
                matchId,
                playerId,
                minute: parseInt(minute) || 0,
                isOwnGoal: !!isOwnGoal,
                isPenalty: !!isPenalty
            }
        })

        return NextResponse.json(goal, { status: 201 })
    } catch (error) {
        console.error('Error adding goal:', error)
        return NextResponse.json({ error: 'Error al agregar el gol' }, { status: 500 })
    }
}
