import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

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

        // Crear un nombre único para evitar colisiones
        const originalName = file.name
        const extension = originalName.substring(originalName.lastIndexOf('.'))
        const fileName = `${uuidv4()}${extension}`

        // Ruta donde se guardará el archivo
        const path = join(process.cwd(), 'public/uploads/teams', fileName)

        await writeFile(path, buffer)

        // Devolver la URL pública del archivo
        const url = `/uploads/teams/${fileName}`

        return NextResponse.json({ url })
    } catch (error) {
        console.error('Error al subir archivo:', error)
        return NextResponse.json(
            { error: 'Error al procesar la subida del archivo' },
            { status: 500 }
        )
    }
}
