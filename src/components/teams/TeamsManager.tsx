'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Plus, Users, Trophy, ExternalLink, Edit2, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PlayerManager } from '@/components/players/PlayerManager'

interface Team {
  id: string
  name: string
  neighborhood: string
  description?: string
  logo?: string
  color?: string
  players: any[]
  statistics: any[]
}

export function TeamsManager() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [newTeam, setNewTeam] = useState({
    name: '',
    neighborhood: '',
    color: '#16a34a',
    description: ''
  })
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      }
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam)
      })
      if (response.ok) {
        setIsAdding(false)
        setNewTeam({ name: '', neighborhood: '', color: '#16a34a', description: '' })
        fetchTeams()
      }
    } catch (error) {
      console.error('Error adding team:', error)
    }
  }

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTeam) return
    try {
      const response = await fetch(`/api/teams/${editingTeam.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTeam)
      })
      if (response.ok) {
        setEditingTeam(null)
        fetchTeams()
      }
    } catch (error) {
      console.error('Error updating team:', error)
    }
  }

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este equipo? Se borrarán todos sus jugadores y estadísticas.')) return
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTeams()
      }
    } catch (error) {
      console.error('Error deleting team:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando equipos...</p>
        </div>
      </div>
    )
  }

  if (selectedTeam) {
    return (
      <PlayerManager
        teamId={selectedTeam.id}
        teamName={selectedTeam.name}
        onBack={() => {
          setSelectedTeam(null)
          fetchTeams() // Refresh player counts
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Equipos Participantes</h2>
          <p className="text-gray-600">Gestiona los equipos del campeonato</p>
        </div>
        {isAdmin && (
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAdding ? 'Cancelar' : 'Nuevo Equipo'}
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="text-lg">Agregar Nuevo Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTeam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Equipo</label>
                <input
                  className="w-full p-2 border rounded-md"
                  value={newTeam.name}
                  onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Barrio</label>
                <input
                  className="w-full p-2 border rounded-md"
                  value={newTeam.neighborhood}
                  onChange={e => setNewTeam({ ...newTeam, neighborhood: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Principal</label>
                <input
                  type="color"
                  className="w-full h-10 border rounded-md"
                  value={newTeam.color}
                  onChange={e => setNewTeam({ ...newTeam, color: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={newTeam.description}
                  onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                />
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 md:col-span-2">
                Guardar Equipo
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {editingTeam && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800 flex justify-between">
              Editar Equipo: {editingTeam.name}
              <Button variant="ghost" size="sm" onClick={() => setEditingTeam(null)}>Cancelar</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateTeam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Equipo</label>
                <input
                  className="w-full p-2 border rounded-md"
                  value={editingTeam.name}
                  onChange={e => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Barrio</label>
                <input
                  className="w-full p-2 border rounded-md"
                  value={editingTeam.neighborhood}
                  onChange={e => setEditingTeam({ ...editingTeam, neighborhood: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Principal</label>
                <input
                  type="color"
                  className="w-full h-10 border rounded-md"
                  value={editingTeam.color}
                  onChange={e => setEditingTeam({ ...editingTeam, color: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={editingTeam.description || ''}
                  onChange={e => setEditingTeam({ ...editingTeam, description: e.target.value })}
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 md:col-span-2 text-white">
                Actualizar Datos
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border bg-gray-50"
                  style={{ borderColor: team.color || '#10b981' }}
                >
                  {team.logo ? (
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-full h-full object-contain"
                      onError={(e: any) => {
                        // Si falla la imagen, ocultarla y mostrar el icono Shield
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <Shield
                    className="w-6 h-6"
                    style={{
                      color: team.color || '#10b981',
                      display: team.logo ? 'none' : 'block'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-green-800">{team.name}</CardTitle>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingTeam(team)
                          }}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTeam(team.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-sm">{team.neighborhood}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Jugadores
                  </span>
                  <Badge variant="secondary">{team.players?.length || 0}</Badge>
                </div>
                {team.statistics && team.statistics.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Puntos
                    </span>
                    <Badge variant="default" className="bg-green-600">
                      {team.statistics[0].points}
                    </Badge>
                  </div>
                )}
                {team.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {team.description}
                  </p>
                )}

                <div className="pt-4 flex gap-2">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTeam(team)
                      }}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Plantilla
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(`/teams/${team.id}`, '_blank')
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay equipos registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando el primer equipo del campeonato
            </p>
            {isAdmin && (
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Equipo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}