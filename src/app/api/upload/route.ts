import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No se recibió ningún archivo' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        const path = join(process.cwd(), 'public', 'uploads', 'teams', fileName)

        console.log('API Upload - Saving to:', path)

        await writeFile(path, buffer)

        const url = `/uploads/teams/${fileName}`
        console.log('API Upload - Success:', url)

        return NextResponse.json({ url })
    } catch (error: any) {
        console.error('API Upload - ERROR:', error)
        return NextResponse.json(
            { error: 'Error al procesar la subida', detail: error.message },
            { status: 500 }
        )
    }
}
