# 🔥 Inicio Rápido - Music Store System

## ⚡ Comandos para iniciar TODO el sistema

### 1️⃣ Primera vez (Instalación)

```powershell
# Backend
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\backend
npm install
Copy-Item .env.example .env
# EDITAR .env con tu DATABASE_URL
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

```powershell
# POS (en nueva ventana)
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\pos-desktop
npm install
Copy-Item .env.example .env
```

```powershell
# Web (en nueva ventana)
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\web-store
npm install
Copy-Item .env.example .env.local
```

### 2️⃣ Iniciar el sistema (Uso diario)

**Ventana 1 - Backend:**
```powershell
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\backend
npm run dev
```

**Ventana 2 - POS:**
```powershell
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\pos-desktop
npm run dev
```

**Ventana 3 - Web (opcional):**
```powershell
cd c:\Users\usuario\OneDrive\Documentos\TIM_WEB\music-store-system\web-store
npm run dev
```

## 🎫 Acceso

- **POS Desktop:** Login con `admin@music.com` / `admin123`
- **Web Store:** http://localhost:3000
- **Backend API:** http://localhost:3001/api/health
- **Prisma Studio:** `cd backend; npx prisma studio`

## 📚 Documentación Completa

Ver archivo `INSTALACION.md` para guía detallada paso a paso.
