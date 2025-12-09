const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

router.get('/movimientos', authMiddleware, inventarioController.obtenerMovimientos);
router.get('/movimientos/:id', authMiddleware, inventarioController.obtenerHistorialProducto);
router.post('/movimientos', authMiddleware, checkRole('ADMIN', 'ALMACEN'), inventarioController.registrarMovimiento);

module.exports = router;
