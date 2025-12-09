const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventas.controller');
const { authMiddleware, checkRole } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, ventasController.obtenerVentas);
router.get('/:id', authMiddleware, ventasController.obtenerVentaPorId);
router.post('/', authMiddleware, checkRole('ADMIN', 'CAJERO'), ventasController.crearVenta);

module.exports = router;
