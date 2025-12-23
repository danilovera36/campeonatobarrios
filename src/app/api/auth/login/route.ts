import { NextRequest, NextResponse } from 'next/server'

// Credenciales del administrador
const ADMIN_USERNAME = 'dvera'
const ADMIN_PASSWORD = 'danilo22'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Verificar credenciales
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generar un token simple (en producción, usar JWT)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          username,
          isAdmin: true
        }
      })
    }

    return NextResponse.json(
      { error: 'Credenciales incorrectas' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}