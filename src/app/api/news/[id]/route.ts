import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const data = await request.json()
        const news = await db.news.update({
            where: { id },
            data
        })
        return NextResponse.json(news)
    } catch (error) {
        console.error('Error updating news:', error)
        return NextResponse.json({ error: 'Error al actualizar noticia' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        await db.news.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting news:', error)
        return NextResponse.json({ error: 'Error al eliminar noticia' }, { status: 500 })
    }
}
