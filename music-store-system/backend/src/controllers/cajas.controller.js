const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Abrir caja
exports.abrirCaja = async (req, res) => {
  try {
    const { montoInicial } = req.body;
    const usuarioId = req.usuario.id;

    // Verificar si hay caja abierta
    const cajaAbierta = await prisma.caja.findFirst({
      where: {
        usuarioId,
        estado: 'ABIERTA',
      },
    });

    if (cajaAbierta) {
      return res.status(400).json({ error: 'Ya existe una caja abierta para este usuario' });
    }

    const caja = await prisma.caja.create({
      data: {
        usuarioId,
        montoInicial: parseFloat(montoInicial),
        estado: 'ABIERTA',
      },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
      },
    });

    res.status(201).json(caja);
  } catch (error) {
    res.status(500).json({ error: 'Error al abrir caja', message: error.message });
  }
};

// Cerrar caja
exports.cerrarCaja = async (req, res) => {
  try {
    const { id } = req.params;
    const { montoFinal, observaciones } = req.body;

    const caja = await prisma.caja.findUnique({
      where: { id: parseInt(id) },
      include: {
        ventas: true,
      },
    });

    if (!caja) {
      return res.status(404).json({ error: 'Caja no encontrada' });
    }

    if (caja.estado === 'CERRADA') {
      return res.status(400).json({ error: 'La caja ya está cerrada' });
    }

    const cajaActualizada = await prisma.caja.update({
      where: { id: parseInt(id) },
      data: {
        montoFinal: parseFloat(montoFinal),
        fechaCierre: new Date(),
        estado: 'CERRADA',
        observaciones,
      },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        ventas: {
          include: {
            detalles: true,
          },
        },
      },
    });

    res.json(cajaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al cerrar caja', message: error.message });
  }
};

// Obtener caja activa del usuario
exports.obtenerCajaActiva = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const caja = await prisma.caja.findFirst({
      where: {
        usuarioId,
        estado: 'ABIERTA',
      },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        ventas: {
          include: {
            detalles: true,
          },
        },
      },
    });

    res.json(caja);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener caja activa', message: error.message });
  }
};

// Obtener todas las cajas
exports.obtenerCajas = async (req, res) => {
  try {
    const { estado, usuarioId, fechaDesde, fechaHasta } = req.query;

    const where = {};
    
    if (estado) where.estado = estado;
    if (usuarioId) where.usuarioId = parseInt(usuarioId);
    if (fechaDesde || fechaHasta) {
      where.fechaApertura = {};
      if (fechaDesde) where.fechaApertura.gte = new Date(fechaDesde);
      if (fechaHasta) where.fechaApertura.lte = new Date(fechaHasta);
    }

    const cajas = await prisma.caja.findMany({
      where,
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        ventas: true,
      },
      orderBy: { fechaApertura: 'desc' },
    });

    res.json(cajas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cajas', message: error.message });
  }
};

// Obtener detalle de caja por ID
exports.obtenerCajaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const caja = await prisma.caja.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        ventas: {
          include: {
            detalles: {
              include: {
                producto: true,
              },
            },
          },
        },
      },
    });

    if (!caja) {
      return res.status(404).json({ error: 'Caja no encontrada' });
    }

    res.json(caja);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener caja', message: error.message });
  }
};
