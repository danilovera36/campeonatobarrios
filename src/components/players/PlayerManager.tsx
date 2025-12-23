'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Trash2, User, ChevronLeft, Edit2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Player {
    id: string
    name: string
    number: number
    position: string
}

interface PlayerManagerProps {
    teamId: string
    teamName: string
    onBack: () => void
}

export function PlayerManager({ teamId, teamName, onBack }: PlayerManagerProps) {
    const [players, setPlayers] = useState<Player[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newPlayer, setNewPlayer] = useState({
        name: '',
        number: '',
        position: 'Delantero'
    })
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
    const { isAdmin } = useAuth()

    const positions = [
        'Portero',
        'Defensa',
        'Mediocampista',
        'Delantero'
    ]

    useEffect(() => {
        fetchPlayers()
    }, [teamId])

    const fetchPlayers = async () => {
        try {
            const response = await fetch(`/api/players?teamId=${teamId}`)
            if (response.ok) {
                const data = await response.json()
                setPlayers(data)
            }
        } catch (error) {
            console.error('Error fetching players:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/players', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newPlayer,
                    teamId
                })
            })

            const data = await response.json()

            if (response.ok) {
                setPlayers([...players, data].sort((a, b) => a.number - b.number))
                setIsAdding(false)
                setNewPlayer({ name: '', number: '', position: 'Delantero' })
                toast.success('Jugador agregado correctamente')
            } else {
                toast.error(data.error || 'Error al agregar jugador')
            }
        } catch (error) {
            toast.error('Error de red al agregar jugador')
        }
    }

    const handleUpdatePlayer = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPlayer) return

        try {
            const response = await fetch('/api/players', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPlayer)
            })

            const data = await response.json()

            if (response.ok) {
                setPlayers(players.map(p => p.id === editingPlayer.id ? data : p).sort((a, b) => a.number - b.number))
                setEditingPlayer(null)
                toast.success('Jugador actualizado correctamente')
            } else {
                toast.error(data.error || 'Error al actualizar jugador')
            }
        } catch (error) {
            toast.error('Error de red al actualizar jugador')
        }
    }

    const handleDeletePlayer = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar a este jugador?')) return

        try {
            const response = await fetch(`/api/players?id=${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setPlayers(players.filter(p => p.id !== id))
                toast.success('Jugador eliminado')
            }
        } catch (error) {
            toast.error('Error al eliminar jugador')
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando plantilla...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Volver a Equipos
                </Button>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-green-800">Plantilla: {teamName}</h2>
                    <p className="text-gray-600">Gestiona los jugadores inscritos</p>
                </div>
                {isAdmin && (
                    <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                            setIsAdding(!isAdding)
                            setEditingPlayer(null)
                        }}
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isAdding ? 'Cancelar' : 'Inscribir Jugador'}
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="border-green-200 bg-green-50/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Nuevo Jugador</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddPlayer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Nombre Completo</Label>
                                <Input
                                    value={newPlayer.name}
                                    onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Número de Camiseta</Label>
                                <Input
                                    type="number"
                                    value={newPlayer.number}
                                    onChange={e => setNewPlayer({ ...newPlayer, number: e.target.value })}
                                    placeholder="Ej: 10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Posición</Label>
                                <select
                                    className="w-full p-2 border rounded-md bg-white border-input"
                                    value={newPlayer.position}
                                    onChange={e => setNewPlayer({ ...newPlayer, position: e.target.value })}
                                >
                                    {positions.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700 md:col-span-3">
                                Registrar Jugador
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {editingPlayer && (
                <Card className="border-blue-200 bg-blue-50/30">
                    <CardHeader>
                        <CardTitle className="text-lg text-blue-800 flex justify-between">
                            Editar Jugador: {editingPlayer.name}
                            <Button variant="ghost" size="sm" onClick={() => setEditingPlayer(null)}>Cancelar</Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdatePlayer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Nombre Completo</Label>
                                <Input
                                    value={editingPlayer.name}
                                    onChange={e => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Número de Camiseta</Label>
                                <Input
                                    type="number"
                                    value={editingPlayer.number}
                                    onChange={e => setEditingPlayer({ ...editingPlayer, number: parseInt(e.target.value) })}
                                    placeholder="Ej: 10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Posición</Label>
                                <select
                                    className="w-full p-2 border rounded-md bg-white border-input"
                                    value={editingPlayer.position}
                                    onChange={e => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                                >
                                    {positions.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 md:col-span-3 text-white">
                                Actualizar Jugador
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map(player => (
                    <Card key={player.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                                    {player.number}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{player.name}</div>
                                    <Badge variant="outline" className="text-[10px] uppercase">
                                        {player.position}
                                    </Badge>
                                </div>
                            </div>
                            {isAdmin && (
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                        onClick={() => {
                                            setEditingPlayer(player)
                                            setIsAdding(false)
                                        }}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDeletePlayer(player.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {players.length === 0 && !isAdding && (
                <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-200">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay jugadores registrados en este equipo.</p>
                </div>
            )}
        </div>
    )
}
