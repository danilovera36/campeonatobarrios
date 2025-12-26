'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Plus, Users, Trophy, ExternalLink, Edit2, Trash2, Upload, Loader2, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PlayerManager } from '@/components/players/PlayerManager'
import { toast } from 'sonner'

interface Team {
  id: string
  name: string
  neighborhood: string
  description?: string
  logo?: string
  color?: string
  sponsor1?: string
  sponsor2?: string
  sponsor3?: string
  sponsor4?: string
  sponsor5?: string
  sponsor6?: string
  players: any[]
  statistics: any[]
}

export function TeamsManager() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [newTeam, setNewTeam] = useState({
    name: '',
    neighborhood: '',
    color: '#16a34a',
    description: '',
    logo: '',
    sponsor1: '',
    sponsor2: '',
    sponsor3: '',
    sponsor4: '',
    sponsor5: '',
    sponsor6: ''
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isEditing: boolean) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(field)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (isEditing && editingTeam) {
          setEditingTeam({ ...editingTeam, [field]: data.url })
        } else {
          setNewTeam({ ...newTeam, [field]: data.url })
        }
        toast.success('Imagen subida correctamente')
      } else {
        toast.error('Error al subir la imagen')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Error al conectar con el servidor')
    } finally {
      setUploading(null)
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
        setNewTeam({
          name: '',
          neighborhood: '',
          color: '#16a34a',
          description: '',
          logo: '',
          sponsor1: '',
          sponsor2: '',
          sponsor3: '',
          sponsor4: '',
          sponsor5: '',
          sponsor6: ''
        })
        fetchTeams()
        toast.success('Equipo creado correctamente')
      }
    } catch (error) {
      console.error('Error adding team:', error)
      toast.error('Error al crear el equipo')
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
        toast.success('Equipo actualizado correctamente')
      }
    } catch (error) {
      console.error('Error updating team:', error)
      toast.error('Error al actualizar el equipo')
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
        toast.success('Equipo eliminado')
      }
    } catch (error) {
      console.error('Error deleting team:', error)
      toast.error('Error al eliminar el equipo')
    }
  }

  const ImageInput = ({ label, value, field, isEditing }: { label: string, value: string, field: string, isEditing: boolean }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium flex justify-between">
        {label}
        {value && <span className="text-[10px] text-green-600 font-bold uppercase">Cargado</span>}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            className="w-full p-2 border rounded-md text-xs pr-8"
            placeholder="URL o sube una imagen"
            value={value || ''}
            onChange={e => {
              if (isEditing && editingTeam) {
                setEditingTeam({ ...editingTeam, [field]: e.target.value })
              } else {
                setNewTeam({ ...newTeam, [field]: e.target.value })
              }
            }}
          />
          {value && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              onClick={() => {
                if (isEditing && editingTeam) {
                  setEditingTeam({ ...editingTeam, [field]: '' })
                } else {
                  setNewTeam({ ...newTeam, [field]: '' })
                }
              }}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="file"
            id={`file-${field}-${isEditing}`}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, field, isEditing)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={uploading === field}
            onClick={() => document.getElementById(`file-${field}-${isEditing}`)?.click()}
          >
            {uploading === field ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      {value && (
        <div className="h-12 w-24 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
          <img src={value} alt="Preview" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  )

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
            <CardTitle className="text-lg text-green-800">Agregar Nuevo Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTeam} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <ImageInput label="Escudo del Equipo" value={newTeam.logo} field="logo" isEditing={false} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={newTeam.description}
                  onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                  placeholder="Habla un poco sobre la historia o espíritu del barrio..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <h3 className="font-bold text-gray-700">Patrocinadores (6 Estaciones)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ImageInput
                      key={i}
                      label={`Estación ${i}`}
                      value={(newTeam as any)[`sponsor${i}`]}
                      field={`sponsor${i}`}
                      isEditing={false}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6">
                Crear Equipo y Guardar Datos
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {editingTeam && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800 flex justify-between items-center">
              Editar Equipo: {editingTeam.name}
              <Button variant="ghost" size="sm" onClick={() => setEditingTeam(null)}>Cancelar</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateTeam} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <ImageInput label="Escudo del Equipo" value={editingTeam.logo || ''} field="logo" isEditing={true} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descripción</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={editingTeam.description || ''}
                  onChange={e => setEditingTeam({ ...editingTeam, description: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <h3 className="font-bold text-gray-700">Patrocinadores (6 Estaciones)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ImageInput
                      key={i}
                      label={`Estación ${i}`}
                      value={(editingTeam as any)[`sponsor${i}`] || ''}
                      field={`sponsor${i}`}
                      isEditing={true}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6">
                Actualizar Datos del Equipo
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-all group overflow-hidden border-0 shadow-md">
            <div className="h-1.5 w-full" style={{ backgroundColor: team.color || '#16a34a' }}></div>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2 bg-white shadow-sm"
                  style={{ borderColor: team.color || '#10b981' }}
                >
                  {team.logo ? (
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-full h-full object-contain"
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <Shield
                    className="w-7 h-7"
                    style={{
                      color: team.color || '#10b981',
                      display: team.logo ? 'none' : 'block'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">{team.name}</CardTitle>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingTeam(team)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTeam(team.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-sm font-medium text-gray-500">{team.neighborhood}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Jugadores</span>
                    <span className="text-lg font-bold text-gray-700">{team.players?.length || 0}</span>
                  </div>
                  <div className="flex flex-col p-2 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-[10px] text-green-600/60 font-bold uppercase tracking-wider">Puntos</span>
                    <span className="text-lg font-bold text-green-700">
                      {team.statistics?.[0]?.points || 0}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 opacity-60">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full ${(team as any)[`sponsor${i}`] ? 'bg-yellow-500' : 'bg-gray-200'}`} title={`Sponsor ${i}`}></div>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-green-200 text-green-700 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTeam(team)
                      }}
                    >
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      Plantilla
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 text-xs bg-gray-900 hover:bg-black text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(`/teams/${team.id}`, '_blank')
                    }}
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <Card className="text-center py-16 border-dashed border-2 bg-gray-50/50">
          <CardContent>
            <Shield className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No hay equipos registrados
            </h3>
            <p className="text-gray-400 mb-6 max-w-xs mx-auto">
              Comienza agregando los equipos que participarán en el campeonato de los barrios.
            </p>
            {isAdmin && (
              <Button onClick={() => setIsAdding(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Equipo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}