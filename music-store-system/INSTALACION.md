# 📋 Guía de Instalación Completa - Music Store System

## 🎯 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **Git** (opcional, para control de versiones)
- Cuenta en **Supabase** o **Neon** (para base de datos PostgreSQL gratuita)

## 📦 Paso 1: Configurar Base de Datos (GRATIS)

### Opción A: Supabase (Recomendado)

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta (usa GitHub, Google, etc.)
3. Crea un nuevo proyecto:
   - Nombre: `music-store`
   - Región: Elige la más cercana
   - Password: Guarda bien esta contraseña
4. Espera 1-2 minutos mientras se crea el proyecto
5. Ve a **Settings** → **Database**
6. Copia el **Connection String** (URI mode)
   - Se verá así: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Opción B: Neon

1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta
3. Crea nuevo proyecto
4. Copia la Connection String

## 🚀 Paso 2: Configurar Backend

```powershell
# Navegar a la carpeta del backend
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\backend

# Instalar dependencias (puede tardar 2-3 minutos)
npm install

# Crear archivo de configuración
Copy-Item .env.example .env

# Editar el archivo .env con Notepad
notepad .env
```

**En el archivo .env, pega tu DATABASE_URL:**

```env
DATABASE_URL="postgresql://postgres:TU-PASSWORD@db.xxxxx.supabase.co:5432/postgres"
JWT_SECRET="mi-secreto-super-seguro-cambiar-esto-123456"
PORT=3001
NODE_ENV=development
```

**Guardar y cerrar Notepad**

```powershell
# Generar Prisma Client
npx prisma generate

# Crear tablas en la base de datos
npx prisma migrate dev --name init

# Cargar datos iniciales (usuarios, productos de ejemplo)
npx prisma db seed

# Iniciar el servidor
npm run dev
```

✅ **El backend debería estar corriendo en http://localhost:3001**

Para verificar que funciona, abre: http://localhost:3001/api/health

## 💻 Paso 3: Configurar POS Desktop

**Abrir una NUEVA ventana de PowerShell:**

```powershell
# Navegar a la carpeta del POS
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\pos-desktop

# Instalar dependencias
npm install

# Crear archivo de configuración
Copy-Item .env.example .env

# Iniciar la aplicación
npm run dev
```

✅ **La aplicación POS se abrirá automáticamente en una ventana**

**Credenciales de prueba:**
- Admin: `admin@music.com` / `admin123`
- Cajero: `cajero@music.com` / `cajero123`

## 🌐 Paso 4: Configurar Sitio Web

**Abrir una TERCERA ventana de PowerShell:**

```powershell
# Navegar a la carpeta web
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\web-store

# Instalar dependencias
npm install

# Crear archivo de configuración
Copy-Item .env.example .env.local

# Iniciar el sitio web
npm run dev
```

✅ **El sitio web estará disponible en http://localhost:3000**

## 🎉 ¡Listo! Sistema Funcionando

Ahora tienes 3 ventanas abiertas:

1. **Backend** (puerto 3001) - No cerrar
2. **POS Desktop** - Aplicación Electron
3. **Web Store** (puerto 3000) - Sitio web

## 📱 Uso del Sistema

### Flujo de Trabajo Diario

1. **Abrir POS Desktop**
2. **Login** con usuario cajero o admin
3. **Abrir Caja** (menú Cajas)
   - Ingresar monto inicial (ej: $100.00)
4. **Realizar Ventas** (menú Ventas)
   - Buscar productos
   - Agregar al carrito
   - Completar venta
5. **Cerrar Caja** al final del día
   - Ingresar monto final
   - Revisar cuadre

### Ver la tienda online

- Abre http://localhost:3000 en cualquier navegador
- Los productos se actualizan en tiempo real

## 🔧 Comandos Útiles

### Ver la Base de Datos (Prisma Studio)

```powershell
cd backend
npx prisma studio
```

Abre una interfaz visual en http://localhost:5555 para ver/editar datos.

### Reiniciar la Base de Datos

```powershell
cd backend
npx prisma migrate reset
npx prisma db seed
```

### Revisar logs del Backend

El terminal del backend muestra todas las peticiones y errores.

## 🌍 Deploy en Producción (GRATIS)

### Backend → Render.com

1. Sube tu código a GitHub
2. Ve a [render.com](https://render.com)
3. New Web Service → Conecta tu repositorio
4. Settings:
   - Build Command: `cd backend && npm install && npx prisma generate`
   - Start Command: `cd backend && npm start`
   - Add Environment Variables (DATABASE_URL, JWT_SECRET)

### Web → Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Import Project → GitHub repo
3. Framework: Next.js (auto-detectado)
4. Root Directory: `web-store`
5. Environment Variable: `NEXT_PUBLIC_API_URL` (URL de tu backend en Render)
6. Deploy

### POS Desktop → Instalable

```powershell
cd pos-desktop
npm run electron:build
```

Genera un instalador .exe en `dist-electron/`

## ❓ Solución de Problemas

### "Port 3001 is already in use"

```powershell
# Cambiar puerto en backend/.env
PORT=3002
```

### "Cannot connect to database"

- Verifica que tu DATABASE_URL sea correcto
- Revisa que tu IP esté permitida en Supabase (Settings → Database → Connection Pooling)

### "Prisma command not found"

```powershell
npm install -g prisma
```

### El POS no conecta con el backend

- Asegúrate que el backend esté corriendo (http://localhost:3001/api/health)
- Verifica que `pos-desktop/.env` tenga: `VITE_API_URL=http://localhost:3001/api`

## 📞 Soporte

Sistema desarrollado específicamente para tu amigo's music store.

**Funcionalidades implementadas:**
✅ Backend API completo con autenticación
✅ Base de datos con todas las tablas necesarias
✅ POS Desktop con Electron + React
✅ Sistema de ventas con carrito
✅ Control de inventario
✅ Apertura/Cierre de caja
✅ Dashboard con estadísticas
✅ Sitio web e-commerce
✅ Stock en tiempo real
✅ Datos de prueba precargados

**100% Gratuito** (solo pagas si quieres dominio personalizado)

---

**Próximos pasos recomendados:**
1. Agregar más productos desde el POS
2. Personalizar colores y logo
3. Configurar impresora térmica (si tiene)
4. Añadir más categorías según necesidad
5. Deploy en producción cuando esté listo
