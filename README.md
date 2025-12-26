# Campeonato de los Barrios - Alfredo "Tente" Zulueta

Sistema de gestión integral para el campeonato de fútbol de barrio, construido con Next.js, TypeScript, Prisma y PostgreSQL.

## 🚀 Características

- ✅ Gestión completa de equipos y jugadores
- ⚽ Registro de partidos, goles y tarjetas
- 📊 Tabla de posiciones en tiempo real
- 📰 Sistema de noticias y comunicados
- 🎨 Interfaz moderna y responsive
- 🔐 Panel de administración protegido

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL (local o en la nube)
- npm o yarn

## 🛠️ Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd barrios
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Crea un archivo `.env` basado en `env.example`:
   ```bash
   cp env.example .env
   ```
   
   Edita `.env` y configura tu base de datos PostgreSQL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/barrios"
   ```

4. **Configurar la base de datos:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

5. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

## 🌐 Despliegue en Vercel

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio de Git (GitHub, GitLab, o Bitbucket).

### 2. Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Click en "Add New Project"
3. Importa tu repositorio de Git
4. Vercel detectará automáticamente que es un proyecto Next.js

### 3. Configurar Base de Datos PostgreSQL

**Opción A: Vercel Postgres (Recomendado)**
1. En el dashboard de tu proyecto, ve a "Storage"
2. Click en "Create Database" → "Postgres"
3. Vercel creará automáticamente las variables de entorno necesarias

**Opción B: Base de datos externa (Neon, Supabase, etc.)**
1. Crea una base de datos PostgreSQL en el servicio de tu elección
2. Copia la URL de conexión

### 4. Configurar Variables de Entorno

En el dashboard de Vercel, ve a "Settings" → "Environment Variables" y agrega:

```
DATABASE_URL=<tu-url-de-postgres>
```

### 5. Ejecutar Migraciones

Después del primer despliegue, necesitas poblar la base de datos:

1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Ejecuta las migraciones:
   ```bash
   vercel env pull .env.local
   npx prisma db push
   npm run seed
   ```

### 6. Desplegar

Vercel desplegará automáticamente cada vez que hagas push a tu rama principal.

## 🔑 Acceso de Administrador

Por defecto, el sistema usa autenticación simple. Para acceder como administrador:

- **Usuario:** `admin`
- **Contraseña:** `barrios2026`

> ⚠️ **Importante:** Cambia estas credenciales en producción editando `src/contexts/AuthContext.tsx`

## 📁 Estructura del Proyecto

```
barrios/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.ts            # Datos iniciales
├── public/                # Archivos estáticos (logos)
├── src/
│   ├── app/
│   │   ├── api/          # API Routes
│   │   └── page.tsx      # Página principal
│   ├── components/       # Componentes React
│   ├── contexts/         # Context providers
│   └── lib/              # Utilidades
└── package.json
```

## 🎯 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run db:push      # Sincronizar schema con DB
npm run seed         # Poblar base de datos
```

## 📝 Licencia

Este proyecto es de código abierto para uso comunitario.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.



