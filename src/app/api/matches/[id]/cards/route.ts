import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: matchId } = await params
        const { playerId, minute, type } = await request.json()

        const card = await db.card.create({
            data: {
                matchId,
                playerId,
                type: type || 'YELLOW',
                minute: parseInt(minute) || 0
            }
        })

        return NextResponse.json(card, { status: 201 })
    } catch (error) {
        console.error('Error adding card:', error)
        return NextResponse.json({ error: 'Error al agregar la tarjeta' }, { status: 500 })
    }
}
