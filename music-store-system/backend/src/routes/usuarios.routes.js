const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, checkRole('ADMIN'), usuariosController.obtenerUsuarios);
router.post('/', authMiddleware, checkRole('ADMIN'), usuariosController.crearUsuario);
router.put('/:id', authMiddleware, checkRole('ADMIN'), usuariosController.actualizarUsuario);
router.delete('/:id', authMiddleware, checkRole('ADMIN'), usuariosController.eliminarUsuario);

module.exports = router;
