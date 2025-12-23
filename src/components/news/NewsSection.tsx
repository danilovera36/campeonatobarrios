'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Star, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface NewsItem {
  id: string
  title: string
  content: string
  summary?: string
  imageUrl?: string
  author?: string
  featured?: boolean
  publishedAt: string
  createdAt: string
}

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        setNews(data)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando noticias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Noticias del Campeonato</h2>
          <p className="text-gray-600">Las últimas novedades del torneo</p>
        </div>
        {isAdmin && (
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Noticia
          </Button>
        )}
      </div>

      {/* Featured News */}
      {news.filter(item => item.featured).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {news.filter(item => item.featured).slice(0, 2).map((item) => (
            <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Destacado
                  </Badge>
                  <Badge variant="outline">{formatDate(item.publishedAt)}</Badge>
                </div>
                <CardTitle className="text-xl text-green-800 line-clamp-2">
                  {item.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.summary || item.content}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{item.author || 'Administrador'}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Leer más
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Regular News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.filter(item => !item.featured).map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{formatDate(item.publishedAt)}</Badge>
              </div>
              <CardTitle className="text-lg text-green-800 line-clamp-2">
                {item.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {item.summary || item.content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-3 h-3" />
                  <span>{item.author || 'Administrador'}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Leer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {news.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay noticias publicadas
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando la primera noticia del campeonato
            </p>
            {isAdmin && (
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Noticia
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}