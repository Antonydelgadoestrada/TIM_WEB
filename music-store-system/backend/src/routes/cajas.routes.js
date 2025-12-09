const express = require('express');
const router = express.Router();
const cajasController = require('../controllers/cajas.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, checkRole('ADMIN'), cajasController.obtenerCajas);
router.get('/activa', authMiddleware, cajasController.obtenerCajaActiva);
router.get('/:id', authMiddleware, cajasController.obtenerCajaPorId);
router.post('/abrir', authMiddleware, checkRole('ADMIN', 'CAJERO'), cajasController.abrirCaja);
router.post('/:id/cerrar', authMiddleware, checkRole('ADMIN', 'CAJERO'), cajasController.cerrarCaja);

module.exports = router;
