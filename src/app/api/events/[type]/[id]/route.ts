// /api/events/[type]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { type: string, id: string } }
) {
    try {
        const { type, id } = await params

        if (type === 'goal') {
            await db.goal.delete({ where: { id } })
        } else if (type === 'card') {
            await db.card.delete({ where: { id } })
        } else {
            return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json({ error: 'Error al eliminar el evento' }, { status: 500 })
    }
}
