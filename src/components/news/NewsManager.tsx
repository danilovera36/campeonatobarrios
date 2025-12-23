'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Newspaper, Plus, Trash2, Megaphone, Send, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface News {
    id: string
    title: string
    content: string
    summary?: string
    author?: string
    createdAt: string
    featured: boolean
}

export function NewsManager() {
    const [newsList, setNewsList] = useState<News[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newNews, setNewNews] = useState({
        title: '',
        summary: '',
        content: '',
        author: 'Admin',
        featured: false
    })

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            const res = await fetch('/api/news')
            if (res.ok) {
                const data = await res.json()
                setNewsList(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNews)
            })
            if (res.ok) {
                toast.success('Noticia publicada con éxito')
                setIsAdding(false)
                setNewNews({ title: '', summary: '', content: '', author: 'Admin', featured: false })
                fetchNews()
            }
        } catch (e) {
            toast.error('Error al publicar noticia')
        }
    }

    const handleDeleteNews = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta noticia?')) return
        try {
            const res = await fetch(`/api/news/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Noticia eliminada')
                fetchNews()
            }
        } catch (e) {
            toast.error('Error al eliminar')
        }
    }

    if (loading) return <div className="p-12 text-center text-gray-500">Cargando noticias...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-green-800">Comunicados y Noticias</h2>
                    <p className="text-gray-600">Publica avisos importantes para la comunidad</p>
                </div>
                <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? 'Cancelar' : <><Plus className="w-4 h-4 mr-2" /> Nueva Noticia</>}
                </Button>
            </div>

            {isAdding && (
                <Card className="border-green-200 bg-green-50/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-green-600" />
                            Redactar Comunicado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddNews} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Título de la Noticia</Label>
                                <Input
                                    placeholder="Ej: Se suspende la fecha por lluvia"
                                    value={newNews.title}
                                    onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Resumen (opcional)</Label>
                                <Input
                                    placeholder="Una breve descripción para la lista"
                                    value={newNews.summary}
                                    onChange={e => setNewNews({ ...newNews, summary: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contenido Completo</Label>
                                <textarea
                                    className="w-full min-h-[150px] p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Escribe aquí el detalle del aviso..."
                                    value={newNews.content}
                                    onChange={e => setNewNews({ ...newNews, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={newNews.featured}
                                    onChange={e => setNewNews({ ...newNews, featured: e.target.checked })}
                                />
                                <Label htmlFor="featured" className="cursor-pointer">Marcar como destacada (aparece primero)</Label>
                            </div>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                <Send className="w-4 h-4 mr-2" /> Publicar Ahora
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {newsList.map((n) => (
                    <Card key={n.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        {n.featured && <Badge className="bg-yellow-500">Destacado</Badge>}
                                        <h3 className="text-xl font-bold text-gray-800">{n.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(n.createdAt).toLocaleDateString()}</span>
                                        <span>Autor: {n.author}</span>
                                    </div>
                                    <p className="text-gray-600 line-clamp-2">{n.summary || n.content}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteNews(n.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {newsList.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                        <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Aún no hay noticias publicadas.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
