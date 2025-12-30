'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Users, Trophy, Target, Star, Calendar, MapPin, TrendingUp } from 'lucide-react'

interface Player {
    id: string
    name: string
    number: number
    position: string
}

interface TeamStatistic {
    points: number
    matchesPlayed: number
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
}

interface Team {
    id: string
    name: string
    neighborhood: string
    description: string
    logo: string
    color: string
    sponsor1?: string
    sponsor2?: string
    sponsor3?: string
    sponsor4?: string
    sponsor5?: string
    sponsor6?: string
    players: Player[]
    statistics: TeamStatistic[]
}

export function TeamProfile({ team }: { team: Team }) {
    const stats = team.statistics[0] || {
        points: 0,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0
    }

    const teamColor = team.color || '#16a34a'

    return (
        <div className="min-h-screen bg-neutral-50 pb-16">
            {/* Hero Header - Premium Gradient */}
            <div
                className="h-[300px] md:h-[350px] relative flex items-center overflow-hidden"
                style={{
                    background: `linear-gradient(225deg, ${teamColor} 0%, ${teamColor}dd 40%, #0a0a0a 100%)`
                }}
            >
                {/* Abstract background elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <Shield className="w-[500px] h-[500px] -mr-32 -mt-32 rotate-12 text-white" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                        {/* Shield Logo Wrapper */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="w-36 h-36 md:w-52 md:h-52 rounded-full bg-white p-3 shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/90 relative">
                                {team.logo ? (
                                    <img src={team.logo.startsWith('http') || team.logo.startsWith('/') ? team.logo : `/${team.logo}`} alt={team.name} className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <Shield className="w-24 h-24" style={{ color: teamColor }} />
                                )}
                            </div>
                        </div>

                        {/* Team Basic Info */}
                        <div className="text-center md:text-left text-white pb-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                                <Badge className="w-fit mx-auto md:mx-0 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                                    Temporada 2026
                                </Badge>
                                <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-xs ml-1 text-white opacity-80 uppercase tracking-widest font-semibold">Club de Barrio</span>
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black mb-4 uppercase tracking-tighter drop-shadow-lg leading-none">
                                {team.name}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-base font-semibold text-white/90">
                                <span className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm"><MapPin className="w-4 h-4" /></div>
                                    {team.neighborhood}
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm"><Users className="w-4 h-4" /></div>
                                    {team.players.length} Jugadores Registrados
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-6 -mt-10 md:-mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column - Details & Players */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="shadow-2xl border-0 overflow-hidden group">
                            <div className="h-2 w-full" style={{ backgroundColor: teamColor }}></div>
                            <CardHeader className="bg-white pb-2 pt-6">
                                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                                    <Shield className="w-6 h-6" style={{ color: teamColor }} />
                                    Espíritu del Club
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {team.description || `El equipo ${team.name} representa con orgullo al barrio ${team.neighborhood} en el Campeonato de los Barrios. Un club formado por vecinos y apasionados del fútbol con un fuerte espíritu comunitario y deportivo.`}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-2xl border-0 overflow-hidden group">
                            <div className="h-2 w-full" style={{ backgroundColor: teamColor }}></div>
                            <CardHeader className="bg-white pb-4 pt-6 flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                                    <Users className="w-6 h-6" style={{ color: teamColor }} />
                                    Plantilla Actual
                                </CardTitle>
                                <Badge variant="outline" className="text-gray-500">{team.players.length} Miembros</Badge>
                            </CardHeader>
                            <CardContent className="bg-white px-0 md:px-6"> {/* Mobile optimization: less horizontal padding */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                                    {team.players.map(player => (
                                        <div key={player.id} className="group/player flex items-center justify-between p-4 bg-gray-50/50 hover:bg-white border hover:border-blue-200 rounded-xl transition-all duration-300 hover:shadow-lg">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transform group-hover/player:rotate-3 transition-transform"
                                                    style={{ backgroundColor: teamColor }}
                                                >
                                                    {player.number}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-lg">{player.name}</div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{player.position}</div>
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        </div>
                                    ))}
                                    {team.players.length === 0 && (
                                        <div className="col-span-2 flex flex-col items-center justify-center py-16 text-gray-400 bg-gray-50 rounded-2xl border border-dashed">
                                            <Users className="w-12 h-12 mb-3 opacity-20" />
                                            <p className="font-medium">No se han cargado jugadores todavía.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sponsors Section */}
                        <Card className="shadow-2xl border-0 overflow-hidden group">
                            <div className="h-2 w-full" style={{ backgroundColor: teamColor }}></div>
                            <CardHeader className="bg-white pb-2 pt-6">
                                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                                    <Trophy className="w-6 h-6" style={{ color: teamColor }} />
                                    Empresas que nos Apoyan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[team.sponsor1, team.sponsor2, team.sponsor3, team.sponsor4, team.sponsor5, team.sponsor6].map((sponsor, i) => {
                                        const imageUrl = sponsor ? (sponsor.startsWith('http') || sponsor.startsWith('/') ? sponsor : `/${sponsor}`) : null;
                                        return (
                                            <div key={i} className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-2 md:p-4 hover:border-gray-300 transition-colors group/sponsor overflow-hidden">
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={`Sponsor ${i + 1}`} className="w-full h-full object-contain group-hover/sponsor:scale-105 transition-transform" />
                                                ) : (
                                                    <>
                                                        <Trophy className="w-6 h-6 md:w-8 md:h-8 text-gray-300 mb-2 group-hover/sponsor:text-gray-400 transition-colors" />
                                                        <span className="text-gray-400 text-[10px] md:text-xs font-medium uppercase tracking-wider text-center">Espacio Disponible</span>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Stats Card */}
                    <div className="lg:col-span-4 sticky top-6">
                        <Card className="shadow-2xl bg-neutral-900 text-white border-0 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Trophy className="w-24 h-24" />
                            </div>
                            <CardHeader className="pb-4 relative z-10 border-b border-white/5">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Estadísticas 2026
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8 pb-8 space-y-8 relative z-10">
                                {/* Pts, PJ, PG row */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-4xl font-black text-white">{stats.points}</div>
                                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-1">Puntos</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-4xl font-black text-white">{stats.matchesPlayed}</div>
                                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-1">PJ</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="text-4xl font-black text-white">{stats.wins}</div>
                                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-1">PG</div>
                                    </div>
                                </div>

                                {/* Divider & Goals */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                <Target className="w-4 h-4 text-green-500" />
                                            </div>
                                            <span className="text-sm font-semibold opacity-60">Goles a favor</span>
                                        </div>
                                        <span className="text-xl font-black">{stats.goalsFor}</span>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-red-500" />
                                            </div>
                                            <span className="text-sm font-semibold opacity-60">Goles en contra</span>
                                        </div>
                                        <span className="text-xl font-black">{stats.goalsAgainst}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <span className="text-sm font-semibold opacity-60">Diferencia de Gol</span>
                                        </div>
                                        <span className={`text-xl font-black ${stats.goalsFor - stats.goalsAgainst >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {stats.goalsFor - stats.goalsAgainst > 0 ? '+' : ''}{stats.goalsFor - stats.goalsAgainst}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="p-4 bg-white/5 text-[10px] text-center font-bold tracking-[0.2em] uppercase opacity-30">
                                Temporada Oficial de Barrios
                            </div>
                        </Card>

                        <Card className="shadow-2xl border-0 bg-white group mt-6">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900 group-hover:translate-x-1 transition-transform">
                                    <Calendar className="w-4 h-4" style={{ color: teamColor }} />
                                    Últimos Logros
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-gray-400 flex flex-col items-center py-8">
                                <Trophy className="w-8 h-8 mb-2 opacity-10" />
                                <p>Buscando récords históricos...</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-green-800 text-white mt-16">
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
