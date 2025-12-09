const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear venta
exports.crearVenta = async (req, res) => {
  try {
    const { cajaId, productos, metodoPago, observaciones } = req.body;
    const usuarioId = req.usuario.id;

    // Verificar que la caja esté abierta
    const caja = await prisma.caja.findUnique({
      where: { id: parseInt(cajaId) },
    });

    if (!caja || caja.estado !== 'ABIERTA') {
      return res.status(400).json({ error: 'La caja no está abierta' });
    }

    // Calcular total
    let total = 0;
    const detallesData = [];

    for (const item of productos) {
      const producto = await prisma.producto.findUnique({
        where: { id: item.productoId },
      });

      if (!producto) {
        return res.status(404).json({ error: `Producto ${item.productoId} no encontrado` });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` 
        });
      }

      const subtotal = parseFloat(producto.precioVenta) * item.cantidad;
      total += subtotal;

      detallesData.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: parseFloat(producto.precioVenta),
        subtotal,
      });
    }

    // Crear venta con transacción
    const venta = await prisma.$transaction(async (tx) => {
      // Crear venta
      const nuevaVenta = await tx.venta.create({
        data: {
          cajaId: parseInt(cajaId),
          usuarioId,
          total,
          metodoPago,
          observaciones,
          detalles: {
            create: detallesData,
          },
        },
        include: {
          detalles: {
            include: {
              producto: true,
            },
          },
          usuario: {
            select: { id: true, nombre: true },
          },
        },
      });

      // Actualizar stock y crear movimientos
      for (const item of productos) {
        await tx.producto.update({
          where: { id: item.productoId },
          data: {
            stock: {
              decrement: item.cantidad,
            },
          },
        });

        await tx.movimientoInventario.create({
          data: {
            productoId: item.productoId,
            usuarioId,
            tipo: 'VENTA',
            cantidad: -item.cantidad,
            motivo: `Venta #${nuevaVenta.id}`,
          },
        });
      }

      return nuevaVenta;
    });

    res.status(201).json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear venta', message: error.message });
  }
};

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const { cajaId, usuarioId, fechaDesde, fechaHasta } = req.query;

    const where = {};
    
    if (cajaId) where.cajaId = parseInt(cajaId);
    if (usuarioId) where.usuarioId = parseInt(usuarioId);
    if (fechaDesde || fechaHasta) {
      where.fechaVenta = {};
      if (fechaDesde) where.fechaVenta.gte = new Date(fechaDesde);
      if (fechaHasta) where.fechaVenta.lte = new Date(fechaHasta);
    }

    const ventas = await prisma.venta.findMany({
      where,
      include: {
        detalles: {
          include: {
            producto: true,
          },
        },
        usuario: {
          select: { id: true, nombre: true },
        },
        caja: true,
      },
      orderBy: { fechaVenta: 'desc' },
    });

    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas', message: error.message });
  }
};

// Obtener venta por ID
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await prisma.venta.findUnique({
      where: { id: parseInt(id) },
      include: {
        detalles: {
          include: {
            producto: true,
          },
        },
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        caja: true,
      },
    });

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener venta', message: error.message });
  }
};
