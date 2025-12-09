# 🎸 Sistema de Gestión para Tienda de Instrumentos Musicales

Sistema completo de punto de venta (POS) y e-commerce para tienda de instrumentos musicales.

## 📦 Estructura del Proyecto

```
music-store-system/
├── backend/              # API REST con Node.js + Express + Prisma
├── pos-desktop/          # Aplicación POS con Electron + React
├── web-store/            # Tienda online con Next.js
└── README.md
```

## 🚀 Tecnologías Utilizadas

- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL
- **POS**: Electron, React, Vite, TailwindCSS
- **Web**: Next.js 14, React, TailwindCSS
- **Base de Datos**: PostgreSQL (Supabase/Neon - GRATIS)

## 🎯 Funcionalidades

### Sistema POS (Punto de Venta)
- ✅ Apertura y cierre de caja
- ✅ Ventas con múltiples formas de pago
- ✅ Búsqueda rápida de productos
- ✅ Impresión de tickets
- ✅ Control de inventario
- ✅ Alertas de stock bajo
- ✅ Reportes de ventas

### Control de Inventario
- ✅ Entrada de mercadería
- ✅ Salida de mercadería
- ✅ Ajustes de stock
- ✅ Categorías de productos
- ✅ Control de proveedores

### Página Web
- ✅ Catálogo de productos
- ✅ Búsqueda y filtros avanzados
- ✅ Stock en tiempo real
- ✅ Carrito de compras
- ✅ Responsive design

## 📋 Instalación

### 1. Configurar Base de Datos (GRATIS)

**Opción A: Supabase (Recomendado)**
1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar la DATABASE_URL de Settings > Database

**Opción B: Neon**
1. Crear cuenta en [neon.tech](https://neon.tech)
2. Crear nuevo proyecto
3. Copiar la conexión string

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tu DATABASE_URL
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 3. POS Desktop

```bash
cd pos-desktop
npm install
npm run dev
```

### 4. Web Store

```bash
cd web-store
npm install
cp .env.example .env.local
# Configurar NEXT_PUBLIC_API_URL
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

**Backend (.env)**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu-secreto-super-seguro"
PORT=3001
```

**Web (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📱 Uso del Sistema

### Primera vez
1. Iniciar el backend
2. Crear usuario administrador (usa el seed)
3. Abrir POS Desktop
4. Login: admin@music.com / admin123
5. Realizar apertura de caja

### Flujo de trabajo diario
1. Apertura de caja (monto inicial)
2. Realizar ventas
3. Entrada/salida de inventario
4. Cierre de caja (cuadre)

## 🌐 Deploy (GRATIS)

### Backend
- **Render.com** o **Railway.app**
- Plan gratuito incluido

### Web Store
- **Vercel** (recomendado para Next.js)
- Deploy automático desde GitHub

## 📊 Base de Datos

El sistema incluye:
- Usuarios y roles
- Productos y categorías
- Inventario y movimientos
- Ventas y detalles
- Cajas y turnos
- Proveedores

## 🔐 Seguridad

- Autenticación JWT
- Roles de usuario (Admin, Cajero, Almacén)
- Validación de datos
- Encriptación de contraseñas

## 📞 Soporte

Sistema creado para tienda de instrumentos musicales.
Desarrollado con ❤️ para tu amigo.

## 📝 Notas

- Stock sincronizado en tiempo real entre POS y web
- Sistema 100% gratuito (excepto dominio personalizado)
- Escalable según crecimiento del negocio
- Compatible con impresoras térmicas
