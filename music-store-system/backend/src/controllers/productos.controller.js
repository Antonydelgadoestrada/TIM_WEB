const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const { categoria, busqueda, activo } = req.query;

    const where = {};
    
    if (categoria) where.categoriaId = parseInt(categoria);
    if (activo !== undefined) where.activo = activo === 'true';
    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { codigo: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
      ];
    }

    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: true,
        proveedor: true,
      },
      orderBy: { nombre: 'asc' },
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', message: error.message });
  }
};

// Obtener producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        proveedor: true,
      },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto', message: error.message });
  }
};

// Crear producto
exports.crearProducto = async (req, res) => {
  try {
    const producto = await prisma.producto.create({
      data: req.body,
      include: {
        categoria: true,
        proveedor: true,
      },
    });

    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto', message: error.message });
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: req.body,
      include: {
        categoria: true,
        proveedor: true,
      },
    });

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto', message: error.message });
  }
};

// Eliminar producto (soft delete)
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { activo: false },
    });

    res.json({ message: 'Producto desactivado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto', message: error.message });
  }
};

// Obtener productos con stock bajo
exports.obtenerProductosStockBajo = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        stock: {
          lte: prisma.producto.fields.stockMinimo,
        },
      },
      include: {
        categoria: true,
      },
      orderBy: { stock: 'asc' },
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos con stock bajo', message: error.message });
  }
};
