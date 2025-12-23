'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Trophy, Shield, Trash2, Plus, ChevronLeft, Save, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Player {
    id: string
    name: string
    number: number
}

interface Team {
    id: string
    name: string
    players: Player[]
}

interface Match {
    id: string
    homeTeamId: string
    awayTeamId: string
    homeScore?: number
    awayScore?: number
    status: string
    homeTeam: Team
    awayTeam: Team
    goals: any[]
    cards: any[]
    date: string
    venue?: string
    round?: string
    notes?: string
}

export function MatchEditor({ matchId, onBack }: { matchId: string, onBack: () => void }) {
    const [match, setMatch] = useState<Match | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Form states
    const [basicInfo, setBasicInfo] = useState({
        status: '',
        homeScore: 0,
        awayScore: 0,
        venue: '',
        round: '',
        notes: ''
    })

    const [newGoal, setNewGoal] = useState({ playerId: '', teamId: '', minute: '', type: 'NORMAL' })
    const [newCard, setNewCard] = useState({ playerId: '', teamId: '', minute: '', type: 'YELLOW' })

    useEffect(() => {
        fetchMatch()
    }, [matchId])

    const fetchMatch = async () => {
        try {
            const resp = await fetch(`/api/matches`) // We'll filter client side for now or add a specific GET /api/matches/[id]
            const matches = await resp.json()
            const found = matches.find((m: any) => m.id === matchId)
            if (found) {
                setMatch(found)
                setBasicInfo({
                    status: found.status,
                    homeScore: found.homeScore || 0,
                    awayScore: found.awayScore || 0,
                    venue: found.venue || '',
                    round: found.round || '',
                    notes: found.notes || ''
                })
            }
        } catch (e) {
            toast.error('Error al cargar el partido')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateBasic = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const resp = await fetch(`/api/matches/${matchId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(basicInfo)
            })
            if (resp.ok) {
                toast.success('Partido actualizado')
                fetchMatch()
            }
        } catch (e) {
            toast.error('Error al guardar')
        } finally {
            setIsSaving(false)
        }
    }

    const addGoal = async () => {
        if (!newGoal.playerId || !newGoal.teamId) return
        try {
            const resp = await fetch(`/api/matches/${matchId}/goals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGoal)
            })
            if (resp.ok) {
                toast.success('Gol registrado')
                fetchMatch()
                setNewGoal({ ...newGoal, playerId: '', minute: '' })
            }
        } catch (e) { toast.error('Error') }
    }

    const addCard = async () => {
        if (!newCard.playerId || !newCard.teamId) return
        try {
            const resp = await fetch(`/api/matches/${matchId}/cards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCard)
            })
            if (resp.ok) {
                toast.success('Tarjeta registrada')
                fetchMatch()
                setNewCard({ ...newCard, playerId: '', minute: '' })
            }
        } catch (e) { toast.error('Error') }
    }

    const deleteEvent = async (type: 'goal' | 'card', id: string) => {
        try {
            const resp = await fetch(`/api/events/${type}/${id}`, { method: 'DELETE' })
            if (resp.ok) {
                toast.success('Evento eliminado')
                fetchMatch()
            }
        } catch (e) { toast.error('Error') }
    }

    if (loading || !match) return <div className="p-12 text-center text-gray-500">Cargando editor de partido...</div>

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Volver a la lista
                </Button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                {/* Basic Management */}
                <Card className="flex-1 shadow-lg border-green-100">
                    <CardHeader>
                        <CardTitle className="text-xl text-green-800 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Resultado y Estado
                        </CardTitle>
                        <CardDescription>Configura los datos principales del encuentro</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateBasic} className="space-y-6">
                            <div className="grid grid-cols-2 gap-8 items-end text-center">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-gray-500">{match.homeTeam.name}</Label>
                                    <Input
                                        type="number"
                                        className="text-center text-2xl font-bold h-16 border-2 focus:border-green-500"
                                        value={basicInfo.homeScore}
                                        onChange={e => setBasicInfo({ ...basicInfo, homeScore: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-gray-500">{match.awayTeam.name}</Label>
                                    <Input
                                        type="number"
                                        className="text-center text-2xl font-bold h-16 border-2 focus:border-green-500"
                                        value={basicInfo.awayScore}
                                        onChange={e => setBasicInfo({ ...basicInfo, awayScore: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Estado del Partido</Label>
                                    <select
                                        className="w-full h-10 border rounded-md px-3 bg-white"
                                        value={basicInfo.status}
                                        onChange={e => setBasicInfo({ ...basicInfo, status: e.target.value })}
                                    >
                                        <option value="SCHEDULED">Programado</option>
                                        <option value="IN_PROGRESS">En curso</option>
                                        <option value="COMPLETED">Finalizado</option>
                                        <option value="POSTPONED">Pospuesto</option>
                                        <option value="CANCELLED">Cancelado</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ronda / Fecha</Label>
                                    <Input
                                        value={basicInfo.round}
                                        onChange={e => setBasicInfo({ ...basicInfo, round: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-10" disabled={isSaving}>
                                {isSaving ? 'Guardando...' : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Guardar Cambios</span>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Events Sidebar */}
                <div className="w-full md:w-96 space-y-6">
                    {/* Goals Management */}
                    <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                Registrar Goles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <select
                                    className="w-full text-sm h-9 border rounded-md px-2"
                                    value={newGoal.teamId}
                                    onChange={e => setNewGoal({ ...newGoal, teamId: e.target.value, playerId: '' })}
                                >
                                    <option value="">Seleccionar Equipo</option>
                                    <option value={match.homeTeam.id}>{match.homeTeam.name}</option>
                                    <option value={match.awayTeam.id}>{match.awayTeam.name}</option>
                                </select>
                                <select
                                    className="w-full text-sm h-9 border rounded-md px-2"
                                    value={newGoal.playerId}
                                    onChange={e => setNewGoal({ ...newGoal, playerId: e.target.value })}
                                    disabled={!newGoal.teamId}
                                >
                                    <option value="">Seleccionar Jugador</option>
                                    {(newGoal.teamId === match.homeTeam.id ? match.homeTeam.players : match.awayTeam.players)?.map(p => (
                                        <option key={p.id} value={p.id}>#{p.number} - {p.name}</option>
                                    ))}
                                </select>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Min"
                                        className="w-20 h-9 text-sm"
                                        value={newGoal.minute}
                                        onChange={e => setNewGoal({ ...newGoal, minute: e.target.value })}
                                    />
                                    <Button size="sm" className="flex-1 bg-blue-600 h-9" onClick={addGoal}>
                                        <Plus className="w-4 h-4 mr-1" /> Gol
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-2 max-h-48 overflow-y-auto">
                                {match.goals.map((g: any) => (
                                    <div key={g.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                                        <span className="font-medium">
                                            {g.minute}' {g.player.name} ({g.player.team.name})
                                        </span>
                                        <Button variant="ghost" size="icon" className="h-5 w-5 text-red-500" onClick={() => deleteEvent('goal', g.id)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cards Management */}
                    <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                Registrar Tarjetas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <select
                                    className="w-full text-sm h-9 border rounded-md px-2"
                                    value={newCard.teamId}
                                    onChange={e => setNewCard({ ...newCard, teamId: e.target.value, playerId: '' })}
                                >
                                    <option value="">Seleccionar Equipo</option>
                                    <option value={match.homeTeam.id}>{match.homeTeam.name}</option>
                                    <option value={match.awayTeam.id}>{match.awayTeam.name}</option>
                                </select>
                                <select
                                    className="w-full text-sm h-9 border rounded-md px-2"
                                    value={newCard.playerId}
                                    onChange={e => setNewCard({ ...newCard, playerId: e.target.value })}
                                    disabled={!newCard.teamId}
                                >
                                    <option value="">Seleccionar Jugador</option>
                                    {(newCard.teamId === match.homeTeam.id ? match.homeTeam.players : match.awayTeam.players)?.map(p => (
                                        <option key={p.id} value={p.id}>#{p.number} - {p.name}</option>
                                    ))}
                                </select>
                                <div className="flex gap-2">
                                    <select
                                        className="w-full text-sm h-9 border rounded-md px-2"
                                        value={newCard.type}
                                        onChange={e => setNewCard({ ...newCard, type: e.target.value })}
                                    >
                                        <option value="YELLOW">Amarilla</option>
                                        <option value="RED">Roja</option>
                                    </select>
                                    <Button size="sm" className="bg-red-600 h-9" onClick={addCard}>
                                        <Plus className="w-4 h-4 mr-1" /> T.
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-2 max-h-48 overflow-y-auto">
                                {match.cards.map((c: any) => (
                                    <div key={c.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                                        <span className="flex items-center gap-2">
                                            <div className={`w-2 h-3 ${c.type === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-500'} rounded-[1px]`} />
                                            {c.minute}' {c.player.name}
                                        </span>
                                        <Button variant="ghost" size="icon" className="h-5 w-5 text-red-500" onClick={() => deleteEvent('card', c.id)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
