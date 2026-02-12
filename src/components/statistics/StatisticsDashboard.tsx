'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Target, TrendingUp, Users, Star, Calendar, Shield } from 'lucide-react'

interface PlayerStats {
  position: number
  name: string
  team: string
  goals: number
  assists: number
  matchesPlayed: number
}

interface StatisticsData {
  topScorers: PlayerStats[]
  topAssists: PlayerStats[]
  summary?: {
    teams: number
    matches: number
    goals: number
    avgGoals: string
  }
  extras?: {
    bestOffense: { name: string, value: number } | null
    bestDefense: { name: string, value: number, total: number } | null
    fairPlay: { name: string, value: number, total: number } | null
  }
}

export function StatisticsDashboard() {
  const [stats, setStats] = useState<StatisticsData>({ topScorers: [], topAssists: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'scorers' | 'assists'>('scorers')

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{position}</span>
    }
  }

  const calculateAverage = (stat: number, matches: number) => {
    return matches > 0 ? (stat / matches).toFixed(2) : '0.00'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  const currentData = activeTab === 'scorers' ? stats.topScorers : stats.topAssists
  const statLabel = activeTab === 'scorers' ? 'Goles' : 'Asistencias'
  const statIcon = activeTab === 'scorers' ? Target : Target

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-green-800">Estadísticas del Campeonato</h2>
        <p className="text-gray-600">Los mejores jugadores del torneo</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-800">{stats.summary?.teams || 0}</div>
                <div className="text-sm text-green-600">Equipos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-800">{stats.summary?.matches || 0}</div>
                <div className="text-sm text-blue-600">Partidos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-800">{stats.summary?.goals || 0}</div>
                <div className="text-sm text-yellow-600">Goles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-800">{stats.summary?.avgGoals || '0.00'}</div>
                <div className="text-sm text-purple-600">Goles x partido</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-green-800 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {activeTab === 'scorers' ? 'Goleadores' : 'Asistidores'}
                </CardTitle>
                <CardDescription>
                  Los mejores {activeTab === 'scorers' ? 'anotadores' : 'asistentes'} del campeonato
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'scorers' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('scorers')}
                  size="sm"
                >
                  Goles
                </Button>
                <Button
                  variant={activeTab === 'assists' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('assists')}
                  size="sm"
                >
                  Asistencias
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentData.map((player) => (
                <div key={player.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getMedalIcon(player.position)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{player.name}</div>
                      <div className="text-xs text-gray-500">{player.team}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {activeTab === 'scorers' ? player.goals : player.assists}
                      </div>
                      <div className="text-xs text-gray-500">
                        {statLabel}: {calculateAverage(
                          activeTab === 'scorers' ? player.goals : player.assists,
                          player.matchesPlayed
                        )} por partido
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {player.matchesPlayed} PJ
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {currentData.length === 0 && (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No hay datos disponibles
                </h3>
                <p className="text-gray-500 text-sm">
                  Las estadísticas se mostrarán una vez que comiencen los partidos
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Stats */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-green-800 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Estadísticas Adicionales
            </CardTitle>
            <CardDescription>
              Métricas destacadas del torneo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.extras ? (
                <>
                  {stats.extras.bestOffense && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-green-900">Mejor Ofensiva</div>
                          <div className="text-xs text-green-700">{stats.extras.bestOffense.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{stats.extras.bestOffense.value}</div>
                        <div className="text-xs text-green-700">Goles anotados</div>
                      </div>
                    </div>
                  )}

                  {stats.extras.bestDefense && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Shield className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-blue-900">Valla Menos Vencida</div>
                          <div className="text-xs text-blue-700">{stats.extras.bestDefense.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {stats.extras.bestDefense.total} <span className="text-xs font-normal text-blue-400">goles en contra</span>
                        </div>
                        <div className="text-xs text-blue-700">Promedio: {stats.extras.bestDefense.value} x partido</div>
                      </div>
                    </div>
                  )}

                  {stats.extras.fairPlay && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-full">
                          <Star className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-yellow-900">Fair Play</div>
                          <div className="text-xs text-yellow-700">{stats.extras.fairPlay.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-600">
                          {stats.extras.fairPlay.total} <span className="text-xs font-normal text-yellow-400">pts</span>
                        </div>
                        <div className="text-xs text-yellow-700">Promedio: {stats.extras.fairPlay.value} x partido</div>
                      </div>
                    </div>
                  )}

                  {!stats.extras.bestOffense && !stats.extras.bestDefense && !stats.extras.fairPlay && (
                    <div className="p-8 text-center border-2 border-dashed rounded-lg">
                      <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Aquí aparecerán los récords del torneo (mayor goleada, rachas, etc.) a medida que se jueguen los partidos.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center border-2 border-dashed rounded-lg">
                  <Target className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Aquí aparecerán los récords del torneo (mayor goleada, rachas, etc.) a medida que se jueguen los partidos.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  )
}