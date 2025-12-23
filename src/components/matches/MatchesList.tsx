'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, MapPin, Plus, Trophy, Edit2, Trash2, Zap, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { MatchEditor } from './MatchEditor'

interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  date: string
  venue?: string
  status: string
  homeScore?: number
  awayScore?: number
  round?: string
  notes?: string
  homeTeam: {
    id: string
    name: string
    neighborhood: string
    color?: string
    logo?: string
  }
  awayTeam: {
    id: string
    name: string
    neighborhood: string
    color?: string
    logo?: string
  }
  goals: any[]
  cards: any[]
}

export function MatchesList() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')
  const [selectedRound, setSelectedRound] = useState<string>('Todas')
  const [isAdding, setIsAdding] = useState(false)
  const [newMatch, setNewMatch] = useState({
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    venue: '',
    round: '',
    notes: ''
  })
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchMatches()
    if (isAdmin) fetchTeams()

    // Polling every 10 seconds for real-time updates (Vercel compatible)
    const intervalId = setInterval(() => {
      fetchMatches()
    }, 10000)

    return () => clearInterval(intervalId)
  }, [isAdmin])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches')
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dateObj = new Date(newMatch.date)
      const payload = { ...newMatch, date: dateObj.toISOString() }

      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (response.ok) {
        setIsAdding(false)
        setNewMatch({ homeTeamId: '', awayTeamId: '', date: '', venue: '', round: '', notes: '' })
        fetchMatches()
      }
    } catch (error) {
      console.error('Error adding match:', error)
    }
  }

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este partido?')) return
    try {
      const response = await fetch(`/api/matches/${id}`, { method: 'DELETE' })
      if (response.ok) fetchMatches()
    } catch (error) {
      console.error('Error deleting match:', error)
    }
  }

  // Get unique rounds for the selector
  const rounds = useMemo(() => {
    const r = Array.from(new Set(matches.map(m => m.round || 'S/F'))).filter(Boolean)
    return ['Todas', ...r.sort()]
  }, [matches])

  const filteredMatchesList = matches.filter(match => {
    const now = new Date()
    const matchDate = new Date(match.date)

    // Status filter
    let passesStatus = true
    if (filter === 'upcoming') passesStatus = matchDate > now && match.status === 'SCHEDULED'
    if (filter === 'completed') passesStatus = match.status === 'COMPLETED'

    // Round filter
    let passesRound = true
    if (selectedRound !== 'Todas') passesRound = (match.round || 'S/F') === selectedRound

    return passesStatus && passesRound
  })

  // Group matches by round for display
  const groupedMatches = filteredMatchesList.reduce((acc, match) => {
    const roundName = match.round || 'Sin Definir'
    if (!acc[roundName]) acc[roundName] = []
    acc[roundName].push(match)
    return acc
  }, {} as Record<string, Match[]>)

  const sortedGroupNames = Object.keys(groupedMatches).sort()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Badge variant="secondary">Programado</Badge>
      case 'IN_PROGRESS': return <Badge className="bg-green-500 animate-pulse">En curso</Badge>
      case 'COMPLETED': return <Badge variant="default">Finalizado</Badge>
      case 'CANCELLED': return <Badge variant="destructive">Cancelado</Badge>
      case 'POSTPONED': return <Badge variant="outline">Pospuesto</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  if (selectedMatchId) {
    return <MatchEditor matchId={selectedMatchId} onBack={() => { setSelectedMatchId(null); fetchMatches() }} />
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando partidos...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Calendario de Partidos</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>Todos</Button>
              <Button variant={filter === 'upcoming' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('upcoming')}>Próximos</Button>
              <Button variant={filter === 'completed' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('completed')}>Finalizados</Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select value={selectedRound} onValueChange={setSelectedRound}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filtrar por Fecha" />
            </SelectTrigger>
            <SelectContent>
              {rounds.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          {isAdmin && (
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsAdding(!isAdding)}>
              <Plus className="w-4 h-4 mr-2" /> Programar
            </Button>
          )}
        </div>
      </div>

      {isAdding && (
        <Card className="bg-green-50 border-green-100">
          <CardHeader>
            <CardTitle className="text-lg">Programar Nuevo Partido</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Forms fields... for briefness I'll assume they are standard and skip detailed re-write if possible, but I must follow write_to_file rules. I'll include the essential fields. */}
              <div className="space-y-2">
                <Label>Equipo Local</Label>
                <Select value={newMatch.homeTeamId} onValueChange={(v) => setNewMatch({ ...newMatch, homeTeamId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar local" /></SelectTrigger>
                  <SelectContent>{teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Equipo Visitante</Label>
                <Select value={newMatch.awayTeamId} onValueChange={(v) => setNewMatch({ ...newMatch, awayTeamId: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar visitante" /></SelectTrigger>
                  <SelectContent>{teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha y Hora</Label>
                <Input type="datetime-local" value={newMatch.date} onChange={e => setNewMatch({ ...newMatch, date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Ronda / Jornada</Label>
                <Input placeholder="Ej: Fecha 1, Semifinal" value={newMatch.round} onChange={e => setNewMatch({ ...newMatch, round: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Lugar (Cancha)</Label>
                <Input placeholder="Ej: Cancha Principal" value={newMatch.venue} onChange={e => setNewMatch({ ...newMatch, venue: e.target.value })} />
              </div>
              <div className="flex gap-2 md:col-span-2 mt-2">
                <Button type="submit" className="flex-1 bg-green-600">Crear Partido</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {sortedGroupNames.map(roundName => (
          <div key={roundName} className="space-y-4">
            <h3 className="text-lg font-bold text-green-700 flex items-center gap-2 border-b pb-2">
              <Calendar className="w-5 h-5" />
              {roundName}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groupedMatches[roundName].map((match) => (
                <Card key={match.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: match.homeTeam.color || '#16a34a' }}>
                  <CardContent className="p-0">
                    <div className="bg-gray-50/50 p-2 flex justify-between items-center text-xs text-gray-500 border-b">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(match.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(match.date)}</span>
                        {match.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {match.venue}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {match.status === 'IN_PROGRESS' && <Zap className="w-3 h-3 text-green-600" />}
                        {getStatusBadge(match.status)}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col items-center flex-1 max-w-[120px] text-center">
                          <div className="w-16 h-16 rounded-full border bg-white flex items-center justify-center mb-2 shadow-sm overflow-hidden" style={{ borderColor: match.homeTeam.color }}>
                            {match.homeTeam.logo ? (
                              <img
                                src={match.homeTeam.logo}
                                alt={match.homeTeam.name}
                                className="w-full h-full object-contain p-2"
                                onError={(e: any) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                                }}
                              />
                            ) : null}
                            <Shield
                              className="w-8 h-8"
                              style={{
                                color: match.homeTeam.color || '#16a34a',
                                display: match.homeTeam.logo ? 'none' : 'block'
                              }}
                            />
                          </div>
                          <span className="font-bold text-gray-800 text-sm md:text-base leading-tight">{match.homeTeam.name}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1">
                          <div className="bg-gray-100 rounded-lg py-2 px-4 shadow-inner flex items-center gap-4">
                            <span className="text-3xl font-black text-gray-900">{match.homeScore ?? '-'}</span>
                            <span className="text-gray-400 font-bold">:</span>
                            <span className="text-3xl font-black text-gray-900">{match.awayScore ?? '-'}</span>
                          </div>
                          {match.status === 'IN_PROGRESS' && (
                            <span className="mt-2 text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                              En Vivo
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-center flex-1 max-w-[120px] text-center">
                          <div className="w-16 h-16 rounded-full border bg-white flex items-center justify-center mb-2 shadow-sm overflow-hidden" style={{ borderColor: match.awayTeam.color }}>
                            {match.awayTeam.logo ? (
                              <img
                                src={match.awayTeam.logo}
                                alt={match.awayTeam.name}
                                className="w-full h-full object-contain p-2"
                                onError={(e: any) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                                }}
                              />
                            ) : null}
                            <Shield
                              className="w-8 h-8"
                              style={{
                                color: match.awayTeam.color || '#16a34a',
                                display: match.awayTeam.logo ? 'none' : 'block'
                              }}
                            />
                          </div>
                          <span className="font-bold text-gray-800 text-sm md:text-base leading-tight">{match.awayTeam.name}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        {isAdmin && (
                          <>
                            <Button variant="default" size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setSelectedMatchId(match.id)}>
                              <Edit2 className="w-4 h-4 mr-2" /> Gestionar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteMatch(match.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {!isAdmin && (
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(`/teams/${match.homeTeamId}`, '_blank')}>
                            Ver Barrio
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {sortedGroupNames.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron partidos en esta fecha o categoría.</p>
        </div>
      )}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-gray-700">{children}</label>
}

function Input(props: any) {
  return <input {...props} className="w-full h-10 px-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none" />
}