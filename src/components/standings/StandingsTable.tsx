'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StandingTeam {
  position: number
  team: {
    id: string
    name: string
    neighborhood: string
    color?: string
  }
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export function StandingsTable() {
  const [standings, setStandings] = useState<StandingTeam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStandings()
  }, [])

  const fetchStandings = async () => {
    try {
      const response = await fetch('/api/standings')
      if (response.ok) {
        const data = await response.json()
        setStandings(data)
      }
    } catch (error) {
      console.error('Error fetching standings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />
      case 2:
        return <Trophy className="w-4 h-4 text-gray-400" />
      case 3:
        return <Trophy className="w-4 h-4 text-amber-600" />
      default:
        return <span className="w-4 h-4 flex items-center justify-center text-sm font-medium">{position}</span>
    }
  }

  const getFormIcon = (position: number) => {
    // Simulación de forma - podrías calcularla basándote en resultados recientes
    const forms = ['up', 'down', 'same', 'up', 'up', 'down', 'same', 'up']
    const form = forms[position - 1] || 'same'
    
    switch (form) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />
      default:
        return <Minus className="w-3 h-3 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando tabla de posiciones...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Tabla de Posiciones
        </CardTitle>
        <CardDescription>
          Posiciones actualizadas del campeonato - Temporada 2026
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">Pos</th>
                <th className="text-left p-3 font-semibold text-gray-700">Equipo</th>
                <th className="text-center p-3 font-semibold text-gray-700">PJ</th>
                <th className="text-center p-3 font-semibold text-gray-700">PG</th>
                <th className="text-center p-3 font-semibold text-gray-700">PE</th>
                <th className="text-center p-3 font-semibold text-gray-700">PP</th>
                <th className="text-center p-3 font-semibold text-gray-700">GF</th>
                <th className="text-center p-3 font-semibold text-gray-700">GC</th>
                <th className="text-center p-3 font-semibold text-gray-700">DG</th>
                <th className="text-center p-3 font-semibold text-gray-700">Pts</th>
                <th className="text-center p-3 font-semibold text-gray-700">Forma</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => (
                <tr 
                  key={team.team.id} 
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    team.position <= 4 ? 'bg-green-50' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {getPositionIcon(team.position)}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: team.team.color || '#10b981' }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{team.team.name}</div>
                        <div className="text-xs text-gray-500">{team.team.neighborhood}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-3 font-medium">{team.matchesPlayed}</td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {team.wins}
                    </Badge>
                  </td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      {team.draws}
                    </Badge>
                  </td>
                  <td className="text-center p-3">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {team.losses}
                    </Badge>
                  </td>
                  <td className="text-center p-3 font-medium">{team.goalsFor}</td>
                  <td className="text-center p-3 font-medium">{team.goalsAgainst}</td>
                  <td className="text-center p-3">
                    <span className={`font-medium ${
                      team.goalDifference > 0 ? 'text-green-600' : 
                      team.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                    </span>
                  </td>
                  <td className="text-center p-3">
                    <span className="font-bold text-lg text-green-600">{team.points}</span>
                  </td>
                  <td className="text-center p-3">
                    {getFormIcon(team.position)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {standings.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay datos disponibles
            </h3>
            <p className="text-gray-500">
              La tabla de posiciones se mostrará una vez que comiencen los partidos
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 rounded" />
            <span>Zona de clasificación</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Mejor posición</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span>Bajó posiciones</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}