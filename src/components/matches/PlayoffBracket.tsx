'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Shield, ChevronRight } from 'lucide-react'

interface Match {
    id: string
    homeTeam: { name: string, logo?: string, color?: string }
    awayTeam: { name: string, logo?: string, color?: string }
    homeScore?: number
    awayScore?: number
    status: string
    round: string
}

export function PlayoffBracket() {
    const [semis, setSemis] = useState<Match[]>([])
    const [final, setFinal] = useState<Match[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMatches()
    }, [])

    const fetchMatches = async () => {
        try {
            const response = await fetch('/api/matches')
            if (response.ok) {
                const data: Match[] = await response.json()
                setSemis(data.filter(m => m.round === 'Semifinal'))
                setFinal(data.filter(m => m.round === 'Final'))
            }
        } catch (error) {
            console.error('Error fetching playoff matches:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return null

    if (semis.length === 0 && final.length === 0) return null

    return (
        <div className="py-8">
            <div className="flex flex-col items-center mb-10">
                <Badge variant="outline" className="mb-2 bg-yellow-50 text-yellow-700 border-yellow-200 px-4 py-1">
                    Fase de Eliminación
                </Badge>
                <h2 className="text-3xl font-black text-green-800 flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    CAMINO A LA GLORIA
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto px-4">
                {/* Semifinales */}
                <div className="space-y-12">
                    <h3 className="text-center font-bold text-gray-400 uppercase tracking-widest text-sm mb-4">Semifinales</h3>
                    {semis.map((match, idx) => (
                        <div key={match.id} className="relative">
                            <Card className="overflow-hidden border-2 hover:border-green-400 transition-all shadow-md">
                                <CardContent className="p-0">
                                    <div className="flex flex-col">
                                        <div className={`flex justify-between items-center p-3 border-b border-gray-100 ${match.status === 'COMPLETED' && (match.homeScore! > match.awayScore!) ? 'bg-green-50' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden" style={{ borderColor: match.homeTeam.color }}>
                                                    {match.homeTeam.logo ? <img src={match.homeTeam.logo} className="w-full h-full object-contain" /> : <Shield className="w-3 h-3 text-gray-400" />}
                                                </div>
                                                <span className={`text-sm font-semibold truncate max-w-[120px] ${match.status === 'COMPLETED' && (match.homeScore! > match.awayScore!) ? 'text-green-800' : 'text-gray-700'}`}>
                                                    {match.homeTeam.name}
                                                </span>
                                            </div>
                                            <span className="font-bold text-lg">{match.homeScore ?? '-'}</span>
                                        </div>
                                        <div className={`flex justify-between items-center p-3 ${match.status === 'COMPLETED' && (match.awayScore! > match.homeScore!) ? 'bg-green-50' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden" style={{ borderColor: match.awayTeam.color }}>
                                                    {match.awayTeam.logo ? <img src={match.awayTeam.logo} className="w-full h-full object-contain" /> : <Shield className="w-3 h-3 text-gray-400" />}
                                                </div>
                                                <span className={`text-sm font-semibold truncate max-w-[120px] ${match.status === 'COMPLETED' && (match.awayScore! > match.homeScore!) ? 'text-green-800' : 'text-gray-700'}`}>
                                                    {match.awayTeam.name}
                                                </span>
                                            </div>
                                            <span className="font-bold text-lg">{match.awayScore ?? '-'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* Connector Line to Final (simplificado) */}
                            <div className="hidden md:block absolute -right-8 top-1/2 w-8 h-0.5 bg-gray-300"></div>
                        </div>
                    ))}
                    {semis.length < 2 && (
                        <div className="p-10 border-2 border-dashed rounded-lg text-center text-gray-400 text-xs">
                            Esperando rivales...
                        </div>
                    )}
                </div>

                {/* Connector Middle */}
                <div className="hidden md:flex flex-col items-center">
                    <div className="h-24 w-0.5 bg-gray-300"></div>
                </div>

                {/* Final */}
                <div className="relative">
                    <h3 className="text-center font-bold text-yellow-600 uppercase tracking-widest text-sm mb-4">Gran Final</h3>
                    <div className="relative">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
                            <Trophy className="w-10 h-10 text-yellow-500" />
                        </div>
                        <Card className="overflow-hidden border-4 border-yellow-400 shadow-xl scale-110">
                            <CardContent className="p-0">
                                {final.length > 0 ? (
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center p-4 border-b border-yellow-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm overflow-hidden" style={{ borderColor: final[0].homeTeam.color }}>
                                                    {final[0].homeTeam.logo ? <img src={final[0].homeTeam.logo} className="w-full h-full object-contain" /> : <Shield className="w-4 h-4 text-gray-400" />}
                                                </div>
                                                <span className="font-bold text-green-900">{final[0].homeTeam.name}</span>
                                            </div>
                                            <span className="font-black text-2xl">{final[0].homeScore ?? '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm overflow-hidden" style={{ borderColor: final[0].awayTeam.color }}>
                                                    {final[0].awayTeam.logo ? <img src={final[0].awayTeam.logo} className="w-full h-full object-contain" /> : <Shield className="w-4 h-4 text-gray-400" />}
                                                </div>
                                                <span className="font-bold text-green-900">{final[0].awayTeam.name}</span>
                                            </div>
                                            <span className="font-black text-2xl">{final[0].awayScore ?? '-'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-gray-50 italic text-gray-400 text-sm">
                                        Rival por definir
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        {final.length > 0 && final[0].status === 'COMPLETED' && (
                            <div className="mt-6 text-center">
                                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 text-lg font-bold">
                                    ¡CAMPEÓN: {final[0].homeScore! > final[0].awayScore! ? final[0].homeTeam.name : final[0].awayTeam.name}!
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
