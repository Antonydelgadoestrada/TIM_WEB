const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true,
      },
      orderBy: { nombre: 'asc' },
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', message: error.message });
  }
};

// Crear usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
      },
    });

    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', message: error.message });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...userData } = req.body;

    const data = { ...userData };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const usuario = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
      },
    });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario', message: error.message });
  }
};

// Eliminar usuario (soft delete)
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { activo: false },
    });

    res.json({ message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', message: error.message });
  }
};
