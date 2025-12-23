import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const news = await db.news.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Error al obtener noticias' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, summary, imageUrl, author, featured } = await request.json()
    const news = await db.news.create({
      data: {
        title,
        content,
        summary,
        imageUrl,
        author,
        featured,
        published: true,
        publishedAt: new Date()
      }
    })
    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json({ error: 'Error al crear noticia' }, { status: 500 })
  }
}