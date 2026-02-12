'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Shield, Calendar, MapPin, Clock } from 'lucide-react'

interface Match {
    id: string
    homeTeam: { name: string, logo?: string, color?: string }
    awayTeam: { name: string, logo?: string, color?: string }
    homeScore?: number
    awayScore?: number
    status: string
    round: string
    date: string
    venue?: string
}

export function FeaturedFinal() {
    const [final, setFinal] = useState<Match | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFinal = async () => {
            try {
                const response = await fetch('/api/matches')
                if (response.ok) {
                    const data: Match[] = await response.json()
                    const finalMatch = data.find(m => m.round === 'Final')
                    if (finalMatch) setFinal(finalMatch)
                }
            } catch (error) {
                console.error('Error fetching final match:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchFinal()
    }, [])

    if (loading || !final) return null

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        })
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isCompleted = final.status === 'COMPLETED'
    const winner = isCompleted ? (final.homeScore! > final.awayScore! ? final.homeTeam : final.awayTeam) : null

    return (
        <Card className="overflow-hidden border-4 border-yellow-400 shadow-2xl bg-gradient-to-br from-white to-yellow-50 relative group transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 p-4">
                <Trophy className={`w-12 h-12 text-yellow-500 opacity-20 group-hover:opacity-40 transition-opacity spin-slow`} />
            </div>

            <CardContent className="p-0">
                <div className="bg-yellow-400 text-yellow-950 py-2 text-center font-black tracking-[0.2em] uppercase text-sm">
                    {isCompleted ? '¡RESULTADO FINAL!' : '¡PRÓXIMAMENTE: LA GRAN FINAL!'}
                </div>

                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4">
                        {/* Home Team */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 p-2 shadow-xl flex items-center justify-center overflow-hidden"
                                style={{ borderColor: final.homeTeam.color || '#e5e7eb' }}>
                                {final.homeTeam.logo ? (
                                    <img src={final.homeTeam.logo} alt={final.homeTeam.name} className="w-full h-full object-contain" />
                                ) : (
                                    <Shield className="w-12 h-12 text-gray-300" />
                                )}
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-green-900 uppercase">
                                {final.homeTeam.name}
                            </h3>
                        </div>

                        {/* Score/VS */}
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="flex items-center gap-4 md:gap-8">
                                <span className="text-5xl md:text-7xl font-black text-gray-900 drop-shadow-sm">
                                    {final.homeScore ?? '-'}
                                </span>
                                <span className="text-2xl md:text-4xl font-bold text-yellow-500 italic">VS</span>
                                <span className="text-5xl md:text-7xl font-black text-gray-900 drop-shadow-sm">
                                    {final.awayScore ?? '-'}
                                </span>
                            </div>

                            <div className="flex flex-col items-center text-gray-600 font-medium space-y-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                    <span>{formatDate(final.date)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span>{formatTime(final.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        <span>{final.venue || 'Por definir'}</span>
                                    </div>
                                </div>
                            </div>

                            {isCompleted && winner && (
                                <Badge className="bg-yellow-500 text-white px-8 py-2 text-xl font-black animate-pulse shadow-lg">
                                    ¡CAMPEÓN: {winner.name}!
                                </Badge>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 p-2 shadow-xl flex items-center justify-center overflow-hidden"
                                style={{ borderColor: final.awayTeam.color || '#e5e7eb' }}>
                                {final.awayTeam.logo ? (
                                    <img src={final.awayTeam.logo} alt={final.awayTeam.name} className="w-full h-full object-contain" />
                                ) : (
                                    <Shield className="w-12 h-12 text-gray-300" />
                                )}
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-green-900 uppercase">
                                {final.awayTeam.name}
                            </h3>
                        </div>
                    </div>
                </div>
            </CardContent>

            <style jsx>{`
                .spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Card>
    )
}
