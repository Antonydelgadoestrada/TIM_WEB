const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await prisma.proveedor.findMany({
      include: {
        _count: {
          select: { productos: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proveedores', message: error.message });
  }
};

// Crear proveedor
exports.crearProveedor = async (req, res) => {
  try {
    const proveedor = await prisma.proveedor.create({
      data: req.body,
    });

    res.status(201).json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proveedor', message: error.message });
  }
};

// Actualizar proveedor
exports.actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await prisma.proveedor.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proveedor', message: error.message });
  }
};

// Eliminar proveedor
exports.eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.proveedor.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proveedor', message: error.message });
  }
};
