import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        const team = await db.team.findUnique({
            where: { id },
            include: {
                players: {
                    where: { isActive: true },
                    orderBy: { number: 'asc' }
                },
                statistics: {
                    where: { season: '2026' }
                }
            }
        })

        if (!team) {
            return NextResponse.json(
                { error: 'Equipo no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(team)
    } catch (error) {
        console.error('Error fetching team:', error)
        return NextResponse.json(
            { error: 'Error al obtener el equipo' },
            { status: 500 }
        )
    }
}
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const data = await request.json()
        const { name, neighborhood, description, logo, color } = data

        const team = await db.team.update({
            where: { id },
            data: {
                name,
                neighborhood,
                description,
                logo,
                color,
                sponsor1: data.sponsor1,
                sponsor2: data.sponsor2,
                sponsor3: data.sponsor3,
                sponsor4: data.sponsor4,
                sponsor5: data.sponsor5,
                sponsor6: data.sponsor6
            }
        })

        return NextResponse.json(team)
    } catch (error) {
        console.error('Error updating team:', error)
        return NextResponse.json(
            { error: 'Error al actualizar el equipo' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        // Antes de borrar el equipo, borramos su dependencia en cascada si es posible
        // o simplemente borramos el equipo (Prisma handle cascade or not depending on schema)
        await db.team.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting team:', error)
        return NextResponse.json(
            { error: 'Error al eliminar el equipo' },
            { status: 500 }
        )
    }
}
