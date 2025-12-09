-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'CAJERO', 'ALMACEN');

-- CreateEnum
CREATE TYPE "EstadoCaja" AS ENUM ('ABIERTA', 'CERRADA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'MIXTO');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE', 'VENTA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'CAJERO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoriaId" INTEGER NOT NULL,
    "proveedorId" INTEGER,
    "precioCompra" DECIMAL(10,2) NOT NULL,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 5,
    "imagen" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cajas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "montoInicial" DECIMAL(10,2) NOT NULL,
    "montoFinal" DECIMAL(10,2),
    "fechaApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierre" TIMESTAMP(3),
    "estado" "EstadoCaja" NOT NULL DEFAULT 'ABIERTA',
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cajas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" SERIAL NOT NULL,
    "cajaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "fechaVenta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_ventas" (
    "id" SERIAL NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "motivo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_key" ON "productos"("codigo");

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "ventas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
