const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedores.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, proveedoresController.obtenerProveedores);
router.post('/', authMiddleware, checkRole('ADMIN'), proveedoresController.crearProveedor);
router.put('/:id', authMiddleware, checkRole('ADMIN'), proveedoresController.actualizarProveedor);
router.delete('/:id', authMiddleware, checkRole('ADMIN'), proveedoresController.eliminarProveedor);

module.exports = router;
