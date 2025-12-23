'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, Target, TrendingUp, Shield, Lock, Users, Newspaper } from 'lucide-react'

// Import components for public view
import { StandingsTable } from '@/components/standings/StandingsTable'
import { StatisticsDashboard } from '@/components/statistics/StatisticsDashboard'
import { TeamsManager } from '@/components/teams/TeamsManager'
import { MatchesList } from '@/components/matches/MatchesList'
import { NewsSection } from '@/components/news/NewsSection'
import { LoginForm } from '@/components/auth/LoginForm'

export function PublicView() {
  const [activeTab, setActiveTab] = useState('inicio')
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    fetch('/api/statistics')
      .then(res => res.json())
      .then(data => setSummary(data.summary))
      .catch(err => console.error('Error fetching summary:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <img
                  src="https://z-cdn-media.chatglm.cn/files/9762e0d7-3720-4822-bec4-981f4c288b4c_barrios1.png?auth_key=1793125091-719f88f95e6548caa32dc0e3635cd0ea-0-205829fa5d7910d1f5d91314dbf220ee"
                  alt="Campeonato de Barrios"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-bold text-green-800">
                  CAMPEONATO DE LOS BARRIOS
                </h1>
                <p className="text-lg md:text-xl text-gray-600 font-semibold">
                  Alfredo "Tente" Zulueta
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                <Trophy className="w-4 h-4 mr-1" />
                Temporada 2026
              </Badge>
              <Button
                variant="outline"
                className="bg-green-50 border-green-200 text-green-800 hover:bg-green-100"
                onClick={() => setActiveTab('admin')}
              >
                <Lock className="w-4 h-4 mr-2" />
                Acceso Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-white shadow-md">
            <TabsTrigger value="inicio" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Inicio
            </TabsTrigger>
            <TabsTrigger value="noticias" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Newspaper className="w-4 h-4 mr-1" />
              Noticias
            </TabsTrigger>
            <TabsTrigger value="partidos" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-1" />
              Partidos
            </TabsTrigger>
            <TabsTrigger value="posiciones" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-1" />
              Tabla
            </TabsTrigger>
            <TabsTrigger value="estadisticas" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-1" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="equipos" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-1" />
              Equipos
            </TabsTrigger>
            <TabsTrigger value="galeria" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-1" />
              Galería
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-1" />
              Apoyan
            </TabsTrigger>
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

          {/* Noticias Tab - Public View */}
          <TabsContent value="noticias" className="mt-6">
            <NewsSection />
          </TabsContent>

          {/* Partidos Tab - Public View */}
          <TabsContent value="partidos" className="mt-6">
            <MatchesList />
          </TabsContent>

          {/* Posiciones Tab - Public View */}
          <TabsContent value="posiciones" className="mt-6">
            <StandingsTable />
          </TabsContent>

          {/* Estadísticas Tab - Public View */}
          <TabsContent value="estadisticas" className="mt-6">
            <StatisticsDashboard />
          </TabsContent>

          {/* Equipos Tab - Public View */}
          <TabsContent value="equipos" className="mt-6">
            <TeamsManager />
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

          {/* Sponsors Tab */}
          <TabsContent value="sponsors" className="space-y-6 mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Empresas que Apoyan el Campeonato
                </CardTitle>
                <CardDescription>
                  Agradecemos a las empresas y comercios locales que hacen posible este torneo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* DV Logo - First Sponsor */}
                  <div className="aspect-square border-2 border-gray-200 rounded-lg flex items-center justify-center p-4 bg-white hover:shadow-lg transition-all">
                    <img
                      src="/dv.png"
                      alt="DV"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Placeholder sponsors - replace with actual logos */}
                  {[2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center p-4 hover:border-green-500 hover:bg-green-50 transition-all group"
                    >
                      <div className="text-center">
                        <Trophy className="w-12 h-12 text-gray-300 group-hover:text-green-500 mx-auto mb-2 transition-colors" />
                        <p className="text-xs text-gray-400 group-hover:text-green-600 font-medium">Patrocinador {i}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-center text-green-800 font-medium">
                    ¿Tu empresa quiere apoyar el campeonato?
                  </p>
                  <p className="text-center text-green-600 text-sm mt-2">
                    Contacta con los organizadores para más información
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hidden Admin Access - accessible via /login route */}
          <LoginForm />
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
          </div>
        </div>
      </footer>
    </div>
  )
}