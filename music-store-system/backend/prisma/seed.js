const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar datos existentes
  await prisma.detalleVenta.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.movimientoInventario.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.caja.deleteMany();
  await prisma.usuario.deleteMany();

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@music.com',
      password: hashedPassword,
      rol: 'ADMIN',
    },
  });

  const cajero = await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez',
      email: 'cajero@music.com',
      password: await bcrypt.hash('cajero123', 10),
      rol: 'CAJERO',
    },
  });

  console.log('✅ Usuarios creados');

  // Crear categorías
  const categorias = await Promise.all([
    prisma.categoria.create({ data: { nombre: 'Guitarras', descripcion: 'Guitarras eléctricas y acústicas' } }),
    prisma.categoria.create({ data: { nombre: 'Bajos', descripcion: 'Bajos eléctricos' } }),
    prisma.categoria.create({ data: { nombre: 'Baterías', descripcion: 'Baterías acústicas y electrónicas' } }),
    prisma.categoria.create({ data: { nombre: 'Teclados', descripcion: 'Pianos y teclados' } }),
    prisma.categoria.create({ data: { nombre: 'Amplificadores', descripcion: 'Amplificadores para instrumentos' } }),
    prisma.categoria.create({ data: { nombre: 'Parlantes', descripcion: 'Parlantes y sistemas de audio' } }),
    prisma.categoria.create({ data: { nombre: 'Micrófonos', descripcion: 'Micrófonos profesionales' } }),
    prisma.categoria.create({ data: { nombre: 'Accesorios', descripcion: 'Cables, púas, cuerdas, etc.' } }),
  ]);

  console.log('✅ Categorías creadas');

  // Crear proveedores
  const proveedores = await Promise.all([
    prisma.proveedor.create({
      data: {
        nombre: 'Fender Distribuidor',
        contacto: 'Carlos López',
        telefono: '555-0101',
        email: 'ventas@fender.com',
      },
    }),
    prisma.proveedor.create({
      data: {
        nombre: 'Yamaha Music',
        contacto: 'María García',
        telefono: '555-0102',
        email: 'info@yamaha.com',
      },
    }),
    prisma.proveedor.create({
      data: {
        nombre: 'Audio Pro',
        contacto: 'Jorge Martínez',
        telefono: '555-0103',
        email: 'contacto@audiopro.com',
      },
    }),
  ]);

  console.log('✅ Proveedores creados');

  // Crear productos de ejemplo
  const productos = await Promise.all([
    // Guitarras
    prisma.producto.create({
      data: {
        codigo: 'GTR-FEN-001',
        nombre: 'Fender Stratocaster American',
        descripcion: 'Guitarra eléctrica profesional',
        categoriaId: categorias[0].id,
        proveedorId: proveedores[0].id,
        precioCompra: 1200,
        precioVenta: 1800,
        stock: 5,
        stockMinimo: 2,
      },
    }),
    prisma.producto.create({
      data: {
        codigo: 'GTR-YAM-001',
        nombre: 'Yamaha FG800 Acústica',
        descripcion: 'Guitarra acústica para principiantes',
        categoriaId: categorias[0].id,
        proveedorId: proveedores[1].id,
        precioCompra: 250,
        precioVenta: 400,
        stock: 12,
        stockMinimo: 5,
      },
    }),
    // Bajos
    prisma.producto.create({
      data: {
        codigo: 'BAS-FEN-001',
        nombre: 'Fender Precision Bass',
        descripcion: 'Bajo eléctrico de 4 cuerdas',
        categoriaId: categorias[1].id,
        proveedorId: proveedores[0].id,
        precioCompra: 800,
        precioVenta: 1200,
        stock: 3,
        stockMinimo: 2,
      },
    }),
    // Amplificadores
    prisma.producto.create({
      data: {
        codigo: 'AMP-MAR-001',
        nombre: 'Marshall MG30CFX',
        descripcion: 'Amplificador de guitarra 30W',
        categoriaId: categorias[4].id,
        proveedorId: proveedores[2].id,
        precioCompra: 180,
        precioVenta: 300,
        stock: 8,
        stockMinimo: 3,
      },
    }),
    // Parlantes
    prisma.producto.create({
      data: {
        codigo: 'PAR-JBL-001',
        nombre: 'JBL EON615 Parlante Activo',
        descripcion: 'Parlante amplificado 1000W',
        categoriaId: categorias[5].id,
        proveedorId: proveedores[2].id,
        precioCompra: 450,
        precioVenta: 700,
        stock: 6,
        stockMinimo: 2,
      },
    }),
    // Micrófonos
    prisma.producto.create({
      data: {
        codigo: 'MIC-SHU-001',
        nombre: 'Shure SM58 Micrófono',
        descripcion: 'Micrófono dinámico profesional',
        categoriaId: categorias[6].id,
        proveedorId: proveedores[2].id,
        precioCompra: 80,
        precioVenta: 130,
        stock: 15,
        stockMinimo: 5,
      },
    }),
    // Accesorios
    prisma.producto.create({
      data: {
        codigo: 'ACC-CUE-001',
        nombre: 'Set de Cuerdas para Guitarra',
        descripcion: 'Cuerdas calibre .010-.046',
        categoriaId: categorias[7].id,
        proveedorId: proveedores[0].id,
        precioCompra: 5,
        precioVenta: 12,
        stock: 50,
        stockMinimo: 20,
      },
    }),
    prisma.producto.create({
      data: {
        codigo: 'ACC-CAB-001',
        nombre: 'Cable para Instrumento 6m',
        descripcion: 'Cable profesional plug-plug',
        categoriaId: categorias[7].id,
        proveedorId: proveedores[2].id,
        precioCompra: 8,
        precioVenta: 15,
        stock: 30,
        stockMinimo: 10,
      },
    }),
  ]);

  console.log('✅ Productos creados');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📝 Credenciales de acceso:');
  console.log('Admin:');
  console.log('  Email: admin@music.com');
  console.log('  Password: admin123');
  console.log('\nCajero:');
  console.log('  Email: cajero@music.com');
  console.log('  Password: cajero123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
