# 🏆 Campeonato de Barrios "Alfredo 'Tente' Zulueta"

## 📋 Descripción
Aplicación web completa para la gestión del campeonato de barrios con sistema de autenticación, gestión de equipos, partidos, estadísticas y noticias.

## 🔐 Credenciales de Administrador
- **Usuario**: `dvera`
- **Contraseña**: `danilo22`

## 🚀 Cómo Descargar y Ejecutar el Proyecto

### Requisitos Previos
- Node.js 18+ 
- npm o bun
- Git

### Paso 1: Descargar el Proyecto
```bash
# Opción 1: Si tienes acceso al repositorio Git
git clone [URL_DEL_REPOSITORIO]
cd campeonato-barrios

# Opción 2: Descargar como ZIP
# 1. Descarga el archivo ZIP del proyecto
# 2. Descomprime el archivo
# 3. Abre la terminal en la carpeta del proyecto
```

### Paso 2: Instalar Dependencias
```bash
# Usando npm
npm install

# O usando bun (recomendado)
bun install
```

### Paso 3: Configurar la Base de Datos
```bash
# Generar cliente de Prisma
npx prisma generate

# O con bun
bunx prisma generate

# Aplicar el esquema a la base de datos
bun run db:push
```

### Paso 4: Iniciar el Servidor de Desarrollo
```bash
# Usando npm
npm run dev

# O usando bun (recomendado)
bun run dev
```

### Paso 5: Acceder a la Aplicación
1. Abre tu navegador web
2. Ve a `http://localhost:3000`
3. Disfruta de la aplicación!

## 📁 Estructura del Proyecto

```
campeonato-barrios/
├── src/
│   ├── app/                    # Páginas y rutas de Next.js
│   │   ├── api/               # Endpoints de la API
│   │   ├── login/             # Página de login
│   │   └── page.tsx           # Página principal
│   ├── components/            # Componentes React
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── teams/             # Gestión de equipos
│   │   ├── matches/           # Gestión de partidos
│   │   ├── news/              # Gestión de noticias
│   │   ├── statistics/        # Estadísticas
│   │   ├── standings/         # Tabla de posiciones
│   │   ├── public/            # Vista pública
│   │   └── ui/                # Componentes UI (shadcn/ui)
│   ├── contexts/              # Contextos de React
│   ├── hooks/                 # Hooks personalizados
│   ├── lib/                   # Utilidades y configuración
│   └── globals.css            # Estilos globales
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── public/                    # Archivos estáticos
├── db/                        # Base de datos SQLite
└── package.json               # Dependencias del proyecto
```

## 🎯 Funcionalidades Principales

### 👤 Vista Pública (Visitantes)
- Ver tabla de posiciones
- Consultar estadísticas del campeonato
- Ver información de equipos
- Acceder a noticias
- Ver calendario de partidos

### 👑 Vista Administrador (Autenticado)
- Panel de control completo
- Gestión de equipos (crear, editar, eliminar)
- Programación y edición de partidos
- Publicación y edición de noticias
- Gestión de estadísticas
- Sistema de logout

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Base de Datos**: Prisma ORM con SQLite
- **Autenticación**: Sistema personalizado con JWT
- **Estado**: React Context API
- **Iconos**: Lucide React

## 📱 Características Técnicas

- ✅ Diseño totalmente responsivo
- ✅ Sistema de autenticación seguro
- ✅ API REST completa
- ✅ Base de datos local SQLite
- ✅ Interfaz moderna con shadcn/ui
- ✅ Manejo de estados con Context API
- ✅ Tipado completo con TypeScript

## 🌐 Navegación

1. **Página Principal**: Vista pública del campeonato
2. **Acceso Admin**: Botón en el header para iniciar sesión
3. **Panel Admin**: Vista completa de gestión (solo administradores)
4. **Logout**: Cerrar sesión y volver a vista pública

## 📊 Secciones de la Aplicación

### 🏟️ Equipos
- Lista completa de equipos participantes
- Información detallada de cada equipo
- Gestión administrativa de equipos

### 📅 Partidos
- Calendario de partidos programados
- Resultados y estadísticas
- Gestión administrativa de partidos

### 📈 Estadísticas
- Tabla de posiciones actualizada
- Estadísticas individuales y por equipo
- Gráficos y visualizaciones

### 📰 Noticias
- Novedades del campeonato
- Actualizaciones importantes
- Gestión de contenido

## 🔒 Seguridad

- Sistema de autenticación con credenciales seguras
- Protección de rutas administrativas
- Validación de datos en frontend y backend
- Manejo seguro de sesiones

## 📞 Soporte

Si tienes problemas para descargar o ejecutar el proyecto:

1. Verifica que tienes Node.js 18+ instalado
2. Asegúrate de tener conexión a internet para instalar dependencias
3. Revisa que los puertos 3000 estén disponibles
4. Consulta la consola para posibles errores

## 📝 Notas Importantes

- El proyecto usa una base de datos SQLite local (`db/custom.db`)
- No requiere configuración de base de datos externa
- El servidor de desarrollo se reinicia automáticamente con cambios
- La aplicación está optimizada para producción

---

**¡Disfruta del Campeonato de Barrios!** ⚽🏆