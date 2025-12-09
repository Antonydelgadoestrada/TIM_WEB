const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Reporte de ventas por período
exports.reporteVentas = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    const where = {};
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
          select: { nombre: true },
        },
      },
    });

    const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
    const cantidadVentas = ventas.length;

    // Ventas por método de pago
    const ventasPorMetodo = ventas.reduce((acc, v) => {
      acc[v.metodoPago] = (acc[v.metodoPago] || 0) + parseFloat(v.total);
      return acc;
    }, {});

    res.json({
      totalVentas,
      cantidadVentas,
      ventasPorMetodo,
      ventas,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar reporte', message: error.message });
  }
};

// Productos más vendidos
exports.productosMasVendidos = async (req, res) => {
  try {
    const { limite = 10, fechaDesde, fechaHasta } = req.query;

    const where = {};
    if (fechaDesde || fechaHasta) {
      where.venta = {
        fechaVenta: {},
      };
      if (fechaDesde) where.venta.fechaVenta.gte = new Date(fechaDesde);
      if (fechaHasta) where.venta.fechaVenta.lte = new Date(fechaHasta);
    }

    const detalles = await prisma.detalleVenta.findMany({
      where,
      include: {
        producto: true,
      },
    });

    const productos = detalles.reduce((acc, detalle) => {
      const { productoId, producto, cantidad, subtotal } = detalle;
      
      if (!acc[productoId]) {
        acc[productoId] = {
          producto,
          cantidadVendida: 0,
          totalVentas: 0,
        };
      }
      
      acc[productoId].cantidadVendida += cantidad;
      acc[productoId].totalVentas += parseFloat(subtotal);
      
      return acc;
    }, {});

    const resultado = Object.values(productos)
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, parseInt(limite));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al generar reporte', message: error.message });
  }
};

// Dashboard - Resumen general
exports.dashboard = async (req, res) => {
  try {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Ventas del día
    const ventasHoy = await prisma.venta.findMany({
      where: {
        fechaVenta: {
          gte: new Date(hoy.setHours(0, 0, 0, 0)),
        },
      },
    });

    const totalVentasHoy = ventasHoy.reduce((sum, v) => sum + parseFloat(v.total), 0);

    // Ventas del mes
    const ventasMes = await prisma.venta.findMany({
      where: {
        fechaVenta: {
          gte: inicioMes,
        },
      },
    });

    const totalVentasMes = ventasMes.reduce((sum, v) => sum + parseFloat(v.total), 0);

    // Productos con stock bajo
    const productosStockBajo = await prisma.producto.count({
      where: {
        activo: true,
        stock: {
          lte: prisma.producto.fields.stockMinimo,
        },
      },
    });

    // Total de productos
    const totalProductos = await prisma.producto.count({
      where: { activo: true },
    });

    // Valor total del inventario
    const productos = await prisma.producto.findMany({
      where: { activo: true },
      select: {
        stock: true,
        precioCompra: true,
      },
    });

    const valorInventario = productos.reduce(
      (sum, p) => sum + (p.stock * parseFloat(p.precioCompra)),
      0
    );

    res.json({
      ventasHoy: {
        cantidad: ventasHoy.length,
        total: totalVentasHoy,
      },
      ventasMes: {
        cantidad: ventasMes.length,
        total: totalVentasMes,
      },
      inventario: {
        totalProductos,
        productosStockBajo,
        valorTotal: valorInventario,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener dashboard', message: error.message });
  }
};
