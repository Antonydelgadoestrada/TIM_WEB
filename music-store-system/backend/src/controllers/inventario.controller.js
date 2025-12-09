const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Registrar movimiento de inventario
exports.registrarMovimiento = async (req, res) => {
  try {
    const { productoId, tipo, cantidad, motivo } = req.body;
    const usuarioId = req.usuario.id;

    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(productoId) },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Validar stock para salidas
    if (tipo === 'SALIDA' && producto.stock < cantidad) {
      return res.status(400).json({ 
        error: 'Stock insuficiente', 
        disponible: producto.stock 
      });
    }

    const movimiento = await prisma.$transaction(async (tx) => {
      // Crear movimiento
      const nuevoMovimiento = await tx.movimientoInventario.create({
        data: {
          productoId: parseInt(productoId),
          usuarioId,
          tipo,
          cantidad,
          motivo,
        },
        include: {
          producto: true,
          usuario: {
            select: { id: true, nombre: true },
          },
        },
      });

      // Actualizar stock
      const cantidadMovimiento = tipo === 'ENTRADA' || tipo === 'AJUSTE' 
        ? cantidad 
        : -cantidad;

      await tx.producto.update({
        where: { id: parseInt(productoId) },
        data: {
          stock: {
            increment: cantidadMovimiento,
          },
        },
      });

      return nuevoMovimiento;
    });

    res.status(201).json(movimiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar movimiento', message: error.message });
  }
};

// Obtener movimientos de inventario
exports.obtenerMovimientos = async (req, res) => {
  try {
    const { productoId, tipo, fechaDesde, fechaHasta } = req.query;

    const where = {};
    
    if (productoId) where.productoId = parseInt(productoId);
    if (tipo) where.tipo = tipo;
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) where.fecha.gte = new Date(fechaDesde);
      if (fechaHasta) where.fecha.lte = new Date(fechaHasta);
    }

    const movimientos = await prisma.movimientoInventario.findMany({
      where,
      include: {
        producto: true,
        usuario: {
          select: { id: true, nombre: true },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener movimientos', message: error.message });
  }
};

// Obtener historial de movimientos de un producto
exports.obtenerHistorialProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const movimientos = await prisma.movimientoInventario.findMany({
      where: { productoId: parseInt(id) },
      include: {
        usuario: {
          select: { id: true, nombre: true },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial', message: error.message });
  }
};
