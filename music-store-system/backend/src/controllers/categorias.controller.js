const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { productos: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías', message: error.message });
  }
};

// Crear categoría
exports.crearCategoria = async (req, res) => {
  try {
    const categoria = await prisma.categoria.create({
      data: req.body,
    });

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría', message: error.message });
  }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar categoría', message: error.message });
  }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.categoria.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría', message: error.message });
  }
};
