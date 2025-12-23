import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const teamId = searchParams.get('teamId')

        if (!teamId) {
            return NextResponse.json(
                { error: 'teamId es requerido' },
                { status: 400 }
            )
        }

        const players = await db.player.findMany({
            where: {
                teamId,
                isActive: true
            },
            orderBy: { number: 'asc' }
        })

        return NextResponse.json(players)
    } catch (error) {
        console.error('Error fetching players:', error)
        return NextResponse.json(
            { error: 'Error al obtener los jugadores' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { name, number, position, teamId } = data

        // Validar datos requeridos
        if (!name || !number || !position || !teamId) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            )
        }

        // Verificar si el número ya existe en el equipo
        const existingPlayer = await db.player.findFirst({
            where: {
                teamId,
                number: parseInt(number)
            }
        })

        if (existingPlayer) {
            return NextResponse.json(
                { error: `El número ${number} ya está asignado en este equipo` },
                { status: 400 }
            )
        }

        const player = await db.player.create({
            data: {
                name,
                number: parseInt(number),
                position,
                teamId
            }
        })

        // Crear estadísticas iniciales para el jugador
        await db.playerStatistic.create({
            data: {
                playerId: player.id,
                season: '2026'
            }
        })

        return NextResponse.json(player, { status: 201 })
    } catch (error) {
        console.error('Error creating player:', error)
        return NextResponse.json(
            { error: 'Error al crear el jugador' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const data = await request.json()
        const { id, name, number, position } = data

        if (!id) {
            return NextResponse.json(
                { error: 'ID es requerido' },
                { status: 400 }
            )
        }

        // Verificar si el nuevo número ya existe en el equipo (si se está cambiando)
        if (number) {
            const currentPlayer = await db.player.findUnique({ where: { id } })
            if (currentPlayer && parseInt(number) !== currentPlayer.number) {
                const existingPlayer = await db.player.findFirst({
                    where: {
                        teamId: currentPlayer.teamId,
                        number: parseInt(number),
                        id: { not: id }
                    }
                })

                if (existingPlayer) {
                    return NextResponse.json(
                        { error: `El número ${number} ya está asignado en este equipo` },
                        { status: 400 }
                    )
                }
            }
        }

        const player = await db.player.update({
            where: { id },
            data: {
                name,
                number: number ? parseInt(number) : undefined,
                position
            }
        })

        return NextResponse.json(player)
    } catch (error) {
        console.error('Error updating player:', error)
        return NextResponse.json(
            { error: 'Error al actualizar el jugador' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID es requerido' },
                { status: 400 }
            )
        }

        // Hard delete para permitir reutilizar números de camiseta inmediatamente
        await db.player.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting player:', error)
        return NextResponse.json(
            { error: 'Error al eliminar el jugador' },
            { status: 500 }
        )
    }
}
