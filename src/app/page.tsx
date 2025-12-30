'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, Users, Target, TrendingUp, Shield, Newspaper, Menu } from 'lucide-react'

// Import components
import { TeamsManager } from '@/components/teams/TeamsManager'
import { StandingsTable } from '@/components/standings/StandingsTable'
import { MatchesList } from '@/components/matches/MatchesList'
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard'
import { NewsSection } from '@/components/news/NewsSection'
import { NewsManager } from '@/components/news/NewsManager'
import { LoginForm } from '@/components/auth/LoginForm'
import { AdminButton } from '@/components/auth/AdminButton'
import { PublicView } from '@/components/public/PublicView'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('inicio')
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/statistics')
        .then(res => res.json())
        .then(data => setSummary(data.summary))
        .catch(err => console.error('Error fetching summary:', err))
    }
  }, [isAuthenticated])

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Mostrar vista pública si no está autenticado
  if (!isAuthenticated) {
    return <PublicView />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-green-800">Panel de Gestión</h1>
          </div>
          <AdminButton />
        </div>
      </header>
      <div className="container mx-auto px-4 py-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-white shadow-md h-auto p-1">
            <TabsTrigger value="inicio" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Inicio
            </TabsTrigger>

            <TabsTrigger value="posiciones" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Tabla</span>
              <span className="sm:hidden">Tabla</span>
            </TabsTrigger>

            <TabsTrigger value="equipos" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-1" />
              Equipos
            </TabsTrigger>

            {/* Desktop only tabs */}
            <TabsTrigger value="partidos" className="hidden lg:inline-flex data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-1" />
              Partidos
            </TabsTrigger>

            <TabsTrigger value="estadisticas" className="hidden lg:inline-flex data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-1" />
              Estadísticas
            </TabsTrigger>

            <TabsTrigger value="noticias" className="hidden lg:inline-flex data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Newspaper className="w-4 h-4 mr-1" />
              Noticias
            </TabsTrigger>

            <TabsTrigger value="galeria" className="hidden lg:inline-flex data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-1" />
              Galería
            </TabsTrigger>

            {/* Mobile Menu Dropdown */}
            <div className="lg:hidden w-full h-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full h-full rounded-sm data-[state=open]:bg-gray-100 ${['partidos', 'estadisticas', 'noticias', 'galeria'].includes(activeTab)
                      ? "bg-green-600 text-white hover:bg-green-700 hover:text-white"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    <Menu className="w-4 h-4 mr-1" />
                    Más
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setActiveTab('partidos')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Partidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('estadisticas')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Estadísticas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('noticias')}>
                    <Newspaper className="w-4 h-4 mr-2" />
                    Noticias
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('galeria')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Galería
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TabsList>

          {/* Inicio Tab */}
          <TabsContent value="inicio" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <Card className="lg:col-span-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Bienvenidos al Campeonato
                  </CardTitle>
                  <CardDescription className="text-lg">
                    El torneo de barrios más importante de la comunidad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    El Campeonato de los Barrios "Alfredo 'Tente' Zulueta" es un evento deportivo
                    que reúne a los diferentes barrios de nuestra comunidad en una competencia
                    de fútbol llena de pasión y espíritu deportivo.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{summary?.teams || 0}</div>
                      <div className="text-sm text-gray-600">Equipos Participantes</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{summary?.matches || 0}</div>
                      <div className="text-sm text-gray-600">Partidos Totales</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">{summary?.goals || 0}</div>
                      <div className="text-sm text-gray-600">Goles Marcados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Resumen Rápido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-800">Líder Actual</div>
                    <div className="text-lg font-bold text-green-600">-</div>
                    <div className="text-xs text-green-500">Sin datos</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Máximo Goleador</div>
                    <div className="text-lg font-bold text-blue-600">-</div>
                    <div className="text-xs text-blue-500">Sin datos</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800">Próximo Partido</div>
                    <div className="text-lg font-bold text-yellow-600">-</div>
                    <div className="text-xs text-yellow-500">Por programar</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg text-gray-400">
                  <Calendar className="w-8 h-8 mb-2" />
                  <p>No hay actividad reciente. Los resultados aparecerán aquí una vez que comiencen los partidos.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipos Tab - Dynamic Component */}
          <TabsContent value="equipos" className="mt-6">
            <TeamsManager />
          </TabsContent>

          {/* Partidos Tab - Dynamic Component */}
          <TabsContent value="partidos" className="mt-6">
            <MatchesList />
          </TabsContent>

          {/* Posiciones Tab - Dynamic Component */}
          <TabsContent value="posiciones" className="mt-6">
            <StandingsTable />
          </TabsContent>

          {/* Estadísticas Tab - Dynamic Component */}
          <TabsContent value="estadisticas" className="mt-6">
            <StatisticsDashboard />
          </TabsContent>

          {/* Noticias Tab - Dynamic Component */}
          <TabsContent value="noticias" className="mt-6">
            {isAdmin ? <NewsManager /> : <NewsSection />}
          </TabsContent>

          {/* Galería Tab */}
          <TabsContent value="galeria" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800">Galería del Campeonato</CardTitle>
                <CardDescription>
                  Los logos y símbolos del torneo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-4">
                      <img
                        src="https://z-cdn-media.chatglm.cn/files/9762e0d7-3720-4822-bec4-981f4c288b4c_barrios1.png?auth_key=1793125091-719f88f95e6548caa32dc0e3635cd0ea-0-205829fa5d7910d1f5d91314dbf220ee"
                        alt="Logo Oficial 1"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-green-800">Logo Oficial</h3>
                    <p className="text-sm text-gray-600">Versión principal del campeonato</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-4">
                      <img
                        src="https://z-cdn-media.chatglm.cn/files/d1a06294-5fcf-4905-98d1-50b57047412d_barrios2.png?auth_key=1793125091-27b951d9a22b404f9192b7d6b293c366-0-c5e74a1ecb9039e2583e77dcc1215a71"
                        alt="Logo Variante"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-green-800">Logo Variante</h3>
                    <p className="text-sm text-gray-600">Versión alternativa del torneo</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-4">
                      <img
                        src="https://z-cdn-media.chatglm.cn/files/1cfebd74-e8ce-41e3-a8a6-43f4e9979077_barrios4.png?auth_key=1793125091-3af0edbbe90b465eb80a05c464d1b870-0-61bc35e22d657c4a1edc1e15b616aed7"
                        alt="Logo Simplificado"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-green-800">Logo Simplificado</h3>
                    <p className="text-sm text-gray-600">Versión compacta del emblema</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Campeonato de los Barrios</h3>
            <p className="text-green-100">Alfredo "Tente" Zulueta</p>
            <p className="text-sm text-green-200 mt-4">
              Promoviendo el deporte y la comunidad desde 2026
            </p>

            <div className="mt-8 pt-6 border-t border-green-700/50 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-green-300 uppercase tracking-wider">Hecho por</p>
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="DV Soluciones Informáticas"
                  className="h-8 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                />
                <span className="text-sm font-medium text-green-100">
                  DV Soluciones Informáticas
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}